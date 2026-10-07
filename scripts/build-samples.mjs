// Erzeugt src/samples/data.ts aus den recherchierten Rohdaten in data/raw/.
// Aufruf: node scripts/build-samples.mjs
import fs from 'node:fs'
import path from 'node:path'

const RAW = path.resolve('data/raw')
const load = (f) => (fs.existsSync(path.join(RAW, f)) ? JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8')) : { rows: [] })
const d1 = load('ds1-tieraerzte.json'), d1b = load('ds1b-tieraerzte-1990-2001.json'), d1c = load('ds1c-taetige-1992-2001.json')
const d2 = load('ds2-heimtiere.json'), d2b = load('ds2b-heimtiere-1990-2013.json'), d2d = load('ds2d-hunde-katzen-1991-1998.json')
// ds2c ist überholt: dessen „1999“-Werte sind laut Nachrecherche in Wahrheit die 1996er Zahlen
// (die IVH-Website zeigte 2001 noch den Stand von 1996). ds2d ersetzt sie durch die datierte ZZF/IVH-Reihe.
// Die 1992er Zeile aus ds2b (unbelegtes Wikipedia-Zitat) widerspricht dieser Reihe und bleibt ebenfalls draußen.
const d2bClean = { rows: d2b.rows.filter((r) => r.date !== '1992') }
const d3 = load('ds3-hunderassen.json'), d3b = load('ds3b-hunderassen-1990-2010.json'), d3c = load('ds3c-hunderassen-2011-2025.json')
const d4 = load('ds4-nutztiere.json'), d5 = load('ds5-tieraerzte-bundesland-1991-2005.json'), d7 = load('ds7-viehbestand-1991-2009.json')
const d8 = load('ds8-praxisarten-1996-2025.json'), d9 = load('ds9-fachtieraerzte.json'), d10 = load('ds10-kleintiere-bundesland.json')
const d12 = load('ds12-ketten-modell.json')
const d13 = load('ds13-hund-katze-welt.json')
const d14 = load('ds14-geschlecht.json')
const d15 = load('ds15-oktoberfest.json')
const d16 = load('ds16-tierarztkosten.json')
const d17 = load('ds17-tierarzt-umsatz.json')
const d18 = load('ds18-pferde.json')
const d19 = load('ds19-heimtiere-dach.json')

/** long rows -> wide table (Jahr × names). Bei Dubletten gewinnt die zuerst genannte Quelle. */
function wide(rows, { names, from, to, rename = {} }) {
  const dates = [...new Set(rows.map((r) => r.date))].filter((d) => (!from || d >= from) && (!to || d <= to)).sort()
  const nm = names ?? [...new Set(rows.map((r) => r.name))]
  const out = dates.map((d) => [d, ...nm.map((n) => { const r = rows.find((x) => x.date === d && x.name === n); return r ? r.value : null })])
  // Zeilen ohne einen einzigen Wert verwerfen
  return { headers: ['Jahr', ...nm.map((n) => rename[n] ?? n)], rows: out.filter((r) => r.slice(1).some((v) => v != null)) }
}
const byMetric = (d, m) => d.rows.filter((r) => r.metric === m)

// Dubletten (Datum|Name) entfernen – die zuerst gelistete Quelle gewinnt.
const dedupe = (rows) => { const s = new Set(); return rows.filter((r) => { const k = r.date + '|' + r.name; return s.has(k) ? false : (s.add(k), true) }) }

// 1 Tierärzt:innen gesamt nach Bundesland. 2006–2025 aus ds1, 2002–2005 aus den archivierten
// BTK-Statistiken (ds5, nach Kammerbereich – Nordrhein und Westfalen-Lippe werden wie in ds1 zu
// Nordrhein-Westfalen addiert). Vor 2002 hat die BTK selbst keine Kammerdaten.
const NRW = ['Nordrhein', 'Westfalen-Lippe']
const kammerRows = byMetric(d5, 'Tierärzte gesamt (Kammermitglieder) nach Kammerbereich').filter((r) => r.name !== 'Deutschland')
const kammerJahre = [...new Set(kammerRows.map((r) => r.date))].filter((y) => new Set(kammerRows.filter((r) => r.date === y).map((r) => r.name)).size >= 16)
const bundeslandAus2005 = kammerJahre.flatMap((date) => {
  const jahr = kammerRows.filter((r) => r.date === date)
  const nrw = jahr.filter((r) => NRW.includes(r.name)).reduce((sum, r) => sum + r.value, 0)
  return [
    ...jahr.filter((r) => !NRW.includes(r.name)),
    ...(nrw > 0 ? [{ date, name: 'Nordrhein-Westfalen', value: nrw }] : []),
  ]
})
const w1 = wide(dedupe([...byMetric(d1, 'Tierärzt:innen gesamt nach Bundesland'), ...bundeslandAus2005]), {})


// 2 National: Niedergelassene, Praxisassistent:innen, Tätige (BTK) + Hunde & Katzen (IVH/ZZF) auf der rechten Achse.
//   1990–1995 aus Maure (1998): Praxisinhaber berechnet (Bereich Praxis − Assistenz/Vertretung), 1991 exakt (Schöne & Ulrich).
// Die BTK zählt ausschließlich approbierte Kammermitglieder. „Praxisassistent:innen“ (so der historische
// Begriff der Statistik, seit 2024 „Angestellte“) sind angestellte TIERÄRZT:INNEN – nicht Tiermedizinische
// Fachangestellte (TFA), die in keiner BTK-Statistik auftauchen.
const NIED = 'Niedergelassene Tierärzt:innen (Praxisinhaber)', ASSI = 'Angestellte Tierärzt:innen (in Praxen)', TAET = 'Tierärztlich Tätige gesamt'
const natMap = {
  'Niedergelassene/praktizierende Tierärzt:innen (Praxisinhaber)': NIED,
  'Praktizierende Tierärzt:innen (Praxisinhaber)': NIED,
  'Praktizierende Tierärzt:innen (Praxisinhaber) – berechnet': NIED,
  'Praxisassistent:innen (angestellt in Praxis)': ASSI,
  'Praxisassistent:innen (ohne Praxisvertreter:innen)': ASSI,
  'Praxisassistent:innen': ASSI,
  'Praxisassistent:innen inkl. Praxisvertreter:innen': ASSI,
  'Tierärztlich Tätige (Summe)': TAET,
  'Tierärztlich Tätige (Inland)': TAET,
  'Tierärztlich Tätige (In- und Ausland; BTK-Definition wie 2002)': TAET,
  // bereits umbenannte Reihen (z.B. aus dem Agrarstatistischen Jahrbuch) unverändert durchlassen
  [NIED]: NIED, [ASSI]: ASSI, [TAET]: TAET,
}
const d1cDe = d1c.rows.filter((r) => r.metric === 'Deutschland')
// Reihenfolge = Priorität (erster Treffer je Jahr gewinnt): BTK direkt, dann publizierte Sekundärquellen,
// zuletzt aus publizierten Aggregaten berechnete Werte. Friedrich (2007) hat vor Maure (1998) Vorrang,
// weil er die Assistent:innen ohne Praxisvertreter:innen ausweist – so wie die heutige BTK-Statistik.
// Agrarstatistisches Jahrbuch 2001 (Tab. 166): geschlossene nationale Reihe 1994–2001. In den
// Überschneidungsjahren 1994/1995 und 1998 stimmt sie exakt mit den anderen Quellen überein,
// deshalb hat sie für 1994–2001 Vorrang vor Einzelwerten aus Pressemitteilungen.
const jahrbuch = [
  ...byMetric(d5, 'Deutschland: Tierärztlich Tätige').map((r) => ({ ...r, name: TAET })),
  ...byMetric(d5, 'Deutschland: Praktizierende Tierärzte').map((r) => ({ ...r, name: NIED })),
]
const natRows = dedupe([
  ...byMetric(d1, 'Deutschland'),
  ...jahrbuch,
  ...d1cDe.filter((r) => r.quality === 'publiziert'),
  ...d1b.rows.filter((r) => r.name === 'Praktizierende Tierärzt:innen (Praxisinhaber)' || r.name === 'Praxisassistent:innen' || r.name === 'Tierärztlich Tätige (Inland)'),
  ...d1b.rows.filter((r) => r.name === 'Praktizierende Tierärzt:innen (Praxisinhaber) – berechnet' || r.name === 'Praxisassistent:innen inkl. Praxisvertreter:innen'),
  ...d1cDe.filter((r) => r.quality === 'berechnet'),
].filter((r) => natMap[r.name]).map((r) => ({ ...r, name: natMap[r.name] })))
// Vergleichsachse als EINE durchgehende Reihe (so gewünscht). Der Anstieg 2011→2012 ist überwiegend ein
// Methodenwechsel: bis 2011 IVH-Schätzung, ab 2012 repräsentative Erhebung (IMR, ab Ende 2013 Skopos).
// Der Hinweis steht in der Quellenzeile des Datensatzes und in docs/DATASETS.md.
const PETS = 'Hunde und Katzen (Mio.)'
// 1999 und 2001 aus archivierten IVH-Angaben; der 2000er-Wert stützt sich nur auf eine Presseangabe
// mit Statista-Bezug und bleibt draußen (die App interpoliert das Jahr).
const petAxis = dedupe([
  ...d2d.rows.filter((r) => r.metric === 'Vergleichsachse'),
  ...d2bClean.rows.filter((r) => r.metric === 'Vergleichsachse'),
].map((r) => ({ ...r, name: PETS })))
// ab 1991: der Wert 1990 umfasst nur die alten Bundesländer
// „Tierärztlich Tätige“ umfasst ALLE Bereiche, nicht nur Praxen. Damit die Zahlen im Diagramm aufgehen,
// wird die Differenz als eigene (berechnete) Reihe ausgewiesen:
//   Tätige = Niedergelassene + Angestellte + Tätig außerhalb von Praxen (Amt, Industrie, Hochschule, Forschung …)
// Die Restgröße enthält auch die wenigen Praxisvertreter:innen (1991: 170 Personen).
const REST = 'Tätig außerhalb von Praxen'
const byDateName = new Map(natRows.map((r) => [r.date + '|' + r.name, r.value]))
const restRows = [...new Set(natRows.map((r) => r.date))].flatMap((date) => {
  const t = byDateName.get(`${date}|${TAET}`), n = byDateName.get(`${date}|${NIED}`), a = byDateName.get(`${date}|${ASSI}`)
  return t != null && n != null && a != null ? [{ date, name: REST, value: t - n - a }] : []
})
// In diesem Datensatz sind alle Werte publiziert, liegen vor 2002 aber nur als Stützjahre vor
// (Tätige 1991 und 1998, Heimtiere 1992/1999/2001). Sie werden alle behalten, damit jede Reihe
// wirklich 1991 beginnt; die Zwischenjahre interpoliert die App und weist sie in der Datenprüfung aus.
// Kurze Namen wie in 2b: Mit den langen Namen der Statistik („Niedergelassene Tierärzt:innen
// (Praxisinhaber)“) wurden die Kopf-Labels in 4:5, 1:1 und in der Grafik der Artikel gekürzt. Dass es
// Tierärztinnen und Tierärzte sind, sagt der Achsentitel.
const w2 = wide([...natRows, ...restRows, ...petAxis], {
  names: [NIED, ASSI, REST, TAET, PETS], from: '1991',
  rename: { [NIED]: 'Praxisinhaber:innen', [ASSI]: 'Angestellte in Praxen', [REST]: 'Außerhalb von Praxen', [TAET]: 'Tätige gesamt', [PETS]: 'Hunde und Katzen' },
})

// 2b Zugespitzte Fassung für die Aussage „Angestellte überholen die Inhaber“: nur die beiden Reihen,
// um die es geht. Im vollen Datensatz steht „Tierärztlich Tätige gesamt“ mit 34.476 daneben – die
// Y-Achse reicht dann bis 35.000 und der Wechsel bei 11.000 zu 12.000 ist im Video nicht mehr zu sehen.
// Kurze Namen, weil die Kopf-Labels im 1:1-Format sonst abgeschnitten werden.
const w2b = wide([...natRows], {
  names: [NIED, ASSI], from: '1991',
  rename: { [NIED]: 'Praxisinhaber:innen', [ASSI]: 'Angestellte in Praxen' },
})

// 3 Heimtiere nach Tierart, ab 1991. 1991–2003 aus der datierten ZZF/IVH-Jahresreihe (ds2d),
// danach die IVH/ZZF-Datenblätter. Einzig 1992 fehlt, das überspringt die Verbandsreihe selbst.
const petNames = ['Katzen', 'Hunde', 'Kleintiere (Kleinsäuger)', 'Ziervögel', 'Aquarien', 'Terrarien']
const petRowsU = dedupe([
  ...d2d.rows.filter((r) => r.metric === 'Bestand'),
  ...byMetric(d2, 'Bestand'),
  ...d2bClean.rows.filter((r) => r.metric === 'Bestand'),
])
const w3 = wide(petRowsU, { names: petNames, from: '1991' })

// ---------- Lückenlose Reihen (Regel seit 07.10.2026, docs/DATENSTANDARD.md Abschnitt 7) ----------
// Neue Datensätze haben in jedem Jahr einen Wert. Was keine Quelle hat, wird mit naheliegenden Daten gerechnet
// und in Dateninfo und Post benannt: zwischen zwei Belegen linear, davor/danach der nächste Beleg gehalten –
// oder, wo es eine verwandte Reihe gibt, über deren Verhältnis fortgeschrieben (siehe DACH).
/** Wert aus Stützpunkten {Jahr: Wert}: belegt, sonst linear zwischen zwei Belegen, außen der nächste Beleg. */
const stuetze = (punkte, jahr) => {
  if (punkte[jahr] != null) return punkte[jahr]
  const js = Object.keys(punkte).filter((k) => punkte[k] != null).map(Number).sort((x, y) => x - y)
  const vor = js.filter((x) => x < jahr).at(-1), nach = js.find((x) => x > jahr)
  if (vor == null) return nach == null ? null : punkte[nach]
  if (nach == null) return punkte[vor]
  return punkte[vor] + (punkte[nach] - punkte[vor]) * (jahr - vor) / (nach - vor)
}
const r3 = (v) => (v == null ? null : Math.round(v * 1000) / 1000)
/** Breite Tabelle → jede Spalte über alle Jahre von–bis nach `stuetze` gefüllt; `ersatz` überschreibt Spalten. */
function lueckenlos(w, { von, bis, ersatz = {} }) {
  const spalte = (i) => Object.fromEntries(w.rows.filter((r) => r[i] != null).map((r) => [Number(r[0]), r[i]]))
  const punkte = w.headers.slice(1).map((_, i) => spalte(i + 1))
  return {
    headers: w.headers,
    rows: Array.from({ length: bis - von + 1 }, (_, k) => von + k).map((j) => [String(j),
      ...w.headers.slice(1).map((n, i) => r3(ersatz[n] ? ersatz[n](j) : stuetze(punkte[i], j)))]),
  }
}

// 3b Heimtiere und Pferde in Deutschland, 1991–2025, ohne leere Jahre. Pferde sind keine Heimtiere (IVH/ZZF
// zählen sie nicht); deshalb heißt der Datensatz „Heimtiere und Pferde“. Dazu Gartenteiche mit Zierfischen.
//  - Pferde: amtliche Zählung aller Halter 1990–1996, FN-Hochrechnungen 2015, 2019, 2025, dazwischen linear.
//  - Gartenteiche und Terrarien werden erst seit 2002 getrennt gezählt: 1991–2001 der Wert von 2002 gehalten.
//  - Aquarien 1999 (Quelle zählte Fische) und das ganze Jahr 1992 (fehlt in der Verbandsreihe): linear.
const TEICH = 'Gartenteiche (mit Zierfischen)'
const teichRows = d2d.rows.filter((r) => r.metric === 'Bestand' && r.name === 'Gartenteiche mit Fischen').map((r) => ({ ...r, name: TEICH }))
const w3bRoh = wide(dedupe([...petRowsU, ...teichRows]), { names: [...petNames, TEICH, 'Pferde'], from: '1991' })
const w3b = lueckenlos(w3bRoh, { von: 1991, bis: 2025, ersatz: { Pferde: (j) => stuetze(d18.stuetzpunkte_grafik.werte, j) } })

// 3c Heimtiere in DACH, 1991–2025: Deutschland (IVH/ZZF, lückenlos wie 3b) plus Österreich und Schweiz, nur die
// vier Kategorien, die alle drei Länder vergleichbar zählen. Österreich und Schweiz:
//  - zwischen den Umfragen linear, nach der letzten gehalten (stuetze);
//  - fremde Quellen vor 2016 über das Überlappungsjahr 2016 an die Hauptquelle angeschlossen (Verkettung);
//  - vor 2010 der Anteil an Deutschland wie 2010 (berechnet, keine Quelle).
const DACH_TIERE = ['Katzen', 'Hunde', 'Kleintiere (Kleinsäuger)', 'Ziervögel']
const deVoll = lueckenlos(w3, { von: 1991, bis: 2025 })
const deWert = (name, jahr) => deVoll.rows.find((r) => r[0] === String(jahr))?.[deVoll.headers.indexOf(name)] ?? null
const kette = (punkte, faktor) => Object.fromEntries(Object.entries(punkte).map(([j, v]) => [j, v * faktor]))
const chPunkte = {
  Katzen: d19.ch.Katzen,
  Hunde: { ...kette({ 2010: d19.ch.vhn_hunde_umfrage['2010'], 2012: d19.ch.vhn_hunde_umfrage['2012'] }, d19.ch.Hunde['2016'] / d19.ch.vhn_hunde_umfrage['2016']), ...d19.ch.Hunde },
  'Kleintiere (Kleinsäuger)': { ...kette(d19.ch.fediaf_vor_2016['Kleintiere (Kleinsäuger)'], d19.ch['Kleintiere (Kleinsäuger)']['2016'] / d19.ch.fediaf_vor_2016['Kleintiere (Kleinsäuger)']['2016']), ...d19.ch['Kleintiere (Kleinsäuger)'] },
  Ziervögel: { ...kette(d19.ch.fediaf_vor_2016.Ziervögel, d19.ch.Ziervögel['2016'] / d19.ch.fediaf_vor_2016.Ziervögel['2016']), ...d19.ch.Ziervögel },
}
const landWert = (punkte, n, j) => (j >= 2010 ? stuetze(punkte, j) : deWert(n, j) / deWert(n, 2010) * stuetze(punkte, 2010))
const w3c = {
  headers: ['Jahr', ...DACH_TIERE],
  rows: Array.from({ length: 2025 - 1991 + 1 }, (_, k) => 1991 + k).map((j) => [String(j), ...DACH_TIERE.map((n) =>
    Math.round((deWert(n, j) + landWert(d19.at[n], n, j) / 1000 + landWert(chPunkte[n], n, j) / 1000) * 100) / 100)]),
}

// 4 Hunderassen: ohne Summenzeile, 1992–2025 (1990/1991 nirgends online verfügbar)
// ds3 deckt nur die 23 Rassen ab, die 2011–2025 einmal in den Top 15 waren. ds3c ergänzt die
// übrigen Rassen aus derselben VDH-Tabelle, damit keine Reihe 2010 abbricht.
const breedRename = { Collie: 'Collie (Langhaar)' }
const breedRowsU = dedupe([...d3.rows, ...d3c.rows, ...d3b.rows]
  .filter((r) => !/^Alle VDH-Rassen|gesamt|Summe/i.test(r.name))
  .map((r) => ({ ...r, name: breedRename[r.name] ?? r.name })))
// Rassen sortiert nach Gesamtsumme (die wichtigsten zuerst)
const sums = {}
for (const r of breedRowsU) sums[r.name] = (sums[r.name] ?? 0) + r.value
const breedNames = Object.keys(sums).sort((a, b) => sums[b] - sums[a])
const w4 = wide(breedRowsU, { names: breedNames, from: '1990' })

// 5 Rinder nach Bundesland (Flächenländer), 1991–2025. 1991–2010 aus der Eurostat-Regionaltabelle
// mit Destatis-Daten (ds7), ab 2010 aus der BMEL-Aufbereitung (ds4); die 2010er Werte beider
// Quellen sind identisch. Achtung: Der Erhebungsstichtag wechselt (Dezember bis 1997, November 1998,
// 1999–2006 und 2008/2009 Mai, 2007 und ab 2010 November) – siehe docs/DATASETS.md.
// Sachsen-Anhalt 2002 ist in der Quelle nicht nachgewiesen und bleibt null.
const ohneStadtstaaten = (r) => !['Deutschland', 'Berlin', 'Bremen', 'Hamburg'].includes(r.name)
const w5 = wide(dedupe([
  ...byMetric(d4, 'Rinder nach Bundesland (November)').filter(ohneStadtstaaten),
  ...byMetric(d7, 'Rinder nach Bundesland').filter(ohneStadtstaaten),
]), { from: '1991' })

// 6 Heimtiermarkt: Umsatz nach Segment. Die Futter- und Bedarfsartikel-Zahlen sind stationärer Handel,
// „Online-Handel“ ist die Schätzung über alle Segmente hinweg und damit bewusst eine eigene Größe.
// Der Wert für 2008 bleibt draußen: 2009 und 2010 fehlen, sonst entstünde eine Dreijahresbrücke.
const marktNamen = ['Katzenfutter', 'Hundefutter', 'Bedarfsartikel und Zubehör (stationär)', 'Online-Handel (Schätzung)', 'Futter für Kleintiere', 'Ziervogelfutter', 'Zierfischfutter']
const w6 = wide(byMetric(d2, 'Umsatz Heimtiermarkt').filter((r) => marktNamen.includes(r.name)), {
  names: marktNamen,
  from: '2011',
  rename: { 'Bedarfsartikel und Zubehör (stationär)': 'Bedarfsartikel und Zubehör', 'Online-Handel (Schätzung)': 'Online-Handel (alle Segmente)' },
})

// 7 Praxisschwerpunkte 1990–2018. Die Kategorien heißen über die Jahre unterschiedlich, meinen aber
// dasselbe Dreieck aus reiner Kleintierpraxis, gemischter Praxis und reiner Nutz-/Großtierpraxis.
// Ende 2018, weil die BTK ab 2019 die Pferde als eigene Kategorie führt und selbst schreibt, dass
// eine Vergleichbarkeit mit den Jahren davor ausgeschlossen ist. 2006 fällt raus: In dem Jahr hat
// Baden-Württemberg für „Kleintiere“ null gemeldet, die Berichtigung der BTK korrigiert die Tabelle nicht.
const KLEIN = 'Nur Kleintiere', GEMISCHT = 'Gemischt (Nutz- und Kleintiere)', NUTZ = 'Nur Nutz- und Großtiere'
const praxisMap = {
  Kleintierpraxis: KLEIN, 'Praxis für überwiegend Kleintiere': KLEIN, Kleintiere: KLEIN,
  Gemischtpraxis: GEMISCHT, 'Praxis für Groß- und Kleintiere': GEMISCHT, 'Nutztiere und Kleintiere': GEMISCHT,
  Großtierpraxis: NUTZ, 'Praxis für überwiegend Großtiere': NUTZ, Nutztiere: NUTZ,
}
// Ab 2019 zählt die BTK Pferde als eigene Kategorie. Die drei Reihen laufen trotzdem durch, weil sich
// die neuen Kategorien definitorisch auf die alte Dreiteilung abbilden lassen – die BTK selbst schreibt,
// dass Pferde bis 2019 „zu den Nutztieren gezählt und unter der Rubrik Großtiere erhoben" wurden
// (Deutsches Tierärzteblatt 8/2024, S. 990):
//   Nur Kleintiere = Kleintiere
//   Nur Nutz- und Großtiere = Nutztiere + Pferde + „Nutztiere und Pferde"
//   Gemischt = „Nutztiere und Kleintiere" + „Kleintiere und Pferde" + „Nutztiere, Pferde und Kleintiere"
//
// Es wird NICHTS geschätzt oder umgerechnet; alle Werte sind Summen publizierter Kategorien.
// Gegenprobe an der einzigen Verteilung, die die BTK selbst nennt (2023: „mehr als 50 Prozent betreiben
// Kleintierpraxen, gut ein Viertel sind Gemischtpraxen"): Diese Zuordnung ergibt 53,9 % Kleintiere und
// 28,8 % gemischt – passt. Eine frühere, trendbasierte Schätzung hätte 37,8 % gemischt ergeben und der
// Quelle widersprochen; sie wurde deshalb verworfen.
//
// Der sichtbare Versatz 2018→2019 (gemischt 4.554 → 3.381, Nutz-Gruppe 971 → 1.713) ist die Folge der
// neuen Abfrage: Wer vorher „Nutztiere und Kleintiere" ankreuzte, wählt heute differenzierter. Die BTK
// zeigt deshalb selbst keinen Verlauf, sondern nur die aktuelle Verteilung. Der Versatz steht in der
// Quellenzeile und in der Dateninfo des Datensatzes.
const praxisRows = byMetric(d8, 'Praxisart').filter((r) => r.date !== '2006')
const praxisNeu = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].flatMap((date) => {
  const v = (n) => { const r = praxisRows.find((x) => x.date === date && x.name === n); return r ? r.value : 0 }
  return [
    { date, name: NUTZ, value: v('Nutztiere') + v('Pferde') + v('Nutztiere und Pferde') },
    { date, name: GEMISCHT, value: v('Nutztiere und Kleintiere') + v('Kleintiere und Pferde') + v('Nutztiere, Pferde und Kleintiere') },
  ]
})
// Praxisketten: Standorte je Gruppe. Modellreihe 2015–2026 nach der Vorgabe vom 17.09.2026: lückenlos,
// jeder Wert mit Marker (B belegt, B~ rund, B≥ Untergrenze, B/P Praxenzahl als Näherung, S geschätzt,
// 0 existierte nicht).
// Die Marker stehen in data/raw/ds12-ketten-modell.json je Zelle; die Tabelle hier trägt nur die Zahlen.
// TOTAL ist die Modellschätzung des Gesamtmarkts, verankert am Tierärzte Atlas (August 2024, rund 450).
// Die Gesamtsumme heißt nach dem Datenstandard „Summe: …“: Sie ist keine Gruppe, sondern läuft als große
// Zahl über dem Diagramm mit. Als eigene Linie drückte sie die Achse auf 600 und quetschte alle Gruppen
// unter 120 zusammen.
const MODELL_NAMEN = ['IVC Evidensia', 'Tierarzt Plus Partner', 'AniCura', 'VetPartners',
  'VetGruppen (Vetopia)', 'Altano (Pferde)', 'TeamVet', 'Veternicum Nesto', 'SmartVet → Medivet', 'Rex', 'filu',
  'Cadomo Vets', 'Wolf & Tiger', 'activet (bis 2022)', 'Weitere Gruppen (Long Tail)', 'TOTAL Deutschland']
