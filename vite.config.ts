import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        'notiv': resolve(__dirname, 'src/index.ts'),
        'module': resolve(__dirname, 'src/module.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'module'
          ? `module.${format === 'es' ? 'mjs' : 'cjs'}`
          : `notiv.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['vue', '@nuxt/kit', 'nuxt/app', 'path'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'style.css',
      },
    },
    cssCodeSplit: false,
  },
})
