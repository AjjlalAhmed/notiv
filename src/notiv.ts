import { DEFAULT_TOAST_DURATION } from './constants'
import { addToast, removeToast, clearToasts, updateToast } from './store'
import type { NotivOptions, NotivPosition } from './types'

export interface NotivPromiseOptions<T = unknown> {
  loading: NotivOptions
  success: NotivOptions | ((data: T) => NotivOptions)
  error: NotivOptions | ((err: unknown) => NotivOptions)
  position?: NotivPosition
}

export const notiv = {
  show(opts: NotivOptions): string {
    return addToast({ ...opts, state: opts.type })
  },

  success(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'success' })
  },

  error(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'error' })
  },

  warning(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'warning' })
  },

  info(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'info' })
  },

  action(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'action' })
  },

  loading(opts: NotivOptions): string {
    return addToast({ ...opts, state: 'loading', duration: null })
  },

  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    opts: NotivPromiseOptions<T>,
  ): Promise<T> {
    const id = addToast({
      ...opts.loading,
      state: 'loading',
      duration: null,
      position: opts.position,
    })

    const p = typeof promise === 'function' ? promise() : promise

    p.then((data) => {
      const successOpts =
        typeof opts.success === 'function' ? opts.success(data) : opts.success
      updateToast(id, {
        ...successOpts,
        id,
        state: 'success',
        duration: successOpts.duration ?? DEFAULT_TOAST_DURATION,
      })
    }).catch((err) => {
      const errorOpts =
        typeof opts.error === 'function' ? opts.error(err) : opts.error
      updateToast(id, {
        ...errorOpts,
        id,
        state: 'error',
        duration: errorOpts.duration ?? DEFAULT_TOAST_DURATION,
      })
    })

    return p
  },

  dismiss(id: string): void {
    removeToast(id)
  },

  clear(position?: NotivPosition): void {
    clearToasts(position)
  },
}