const w10 = wide(byMetric(d12, 'Standorte je Gruppe'), {
  names: MODELL_NAMEN,
  rename: { 'TOTAL Deutschland': 'Summe: Alle Gruppen (Standorte)', 'Weitere Gruppen (Long Tail)': 'Weitere Gruppen' },
})
// Marker „0 = existierte in Deutschland noch nicht“: Das ist keine Null, sondern „kein Wert“. Nach dem
// Datenstandard wird das zur leeren Zelle – sonst stehen 2015 fünfzehn Gruppen mit „0“ im Bild und die
// Top-N-Auswahl bricht an den Gleichständen. Nachlaufende Nullen (activet nach der Übernahme) bleiben:
// Die Marke gibt es danach wirklich nicht mehr, der Balken soll auf null fallen.
for (let c = 1; c < w10.headers.length; c++) {
  for (const zeile of w10.rows) {
    if (zeile[c] === 0) zeile[c] = null
    else if (zeile[c] != null) break
  }
}

// Sammelreihe „Ketten“ für den Schwerpunkte-Chart: dieselbe TOTAL-Reihe wie im Ketten-Datensatz und im
// Artikel. Vorher stand hier ein eigener Fünf-Gruppen-Korb – das ergab für dasselbe Wort zwei verschiedene
// Zahlen im selben Produkt (320 hier gegen 514 dort). Es gibt jetzt nur noch eine Kettenzahl.
const KETTEN = 'Ketten (Standorte in Deutschland)'
const kettenSumme = byMetric(d12, 'Standorte je Gruppe')
  .filter((r) => r.name === 'TOTAL Deutschland')
  .map((r) => ({ date: r.date, name: KETTEN, value: r.value }))

