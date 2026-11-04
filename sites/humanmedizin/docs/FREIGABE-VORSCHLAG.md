# Freigabe-Vorschlag: 20 neue Chart Races (Stand 04.11.2026)

Die Datensätze aus der Prüfschleife vom 29.10.2026 sind gebaut und geprüft (Glätte 0 Sprünge, keine Kürzung, Zweitquelle
und Gegenbelege in der Dateninfo, eigener Abschnitt in der Datenherkunft). Im öffentlichen Studio sind sie erst
sichtbar, wenn ihre ID in `sites/humanmedizin/content/freigabe.json` unter `datensaetzeOhnePost` steht. Das entscheidet
Thomas. Solange die Humanmedizin nicht live ist, hat die Freigabe keine Außenwirkung.

## Empfehlung

**Gruppe A – passt zur Zielgruppe (Praxis-IT, Schnittstellen), zuerst freigeben:**

| ID | Titel | Gerechnet? | Passt zu |
|---|---|---|---|
| `erezept-monat` | E-Rezepte je Monat | Monatswerte aus Zählerständen | Post 7 (KIM), eigener Post E-Rezept |
| `erezept-quote` | E-Rezept: Frauenärzte vorn, Kinderärzte hinten | nein | eigener Post E-Rezept |
| `eau-monat` | Krankschreibungen digital: die Wellen | Monatswerte aus Zählerständen | Post 7 (KIM-Verkehr) |
| `kim-nutzung` | KIM in Arzt- und Psychotherapiepraxen | nein | Post 7 |
| `epa-nutzung` | Die ePA kommt in den Praxen an | nein | eigener Post ePA |
| `arztbrief-praxisbarometer` | Arztbriefe: empfangen ja, senden zögerlich | nein | Post 7 |
| `digitale-angebote` | Hausarztpraxis online: Rezept vor Termin | nein | Post 12 |
| `pvs-internisten` | Praxissoftware der Internisten | 2022/2023 linear | Fortsetzung von Post 12 |

**Gruppe B – Markt und Struktur (MVZ, Labor, Ketten):**

| ID | Titel | Gerechnet? | Passt zu |
|---|---|---|---|
| `mvz-angestellte` | Im MVZ arbeiten fast nur Angestellte | nein | Post 8 |
| `mvz-typen` | MVZ ohne einen einzigen Vertragsarzt | nein | Post 8 |
| `einzelpraxen` | Die Einzelpraxis wird psychotherapeutisch | 2025 aus Tabelle 5 der Registerstatistik summiert | Post 8, Post 3 |
| `labor-honorar` | Laborhonorar: der Corona-Berg | nein | Post 11 |
| `praxisnetze` | Praxisnetze steigen auf | nein | eigener Post |
| `apotheken-filialen` | Apotheken: Die Einzelapotheke schwindet | 2016–2019 linear, Filialen 2021 | eigener Post (Parallele zu Einzelpraxen) |

**Gruppe C – Versorgung allgemein, eher für Reichweite als für die Zielgruppe:**

| ID | Titel | Gerechnet? |
|---|---|---|
| `frauenanteil` | Die Praxis wird weiblich, nicht überall | nein |
| `facharzt-anerkennungen` | Mehr neue Allgemeinärzte | nein |
| `medizinstudierende` | Medizinstudium: zwei Drittel Frauen | nein |
| `weiterbildung-allgemeinmedizin` | Hausarzt-Nachwuchs: NRW holt Bayern ein | nein |
| `tss-vermittlungen` | Terminservice: Orthopädie holt auf | nein |
| `au-faelle` | Krankschreibungen: der Sprung 2022 | nein |

## So wird freigegeben

```json
"datensaetzeOhnePost": ["pvs-installationen-2007", "erezept-monat", "erezept-quote", "…"]
```

Danach `npm run build` und `npm run check:grafiken` (gegen `npm run preview`), dann Push.
