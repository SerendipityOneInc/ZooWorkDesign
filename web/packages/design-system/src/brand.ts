/** Production assets shared by the catalog and consuming applications. */
export const BRAND_ASSETS = {
  logoDark: new URL('../assets/logos/zoowork-horizontal-navy.png', import.meta.url).href,
  logoLight: new URL('../assets/logos/zoowork-horizontal-white.png', import.meta.url).href,
  symbol: new URL('../assets/logos/zoowork-symbol.png', import.meta.url).href,
  canvas: new URL('../assets/imagery/hero-canvas.webp', import.meta.url).href,
} as const
