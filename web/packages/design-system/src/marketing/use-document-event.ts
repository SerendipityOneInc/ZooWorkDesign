import { useEffect, type RefObject } from 'react'
export function useDocumentEvent(type: 'click', listener: (event: MouseEvent) => void, ref: RefObject<Document>) {
  useEffect(() => {
    const target = ref.current
    target?.addEventListener(type, listener)
    return () => target?.removeEventListener(type, listener)
  }, [type, listener, ref])
}