const w7 = wide(
  [
    ...praxisRows.filter((r) => praxisMap[r.name] === KLEIN).map((r) => ({ ...r, name: KLEIN })),
    ...praxisRows.filter((r) => praxisMap[r.name] === GEMISCHT && +r.date <= 2018).map((r) => ({ ...r, name: GEMISCHT })),
    ...kettenSumme.filter((r) => +r.date <= 2025),
    ...praxisRows.filter((r) => praxisMap[r.name] === NUTZ && +r.date <= 2018).map((r) => ({ ...r, name: NUTZ })),
    ...praxisNeu,
  ],
  // Ab 1991. Die 1990er-Zeile aus Maure (1998) umfasst nur die alten Bundesländer: Ihre Summe ergibt
  // 5.900, die von 1991 dagegen 8.243 – passend zu den 8.510 Niedergelassenen der gesamtdeutschen
  // Reihe. Der Sprung 1990→1991 wäre also die Wiedervereinigung und keine Entwicklung der Praxen.
  { names: [KLEIN, GEMISCHT, NUTZ, KETTEN], from: '1991' },
)

// 8 Fachtierarzt-Gebiete ab 2007. 2005 zählt nur Tierärzt:innen bis 65 Jahre und ist nicht
// vergleichbar, 2006 ist durch dieselbe Baden-Württemberg-Lücke verzerrt; beide bleiben draußen.
// 2015–2017 und 2020 hat die BTK nicht bzw. unvollständig veröffentlicht und wird interpoliert.
// Pferde 2012 fehlt bewusst (Quelle bucht die Werte unter Pferdechirurgie), siehe notes in ds9.
const fachMap = {
  'Fachtierarzt für Kleintiere, kleine Haustiere': 'Kleintiere', 'Fachtierarzt für Klein- und Heimtiere': 'Kleintiere', 'Fachtierarzt für Kleintiere': 'Kleintiere',
  'Fachtierarzt für Lebensmittelhygiene': 'Lebensmittel(hygiene)', 'Fachtierarzt für Lebensmittel': 'Lebensmittel(hygiene)',
  'Fachtierarzt für Öffentliches Veterinärwesen': 'Öffentliches Veterinärwesen',
  'Fachtierarzt für Rinder': 'Rinder', 'Fachtierarzt für Schweine': 'Schweine', 'Fachtierarzt für Pferde': 'Pferde',
  'Fachtierarzt für Geflügel': 'Geflügel', 'Fachtierarzt für Mikrobiologie': 'Mikrobiologie', 'Fachtierarzt für Pathologie': 'Pathologie',
  'Fachtierarzt für Kleintierchirurgie': 'Kleintierchirurgie', 'Fachtierarzt für Innere Medizin der Kleintiere': 'Innere Medizin der Kleintiere',
}
const fachRows = byMetric(d9, 'Fachtierarzt-Gebietsbezeichnung')
  .filter((r) => fachMap[r.name] && +r.date >= 2007)
  .map((r) => ({ ...r, name: fachMap[r.name] }))
