import { reactive } from 'vue'
import {
  AUTO_COLLAPSE_DELAY,
  AUTO_EXPAND_DELAY,
  DEFAULT_TOAST_DURATION,
  EXIT_DURATION,
} from './constants'
import type { NotivItem, NotivOptions, NotivPosition } from './types'

/* -------------------------------- Store ----------------------------------- */

let idCounter = 0
const generateId = () =>
  `${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

interface NotivStore {
  toasts: NotivItem[]
  position: NotivPosition
  options: NotivOptions | undefined
}

// Module-level reactive singleton — Vue's reactivity handles subscriptions automatically
export const store: NotivStore = reactive<NotivStore>({
  toasts: [],
  position: 'top-right',
  options: undefined,
})

/* ----------------------------- Autopilot ---------------------------------- */

function resolveAutopilot(
  opts: NotivOptions,
  duration: number | null,
): { expandDelayMs?: number; collapseDelayMs?: number } {
  // autopilot is on by default — pass false to disable
  if (opts.autopilot === false || !duration || duration <= 0) return {}
  const cfg = typeof opts.autopilot === 'object' ? opts.autopilot : undefined
  const clamp = (v: number) => Math.min(duration, Math.max(0, v))
  return {
    expandDelayMs: clamp(cfg?.expand ?? AUTO_EXPAND_DELAY),
    collapseDelayMs: clamp(cfg?.collapse ?? AUTO_COLLAPSE_DELAY),
  }
}

/* ----------------------------- Build item --------------------------------- */

function mergeOptions(opts: NotivOptions): NotivOptions {
  return {
    ...store.options,
    ...opts,
    styles: { ...store.options?.styles, ...opts.styles },
  }
}

function buildItem(opts: NotivOptions, id: string, fallbackPosition?: NotivPosition): NotivItem {
  const merged = mergeOptions(opts)
  const duration = merged.duration !== undefined ? merged.duration : DEFAULT_TOAST_DURATION
  const auto = resolveAutopilot(merged, duration)
  return {
    ...merged,
    id,
    instanceId: generateId(),
    state: (merged as NotivItem).state ?? merged.type,
    position: merged.position ?? fallbackPosition ?? store.position,
    autoExpandDelayMs: auto.expandDelayMs,
    autoCollapseDelayMs: auto.collapseDelayMs,
  }
}

/* ----------------------------- Public API --------------------------------- */

export function addToast(opts: NotivOptions & { state?: NotivItem['state'] }): string {
  const id = opts.id ?? generateId()
  const existing = store.toasts.find(t => t.id === id && !t._removing)
  const item = buildItem(opts, id, existing?.position)

  if (existing) {
    const idx = store.toasts.indexOf(existing)
    store.toasts.splice(idx, 1, item)
  } else {
    const ghostIdx = store.toasts.findIndex(t => t.id === id)
    if (ghostIdx !== -1) store.toasts.splice(ghostIdx, 1)
    store.toasts.push(item)
  }
  return id
}

export function updateToast(id: string, opts: NotivOptions & { state?: NotivItem['state'] }): void {
  const existing = store.toasts.find(t => t.id === id)
  if (!existing) return
  const item = buildItem({ ...existing, ...opts }, id, existing.position)
  const idx = store.toasts.indexOf(existing)
  store.toasts.splice(idx, 1, item)
}

export function removeToast(id: string): void {
  const item = store.toasts.find(t => t.id === id)
  if (!item || item._removing) return
  item._removing = true
  setTimeout(() => {
    const idx = store.toasts.findIndex(t => t.id === id)
    if (idx !== -1) store.toasts.splice(idx, 1)
  }, EXIT_DURATION)
}

export function clearToasts(position?: NotivPosition): void {
  const targets = position
    ? store.toasts.filter(t => (t.position ?? store.position) === position)
    : [...store.toasts]
  targets.forEach(t => removeToast(t.id))
}
