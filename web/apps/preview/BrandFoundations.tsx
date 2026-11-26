import { usePreviewLocale } from './locale'
import { useId, useState, type CSSProperties } from 'react'
import { ArrowDownTrayIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Badge, BRAND_ASSETS, Button, ButtonGroup, Input, Label } from '@zooclaw/zooworkdesign'
import './brand-preview.css'
import { GradientRules } from './GradientRules'

export function BrandIdentity() {
  const { t, locale: language } = usePreviewLocale()
  const [backdrop, setBackdrop] = useState<'light' | 'dark'>('light')
  const [symbol, setSymbol] = useState(false)
  const logo = symbol ? BRAND_ASSETS.symbol : backdrop === 'dark' ? BRAND_ASSETS.logoLight : BRAND_ASSETS.logoDark
  return (
    <section className="pv-section pv-platform-section" id="brand">
      <div className="bv-heading">
        <div>
          <p className="bv-eyebrow">{t('Brand · 品牌基础')}</p>
          <h2>{t('ZooWork 的视觉表达')}</h2>
        </div>
      </div>
      <p className="pv-sd">
        {t('衬线标题承载品牌气质，清晰的无衬线界面服务工作；中性色构成主体，紫色用于有目的的强调。')}
      </p>
      <div className="bv-expression" data-zc-surface="marketing">
        <div className="bv-expression-copy">
          <img src={BRAND_ASSETS.logoDark} alt={t('ZooWork')} className="bv-wordmark" />
          <p className="zw-display bv-display" lang={language}>
            {language === 'en' ? (
              <>
                {t('Your expertise,')}
                <br />
                {t('deployed in minutes.')}
              </>
            ) : (
              <>
                {t('让你的专业，')}
                <br />
                {t('成为随时待命的智能体。')}
              </>
            )}
          </p>
          <p className="bv-lede">
            {t(
              language === 'en'
                ? 'A thoughtful system for ideas, agents, and the work ahead.'
                : '以清晰的界面和克制的表达，让每一个想法进入工作。',
            )}
          </p>
          <div className="bv-inline">
            <span className="bv-dot" />
            {t(language === 'en' ? 'Clarity, with character.' : '清晰、有温度、有辨识度。')}
          </div>
        </div>
        <div className="bv-expression-art" style={{ backgroundImage: `url(${BRAND_ASSETS.canvas})` }}>
          <div className="bv-art-caption">
            <span>{t('柔和的绘画肌理')}</span>
            <span>{t('官网现有视觉资产')}</span>
          </div>
        </div>
      </div>
      <div className="bv-rule-grid">
        <div>
          <h3>{t('表达品牌')}</h3>
          <p>{t('Hero、欢迎语使用展示字体；氛围图放在专门的品牌展示区域。')}</p>
        </div>
        <div>
          <h3>{t('保持清晰')}</h3>
          <p>{t('正文、表单、卡片与导航使用界面字体和中性表面，保留阅读层级。')}</p>
        </div>
        <div>
          <h3>{t('少量强调')}</h3>
          <p>{t('官网强调关键词；工具里的紫色主要用于更新提示。')}</p>
        </div>
      </div>

      <div className="bv-heading bv-subsection">
        <div>
          <p className="bv-eyebrow">{t('Identity · 正式资产')}</p>
          <h3>{t('同一个标识，适应不同空间')}</h3>
        </div>
        <a
          className="bv-text-link"
          href={new URL('../../packages/design-system/BRAND_GUIDELINES.md', import.meta.url).href}
          download="ZooWork-brand-guidelines.md"
        >
          {t('下载使用规范 ')}
          <ArrowDownTrayIcon />
        </a>
      </div>
      <div className="bv-controls">
        <ButtonGroup aria-label={t('Logo 背景')}>
          <Button size="sm" variant="ghost" aria-pressed={backdrop === 'light'} onClick={() => setBackdrop('light')}>
            {t('浅色底')}
          </Button>
          <Button size="sm" variant="ghost" aria-pressed={backdrop === 'dark'} onClick={() => setBackdrop('dark')}>
            {t('深色底')}
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label={t('Logo 形式')}>
          <Button size="sm" variant="ghost" aria-pressed={!symbol} onClick={() => setSymbol(false)}>
            {t('横版字标')}
          </Button>
          <Button size="sm" variant="ghost" aria-pressed={symbol} onClick={() => setSymbol(true)}>
            {t('独立标志')}
          </Button>
        </ButtonGroup>
      </div>
      <div className="bv-logo-stage" data-backdrop={backdrop}>
        <img src={logo} alt={t(symbol ? 'ZooWork 独立标志' : 'ZooWork 横版字标')} data-symbol={symbol} />
        <p>{t(symbol ? '紧凑空间 · 折叠导航' : backdrop === 'dark' ? '反白版本 · 深色背景' : '深色版本 · 浅色背景')}</p>
      </div>
      <div className="bv-downloads">
        <a href={BRAND_ASSETS.logoDark} download="zoowork-horizontal-navy.png">
          {t('深色横版 PNG ')}
          <ArrowDownTrayIcon />
        </a>
        <a href={BRAND_ASSETS.logoLight} download="zoowork-horizontal-white.png">
          {t('白色横版 PNG ')}
          <ArrowDownTrayIcon />
        </a>
        <a href={BRAND_ASSETS.symbol} download="zoowork-symbol.png">
          {t('独立标志 PNG ')}
          <ArrowDownTrayIcon />
        </a>
      </div>
      <div className="bv-rule-grid">
        <div>
          <h3>{t('保留原始组合')}</h3>
          <p>{t('保持图形、字标、比例和间距。字标直接引用资产，不用 Inter 重新输入。')}</p>
        </div>
        <div>
          <h3>{t('选择合适版本')}</h3>
          <p>{t('浅底深标、深底白标；窄空间使用独立图形。图标周围留出清晰空间。')}</p>
        </div>
        <div>
          <h3>{t('第三方保留识别色')}</h3>
          <p>{t('Connector 与模型 Logo 使用原品牌配色，统一容器、尺寸和对齐。')}</p>
        </div>
      </div>
      <p className="bv-note">
        {t(
          '当前来源：官网与工具使用的同一横版 Logo。最小尺寸与净空比例尚未定稿；深底独立标志暂以单色反白演示。中文展示字体为 Noto Serif SC 配对提案。',
        )}
      </p>
    </section>
  )
}

