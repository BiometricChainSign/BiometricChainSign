import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
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
