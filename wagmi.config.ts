import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-generated.ts',
  contracts: [
    { name: 'sepolia', address: '0x8164CE12dF1DdAA41d67e7349996aaEF5F053c20', abi },
    { name: 'mainnet', address: '0xeF427b6E656b7a63fbA3769946afD161E2aB27B3', abi }, // TODO: Add address
  ],
  plugins: [actions({ readContract: true, writeContract: true })],
})
