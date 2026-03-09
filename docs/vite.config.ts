import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Force all vue imports (including those from notiv src files aliased into
    // this build) to resolve from docs/node_modules — critical for CI where
    // the root node_modules is not installed.
    dedupe: ['vue'],
    alias: [
      // notiv/style.css is a no-op — styles are bundled into index.ts already
      { find: /^notiv\/style\.css$/, replacement: resolve(__dirname, '../src/styles.css') },
      { find: 'notiv', replacement: resolve(__dirname, '../src/index.ts') },
    ],
  },
})
