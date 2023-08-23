import { createRoot } from 'react-dom/client'

function App() {
  return <div>Hello world</div>
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<App />)
}

render()
