// Lädt das Stylesheet der Artikelseiten. Der Inhalt steht statisch im HTML,
// damit er ohne JavaScript und für Crawler im Quelltext steht.
import './article.css'
import { FEATURES } from '@/content/site'
import { starteEinwilligung } from '@/lib/consent'

// Einwilligung für Google Analytics: nur wenn eine Messkennung konfiguriert ist. Der Pfad zur
// Datenschutzerklärung kommt aus dem Fußlink, der die Ordnertiefe schon richtig auflöst.
const datenschutz = document.querySelector<HTMLAnchorElement>('footer a[href$="datenschutz.html"]')?.getAttribute('href') ?? '/datenschutz.html'
starteEinwilligung(FEATURES.gaId, datenschutz)
