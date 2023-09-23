import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-hooks.ts',
  contracts: [{ name: '', address: '0xd699C7e4E8Bb3D5175FDFda4bdCB7066d4cB48Cb', abi }],
  plugins: [
    react({ useContractRead: true, useContractWrite: true }),
    actions({ readContract: true, writeContract: true }),
  ],
})
