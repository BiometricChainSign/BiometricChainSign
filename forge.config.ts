import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { MakerWix } from '@electron-forge/maker-wix'

import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerWix({
      name: 'BiometricChainSign',
      description:
        'BiometricChainSign is an innovative app designed to streamline and ensure secure document signing using blockchain and biometric technology. It provides an efficient and trustworthy solution for authenticating and recording document signatures, offering enhanced security and ease of use.',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        name: 'BiometricChainSign',
        description:
          'BiometricChainSign is an innovative app designed to streamline and ensure secure document signing using blockchain and biometric technology. It provides an efficient and trustworthy solution for authenticating and recording document signatures, offering enhanced security and ease of use.',
      },
    }),
    new MakerDeb({
      options: {
        name: 'BiometricChainSign',
        description:
          'BiometricChainSign is an innovative app designed to streamline and ensure secure document signing using blockchain and biometric technology. It provides an efficient and trustworthy solution for authenticating and recording document signatures, offering enhanced security and ease of use.',
      },
    }),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/electron/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/electron/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
}

export default config
