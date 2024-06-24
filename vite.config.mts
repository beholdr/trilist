import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svgLoader from 'vite-svg-loader'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'Trilist',
      entry: resolve(__dirname, 'src/main.ts'),
    },
  },
  plugins: [
    svelte(),
    svgLoader(),
    dts({ outDir: 'dist/types', include: 'src/lib', entryRoot: 'src/lib' }),
    banner(
      `/*! ${pkg.name} v${pkg.version} by ${pkg.author}. Released under the ${pkg.license} license */`,
    ),
  ],
  test: {
    globals: true,
    setupFiles: 'test/setup.ts',
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
    },
  },
})
