# Hinweise für KI-Assistenten

Dieses Repo baut **zwei Seiten aus einem gemeinsamen Kern**:

- **Tiermedizin in Zahlen** (https://tiermedizin-in-zahlen.org) – Inhalte in `sites/tiermedizin/`, privates Projekt
  von Thomas Freimoser, ohne Firmenbezug.
- **Humanmedizin in Zahlen** (https://humanmedizin-in-zahlen.org) – Inhalte in `sites/humanmedizin/`, Herausgeber
  ebenfalls Thomas Freimoser, Geschäftsführer der FleXChange Medical GmbH; der Interessenkonflikt steht offen.

Alles außerhalb von `sites/` ist Kern und gilt für beide Seiten. Die Umgebungsvariable `SITE` (sonst die Datei
`.seite`, sonst `tiermedizin`) wählt die Seite.

Bevor du etwas änderst, lies:

1. `CLAUDE.md` – verbindliche Regeln für Daten, Grafiken, Posts, Website und die Zusammenarbeit zweier Chats
2. `sites/<seite>/CLAUDE.md` – Zweck, Zielgruppe und Ton der Seite
3. `docs/ARCHITEKTUR.md` – Aufbau, Befehle, Deploy
4. `docs/VERLINKUNG.md` – wie die Seiten aufeinander verweisen

Die wichtigsten Regeln in einem Satz: Kein Seitentext fest im Kern (alles ins Profil `sites/<seite>/profil.ts`),
Kernänderungen mit beiden Builds und `npm run test:alle` prüfen, jede Zahl mit Quelle und Jahr, Gerechnetes
markieren, keine leeren Jahre, und die erzeugten Kopien in der Wurzel (`artikel/`, `index.html`, `beitrag/`) nie
bearbeiten.
