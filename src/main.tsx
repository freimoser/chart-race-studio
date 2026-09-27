import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useApp } from './state/store'

// Debug-Zugriff im Dev-Modus (gleiche Store-Instanz wie die App)
if (import.meta.env.DEV) (window as unknown as { __crs: unknown }).__crs = { useApp }

// Nach einem Deploy gibt es die nachgeladenen Programmteile des alten Stands nicht mehr. Ein offener Tab
// scheitert dann still, sobald er etwa das Balkenrennen nachlädt. Einmal neu laden holt den neuen Stand.
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault()
  if (!sessionStorage.getItem('crs-neu-geladen')) { sessionStorage.setItem('crs-neu-geladen', '1'); window.location.reload() }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