const fachSummen = {}
for (const r of fachRows) fachSummen[r.name] = (fachSummen[r.name] ?? 0) + r.value
const w8 = wide(fachRows, { names: Object.keys(fachSummen).sort((a, b) => fachSummen[b] - fachSummen[a]) })

// 9 Kleintier-Tierärzt:innen je Bundesland, 2002–2018. Wie beim nationalen Datensatz endet die Reihe
// 2018: Ab 2019 führt die BTK die Pferde getrennt, außerdem melden mehrere Kammern „k. A.“ (Bremen
// durchgehend, Mecklenburg-Vorpommern fünf Jahre) – im Balkenrennen würden diese Länder scheinbar
// verschwinden. 2005 fehlt in der Quelle, 2006 ist unbrauchbar (Baden-Württemberg meldete null).
const kleintierBl = byMetric(d10, 'Kleintiere nach Kammerbereich')
  .filter((r) => r.value != null && +r.date <= 2018 && r.date !== '2006')
const kleintierJahre = [...new Set(kleintierBl.map((r) => r.date))]
const w9 = wide(
  kleintierJahre.flatMap((date) => {
    const jahr = kleintierBl.filter((r) => r.date === date)
    const nrw = jahr.filter((r) => NRW.includes(r.name)).reduce((sum, r) => sum + r.value, 0)
    return [...jahr.filter((r) => !NRW.includes(r.name)), ...(nrw > 0 ? [{ date, name: 'Nordrhein-Westfalen', value: nrw }] : [])]
  }),
  {},
)

