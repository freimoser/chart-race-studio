# Schnittstellen der Praxissoftware: LDT 3, eArztbrief, KIM (Recherche 22.10.2026)

Grundlage für Post 5 („Wie viele Systeme Laborbefunde nach LDT 3 lesen“) und Post 6 („KIM und eArztbrief: wer
angeschlossen ist“) auf *Humanmedizin in Zahlen*. Zielgruppe: Dienstleister, die Schnittstellen zu Praxissoftware
bauen.

Zugehörige Daten (nur belegte Werte, nichts geschätzt):

- `data/raw/pvs-zulassungen.csv` – je System und Stand: KBV-Zulassung ja/nein/unbekannt (902 Zeilen, 41 Systeme,
  22 Stände 17.10.2021–21.10.2026). Systemnamen wie in `pvs-kbv-installationen.csv`, damit man direkt mit den
  Installationen Ende 2025 gewichten kann.
- `data/raw/ti-nutzung.csv` – Long-Format: gematik TI-Dashboard (Monatswerte 02/2022–10/2026), TI-Atlas
  (Befragung 2021–2026), KBV-PraxisBarometer Digitalisierung (2018–2025).

Alle Abrufe am 22.10.2026. Die KBV-Verzeichnisse tragen das Datum **21.10.2026** (die Vorarbeit in
`FleXChange-Medical GmbH - Website/recherche/` nennt 19.10.2026; seither neu erzeugt, inhaltlich nur kleine
Abweichungen, siehe Widersprüche).

## 1. Kurzfazit

**Post 5 (LDT 3):** Eine KBV-Zulassung für den **Import von LDT-Befunden** haben Systeme, mit denen **96,2 %** der
ärztlichen Installationen Ende 2025 laufen (33 von 51 ärztlichen Systemen; alle großen). Das ist seit dem ältesten
archivierten Verzeichnis (Januar 2022) unverändert (95,6 %). Den **digitalen Laborauftrag** (LDT-Auftrag-Export)
hat **kein einziges ärztliches PVS** zertifiziert – nur Epikur (Psychotherapie/gemischt) und sieben Laborsysteme.
Digitales Muster 10 (Laborüberweisung) als Export: Medical Office, QUINCY WIN, DURIA, David = **15,1 %** der
ärztlichen Installationen. Die Praxen bestätigen das Bild: 80 % der Arztpraxen empfangen Labordaten digital, aber
nur 39 % senden welche (PraxisBarometer 2025). **Kernaussage: Befunde kommen digital an, Aufträge gehen fast
überall noch über Papier oder ein Order-Entry-Portal des Labors – die Lücke liegt beim Auftrag, nicht beim
Befund.**

**Post 6 (KIM/eArztbrief):** 1-Click-Abrechnung per KIM ist für alle 124 KVDT-Systeme zertifiziert (Pflicht seit der
Abschaltung von KV-Connect am 20.10.2025) – also **100 %** der Installationen. Eine eArztbrief-Zulassung haben
Systeme mit **88,6 %** der ärztlichen und 100 % der psychotherapeutischen Installationen; Medical Office
(5.700 Installationen) steht seit Februar 2026 nicht mehr im eArztbrief-Verzeichnis. Die Nutzung ist steil gewachsen:
mit KIM gesendete eArztbriefe 14,4 Mio. (2023) → 32,3 Mio. (2024) → 45,3 Mio. (2025) → 41,5 Mio. allein Jan–Sep 2026,
zuletzt **gut 4 Mio. im Monat**. 82 % der TI-angebundenen Arztpraxen nutzen den eArztbrief via KIM (2025), aber
nur 22 % der Psychotherapiepraxen. **Kernaussage: Angeschlossen sind praktisch alle (KIM ist Pflicht), der
eArztbrief ist in den Arztpraxen Alltag geworden – der Versand hinkt dem Empfang hinterher (65 % vs. 87 %).**

## 2. Quellen

### 2.1 KBV-Zulassungsverzeichnisse (Primärquelle für Teil 1 und 4)

Aktuell (Stand 21.10.2026, abgerufen 22.10.2026), Verzeichnis:
<https://update.kbv.de/ita-update/Service-Informationen/Zulassungsverzeichnisse/>

| Verzeichnis | Datei | Einträge 21.10.2026 |
|---|---|---|
| KVDT (Abrechnung) | `KBV_ITA_SIEX_Verzeichnis_KVDT.pdf` | 124 |
| Labordatenkommunikation (LDK) | `KBV_ITA_SIEX_Verzeichnis_LDK.pdf` | 82 (davon 54 mit „LDT-Befund - Import“) |
| eArztbrief | `KBV_ITA_SIEX_Verzeichnis_eArztbrief.pdf` | 78 |
| 1-Click-Abrechnung mittels KIM | `KBV_ITA_SIEX_Verzeichnis_1Click_KIM.pdf` | 125 |
| Arzneimittelverordnung (AVWG) | `KBV_ITA_SIEX_Verzeichnis_AVWG.pdf` | 82 |
| Übersichtsmatrix | `KBV_ITA_SIEX_Verzeichnis_Zert_Software.pdf` | 193 Produkte |
| Prüfnummern-Definition (15.11.2023) | `KBV_ITV_VGEX_Definition_von_Pruefnummern.pdf` | – |

Archivierte Stände (web.archive.org, CDX-Abfrage am 22.10.2026; Dateien unter
`https://web.archive.org/web/<Zeitstempel>/https://update.kbv.de/ita-update/Service-Informationen/Zulassungsverzeichnisse/<Datei>`):

- Übersichtsmatrix: 20211229105504, 20221027141104, 20230606163908, 20231029011203, 20240325001923, 20251110200256,
  20251222110903, 20260206230316, 20260409085014, 20260519111010, 20260626101635, 20260810061632, 20260914080520
