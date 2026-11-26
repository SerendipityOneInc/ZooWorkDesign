/** Preserve existing shared links while retiring the separate page showcases. */
export function resolveCatalogLocation(search: string, hash: string): string | null {
  const query = new URLSearchParams(search)
  const showcase = query.get('showcase')
  const aliases: Record<string, string> = {
    'product-catalog': 'connector-cards',
    'product-agent-navigation': 'product-navigation',
    'product-states': 'connector-cards',
    'platform-overview': 'brand',
    segmented: 'tabs',
  }
  if (showcase) {
    query.delete('showcase')
    const section = ['settings', 'agent'].includes(showcase) ? 'product-navigation' : 'connector-pattern'
    return `${query.size ? `?${query}` : ''}#${section}`
  }
  const section = aliases[hash.slice(1)]
  return section ? `${search}#${section}` : null
}
