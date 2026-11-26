import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../web/package.json', import.meta.url));
const ts = require('typescript');
const root = resolve(process.argv[2] ?? '.');
const configPath = join(root, 'tsconfig.build.json');
const raw = ts.readConfigFile(configPath, ts.sys.readFile);
if (raw.error) throw new Error(ts.flattenDiagnosticMessageText(raw.error.messageText, '\n'));
const config = ts.parseJsonConfigFileContent(raw.config, ts.sys, root);
const program = ts.createProgram(config.fileNames, config.options);
const errors = [...config.errors, ...ts.getPreEmitDiagnostics(program)];
const report = diagnostics => ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCanonicalFileName: file => file,
  getCurrentDirectory: () => root,
  getNewLine: () => '\n',
});
if (errors.length) throw new Error(report(errors));
rmSync(join(root, 'dist'), { recursive: true, force: true });
const result = program.emit();
if (result.emitSkipped || result.diagnostics.length) throw new Error(report(result.diagnostics));

// Preserve per-module client directives and assets instead of bundling the package.
// Node ESM requires explicit extensions; patch only AST module specifiers, never strings in UI.
function rewrite(file) {
  const text = readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits = [];
  function visit(node) {
    let literal;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) literal = node.moduleSpecifier;
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) literal = node.argument.literal;
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) literal = node.arguments[0];
    if (literal && ts.isStringLiteral(literal) && literal.text.startsWith('.')) {
      const specifier = literal.text;
      const target = resolve(dirname(file), specifier);
      const suffix = existsSync(`${target}.js`) ? '.js' : existsSync(join(target, 'index.js')) ? '/index.js' : '';
      if (suffix) edits.push({ start: literal.getStart(ast) + 1, end: literal.getEnd() - 1, value: specifier + suffix });
      else if (!existsSync(target)) throw new Error(`Unresolved emitted import: ${file}: ${specifier}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  let output = text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, edit.start) + edit.value + output.slice(edit.end);
  // TypeScript can remove a license banner attached to an erased type-only import.
  // Restore the source banner in both JS and declarations, after any client directive.
  const stem = relative(join(root, 'dist'), file).replace(/(?:\.d)?\.js$|\.d\.ts$/, '');
  const source = ['.tsx', '.ts'].map(ext => join(root, 'src', stem + ext)).find(existsSync);
  const banner = source && readFileSync(source, 'utf8').match(/^(?:['"]use client['"];?\s*)?\s*(\/\*![\s\S]*?\*\/)/)?.[1];
  if (banner && !output.includes(banner)) {
    const directive = output.match(/^['"]use client['"];?\r?\n/);
    const position = directive?.[0].length ?? 0;
    output = output.slice(0, position) + banner + '\n' + output.slice(position);
  }
  writeFileSync(file, output);
}
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.js') || file.endsWith('.d.ts')) rewrite(file);
  }
}
walk(join(root, 'dist'));
console.log(`Built ${JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name} (ESM + declarations)`);
