import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-generated.ts',
  contracts: [
    { name: 'sepolia', address: '0x7D18DD11D85DD5399a529938D7C8231eB5f8089b', abi },
    { name: 'mainnet', address: '0x7D18DD11D85DD5399a529938D7C8231eB5f8089b', abi }, // TODO: Add address
  ],
  plugins: [actions({ readContract: true, writeContract: true })],
})
