import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import commonjsExternals from 'vite-plugin-commonjs-externals'

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
          src: 'src/electron/static',
          dest: './',
        },
      ],
    }),
    commonjsExternals({
      externals: ['web3.storage'],
    }),
  ],
  optimizeDeps: { exclude: ['web3.storage'] },
})
