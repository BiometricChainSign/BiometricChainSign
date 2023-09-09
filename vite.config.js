/** @type {import('vite').UserConfig} */
import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src/renderer'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
}
