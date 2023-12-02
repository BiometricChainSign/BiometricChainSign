import '@fontsource-variable/open-sans'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { WagmiConfig } from 'wagmi'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { /*mainnet,*/ sepolia } from 'wagmi/chains'

import Routes from './routes'

const chains = [/*mainnet,*/ sepolia]
const projectId = '1790d0716aba5ac0c6ac1e5a5c8968cd'

const metadata = {
  name: 'BiometricChainSign',
  description: 'BiometricChainSign: Secure Biometric Blockchain Signatures.',
  url: 'BiometricChainSign',
  icons: [
    'https://raw.githubusercontent.com/BiometricChainSign/BiometricChainSign/main/src/electron/static/imgs/icon.png',
  ],
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: chains[0],
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Open Sans Variable, sans-serif',
    '--w3m-accent': '#4c6ef5',
  },
})

function App() {
  useEffect(() => {
    const web3StorageToken = localStorage.getItem('web3StorageToken')

    if (web3StorageToken) {
      window.electron.setWeb3StorageToken(web3StorageToken)
    }
  }, [])

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Open Sans Variable, sans-serif',
        primaryColor: 'indigo',
        globalStyles: theme => ({
          body: {
            minHeight: '100vh',
            background: theme.colors.gray[0],
          },
        }),
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position='top-center' />

      <WagmiConfig config={wagmiConfig}>
        <Routes />
      </WagmiConfig>
    </MantineProvider>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container!)
  root.render(<App />)
}

render()
