import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'

import { abi } from './src/renderer/abi'

export default defineConfig({
  out: 'src/renderer/wagmi-hooks.ts',
  contracts: [{ name: '', address: '0x88E825cD5720991B9aEEdcaa16C2f2ac373B2243', abi }],
  plugins: [
    react({ useContractRead: true, useContractWrite: true }),
    actions({ readContract: true, writeContract: true }),
  ],
})
