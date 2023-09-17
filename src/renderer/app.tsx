import '@fontsource-variable/open-sans'

import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import { mainnet, sepolia } from 'wagmi/chains'

import Routes from './routes'

const chains = [process.env.NODE_ENV === 'production' ? mainnet : sepolia]
const projectId = '1790d0716aba5ac0c6ac1e5a5c8968cd'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

function App() {
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
      <Notifications position='bottom-center' />

      <WagmiConfig config={wagmiConfig}>
        <Routes />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={sepolia}
        themeMode='light'
        themeVariables={{
          '--w3m-font-family': 'Open Sans Variable, sans-serif',
          '--w3m-accent-color': '#4c6ef5',
          '--w3m-background-color': '#4c6ef5',
        }}
      />
    </MantineProvider>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container!)
  root.render(<App />)
}

render()