const palette = [
  ['品牌深色', '--zw-ink', '#0E0522', 'Logo · 标题 · 官网 CTA'],
  ['品牌强调', '--zw-violet', '#5755C6', '关键词 · 链接 · 更新提示'],
  ['浅紫衬底', '--zw-violet-soft', '#E8E7F8', '少量标签与局部反馈'],
  ['品牌画布', '--zw-canvas', '#F7F7F7', '中性背景与内容分区'],
] as const

export function BrandColorRules() {
  const { t } = usePreviewLocale()
  const [context, setContext] = useState<'marketing' | 'product'>('marketing')
  const [updated, setUpdated] = useState(false)
  const [email, setEmail] = useState('')
  const id = useId()
  const marketing = context === 'marketing'
  return (
    <div className="bv-color-rules">
      <div className="bv-palette">
        {palette.map(([name, token, value, use]) => (
          <div className="bv-swatch" key={token}>
            <span style={{ background: `var(${token})` }} />
            <strong>{t(name)}</strong>
            <code>{value}</code>
            <p>{t(use)}</p>
          </div>
        ))}
      </div>
      <div className="bv-heading bv-subsection">
        <h3>{t('同一品牌，两种使用场景')}</h3>
        <ButtonGroup aria-label={t('颜色使用场景')}>
          <Button size="sm" variant="ghost" aria-pressed={marketing} onClick={() => setContext('marketing')}>
            {t('官网表达')}
          </Button>
          <Button size="sm" variant="ghost" aria-pressed={!marketing} onClick={() => setContext('product')}>
            {t('工具界面')}
          </Button>
        </ButtonGroup>
      </div>
      <div className="bv-context-grid">
        <div className="bv-context-stage" data-zc-surface={context} aria-label={t('颜色交互示例')}>
          {marketing ? (
            <>
              <p className="bv-eyebrow">{t('Marketing · 官网')}</p>
              <p className="zw-display bv-context-display">
                {t('Built for your')}
                <br />
                <span>{t('next idea.')}</span>
              </p>
              <p className="bv-context-copy">{t('深色按钮确定主操作，紫色强调关键词与行动链接。')}</p>
              <div className="bv-inline">
                <Button onClick={() => document.getElementById('type')?.scrollIntoView({ behavior: 'smooth' })}>
                  {t('查看字体规范 ')}
                  <ArrowRightIcon />
                </Button>
                <a className="zw-brand-link" href="#brand">
                  {t('探索品牌资产')}
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="bv-heading">
                <strong>{t('Agent workspace')}</strong>
                {!updated && <Badge className="zw-update-badge">{t('Update available')}</Badge>}
              </div>
              <p className="zw-display bv-context-display">{t('What’s on your mind?')}</p>
              <p className="bv-context-copy">{t('工作区域保持中性，紫色提示有新版本可用。')}</p>
              <Label htmlFor={id}>{t('工作邮箱')}</Label>
              <Input
                id={id}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('name@zoowork.ai')}
              />
              <div className="bv-inline">
                <Button onClick={() => setUpdated(true)} disabled={updated}>
                  {updated ? (
                    <>
                      <CheckIcon /> {t('已更新')}
                    </>
                  ) : (
                    t('更新 Agent')
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdated(false)
                    setEmail('')
                  }}
                >
                  {t('重置示例')}
                </Button>
              </div>
              <p className="bv-feedback" role="status">
                {t(updated ? '更新完成，紫色提示已移除。仅演示本地状态。' : '可编辑输入框，使用 Tab 查看中性焦点。')}
              </p>
            </>
          )}
        </div>
        <div className="bv-context-rules">
          <p className="bv-eyebrow">{t(marketing ? '表达与引导' : '专注与反馈')}</p>
          <h3>{t(marketing ? '让少数位置被看见' : '让操作和内容清晰可见')}</h3>
          <ul>
            {(marketing
              ? [
                  '主要 CTA：深墨紫底、白字。',
                  '关键词和行动链接：允许品牌紫。',
                  '悬停与焦点：局部紫色反馈。',
                  '大面积背景：白色和浅灰。',
                ]
              : [
                  '主要按钮和导航：中性色。',
                  'New / Updated：少量紫色标签。',
                  '普通分类和数量标签：默认中性。',
                  '错误、成功、警告：独立语义色。',
                ]
            ).map((rule) => (
              <li key={rule}>{t(rule)}</li>
            ))}
          </ul>
          <p className="bv-note">
            {t(
              marketing
                ? '官网当前以浅色呈现；右上角深色模式不会把官网示例反转。'
                : '这是约定后的规则示例。紫色更新按钮的使用边界仍待收敛；创建弹窗的氛围色作为独立渐变配方保留。',
            )}
          </p>
        </div>
      </div>
      <GradientRules />
      <p className="bv-note">
        {t(
          '下面保留组件库基础调色板与状态色。品牌强调、主要操作和语义反馈各有用途；相近色值与深色主题仍需按真实组件核查。',
        )}
      </p>
    </div>
  )
}

