import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-generated.ts',
  contracts: [
    { name: 'sepolia', address: '0x7C6312A61Ab5645e53be42F154028D14B15B5c37', abi },
    { name: 'mainnet', address: '0x7C6312A61Ab5645e53be42F154028D14B15B5c37', abi }, // TODO: Add address
  ],
  plugins: [actions({ readContract: true, writeContract: true })],
})
