/** Public demo media must follow the catalog's deployment path, including on project Pages. */
export function previewAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
