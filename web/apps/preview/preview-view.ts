/** The homepage and catalog share one static entry, including on GitHub Pages. */
export function resolvePreviewView(search: string, hash: string): 'home' | 'components' | 'patterns' {
  const view = new URLSearchParams(search).get('view')
  if (view === 'patterns') return view
  if (view === 'components') return view
  if (view === 'home') return view
  const homeSections = ['', '#top', '#home-main', '#examples', '#capabilities', '#design-resources', '#get-started']
  return homeSections.includes(hash) ? 'home' : 'components'
}
