import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // notiv/style.css is a no-op — styles are bundled into index.ts already
      { find: /^notiv\/style\.css$/, replacement: resolve(__dirname, '../src/styles.css') },
      { find: 'notiv', replacement: resolve(__dirname, '../src/index.ts') },
    ],
  },
})
