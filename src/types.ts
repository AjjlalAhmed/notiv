import type { Component, VNode } from 'vue'

export type NotivState =
  | 'success'
  | 'loading'
  | 'error'
  | 'warning'
  | 'info'
  | 'action'

export const NOTIV_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

export type NotivPosition = (typeof NOTIV_POSITIONS)[number]

export interface NotivStyles {
  title?: string
  description?: string
  badge?: string
  button?: string
}

export interface NotivButton {
  title: string
  onClick: () => void
}

export interface NotivOptions {
  id?: string
  title?: string
  description?: string
  type?: NotivState
  position?: NotivPosition
  /** Duration in ms. null = persist forever. */
  duration?: number | null
  icon?: Component | VNode | null
  styles?: NotivStyles
  fill?: string
  roundness?: number
  /** Auto expand/collapse. Defaults to true. false = disabled, object = custom delays (ms) */
  autopilot?: boolean | { expand?: number; collapse?: number }
  button?: NotivButton
}

export interface NotivItem extends NotivOptions {
  id: string
  /** Unique per-instance key — changes when toast is updated via promise/update */
  instanceId: string
  state?: NotivState
  _removing?: boolean
  autoExpandDelayMs?: number
  autoCollapseDelayMs?: number
}

export type NotivOffsetValue = number | string
export type NotivOffsetConfig = Partial<
  Record<'top' | 'right' | 'bottom' | 'left', NotivOffsetValue>
>

export interface NotivToasterProps {
  position?: NotivPosition
  offset?: NotivOffsetValue | NotivOffsetConfig
  options?: NotivOptions
  theme?: 'light' | 'dark' | 'system'
}