// Dieselben Ketten-Standorte, gebündelt nach dem Eigentümer im September 2026 (Post 8). Abgeleitet statt
// abgetippt, damit beide Datensätze nie auseinanderlaufen. activet zählt zu den Beteiligungsgesellschaften,
// weil die Praxen seit August 2023 zu Tierarzt Plus Partner gehören.
const EIGENTUEMER_BLOECKE = [
  ['Beteiligungsgesellschaften', ['IVC Evidensia', 'Tierarzt Plus Partner', 'VetGruppen (Vetopia)', 'VetPartners', 'SmartVet → Medivet', 'activet (bis 2022)']],
  ['Mars (AniCura)', ['AniCura']],
  ['Ohne Fonds, tierärztlich geführt', ['TeamVet', 'Cadomo Vets', 'Wolf & Tiger']],
  ['Eigentümer nicht erfasst', ['Altano (Pferde)', 'Veternicum Nesto', 'Rex', 'filu']],
  ['Weitere Gruppen', ['Weitere Gruppen']],
  ['Summe: Alle Gruppen (Standorte)', ['Summe: Alle Gruppen (Standorte)']],
]
const w11 = {
  headers: ['Jahr', ...EIGENTUEMER_BLOECKE.map(([name]) => name)],
  rows: w10.rows.map((zeile) => [zeile[0], ...EIGENTUEMER_BLOECKE.map(([, gruppen]) => {
    const werte = gruppen.map((g) => zeile[w10.headers.indexOf(g)]).filter((v) => typeof v === 'number')
    // Leer bleibt leer: Ein Block, dessen Gruppen es noch nicht gab, ist nicht erhoben, nicht 0.
    return werte.length ? werte.reduce((x, y) => x + y, 0) : null
  })]),
}

