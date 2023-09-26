import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-generated.ts',
  contracts: [
    { name: 'sepolia', address: '0x40d9F05C436dB94d02886813C80Ef1634CbAc641', abi },
    { name: 'mainnet', address: '0x40d9F05C436dB94d02886813C80Ef1634CbAc641', abi }, // TODO: Add address
  ],
  plugins: [actions({ readContract: true, writeContract: true })],
})
