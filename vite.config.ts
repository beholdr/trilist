import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svgLoader from 'vite-svg-loader'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'trilist',
      formats: ['umd'],
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: (format) => `${pkg.name}.${format}.js`
    }
  },
  plugins: [
    svelte(),
    svgLoader(),
    dts({
      outDir: 'dist/types',
      include: 'src/lib',
      entryRoot: 'src/lib'
    }),
    banner(
      `/*! ${pkg.name} v${pkg.version} (c) ${pkg.author}. Released under the ${pkg.license} license */`
    )
  ]
})
