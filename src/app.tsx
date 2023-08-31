import '@fontsource-variable/open-sans'

import { createRoot } from 'react-dom/client'
import { MantineProvider, Stack } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, useAccount, WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import { mainnet } from 'wagmi/chains'

import { Bar } from './components/bar'
import { ConnectPage } from './pages/connect'
import { DocumentSelectPage } from './pages/document-select'
import { FaceCapturePage } from './pages/face-capture'

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
      <Notifications />

      <WagmiConfig config={wagmiConfig}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<ConnectPage />} />
              <Route path='/document-select' element={<DocumentSelectPage />} />
              <Route path='/face-capture' element={<FaceCapturePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
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

function Layout() {
  const location = useLocation()
  const { isConnected } = useAccount()

  if (location.pathname !== '/' && !isConnected) {
    return <Navigate to='/' />
  }

  if (location.pathname === '/' && isConnected) {
    return <Navigate to='/document-select' />
  }

  return (
    <Stack w='100%' maw='1200px' mih='100vh' mx='auto' px='xs' spacing={0}>
      <Bar />
      <Outlet />
    </Stack>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<App />)
}

render()
