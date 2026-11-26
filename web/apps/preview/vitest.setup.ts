import '@testing-library/jest-dom/vitest'

// jsdom polyfills for Radix primitives (Menu/Select/Tooltip call these; jsdom omits them).
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {}
if (!Element.prototype.hasPointerCapture) Element.prototype.hasPointerCapture = () => false
if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = () => {}
if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = () => {}
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
// vaul (Drawer) and sonner (Toaster) call window.matchMedia on mount for
// breakpoint/theme detection; jsdom omits it. Install the shim once here as a
// suite-wide environment polyfill (alongside the others above) rather than via
// a per-test beforeAll that mutates window without restoring — that leaks the
// stub across files in the same Vitest worker.
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
