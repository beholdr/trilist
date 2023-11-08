import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import { transform } from 'esbuild'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svgLoader from 'vite-svg-loader'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

// https://github.com/vitejs/vite/issues/6555#issuecomment-1342664357
const minifyEs = () => {
  return {
    name: 'minifyEs',
    renderChunk: {
      order: 'post',
      async handler(code, chunk, outputOptions) {
        if (
          outputOptions.format === 'es' &&
          chunk.fileName.endsWith('.min.js')
        ) {
          return await transform(code, { minify: true })
        }
        return code
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: [
        'es',
        // @ts-expect-error
        'esm'
      ],
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: (format) =>
        ({
          es: `${pkg.name}.js`,
          esm: `${pkg.name}.min.js`
        }[format])
    }
  },
  plugins: [
    svelte(),
    svgLoader(),
    minifyEs(),
    dts({
      outDir: 'dist/types',
      include: 'src/lib',
      entryRoot: 'src/lib'
    }),
    banner(
      `/*! ${pkg.name} v${pkg.version} (c) ${pkg.author}. Released under the ${pkg.license} license */`
    )
  ],
  test: {
    globals: true,
    setupFiles: 'test/setup.ts',
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary']
    }
  }
})