- LDK: 20220122021547, 20230606163720, 20231214134914
- eArztbrief: 20211017072318, 20220122021544, 20221122190723, 20260305085406
- 1-Click-KIM: 20240713192043, 20240808025919
- KVDT: 20220116093756, 20230606161418, 20231214134948
- AVWG (inkl. „AVWG_eRezept“ 10–11/2021): 20211017065403, 20211107075509, 20220122021723, 20230606152247, 20231214134938

Installationen: KBV-Installationsstatistik Q4/2025,
<https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/Gesamt_Systeme_Installationen.pdf>
(126 Systeme, Summe 116.954). **Wichtig:** Die Statistik nennt in der Spalte „Id“ die **Software-ID** – dieselbe
dreistellige Zahl, die am Ende jeder KBV-Prüfnummer steht (Y/Komponente/JJMM/Dauer/**Software-ID**). Darüber sind
Installationen und Zulassungen **eindeutig** verknüpft, ohne Namensabgleich (z. B. Medical Office 210, T2med 498,
tomedo 457, medatixx 462, CGM MEDISTAR 280). Für die archivierten Übersichtsmatrizen (ohne Prüfnummern) musste über
Produktnamen abgeglichen werden (Aliasse wie MEDISTAR/CGM MEDISTAR BLACK PRO, inSuite/ETERNO Cloud, PSYPRAX/psyprax).

### 2.2 gematik TI-Dashboard (Nutzung, Teil 2)

- Seite: <https://www.gematik.de/telematikinfrastruktur/ti-dashboard> (bindet ein Grafana-Dashboard ein, nur nach
  Einwilligung sichtbar).
- Grafana (öffentlich, anonym lesbar): KIM <https://ti-lage.prod.ccs.gematik.solutions/d/_v5YC1HVk/ti-dashboard-verlauf-kim>,
  E-Rezept <https://ti-lage.prod.ccs.gematik.solutions/d/W19ANiYnk/ti-dashboard-verlauf-erp>,
  ePA <https://ti-lage.prod.ccs.gematik.solutions/d/R96LCJN4z/ti-dashboard-verlauf-epa>.
- Die Zeitreihen liegen als JSON hinter dem Grafana-Datasource-Proxy, z. B.
  `https://ti-lage.prod.ccs.gematik.solutions/api/datasources/proxy/uid/PD47B0EB3875A445D/query/Kennz_Verlauf?&v1=1002`
  (1001 KIM-Nachrichten, 1002 eArztbriefe, 1003 eAU, 1000 E-Rezepte eingelöst, 1008 Einrichtungen, die E-Rezepte
  ausstellen). Tageswerte (kumuliert) ab **22.02.2022**, letzter Stand 21.10.2026 22:30 UTC.
- In `ti-nutzung.csv` steht je Monat der **letzte Tageswert** (kumuliert); Stichtag = Datum des Messpunkts.
- Archiv: Die Wayback-Stände der gematik-Seite (ab 02/2022) enthalten nur das iframe, keine Zahlen. Für
  08/2021–02/2022 gibt es **keine Monatswerte**, nur den kumulierten Startwert vom 22.02.2022.

### 2.3 TI-Atlas (gematik-Befragung, Teil 2/3)

- Methode: <https://www.gematik.de/telematikinfrastruktur/ti-atlas> – Online-Befragung, gewichtet; 2026 im Mai,
  Arztpraxen/MVZ: 20.000 angeschrieben, 1.533 Teilnehmer. Frühere Stichproben auf der Seite nicht genannt.
- Werte: Grafana „Nutzung LE“ <https://ti-lage.prod.ccs.gematik.solutions/d/hS_STZ744/nutzung-le> und
  „Readyness Index“ <https://ti-lage.prod.ccs.gematik.solutions/d/KfxnLi745/readyness-index> (JSON über
  `.../query/Nutzung_LE` und `.../query/TI_Readyness`). Umfragejahre 2021–2026; 2021 = individuelle Bekanntheit,
  ab 2022 Bekanntheit in der Einrichtung. Werte 2025/2026 im Dashboard ganzzahlig, davor mit Nachkommastellen.

### 2.4 KBV-PraxisBarometer Digitalisierung (IGES im Auftrag der KBV, Zweitquelle)

- Übersicht: <https://www.kbv.de/infothek/zahlen-und-fakten/studien-und-berichte/praxisbarometer-digitalisierung>
- Folien 2025 (Reihe 2018–2025, S. 4):
  <https://www.iges.com/sites/igesgruppe/iges/content/e2622/e2634/e5722/e16695/e16696/e16698/attr_objs16704/Folien_Pressegesprch_PraxisBarometer_20251015_ger.pdf>
- Tabellenbände 2021–2025 (xlsx, mit Spalte Psychotherapeuten): 2025
  <https://www.iges.com/sites/igesgruppe/iges/content/e2622/e2634/e5722/e16695/e16696/e16698/attr_objs22315/Tabellenband_PraxisbarometerDigitalisierung_2025_ger.xlsx>,
  2024/2023/2022 unter `.../e16696/e22280/attr_objs22281|22282|22283/Tabellenband_PraxisbarometerDigitalisierung_<Jahr>_ger.xlsx`,
  2021 <https://web.archive.org/web/20230314231545/https://www.kbv.de/media/sp/Tabellenband_Ergebnisse_PraxisBaroDigit2021.xlsx>
- Vollbericht 2020: <https://www.iges.com/sites/igesgruppe/iges/content/e2622/e2634/e8244/e8316/e8317/e8319/attr_objs8321/IGES_KBV_Digitalbaromenter_2020_ger.pdf>
- Berichte 2018/2019 nur im Archiv: <https://web.archive.org/web/20210907105612/https://www.kbv.de/media/sp/PraxisBarometer-Digitalisierung_2018.pdf>,
  <https://web.archive.org/web/20210907105612/https://www.kbv.de/media/sp/KBV_Praxisbarometer_Digitalisierung_2019.pdf>
- Befragungen: 2018 n=1.754, 2019 2.097, 2020 2.188, 2021 2.836, 2022 2.451, 2023 3.143, 2024 2.609, 2025 1.719
  (davon Arztpraxen ohne PT 2025: 1.379). Befragungsende in der CSV als Stichtag (2022 nur Jahr, Ende unsicher:
  02.10. oder 23.10.2022). **2026er Ergebnisse noch nicht veröffentlicht** (Befragung bis 23.08.2026).

### 2.5 Sonstige

- KV-Connect-Abschaltung 20.10.2025, Abrechnung nur noch per KIM: KVB-Rundschreiben
  <https://www.kvb.de/fileadmin/kvb/Mitglieder/Service/Serviceschreiben/2025-DS/KVB-RS-250821-Abschaltung-KV-Connect-ab-201025.pdf>;
  Prüfpaket 1-Click-KIM: <https://update.kbv.de/ita-update/Abrechnung/1-Click-Abrechnung/KIM/KBV_ITA_AHEX_Pruefpaket_1ClickAbrechnung.pdf>
- AWS-Ordner auf dem KBV-Server (letzte Änderung 15.11.2024, kein Prüfpaket mehr, jüngste Datei 13.05.2022):
  <https://update.kbv.de/ita-update/371-Schnittstellen/PVS-Archivierungs-Wechsel-Schnittstelle/>; das Prüfpaket AW-SST
  lag noch im Vorquartal 2024_Q2: <https://update.kbv.de/ita-update/Vorquartale/ita_update_2024_Q2/371-Schnittstellen/PVS-Archivierungs-Wechsel-Schnittstelle/KBV_ITA_VGEX_Pruefpaket_AW_SST.pdf>
- eArztbrief-Vergütung (GOP 86900/86901, Strukturförderpauschale 01660): <https://www.kvb.de/fileadmin/kvb/Mitglieder/Service/Serviceschreiben/2024-DS/KVB-RS-240730-eArztbrief-via-KIM.pdf>

## 3. Definitionen (was genau gezählt wird)

- **Zulassung = gültige KBV-Prüfnummer am Verzeichnisstand.** Prüfnummern gelten i. d. R. 36 Monate und müssen
  rezertifiziert werden. Fehlt ein System in einem Verzeichnis, heißt das: am Stichtag keine gültige Prüfnummer –
  nicht zwingend, dass die Funktion fehlt (Rezertifizierungslücken kommen vor, siehe 6.4). Zulassung ≠ Nutzung.
- **kvdt** = KVDT-Prüfnummer der Komponenten 1 (ADT), 2 (KADT) oder 200–216 (Satzarten). Bei den archivierten
  Matrizen: irgendein Abrechnungs-Kreuz. Jedes System der Installationsstatistik rechnet per Definition über KVDT ab.
- **ldt_befund** = Komponente „LDT-Befund - Import“ im LDK-Verzeichnis (Komponente 43). Das Verzeichnis führt keine
  LDT-Version; zertifiziert wird gegen die jeweils gültige LDT-3-Satzbeschreibung (derzeit 3.2.x).
- **ldt_auftrag** = „LDT-Auftrag - Export“ (der Auftrag geht aus der Praxis ans Labor). Separat geführt, nicht in
  der CSV: „Digitales Muster 10/10A - Export“ (digitale Laborüberweisung).
- **earztbrief** = Prüfnummer Komponente 63 (eArztbrief nach KBV-Richtlinie, Versand per KIM).
- **kim_1click** = Prüfnummer Komponente 169 (1-Click-Abrechnung mittels KIM). Das ist die Abrechnungsübermittlung
  per KIM, **nicht** „hat KIM“ im Sinne von eArztbrief. Das Verzeichnis führt zusätzlich „Sammelerklärung
  umgesetzt / nicht umgesetzt“ (elektronische Sammelerklärung im selben Vorgang).
- **aws** = Archiv- und Wechselschnittstelle (§ 371 SGB V, Komponente 71). Nur in der alten Übersichtsmatrix
  (bis 11/2025) als Spalte; seit 12/2025 gibt es weder Spalte noch Verzeichnis → 2026: „unbekannt“.
- **eAU, eRezept:** Kein KBV-Zulassungsverzeichnis (TI-Fachanwendungen, gematik). Das AVWG-Verzeichnis
  (Arzneimittelverordnung) ist nicht das E-Rezept; 10–11/2021 gab es kurz ein Verzeichnis „AVWG_eRezept“ (42 bzw.
  54 Einträge). eHKS steht unter „elektronische Dokumentation“. Daher keine Spalten dafür.
- **KIM-Nachrichten (gematik):** „Anzahl der seit Produktivstart (01.08.2021) insgesamt gesendeten Nachrichten
  (enthält eArztbriefe und eAUs) mit KIM“. Dazu gehören auch 1-Click-Abrechnungen, EBZ (Zahnärzte), DALE-UV u. a.
  Zählbasis sind gesendete Nachrichten aller Teilnehmer (Praxen, Kliniken, Kassen …), nicht Praxen.
- **eArztbriefe (gematik):** „Anzahl der seit Produktivstart (01.08.2021) mit KIM gesendeten elektronischen
  Arztbriefe“ – Absender auch Krankenhäuser; wie erkannt wird (vermutlich KIM-Dienstkennung) ist nicht angegeben.
- **eAU (gematik):** mit KIM an Krankenkassen gesendete eAU. **E-Rezepte:** über den Fachdienst von einer Apotheke
  dispensiert (seit 01.07.2021). **Einrichtungen, die E-Rezepte ausstellen:** mind. eine Interaktion mit dem
  Fachdienst in der Woche – alle Sektoren, wöchentlich, keine Bestandszahl.
- **TI-Atlas „mind. einmal genutzt“:** Befragte Einrichtung hat die Anwendung mind. einmal genutzt. Bei KIM zählt
  die Pflicht-eAU mit → für Arztpraxen kein Maß für den eArztbrief.
- **PraxisBarometer:** Mehrfachnennung „Was empfangen/senden Sie in digitaler Form von/an andere niedergelassene …
  oder ambulante Einrichtungen?“ (Fax zählt nicht), Basis Arztpraxen ohne Psychotherapeuten.

## 4. Ergebnisse Teil 1: Zulassungen je System (Stand 21.10.2026), gewichtet mit Installationen Q4/2025

### 4.1 Alle 126 Systeme der Installationsstatistik, nach Gruppe

Gruppen: für die 41 Systeme aus `pvs-kbv-installationen.csv` deren Klasse (arzt/psychotherapie/kis), die übrigen
85 Kleinsysteme **eigene Zuordnung** nach Produktname (Labor/Pathologie, Radiologie, Zahn/MKG, Dialyse, Sonstige;
Abweichung: EVIDENT hier als Zahn/MKG, RED medical classic als Sonstige). Anteil = Installationen mit Zulassung /
alle Installationen der Gruppe.

| Gruppe | Systeme | Installationen | KVDT | LDT-Befund-Import | LDT-Auftrag-Export | eArztbrief | 1-Click-KIM | KIM-Sammelerklärung umgesetzt |
|---|---|---|---|---|---|---|---|---|
| Ärztliche Praxis-PVS | 51 | 69.507 | 100 % | **96,2 %** (33) | **0,0 %** (0) | **88,6 %** (41) | 100 % | 68,1 % |
| Psychotherapie (inkl. Epikur, SMARTY) | 6 | 34.498 | 100 % | 63,6 % (3) | 17,4 % (1, Epikur) | 100 % | 100 % | 99,1 % |
| Krankenhaus-/Ambulanzsysteme | 11 | 9.249 | 100 % | 0 % | 0 % | 78,3 % | 99,7 % | 0 % |
| Labor/Pathologie | 33 | 1.334 | 98,8 % | 12,7 % | 11,5 % | 65,9 % | 98,8 % | 0,4 % |
| Alle | 126 | 116.954 | 100 % | 76,7 % | 5,3 % | 90,4 % | 99,9 % | 69,9 % |

Gegenprobe Teilmenge: Die 28 ärztlichen Systeme aus `pvs-kbv-installationen.csv` decken 98,2 % der ärztlichen
Installationen ab (68.235 von 69.507) und liefern fast dieselben Quoten (LDT-Befund 95,8 %, eArztbrief 88,9 %).

- **Ärztliche Systeme ohne LDT-Befund-Import-Zulassung** (zusammen 2.671 Installationen = 3,8 %): Praxis-Programm 687,
  Med7 528, FIDUS 524 (Augenheilkunde), IFA-AUGENARZT 392, QMED.PRAXIS 155, APRIS 142, Praxis4More 68, David 44,
  J-MED 32, MEDICUSplus 27, ARZT 2000 22, ifa|NX 17, apraxos 13, UNISOLO-POESY 12, Med4WinPlus 4, MEDIPX 2,
  garrioPRO 1, MEDI_LINE 1. Med7 und APRIS werben mit Labor/LDT, haben aber keine LDK-Prüfnummer.
- **Digitaler Laborauftrag:** „Digitales Muster 10 - Export“ haben Medical Office, QUINCY WIN, DURIA und David
  (15,1 % der ärztlichen Installationen); „LDT-Auftrag - Export“ kein ärztliches PVS. ETERNO Cloud führt
  „LDT-Auftrag - Import“ (ungewöhnlich für ein PVS, so im Verzeichnis).
- **Ärztliche Systeme ohne eArztbrief-Zulassung am 21.10.2026:** Medical Office 5.700, EL – Elaphe Longissima 1.402,
  EVA 457, QMED.PRAXIS 155, Doctorly 87, Praxis4More 68, David 44, J-MED 32, UNISOLO-POESY 12, MEDI_LINE 1.
- **1-Click-KIM:** alle KVDT-Systeme. Die elektronische **Sammelerklärung** fehlt u. a. bei medatixx 6.121,
  T2med 4.078, ALBIS 3.595, EL 1.402, PegaMed 1.028, S3-Win 1.015, ETERNO 778.

### 4.2 Die 41 Systeme der CSV (Stand 21.10.2026)

| Software-ID | System | Inst. Q4/25 | Klasse | LDT-Befund | LDT-Auftrag | eArztbrief | 1-Click-KIM (Sammelerkl.) |
|---|---|---|---|---|---|---|---|
| 298 | Elefant | 10.967 | PT | ja | nein | ja | ja (umgesetzt) |
| 348 | psyprax | 10.519 | PT | nein | nein | ja | ja (umgesetzt) |
| 280 | CGM MEDISTAR (BLACK PRO) | 9.617 | arzt | ja | nein | ja | ja (umgesetzt) |
| 112 | TURBOMED | 6.305 | arzt | ja | nein | ja | ja (umgesetzt) |
| 462 | medatixx | 6.121 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 216 | x.isynet | 6.086 | arzt | ja | nein | ja | ja (umgesetzt) |
| 295 | Epikur | 6.008 | PT | ja | **ja** | ja | ja (umgesetzt) |
| 210 | Medical Office | 5.700 | arzt | ja | nein (Muster 10 Export: ja) | **nein** | ja (umgesetzt) |
| 299 | SMARTY | 4.982 | PT | ja | nein | ja | ja (umgesetzt) |
| 457 | tomedo | 4.530 | arzt | ja | nein | ja | ja (umgesetzt) |
| 498 | T2med | 4.078 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 254 | ORBIS | 4.073 | kis | nein | nein | ja | ja (nicht umgesetzt) |
| 243 | x.concept | 3.612 | arzt | ja | nein | ja | ja (umgesetzt) |
| 203 | ALBIS | 3.595 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 244 | QUINCY WIN | 2.654 | arzt | ja | nein (Muster 10 Export: ja) | ja | ja (umgesetzt) |
| 252 | CGM M1 PRO | 2.278 | arzt | ja | nein | ja | ja (umgesetzt) |
| 086 | DURIA | 2.069 | arzt | ja | nein (Muster 10 Export: ja) | ja | ja (umgesetzt) |
| 266 | x.comfort | 1.938 | arzt | ja | nein | ja | ja (umgesetzt) |
| 253 | PsychoDat | 1.705 | PT | nein | nein | ja | ja (umgesetzt) |
| 343 | SAP Ambulatory Care Mgmt | 1.543 | kis | nein | nein | nein | ja (nicht umgesetzt) |
| 135 | EL – Elaphe Longissima | 1.402 | arzt | ja | nein | nein | ja (nicht umgesetzt) |
| 226 | CGM MEDICO | 1.363 | kis | nein | nein | ja | ja (nicht umgesetzt) |
| 083 | PegaMed | 1.028 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 261 | S3-Win | 1.015 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 314 | IMedOne | 969 | kis | nein | nein | ja | ja (nicht umgesetzt) |
| 060 | Data-AL | 806 | arzt | ja | nein | ja | ja (umgesetzt) |
| 488 | ETERNO Cloud | 778 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 406 | esQlab.online | 728 | unklar | nein | nein | ja | ja (nicht umgesetzt) |
| 421 | EVIDENT | 711 | arzt (eher Zahn/MKG) | nein | nein | ja | ja (nicht umgesetzt) |
| 030 | Praxis-Programm | 687 | arzt | nein | nein | ja | ja (nicht umgesetzt) |
| 015 | MEDYS | 578 | arzt | ja | nein | ja | ja (nicht umgesetzt) |
| 078 | Med7 | 528 | arzt | nein | nein | ja | ja (nicht umgesetzt) |
| 403 | FIDUS | 524 | arzt | nein | nein | ja | ja (nicht umgesetzt) |
| 456 | RED medical classic | 496 | unklar | ja | nein | nein | ja (nicht umgesetzt) |
| 062 | EVA | 457 | arzt | ja | nein | nein | ja (nicht umgesetzt) |
| 247 | PROFIMED | 427 | arzt | ja | nein | ja | ja (umgesetzt) |
| 400 | IFA-AUGENARZT | 392 | arzt | nein | nein | ja | ja (umgesetzt) |
| 626 | RED Medical | 317 | PT | nein | nein | ja | ja (nicht umgesetzt) |
| 023 | DATA VITAL | 275 | arzt | ja | nein | ja | ja (umgesetzt) |
| 308 | RescuePro | 186 | unklar | nein | nein | nein | ja (nicht umgesetzt) |
| 721 | DAVID | 44 | arzt | nein | nein | nein | ja (umgesetzt) |

AWS 2026: unbekannt für alle (kein Verzeichnis). KVDT: ja für alle 41 (David und SAP nur mit Satzart-Prüfnummern
Y/200 ff., nicht Y/1).

## 5. Ergebnisse Teil 4: Zeitreihe der Zulassungen

### 5.1 Zahl der Einträge je Verzeichnis

| Stand | Matrix: Abrechnung¹ | LDK gesamt | davon LDT-Befund-Import² | eArztbrief | 1-Click-KIM | AWS |
|---|---|---|---|---|---|---|
| 17.10.2021 | – | – | – | 40 | – | – |
| 29.12.2021 | 98 | 75 | – | 41 | – | 31 |
| 22.01.2022 | (KVDT 16.01.: 129) | 76 | 51 | 41 | – | – |
| 27.10.2022 | 97 | 76 | – | 47 | – | 37 |
| 22.11.2022 | – | – | – | 47 | – | – |
| 06.06.2023 | 95 (KVDT: 123) | 77 | 51 | 43 | – | 38 |
| 29.10.2023 | 95 | 77 | – | 52 | – | 38 |
| 14.12.2023 | (KVDT: 125) | 77 | 51 | – | – | – |
| 25.03.2024 | 94 | 76 | – | 68 | – | 38 |
| 13.07.2024 | – | – | – | – | 28 | – |
| 08.08.2024 | – | – | – | – | 46 | – |
| 10.11.2025 | 96 | 81 | – | 78 | – | **0** |
| 22.12.2025 | 126 (neue Matrix) | 81 | – | 78 | – | Spalte entfallen |
| 06.02.2026 | 123 | 81 | – | 77 | – | – |
| 09.04.2026 | 124 | 81 | – | 78 | – | – |
| 19.05.2026 | 124 | 81 | – | 79 | – | – |
| 26.06.2026 | 123 | 81 | – | 79 | – | – |
| 10.08.2026 | 123 | 81 | – | 77 | – | – |
| 14.09.2026 | 123 | 82 | – | 77 | – | – |
| 21.10.2026 | 124 (KVDT: 124) | 82 | 54 | 78 | 125 | – |

¹ Alte Matrix (bis 11/2025): Systeme mit Kreuz „Ambulante Behandlung“; neue Matrix (ab 12/2025): eine Spalte
„Abrechnung“ (inkl. reiner Überweisungs-/Laborabrechner) – Bruch 11/2025→12/2025, nicht vergleichbar.
² Nur aus den Einzelverzeichnissen mit Komponentenliste; die Matrix unterscheidet Befund/Auftrag nicht.
Die LDK-Prüfnummern im Verzeichnis 01/2022 beginnen ganz überwiegend ab 02/2021 (einzelne ab 04/2019).
Ein LDK-Verzeichnis vor 01/2022 ist im Archiv nicht zu finden.

### 5.2 Anteil der ärztlichen Installationen mit Zulassung (Top-Systeme der CSV, Klasse arzt)

Gewichtet mit dem nächstgelegenen Quartal aus `pvs-kbv-installationen.csv` (gerechnet). Nur die dort erfassten
28–29 ärztlichen Systeme (≈98 % der ärztlichen Installationen).

| Stand | Gewicht (Quartal) | LDT-Befund-Import | eArztbrief | 1-Click-KIM | AWS |
|---|---|---|---|---|---|
| 17.10.2021 | Q3/2021 | – | 94,6 % | – | – |
| 29.12.2021 / 22.01.2022 | Q4/2021 | 95,6 % | 94,3 % | – | 75,1 % |
| 27.10. / 22.11.2022 | Q3/2022 | – | 96,9 % | – | 89,4 % |
| 06.06.2023 | Q1/2023 | 95,6 % | 92,3 % | – | 91,5 % |
| 29.10. / 14.12.2023 | Q4/2023 | 95,6 % | 95,7 % | – | 91,5 % |
| 25.03.2024 | Q1/2024 | – | 99,9 % | – | 91,6 % |
| 13.07.2024 | Q1/2024 | – | – | 22,0 % | – |
| 08.08.2024 | Q1/2024 | – | – | 37,0 % | – |
| 10.11.2025 | Q3/2025 | – | 99,9 % | – | 0 % |
| 22.12.2025 | Q4/2025 | – | 99,9 % | – | – |
| 06.02.–26.06.2026 | Q4/2025 | – | 87,7 % | – | – |
| 10.08.2026 | Q4/2025 | – | 87,0 % | – | – |
| 14.09. / 21.10.2026 | Q4/2025 | 95,8 % | 88,9 % | 100 % | – |

Aussage: Beim LDT-Befund-Import gibt es **keine Entwicklung** – die Zulassung war schon 2022 Standard. Beim
eArztbrief schwankt der Anteil vor allem durch Rezertifizierungslücken großer Systeme (2026: Medical Office).
1-Click-KIM sprang 2024/2025 auf 100 % (Pflicht vor Abschaltung KV-Connect). AWS: 2021–2024 bis 92 %, dann aus der
Matrix verschwunden.

## 6. Ergebnisse Teil 2/3: Nutzung

### 6.1 gematik TI-Dashboard – Jahressummen (gerechnet als Differenz der kumulierten Stände)

| Zeitraum | KIM-Nachrichten | davon eArztbriefe | davon eAU an Kassen | E-Rezepte eingelöst |
|---|---|---|---|---|
| 08/2021–12/2022 (kumuliert) | 74,0 Mio. | 3,6 Mio. | 62,3 Mio. | 0,9 Mio. |
| 2023 | 180,1 Mio. | 14,4 Mio. | 116,6 Mio. | 17,8 Mio. |
| 2024 | 233,4 Mio. | 32,3 Mio. | 125,3 Mio. | 522,5 Mio. |
| 2025 | 256,7 Mio. | 45,3 Mio. | 114,0 Mio. | 582,2 Mio. |
| 01–09/2026 | 215,2 Mio. | 41,5 Mio. | 80,5 Mio. | 445,1 Mio. |
| Stand 21.10.2026 kumuliert | 980,9 Mio. | 141,0 Mio. | 506,4 Mio. | 1.602,2 Mio. |

eArztbriefe je Monat (gerechnet): 03/2022 0,15 Mio. → 03/2023 1,0 Mio. → 03/2024 2,2 Mio. → 03/2025 3,6 Mio. →
03/2026 5,2 Mio. (Spitze) → 09/2026 4,3 Mio. Anteil eArztbrief an allen KIM-Nachrichten: 2023 8 %, 2025 18 %.
eAU per KIM: 2026 deutlich unter Vorjahr (Q3/2026 21,6 Mio.; Grund nicht geklärt).
Einrichtungen, die E-Rezepte ausstellen (Woche, alle Sektoren): 07/2023 4.176 → 07/2024 84.584 → 07/2025 89.268 →
07/2026 89.219.

### 6.2 TI-Atlas (gematik-Befragung), Arztpraxen / Psychotherapiepraxen

| Jahr | KIM mind. einmal genutzt (Arzt / PT) | KIM-Modul vorhanden (Arzt / PT) | Voll TI-ready (Arzt / PT) | ohne TI-Anschluss (Arzt / PT) |
|---|---|---|---|---|
| 2021 | 8,7 / 0,6 | 32,8 / 6,8 | 33,3 / 11,1 | 8,1 / 12,5 |
| 2022 | 42,0 / 5,9 | 69,7 / 22,0 | 42,5 / 39,0 | 6,4 / 12,9 |
| 2023 | 86,3 / 10,2 | 90,4 / 28,6 | 71,2 / 54,0 | 4,0 / 11,4 |
| 2024 | 94,6 / 23,8 | 96,1 / 80,6 | 70,2 / 53,0 | 1,4 / 7,3 |
| 2025 | 94 / 42 | 95 / 90 | 81,5 / 78,7 | 1,7 / 4,1 |
| 2026 | 96 / 54 | 97 / 93 | 87 / 85 | 1 / 2 |

### 6.3 PraxisBarometer Digitalisierung (Arztpraxen ohne PT, %)

| Jahr | Arztbrief digital empfangen | … gesendet | Labordaten digital empfangen | … gesendet | KIM als Kommunikationsweg | eArztbrief via KIM genutzt (TI-Praxen) | LDT als Kommunikationsweg |
|---|---|---|---|---|---|---|---|
| 2018 | 13 | 13 | 69 | 15 | – | – | – |
| 2019 | 15 | 12 | 67 | 13 | – | – | – |
| 2020 | 14 | 12 | 70 | 15 | – | – | rund 37 |
| 2021 | 14 | 14 | 67 | 10 | 9,7 | – | 35,1 |
| 2022 | 35 | 23 | 70 | 13 | 27,9 | 50,7 | 37,8 |
| 2023 | 63 | 41 | 71 | 20 | 52,9 | 67,4 | 36,4 |
| 2024 | 77 | 53 | 73* | 30* | 57,8 | 75,6 | 38,1 |
| 2025 | 87 | 65 | 80* | 39* | 76,1 | 81,9 | 47,2 |

\* ab 2024 Antwort „Labordaten (inkl. Labordatenaufträgen und -ergebnissen)“ – Formulierungsbruch.
Psychotherapiepraxen: KIM als Kommunikationsweg 2,0 (2021) → 31,6 % (2025); eArztbrief via KIM 12,0 (2022) →
21,9 % (2025).

### 6.4 Gegenüberstellung (Zulassung – Anbindung – Nutzung), Arztpraxen 2025

| Ebene | Wert | Quelle |
|---|---|---|
| Installationen mit eArztbrief-Zulassung (Stand 21.10.2026) | 88,6 % | KBV-Verzeichnis × Installationen |
| TI-Praxen, die eArztbrief via KIM nutzen | 81,9 % | PraxisBarometer 2025 |
| Arztbrief digital empfangen / gesendet | 87 / 65 % | PraxisBarometer 2025 |
| Installationen mit LDT-Befund-Import-Zulassung | 96,2 % | KBV × Installationen |
| Labordaten digital empfangen / gesendet | 80 / 39 % | PraxisBarometer 2025 |
| LDT als Kommunikationsweg | 47,2 % | PraxisBarometer 2025 |
| Installationen mit digitalem Laborauftrag (Muster 10 Export oder LDT-Auftrag) | 15,1 % | KBV × Installationen |

## 7. Lücken

1. **LDT-Version in der Praxis:** Kein Beleg, wie viele Praxen tatsächlich LDT 3 statt LDT 2.x empfangen. Die
   KBV-Zulassung sagt nur, dass das System LDT 3 importieren kann. Die in der Vorarbeit genannte Zahl „KBV 2022: LDT 3
   bei < 10 % der Zuweiser“ ließ sich **nicht** belegen – nicht verwenden.
2. **Nutzung je System:** Weder gematik noch KBV veröffentlichen eArztbrief- oder KIM-Zahlen je PVS.
3. **Zahl angebundener Praxen:** Das TI-Dashboard zählt Nachrichten, keine Praxen. Näherungen: TI-Atlas
   (Befragung, %), wöchentlich aktive E-Rezept-Aussteller (alle Sektoren), ePA-Teilnahme je Woche (ab 05/2025,
   Arztpraxen = Reihen 1018 + 1022 laut Dashboard-Transformation, nicht in die CSV übernommen). Die Zahl der
   KIM-Adressen im Verzeichnisdienst ist nicht öffentlich als Zeitreihe zu finden.
4. **08/2021–02/2022:** keine Monatswerte des TI-Dashboards (Grafana-Reihe beginnt 22.02.2022).
5. **AWS:** Kein Verzeichnis seit 12/2025; 0 Kreuze schon in der Matrix 11/2025. Ein Archivstand zwischen 03/2024 und
   11/2025 fehlt, ebenso eine KBV-Mitteilung zum Grund. Der Prüfpaket-Ordner wurde zuletzt am 15.11.2024 geändert
   (Prüfpaket nur noch im Vorquartal 2024_Q2) – Hinweis, kein Beleg.
6. **Archivlücken der Verzeichnisse:** LDK nur 01/2022, 06/2023, 12/2023, 10/2026; KIM nur 07/2024, 08/2024,
   10/2026; eArztbrief-Detail 10/2021–11/2022 und 03/2026. Zwischenstände nur über die Matrix.
7. **Zweitquelle eArztbrief-Mengen:** Abrechnungsfrequenzen der GOP 86900/86901/01660 (KBV/Zi) wären eine
   unabhängige Gegenprobe zur gematik-Zählung – nicht öffentlich gefunden.
8. **PraxisBarometer 2026** noch nicht veröffentlicht (angekündigt „Herbst 2026“).

## 8. Widersprüche und Auffälligkeiten

1. **MEDYS:** Vorarbeit (`kbv-pvs-daten.md`) nennt „Befund-Export + Import“. Die Auswertung mit Koordinaten
   (pdftotext -bbox) ordnet „LDT-Befund - Export“ dem folgenden Eintrag LabCentre zu; MEDYS hat nur „Befund-Import“.
   Die Zeile steht im PDF genau zwischen beiden – leicht unsicher, für ldt_befund ohne Belang.
2. **DAVID:** In `pvs-kbv-installationen.csv` als Hersteller „CompuGroup Medical“ geführt; die KBV-Statistik
   (Id 721) und das KVDT-Verzeichnis nennen **Medat Computersysteme GmbH, München**. Bitte in der Installations-CSV
   prüfen (hier nicht geändert).
3. **EVIDENT** ist in der Installations-CSV „arzt“, laut Vorarbeit Zahn/MKG/KFO.
4. **eArztbrief-Lücken bei Rezertifizierung:** Medical Office bis 22.12.2025 gelistet, ab 06.02.2026 nicht mehr;
   QUINCY WIN 02–08/2026 nicht gelistet, ab 09/2026 wieder; EL ab 09/2026 nicht mehr; S3-Win, SMARTY,
   Praxis-Programm 06/2023 kurz nicht gelistet. Eine fehlende Zulassung ist eine Momentaufnahme, keine Aussage
   über die Funktion. In Texten „derzeit nicht im Verzeichnis“ schreiben.
5. **KBV vs. IGES beim eArztbrief 2025:** KBV-Grafik „87 % nutzen den eArztbrief“ = digitaler Empfang von Arztbriefen
   über jeden Kanal; IGES-Kurzbericht 82 % = „eArztbrief via KIM genutzt“ in TI-Praxen. Für den eArztbrief im
   engen Sinn 82 % verwenden.
6. **TI-Atlas vs. PraxisBarometer KIM:** TI-Atlas 2025 „KIM mind. einmal genutzt“ 94 % der Arztpraxen,
   PraxisBarometer 2025 „KIM als Kommunikationsweg mit anderen Niedergelassenen“ 76 %. Kein Widerspruch: Der
   TI-Atlas zählt jede Nutzung (Pflicht-eAU an Kassen), das Barometer nur Kommunikation mit Kollegen.
7. **Fragewechsel PraxisBarometer:** KIM-Item 2020 „E-Arztbrief“, 2021–23 „KIM (z. B. eArztbrief)“, ab 2024
   „z. B. eNachricht“; TI-Anwendungen 2022/23 Mehrfachauswahl, ab 2024 Matrix; Labordaten ab 2024 inkl. Aufträgen.
8. **E-Rezept-Reihe (1000):** einmaliger Rücksprung am 19.05.2022 (17.942 → 7.592), offenbar Bereinigung in der
   Pilotphase. Ab 06/2022 monoton.
9. **1-Click-KIM-Zulassung ≠ eArztbrief:** Die KIM-Zulassung ist eine Abrechnungsfunktion. Wer „alle Systeme können
   KIM“ schreibt, muss das so sagen.

## 9. Grafikvorschläge (je eine ehrliche Grafik)

### Post 5 – „Befunde kommen digital, Aufträge nicht“

**Linie, 2018–2025, zwei Reihen (PraxisBarometer, Arztpraxen ohne PT):** „Labordaten digital empfangen“ (69 → 80 %)
und „Labordaten digital gesendet“ (15 → 39 %). Jedes Jahr belegt, keine Lücke, eine Quelle, eine Aussage: Der
Empfang ist seit Jahren Standard, der Auftrag kommt erst langsam. Markierung im Bild und im Post: Formulierung ab
2024 inkl. Aufträgen/Ergebnissen (Bruch).

Begleitend als Bild oder `::grafik` im Artikel: **Balken, Stand 21.10.2026, Anteil der ärztlichen Installationen
mit KBV-Zulassung**: LDT-Befund-Import 96,2 % · digitale Laborüberweisung (Muster 10) 15,1 % · LDT-Auftrag-Export
0 %. Titel nach der Quelle: „Zulassung“ bzw. „Praxissoftware mit Zertifikat“, nicht „Praxen, die …“.
Fußnote: Installationen = KBV-Zählung nach Prüfnummer, keine Praxen.

### Post 6 – „Der eArztbrief ist Alltag geworden“

**Linie, Monatswerte 03/2022–09/2026: mit KIM gesendete eArztbriefe pro Monat** (gerechnet als Differenz der
kumulierten gematik-Stände; 0,15 → gut 4 Mio.). Lückenlos, eine Reihe, klare Aussage. Startmonat 03/2022 (erster
voller Monat); kumulierter Startwert 22.02.2022 nennen. Im Post markieren: Monatswerte gerechnet, Absender auch
Kliniken.

Gegenprobe als zweite Grafik: **PraxisBarometer 2018–2025, Arztbrief digital empfangen (13 → 87 %) vs. gesendet
(13 → 65 %)** – zeigt dieselbe Kurve aus Sicht der Praxen und die Lücke beim Versand. Nicht in einer Grafik mit
Prozent- und Millionenachse mischen. Hinweis „angeschlossen“: 1-Click-KIM-Zulassung 100 %, TI-Atlas KIM-Modul
97 % (2026) – als Satz im Text, nicht als Linie (läuft seit 2023 flach bei > 90 %).

## 10. Gerechnet / Quellen (für Post-Texte)

- **Gerechnet:** Anteile der Installationen = Summe der Installationen Q4/2025 aller Systeme mit Prüfnummer der
  Komponente, geteilt durch alle Installationen der Gruppe (Verknüpfung über Software-ID). Zeitreihe 5.2 mit dem
  nächstgelegenen Quartal gewichtet. Monats- und Jahreswerte des TI-Dashboards = Differenz der kumulierten Stände
  (letzter Messpunkt je Monat, Stand 00:00 UTC).
- **Überschneidungen:** Für die Nutzung liegen zwei unabhängige Befragungen (TI-Atlas, PraxisBarometer) und eine
  Zählung (gematik) vor; sie messen Unterschiedliches (siehe 8.5, 8.6). Gruppenzuordnung der 85 Kleinsysteme
  eigene Einschätzung (zusammen 4.863 Installationen = 4,2 %; die ärztliche Quote ändert sich dadurch um höchstens 0,4 Prozentpunkte, vgl. 4.1).