export function BrandTypography() {
  const { t, locale: language } = usePreviewLocale()
  const [size, setSize] = useState(56)
  const [weight, setWeight] = useState('400')
  const [texts, setTexts] = useState({
    en: 'Your expertise,\ndeployed in minutes.',
    zh: '让你的专业，\n成为随时待命的智能体。',
  })
  const id = useId()
  const chinese = language === 'zh'
  const typeStyle = { '--specimen-size': `${size}px`, fontWeight: chinese ? Number(weight) : 400 } as CSSProperties
  return (
    <div className="bv-typography">
      <div className="bv-type-pairs">
        <div>
          <p className="bv-eyebrow">{t('Display · 品牌展示')}</p>
          <p className="zw-display bv-pair-latin">{t('GFS Didot')}</p>
          <p className="zw-display bv-pair-han" lang={language}>
            {t('让专业成为可能')}
          </p>
          <span>{t('中文配对提案 · Noto Serif SC')}</span>
        </div>
        <div>
          <p className="bv-eyebrow">{t('UI & Body · 正文与功能')}</p>
          <p className="bv-pair-latin">{t('Inter')}</p>
          <p className="bv-pair-han" lang={language}>
            {t('清晰的阅读与操作')}
          </p>
          <span>{t('中文 · Noto Sans SC')}</span>
        </div>
      </div>
      <div className="bv-heading bv-subsection">
        <h3>{t('亲自排一句话')}</h3>
      </div>
      <div className="bv-type-lab">
        <div className="bv-type-editor">
          <Label htmlFor={`${id}-text`}>{t('展示文字')}</Label>
          <textarea
            id={`${id}-text`}
            rows={3}
            value={texts[language]}
            onChange={(event) => setTexts({ ...texts, [language]: event.target.value })}
          />
          <Label htmlFor={`${id}-size`}>
            {t('字号 ')}
            <output>
              {size}
              {t('px')}
            </output>
          </Label>
          <input
            id={`${id}-size`}
            type="range"
            min="32"
            max="72"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
          <Label htmlFor={`${id}-weight`}>{t('中文展示字重')}</Label>
          <select
            id={`${id}-weight`}
            value={weight}
            disabled={!chinese}
            onChange={(event) => setWeight(event.target.value)}
          >
            <option value="400">{t('Regular · 400')}</option>
            <option value="500">{t('Medium · 500')}</option>
          </select>
          <p className="bv-note">{t('英文展示保持 Regular。中文单独调整行高和字重，以真实中英文混排检查视觉平衡。')}</p>
        </div>
        <div className="bv-type-stage">
          <span className="bv-eyebrow">{t(chinese ? `Noto Serif SC · ${weight}` : 'GFS Didot · 400')}</span>
          <p className="zw-display bv-type-specimen" lang={language} style={typeStyle}>
            {texts[language]}
          </p>
          <div className="bv-type-ui">
            <strong>{t(chinese ? '项目设置' : 'Project settings')}</strong>
            <p>
              {t(
                chinese
                  ? '普通标题和操作文字使用无衬线字体。'
                  : 'Functional headings and controls use the UI typeface.',
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSize(56)
                setWeight('400')
                setTexts({ en: 'Your expertise,\ndeployed in minutes.', zh: '让你的专业，\n成为随时待命的智能体。' })
              }}
            >
              {t(chinese ? '重置排版' : 'Reset specimen')}
            </Button>
          </div>
        </div>
      </div>
      <p className="bv-note">
        {t(
          '四个字体家族组成两种风格。此处使用本地字体文件；GFS Didot、Inter、Noto Serif SC、Noto Sans SC 的 OFL 许可随包保留。中文配对的最终字重仍待实样确认。',
        )}
      </p>
    </div>
  )
}
