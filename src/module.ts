import { defineNuxtModule, addComponent, addPlugin, addImports, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /** Whether to auto-inject the CSS. Default: true */
  css?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'notiv',
    configKey: 'notiv',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: { css: true },
  setup(opts, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Auto-register components (client-only — toast UI is never SSR'd)
    addComponent({
      name: 'NotivToaster',
      export: 'NotivToaster',
      filePath: 'notiv',
      mode: 'client',
    })
    addComponent({
      name: 'NotivToast',
      export: 'NotivToast',
      filePath: 'notiv',
      mode: 'client',
    })

    // Auto-import the useNotiv composable
    addImports({
      name: 'useNotiv',
      as: 'useNotiv',
      from: 'notiv',
    })

    // Also auto-import the notiv object for out-of-component usage
    addImports({
      name: 'notiv',
      as: 'notiv',
      from: 'notiv',
    })

    // Runtime plugin that provides $notiv via useNuxtApp()
    addPlugin({
      src: resolve('./runtime/plugin'),
      mode: 'client',
    })

    // Inject CSS
    if (opts.css !== false) {
      nuxt.options.css.push('notiv/style.css')
    }
  },
})
