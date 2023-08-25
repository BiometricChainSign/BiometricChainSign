import '@fontsource-variable/open-sans'

import { MantineProvider } from '@mantine/core'
import { createRoot } from 'react-dom/client'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import { mainnet } from 'wagmi/chains'

import { Landing } from './pages/landing'
import { Bar } from './components/bar'

const chains = [mainnet]
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
      theme={{ fontFamily: 'Open Sans Variable, sans-serif', primaryColor: 'indigo' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <WagmiConfig config={wagmiConfig}>
        <Bar />
        <Landing />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
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
  const root = createRoot(container)
  root.render(<App />)
}

render()