// Frauen und Männer in der Praxis, 2002–2025 (Post 28). Jeder Wert aus Tab. 1 der BTK-Jahrgänge, nichts
// interpoliert; Männer = gesamt minus Frauen. Der Frauenanteil aller Tätigen läuft als große Zahl mit
// („Gesamt:“-Spalte nach dem Datenstandard), er ist keine eigene Linie.
const w12 = {
  headers: ['Jahr', 'Angestellte Tierärztinnen', 'Praxisinhaberinnen', 'Praxisinhaber', 'Angestellte Tierärzte', 'Gesamt: Frauenanteil aller Tätigen (%)'],
  rows: (d14.jahre ?? []).map((j) => [String(j.jahr), j.angestellte_frauen, j.inhaber_frauen, j.inhaber_gesamt - j.inhaber_frauen,
    j.angestellte_gesamt - j.angestellte_frauen, Math.round((1000 * j.taetig_frauen) / j.taetig_gesamt) / 10]),
}

const lit = (v) => (v == null ? 'null' : typeof v === 'number' ? String(v) : JSON.stringify(v))
// 13 Oktoberfest 1985–2026 (Exkurs, Beispiel für „Säulen + Linie“): Bier und Besucher als Säulen nebeneinander,
// auf der rechten Achse der Maßpreis und der Preis, den die Maß hätte, wenn sie seit 1985 nur mit den
// Verbraucherpreisen gestiegen wäre. 2020 und 2021 bleiben leer – keine Wiesn, kein Bier, kein Maßpreis;
// nur die Inflation läuft weiter. 2026 ist vorläufig (Bilanz der Stadt vom 04.10.2026, siehe Rohdaten).
const vpi = (j) => {
  const v = d15.vpi
  if (j === 2026) return v.jahr_2026_aus_monatsraten.index
  if (j >= 1991) return v.deutschland_2020_100[j] ?? (j === 2025 ? v.jahr_2025_aus_rate.index : null)
  const w = v.frueheres_bundesgebiet_1995_100[j]
  return w == null ? null : w * v.deutschland_2020_100[1991] / v.frueheres_bundesgebiet_1995_100[1991]
}
const wiesn = new Map([...d15.oktoberfest, d15.vorlaeufig_2026].map((r) => [r.jahr, r]))
const mass85 = wiesn.get(1985).masspreis_eur, vpi85 = vpi(1985)
const w13 = {
  headers: ['Jahr', 'Bier (Mio. Liter)', 'Besucher (Mio.)', 'Maß', 'Maß mit Inflation'],
  rows: Array.from({ length: 2026 - 1985 + 1 }, (_, k) => 1985 + k).map((j) => {
    const r = wiesn.get(j)
    return [String(j), r ? Math.round(r.bier_hl / 100) / 100 : null, r ? r.besucher_mio : null, r ? r.masspreis_eur : null, Math.round(mass85 * vpi(j) / vpi85 * 100) / 100]
  }),
}

