# Redaktion: Visiten, Freigabe, Artikel

**Stand:** 29.09.2026

## Visiten

Der Redaktionsplan ist in **Visiten** zu je 30 Posts gegliedert – wie ein Rundgang über die Station, Bett für
Bett. Die Postnummern laufen durch: Visite 1 sind die Posts 1–30, Visite 2 beginnt mit Post 31. Verweise wie
„siehe Post 3“ bleiben dadurch über alle Visiten eindeutig.

Definiert in `src/content/roadmap.ts` (`VISITEN`, `POSTS_JE_VISITE`). Eine neue Visite: Eintrag in `VISITEN`
mit Titel und Leitfrage, dann Posts ab der nächsten Nummer anlegen.

## Lokal und live

Seit 29.09.2026 zeigt die Seite **live nur, was schon gepostet ist**, plus eine Vorschau. **Lokal
(`npm run dev`) ist alles sichtbar**, alle Datensätze und alle 30 Posts mit Zahlen – dort entstehen die Videos.

**Adressen seit 03.10.2026:** Die Startseite ist das Magazin, das Studio liegt unter `/studio/`.

| | lokal | live |
|---|---|---|
| Startseite (neuester Artikel mit Grafik, alle Artikel) | <http://localhost:5173/> | <https://tiermedizin-in-zahlen.org/> |
| Studio, hier entstehen die Videos | <http://localhost:5173/studio/> | <https://tiermedizin-in-zahlen.org/studio/> |
| Redaktionsplan | <http://localhost:5173/studio/#redaktionsplan> | <https://tiermedizin-in-zahlen.org/studio/#redaktionsplan> |

Alte Links auf `/?beispiel=…` und `/#redaktionsplan` leitet die Startseite ins Studio weiter.

| | lokal (`npm run dev`) | live (tiermedizin-in-zahlen.org) |
|---|---|---|
| Datensätze im Studio | alle | nur aus veröffentlichten Posts und dem aktuellen Post |
| Redaktionsplan | alle 30 Posts, voll, je Post ein Hinweis „live: …“ | veröffentlichte Posts, der aktuelle Post und 3 Vorschauen ohne Zahlen |
| Artikel | alle Entwürfe unter `/beitrag/entwurf/` | nur ab Status `naechster` mit `bereit: ja` |

**Live gegen lokal prüfen:** unten links im Entwicklungsserver auf „Live-Ansicht prüfen“ klicken (oder `?live`
an die Adresse hängen). Die Seite zeigt dann genau das, was online steht. Die Artikelseiten entstehen erst im
Build; für sie `npm run build && npm run preview` und dort nachsehen.

## Ablauf je Post

1. **Video lokal:** `npm run dev`, Datensatz im Studio öffnen, `npm run check:glaette`, exportieren. Der Post darf
   dabei noch auf `geplant` stehen.
2. **Am Posttag:** Post auf `naechster`, Artikelentwurf auf `bereit: ja`, pushen. Damit gehen Artikel und
   Datensatz online, und die Vorschau rückt nach. Live prüfen, ob der Artikel-Link lädt.
3. **Post auf LinkedIn** mit dem Artikel-Link im Post selbst.
4. Im Redaktionsplan: `status: 'veroeffentlicht'`, `publishedOn`, `linkedInUrl`. Push.

Nach Änderungen an Titel oder Beschreibung eines Artikels: `node scripts/og-bilder.mjs` (braucht lokales Chrome) und die Bilder in `public/beitrag/og/` einchecken – das ist die Vorschau, die LinkedIn unter dem Link zeigt.

**Grafik im Artikel:** Unter dem ersten Absatz läuft der Datensatz des Posts als animierte Grafik, mit Knopf
„Im Studio öffnen“. Sie startet, sobald sie zur Hälfte im Bild ist, und wählt ihr Format selbst: hochkant 4:5
auf dem Telefon, 16:9 am Rechner. Ein anderer Datensatz oder eine andere Diagrammart im Kopf des Entwurfs:
`grafik: heimtiere bar`; keine Grafik: `grafik: keine`. Ohne Datensatz zeigt der Artikel ein Standbild unter
`public/beitrag/<slug>.png`, falls es eines gibt.

**Vor dem Push bei Änderungen an Layout oder Grafik:** `npm run check:mobil` (Entwicklungsserver muss laufen)
lädt jede Seite auf 360 Pixel Breite und meldet waagrechtes Scrollen und überstehende Elemente.

