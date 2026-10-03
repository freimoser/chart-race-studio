/**
 * Die animierte Grafik in den Artikeln. Läuft als eigene, kleine Seite in einem iframe: So bleibt das
 * Stylesheet der Artikel frei von Tailwind, und der Artikel lädt Diagrammcode erst, wenn die Grafik
 * in die Nähe des Bildschirms kommt (loading="lazy").
 *
 *   grafik.html?d=<Datensatz>          Diagrammart wie im Datensatz vorgeschlagen
 *   grafik.html?d=<Datensatz>&art=bar  andere Diagrammart, etwa für die Seiten zum Datenformat
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Grafik } from './Grafik'

const p = new URLSearchParams(window.location.search)
const art = p.get('art')
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Grafik id={p.get('d') ?? ''} art={art === 'bar' || art === 'line' || art === 'map' ? art : undefined} />
  </StrictMode>,
)
