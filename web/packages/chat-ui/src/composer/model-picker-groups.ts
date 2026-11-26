/** Primary rows shown before "More models", including the selected model. */
export const MODEL_PICKER_PRIMARY_LIMIT = 8

interface GroupableModelOption {
  id: string
  /** 2 = secondary ("More models"); missing or 1 is primary. */
  displayTier?: 1 | 2
}

export interface ModelPickerGroups<T extends GroupableModelOption> {
  primary: T[]
  more: T[]
}

/**
 * Presentation-only split of a catalog into primary and "More models" rows.
 *
 * A missing tier means primary, so an untiered catalog is still capped at
 * `limit` rows with the overflow under "More models". The selected option
 * always stays primary — even a secondary or unselectable one — and keeps its
 * own selectability. Order within each group follows the input order; options
 * are never added, removed or mutated.
 */
export function groupModelPickerOptions<T extends GroupableModelOption>(
  options: T[],
  selectedId: string,
  limit = MODEL_PICKER_PRIMARY_LIMIT,
): ModelPickerGroups<T> {
  const selected = options.find((option) => option.id === selectedId)
  const primaryIds = new Set<string>(selected ? [selected.id] : [])
  for (const option of options) {
    if (primaryIds.size >= limit) break
    if (option.displayTier !== 2) primaryIds.add(option.id)
  }
  return {
    primary: options.filter((option) => primaryIds.has(option.id)),
    more: options.filter((option) => !primaryIds.has(option.id)),
  }
}