// 13b Reduzierte Fassung ohne Bier: Besucher als Säulen, Maßpreis und Inflation als Linien. Dieselben Werte.
const w13b = { headers: ['Jahr', 'Besucher (Mio.)', 'Maß', 'Maß mit Inflation'], rows: w13.rows.map((r) => [r[0], r[2], r[3], r[4]]) }

// 14 Tierarzt gegen Inflation, 2010–2024: Anstieg seit 2010 in Prozent. Vier Reihen, eine Aussage
// („Deutschland steigt in Stufen“): deutscher Preisindex (folgt den GOT-Sätzen), Preisindex der Niederlande (keine
// Gebührenordnung), Umsatz der Tierarztpraxen (Umsatzsteuerstatistik, Preis × Menge) und die Inflation.
// 2010 ist das erste Jahr mit allen Reihen, 2024 das letzte.
// 14b Routinejahr in Euro, 2010–2026: eigener GOT-Warenkorb (Impftermin + Krankheitsbesuch), einfacher Satz mit
// MwSt., Jahresdurchschnitt nach Geltungstagen. In Euro statt Prozent, damit die drei Tierarten bis 2021 nicht
// aufeinanderliegen (in Prozent stiegen sie gleich).
const DM = 1.95583
const GOT = d16.got_allgemeine_untersuchung.versionen
const KORB = d16.got_routinekorb.versionen
const gotStufen = GOT.map((v, k) => {
  const w = KORB[k]
  const eur = (o, f) => o[f] ?? o[`${f}_dm`] / DM
  return { ab: v.in_kraft, u: { katze: eur(v, 'katze'), hund: eur(v, 'hund'), pferd: eur(v, 'pferd') }, impfung: eur(w, 'impfung'), injektion: eur(w, 'injektion') }
})
const ust = (tag) => (tag < '2007-01-01' || (tag >= '2020-07-01' && tag < '2021-01-01') ? 0.16 : 0.19)
const korbAm = (tier, tag) => {
  let g = null
  for (const s of gotStufen) if (s.ab <= tag) g = s
  return (2 * g.u[tier] + g.impfung + g.injektion) * (1 + ust(tag))
}
const korbJahr = (tier, jahr) => {
  const ende = jahr === 2026 ? Date.UTC(2026, 9, 1) : Date.UTC(jahr + 1, 0, 1) // 2026 bis Ende September
  let summe = 0, tage = 0
  for (let t = Date.UTC(jahr, 0, 1); t < ende; t += 864e5) { summe += korbAm(tier, new Date(t).toISOString().slice(0, 10)); tage++ }
  return summe / tage
}
const vet = (j) => (j === 2026 ? d16.jahr_2026.veterinaer : d16.veterinaer_2020_100[j])
const ges = (j) => (j === 2026 ? d16.jahr_2026.vpi_gesamt_naeherung : d16.vpi_gesamt_2020_100[j])
const anstieg = (a, b) => (a == null || b == null ? null : Math.round((a / b - 1) * 1000) / 10)
const umsatz = (j) => d17.tierarztpraxen_umsatz_tsd_eur[j] ?? null
const preiseNL = (j) => d17.hicp_cp0935_2015_100.NL[j] ?? null
const w14 = {
  headers: ['Jahr', 'Tierarztpreise DE', 'Tierarztpreise NL', 'Praxisumsatz DE', 'Inflation DE'],
  rows: Array.from({ length: 2024 - 2010 + 1 }, (_, k) => 2010 + k).map((j) => [String(j),
    anstieg(vet(j), vet(2010)), anstieg(preiseNL(j), preiseNL(2010)), anstieg(umsatz(j), umsatz(2010)), anstieg(ges(j), ges(2010))]),
}
const w14b = {
  headers: ['Jahr', 'Katze', 'Hund', 'Pferd'],
  rows: Array.from({ length: 2026 - 2010 + 1 }, (_, k) => 2010 + k).map((j) => [String(j),
    ...['katze', 'hund', 'pferd'].map((t) => Math.round(korbJahr(t, j) * 100) / 100)]),
}
// Kontrollausgabe für die Lupe im Artikel: Routinejahr (einfacher Satz, mit MwSt.)
for (const t of ['katze', 'hund', 'pferd']) console.log('Routinejahr', t, [2010, 2021, 2024, 2026].map((j) => korbJahr(t, j).toFixed(2)).join(' / '))

