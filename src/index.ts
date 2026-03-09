import type { App } from 'vue'
import NotivToaster from './components/NotivToaster.vue'
import NotivToast from './components/NotivToast.vue'
import { useNotiv } from './composables/useNotiv'
import { notiv } from './notiv'
import './styles.css'

export { NotivToaster, NotivToast, useNotiv, notiv }
export type {
  NotivOptions,
  NotivPosition,
  NotivState,
  NotivItem,
  NotivButton,
  NotivStyles,
  NotivToasterProps,
} from './types'

/** Vue plugin — registers NotivToaster and NotivToast globally and adds $notiv */
export const NotivPlugin = {
  install(app: App) {
    app.component('NotivToaster', NotivToaster)
    app.component('NotivToast', NotivToast)
    app.config.globalProperties.$notiv = notiv
  },
}

export default NotivPlugin
