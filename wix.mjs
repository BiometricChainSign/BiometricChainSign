import { join } from 'path'

import { MSICreator } from 'electron-wix-msi'

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: './dist',
  name: 'BiometricChainSign',
  icon: join('src', 'electron', 'static', 'imgs', 'icon.ico'),
  description:
    'BiometricChainSign is an innovative app designed to streamline and ensure secure document signing using blockchain and biometric technology. It provides an efficient and trustworthy solution for authenticating and recording document signatures, offering enhanced security and ease of use.',
  exe: 'BiometricChainSign',
  version: '1.0.0',
  outputDirectory: './package',
})

await msiCreator.compile()