const emit = (name, w) => `export const ${name} = {\n  headers: ${JSON.stringify(w.headers)},\n  rows: [\n${w.rows.map((r) => '    [' + r.map(lit).join(', ') + '],').join('\n')}\n  ],\n}\n`
const out = `// Automatisch erzeugt von scripts/build-samples.mjs aus data/raw/*.json – nicht von Hand editieren.\n/* eslint-disable */\n` +
  [emit('TIERAERZTE_BUNDESLAND', w1), emit('TIERAERZTESCHAFT_DEUTSCHLAND', w2), emit('INHABER_ANGESTELLTE', w2b), emit('HEIMTIERE', w3), emit('HEIMTIERE_ALLE', w3b), emit('HEIMTIERE_DACH', w3c), emit('HUNDERASSEN', w4), emit('RINDER_BUNDESLAND', w5), emit('HEIMTIERMARKT', w6), emit('PRAXISSCHWERPUNKTE', w7), emit('FACHTIERAERZTE', w8), emit('KLEINTIERE_BUNDESLAND', w9), emit('KETTEN', w10), emit('KETTEN_EIGENTUEMER', w11), emit('GESCHLECHT_PRAXIS', w12), emit('OKTOBERFEST', w13), emit('OKTOBERFEST_PREIS', w13b), emit('TIERARZT_INFLATION', w14), emit('TIERARZT_ROUTINEJAHR', w14b), emit('HUND_KATZE_WELT', { headers: d13.headers ?? ['Jahr'], rows: d13.rows ?? [] })].join('\n')
fs.writeFileSync('src/samples/data.ts', out)
for (const [n, w] of Object.entries({ w1, w2, w2b, w3, w3b, w3c, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w13b, w14, w14b })) console.log(n, w.headers.length - 1, 'Kategorien,', w.rows.length, 'Perioden', w.rows[0]?.[0], '–', w.rows.at(-1)?.[0])
