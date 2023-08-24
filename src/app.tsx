import '@fontsource-variable/open-sans'

import { MantineProvider } from '@mantine/core'
import { createRoot } from 'react-dom/client'
import { Landing } from './pages/landing'

function App() {
  return (
    <MantineProvider
      theme={{ fontFamily: 'Open Sans Variable, sans-serif', primaryColor: 'indigo' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Landing />
    </MantineProvider>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<App />)
}

render()
