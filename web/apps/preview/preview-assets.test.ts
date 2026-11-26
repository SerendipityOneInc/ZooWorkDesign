import { afterEach, expect, it, vi } from 'vitest'
import { previewAsset } from './preview-assets'

afterEach(() => vi.unstubAllEnvs())

it('serves public demo media from the root for local previews', () => {
  vi.stubEnv('BASE_URL', '/')
  expect(previewAsset('product-source/avatars/owl.png')).toBe('/product-source/avatars/owl.png')
})

it('keeps avatars, logos and videos within the GitHub Pages project path', () => {
  vi.stubEnv('BASE_URL', '/ZooWorkDesign/')
  for (const path of ['product-source/avatars/owl.png', 'product-source/brand/zoowork-symbol.png', 'videos/sample-clip.mp4']) {
    expect(previewAsset(path)).toBe(`/ZooWorkDesign/${path}`)
  }
})

it('does not let a leading slash bypass the deployment path', () => {
  vi.stubEnv('BASE_URL', '/ZooWorkDesign/')
  expect(previewAsset('/product-source/avatars/fox.png')).toBe('/ZooWorkDesign/product-source/avatars/fox.png')
})
