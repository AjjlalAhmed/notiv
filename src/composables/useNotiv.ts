import { computed, type ComputedRef } from 'vue'
import { store } from '../store'
import { notiv } from '../notiv'
import type { NotivItem, NotivPosition } from '../types'

export interface UseNotivReturn {
  notiv: typeof notiv
  toasts: ComputedRef<NotivItem[]>
}

/**
 * Returns the imperative notiv API and a reactive list of current toasts.
 * Optionally filter by position.
 */
export function useNotiv(position?: NotivPosition): UseNotivReturn {
  const toasts = computed<NotivItem[]>(() =>
    position
      ? store.toasts.filter(t => (t.position ?? 'top-right') === position)
      : store.toasts,
  )

  return { notiv, toasts }
}
