import { BRAND_ASSETS } from '@zooclaw/zooworkdesign'

/** Public site identity; package and legal names remain unchanged. */
export function SiteBrand() {
  return <span className="site-brand"><img src={BRAND_ASSETS.symbol} width="30" height="30" alt="" /><span>ZooWork<span className="site-brand-design">Design</span></span></span>
}