## Freigabe (`src/content/freigabe.json`)

| Schalter | Wert | Wirkung |
|---|---|---|
| `beispieleErstNachVeroeffentlichung` | an seit 29.09.2026 | live nur Datensätze aus veröffentlichten Posts, dem aktuellen Post (`naechster`) und Posts mit `vorabOnline`, lokal alle |
| `vorschauPosts` | 4 | so viele offene Posts zeigt der Plan live: der aktuelle und die nächsten drei, ohne Zahlen und Datensatz |
| `artikelLive` | an seit 23.09.2026 | Artikel von Posts auf `naechster` oder `veroeffentlicht` mit `bereit: ja` werden als Seite gebaut, dazu Übersicht `/beitrag/`, CSV je Datensatz unter `/daten/`, Sitemap und llms.txt |

Das Vorschaufenster zählt nur offene Posts: Wurde ein späterer Post vorgezogen (Post 6 vor Post 5), rückt der
nächste geplante nach. Regel und Test: `sichtbarkeiten()` in `src/content/freigabe.ts`, `src/test/freigabe.test.ts`.

**Was „verborgen“ nicht heißt:** Das Repository ist öffentlich. Entwürfe, Redaktionsplan und Rohdaten sind dort
lesbar, und die Datensätze liegen weiterhin im ausgelieferten JavaScript. Die Schalter steuern, was die Seite
anbietet und was Suchmaschinen finden, nicht was geheim ist.

## Vor jedem Video

`npm run dev`, dann `npm run check:glaette`: prüft Bild für Bild, dass das Line Race weder springt noch Beschriftungen umspringen lässt. Ein ✗ vor dem Export beheben, nicht im Video übersehen.

## Anleitungen

Artikel mit `art: anleitung` statt `post:` gehören zu keinem Post und gehen online, sobald sie `bereit: ja` tragen. Screenshots nie von Hand: `npm run dev`, dann `node scripts/screenshots-anleitung.mjs`. Nach Änderungen am Datenstandard (`docs/DATENSTANDARD.md`) Vorlagen neu erzeugen: `node scripts/build-vorlagen.mjs`.

## Artikel

Format und Regeln: `src/content/artikel/README.md`. Vorschau aller Entwürfe mit `npm run dev` unter
`/beitrag/entwurf/`. `npm run check:content` prüft jeden Entwurf auf Pflichtabschnitte, Länge der
Beschreibung, eine Zahl im ersten Absatz und offene Stellen.

## Einschübe außerhalb der Nummerierung

**Post zurückstellen:** Status zurück auf `geplant`, `vorabOnline: true`, wenn sein Artikel schon online war – sonst wird die Seite zur 404. Am 30.09.2026 so zurückgestellt: Post 5 (Video zu schwach) und Post 7 (Post 6 hatte dieselbe Geschichte schon erzählt), Post 8 kam vor.

Beiträge, die zu keinem Datensatz gehören, bekommen keine Postnummer, damit „siehe Post 7“ gültig bleibt.

| nach Post | Format | Thema | Entwurf |
|---|---|---|---|
| 8 | LinkedIn-Artikel | Vibecoding, Datenforschung und mehr: wie die Seite entsteht | `docs/linkedin/vibecoding-datenforschung.md` |

## Kandidaten für Visite 2

Stand der Bewertung von Visite 1 und Themen, die dort keinen Platz hatten. Reihenfolge ist Priorität.

1. ~~**Hund oder Katze – die Welt**~~ – seit 24.09.2026 Post 3 in Visite 1 (die Posts 3–15 sind dafür um eins aufgerückt, der alte Post 16 ist darin aufgegangen).
2. **Die Tiermedizin wird weiblich, als Reihe seit 1991.** Einzelwerte sind in Post 28 belegt; die Zeitreihe steht in denselben BTK-Jahrgängen wie Datensatz 1 und muss ausgelesen werden.
3. **Versorgung je Einwohner** (Post 22) – falls die Destatis-Reihe nicht rechtzeitig für Visite 1 kommt.
4. **Tiergesundheitsmarkt als Reihe** (Post 27) – die Vorjahre veröffentlicht der BfT jährlich.
5. **Eröffnungen der Neugründer** (Post 9) – Eröffnungsdatum je Standort von filu, Rex, Wolf & Tiger ergäbe ein echtes Rennen.
6. **Japan: vom Hunde- zum Katzenland** – Einzelfall aus der Weltkarte, 57 auf 41 Prozent Hundeanteil.
