import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  resolve: {
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/electron/python/fisherface.py',
          dest: 'python',
        },
      ],
    }),
  ],
})
