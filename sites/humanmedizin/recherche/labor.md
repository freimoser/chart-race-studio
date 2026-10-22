# Wer die Laborbefunde liefert – Labormedizin in Zahlen (Recherche 22.10.2026)

Grundlage für Post 11 „Wer die Laborbefunde liefert“. Zielgruppe: Labore und Dienstleister, die Schnittstellen
zwischen Labor und Praxissoftware bauen. Zugehörige Daten: `sites/humanmedizin/data/raw/labor.csv` (Long-Format
`stichtag,reihe,wert,einheit,quelle_url`, 616 Zeilen, **nur belegte Werte**; Summen, Anteile und Jahreswerte aus
Quartalen stehen nur hier im Text und sind als **gerechnet** markiert). Alle Abrufe am **22.10.2026**.

Nicht gedoppelt (steht in `schnittstellen.md` und `data/raw/ti-nutzung.csv`): KBV-Zulassungen LDT-Befund-Import
(96,2 % der Installationen), digitales Muster 10 als PVS-Export (15,1 %), LDT-Auftrag-Export (0 ärztliche PVS),
PraxisBarometer „Labordaten digital empfangen/gesendet“ und „LDT als Kommunikationsweg“.

## 1. Kurzfazit

| Reihe | Zeitraum | lückenlos? | Quelle |
|---|---|---|---|
| Personen der Fachgruppe Laboratoriumsmedizin (inkl. Mikrobiologie) in der vertragsärztlichen Versorgung nach Teilnahmestatus: gesamt, Zulassung, angestellt in Einrichtungen, angestellt in freier Praxis, ermächtigt | 2013–2025 (31.12.) | ja | KBV, Bundesarztregister (BAR), Tabelle 1.0 |
| dto. angestellt in MVZ | 2013–2025 | ja | BAR Tabelle 9 |
| dto. nach Kooperationsform (BAG / Einrichtungen / Einzelpraxis, je Vertragsärzte und Angestellte) | 2013–2025 | ja | BAR Tabelle 5 |
| Personen mit FA Laboratoriumsmedizin bzw. FA Mikrobiologie (Mehrfachzählung möglich) | 2016–2025 | ja | KBV-Gesundheitsdaten = BAR Tabelle 1.1 |
| FA Laboratoriumsmedizin: berufstätig, ambulant, davon niedergelassen / angestellt, stationär | 2013–2025 | ja | Bundesärztekammer (BÄK), Ärztestatistik Tabelle 3 |
| Gebiet Mikrobiologie, Virologie und Infektionsepidemiologie, dto. | 2016–2025 | ja (2013–2015 keine Gebietssummenzeile) | BÄK Tabelle 3 |
| Honorarumsatz, Behandlungsfälle, Ärzte der Abrechnungsgruppe Laboratoriumsmedizin; Honorarumsatz aller Ärzte | Quartale 1/2013–3/2024 | ja bis 3/2024; **4/2024 fehlt** | KBV-Honorarbericht (Tabellen) |
| Abrechnungshäufigkeit einzelner GOP (SARS-CoV-2-PCR 32816; eAuftrag 40092; Transport 40094) | 32816: 1/2020–1/2025; 40092/40094: **nur 1/2025** | 40092/40094 Einzelwert | KBV, Leistungshäufigkeiten je GOP |
| Umsatz Sonic Healthcare, Segment Germany | Geschäftsjahre 2011–2026 (Juli–Juni) | ja | Sonic-Geschäftsberichte |
| Umsatz SYNLAB, Segment Germany | 2022, 2023 | nein (nur zwei Jahre) | SYNLAB-Jahresergebnis 2023 |
| ALM e.V.: Labore, Fachärzte, Mitarbeitende | 2020 und 2026 (Selbstangaben, gerundet) | nein | ALM-Pressemitteilung 2020, Website 2026 |
| Zahl der Laborpraxen / Labor-MVZ | – | **keine Quelle** | siehe Lücken |

**Kernaussage, die die Daten tragen:**

- **Der Laborarzt in der Kassenversorgung ist angestellt, fast immer im MVZ.** Ende 2025 nahmen 1.386 Ärztinnen und
  Ärzte der Fachgruppe Laboratoriumsmedizin an der vertragsärztlichen Versorgung teil, davon **1.226 angestellt in
  Einrichtungen (88,5 %, gerechnet)**, 1.224 davon in MVZ. 2013 waren es 793 von 1.166 (68,0 %). Mit eigener
  **Zulassung** arbeiteten 2013 noch **288**, Ende 2025 **99** (−66 %, gerechnet).
- **Die Zweitquelle zeigt dasselbe.** BÄK-Ärztestatistik, Fachärzte für Laboratoriumsmedizin im ambulanten Bereich:
  niedergelassen **337 → 113** (2013 → 2025, −66 %), angestellt **329 → 725** (+120 %, gerechnet). Anteil angestellt
  an ambulant tätigen Laborärzten: 49,4 % → 86,5 % (gerechnet). Zwei unabhängige Register, gleiche Richtung, fast
  gleiche Größenordnung.
- **Die klassische Laborarzt-Einzelpraxis ist fast verschwunden:** Vertragsärzte in Einzelpraxen 92 (2013) → 35 (2025),
  gerechnet aus BAR Tabelle 5 (13 + 79 bzw. 9 + 26).
- **Wenige Gruppen, wachsende Größe.** Sonic Healthcare (Bioscientia u. a.) setzte in Deutschland im Geschäftsjahr
  2010/11 541 Mio. A$ um, 2025/26 **2.729 Mio. A$** – nach der Übernahme der LADR-Gruppe (Top-5-Laborgruppe, Umsatz
  2024 rund 370 Mio. €) zum 01.07.2025. Ein Marktanteil lässt sich daraus **nicht** ehrlich rechnen (Währung,
  Geschäftsjahr, Privat- und Krankenhausumsatz enthalten, kein Gesamtmarkt mit gleicher Abgrenzung).
- **Für Schnittstellen-Anbieter:** Der digitale Laborauftrag läuft über die Systeme der Labore, nicht über die
  Praxissoftware. Seit 01.01.2025 vergütet der EBM den Laboren die **Bereitstellung eines Systems zur digitalen
  Auftragserteilung** (GOP 40092). Im 1. Quartal 2025 wurde sie **15,1 Mio. Mal** abgerechnet, die Transportpauschale
  40094 **18,8 Mio. Mal** – Verhältnis **80,5 %** (gerechnet; nur Laborärzte: 87,8 %). Zum Vergleich (aus
  `schnittstellen.md`): kein ärztliches PVS hat eine KBV-Zulassung für den LDT-Auftrag-Export.

## 2. Quellen

| ID | Quelle | URL |
|---|---|---|
| BAR13–BAR23 | KBV, Statistische Informationen aus dem Bundesarztregister, Stand 31.12.2013 … 31.12.2023 (Tabellen 1.0, 1.1, 5, 9). Live erreichbar; Archivkopien im Webarchiv | `https://www.kbv.de/documents/infothek/zahlen-und-fakten/Bundesarztregister/<JJJJ>%20Statistische%20Informationen%20BAR.pdf` |
| BAR24 | dto., Stand 31.12.2024 | <https://www.kbv.de/documents/infothek/zahlen-und-fakten/Bundesarztregister/2024-12-31-BAR-Statistik.pdf> |
| BAR25 | dto., Stand 31.12.2025 | <https://www.kbv.de/documents/infothek/zahlen-und-fakten/Bundesarztregister/statistische-informationen-bar-2025.pdf> |
| GD-FA | KBV-Gesundheitsdaten „Fachgruppe und Schwerpunkt“, Diagramm I.1.1.4 (Laboratoriumsmediziner → FA Laboratoriumsmedizin / FA Mikrobiologie), Rohdaten JSON | Seite <https://www.kbv.de/infothek/zahlen-und-fakten/gesundheitsdaten/fachgruppe-und-schwerpunkt>; JSON `https://www.kbv.de/health-data/json/I.1.1.4?&far=6,27,10&cr=1` (Labor) und `…far=6,28,10…` (Mikrobiologie) |
| BÄK13 | Bundesärztekammer, Ärztestatistik 31.12.2013, Tabelle 3 (Webarchiv) | <https://web.archive.org/web/20160701224919/http://www.bundesaerztekammer.de/fileadmin/user_upload/downloads/Stat13AbbTab.pdf> |
| BÄK14, BÄK15 | dto. 2014, 2015 (Webarchiv) | <https://web.archive.org/web/2020/http://www.bundesaerztekammer.de:80/fileadmin/user_upload/downloads/pdf-Ordner/Statistik2014/Stat14AbbTab.pdf>, <https://web.archive.org/web/2020/http://www.bundesaerztekammer.de/fileadmin/user_upload/downloads/pdf-Ordner/Statistik2015/Stat15AbbTab.pdf> |
| BÄK16–BÄK20 | dto. 2016–2020 | <https://www.bundesaerztekammer.de/fileadmin/user_upload/_old-files/downloads/pdf-Ordner/Statistik2016/Stat16AbbTab.pdf> (2017, 2018 analog `Stat17AbbTab.pdf`, `Stat18AbbTab.pdf`), <https://www.bundesaerztekammer.de/fileadmin/user_upload/_old-files/downloads/pdf-Ordner/Statistik2019/WEBStatistik_2019_k.pdf>, <https://www.bundesaerztekammer.de/fileadmin/user_upload/_old-files/downloads/pdf-Ordner/Statistik_2020/2020-Statistik.pdf> |
| BÄK21–BÄK25 | dto. 2021–2025 | <https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Ueber_uns/Statistik/2021/2021_Statistik.pdf>, <https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Ueber_uns/Statistik/AErztestatistik_2022_09062023.pdf>, <https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Ueber_uns/Statistik/AErztestatistik_2023_Update_Juni_2024.pdf>, <https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Ueber_uns/Statistik/AErztestatistik_2024.pdf>, <https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Ueber_uns/Statistik/AErztestatistik_2025.pdf> |
| HB | KBV, Honorarbericht nach § 87c SGB V, Tabellen 1/2013–3/2024, Stand September 2026 | <https://www.kbv.de/documents/infothek/zahlen-und-fakten/honorarbericht/honorarbericht-tabellen.xlsx> |
| HB-FAQ | KBV, FAQ zum Honorarbericht (Sept. 2022) – Definitionen Honorarumsatz, Behandlungsfall | <https://www.kbv.de/documents/infothek/zahlen-und-fakten/honorarbericht/faq-honorarbericht.pdf> |
| GOP | KBV, Leistungshäufigkeiten je GOP auf Ebene des Honorarberichts, 1/2019–1/2025, Stand November 2025 | <https://www.kbv.de/documents/infothek/zahlen-und-fakten/honorarbericht/leistungshaeufigkeiten-je-gop-honorarbericht.xlsx> |
| BA709 | Bewertungsausschuss, 709. Sitzung (schriftlich), Laborreform / Transportkosten, EBM-Änderung zum 01.01.2025 (Leistungslegenden 40089–40095, Protokollnotiz, Gründe) | <https://www.kbv.de/documents/infothek/rechtsquellen/bewertungsausschuss/ebm/2025/ba-709-labor-transportkosten.pdf> |
| BA787 | Bewertungsausschuss, 787. Sitzung, Änderung 40090/40092/40094 zum 01.07.2025 | <https://www.kbv.de/documents/infothek/rechtsquellen/bewertungsausschuss/ebm/2025/ba-787-labor.pdf> |
| KVS | KV Sachsen, „EBM-Änderungen zum 1. Januar 2025“ (Übersicht der neuen Pauschalen in Euro) | <https://www.kvsachsen.de/fuer-praxen/aktuelle-informationen/praxis-news/ebm-aenderungen-zum-1-januar-2025-1> |
| ÄZ17 | Ärzte Zeitung, 18.01.2017, „Digitale Laboraufträge sind nur mit E-Arztausweis machbar“ (Muster 10 digital ab Juli 2017, freiwillig) | <https://www.aerztezeitung.de/Wirtschaft/Digitale-Laborauftraege-sind-nur-mit-E-Arztausweis-machbar-309333.html> |
| SON | Sonic Healthcare, Geschäftsberichte 2012, 2014, 2016, 2018, 2019, 2021, 2022, 2024, 2025 (Segmentangabe „Germany“, jeweils Berichtsjahr und Vorjahr) | `https://investors.sonichealthcare.com/FormBuilder/_Resource/_module/T8Ln_c4ibUqyFnnNe9zNRA/docs/Reports/AR/` + `sonic-healthcare-limited-<JJJJ>-annual-report-online.pdf` (bis 2019) bzw. `SHL_AnnualReport_<JJJJ>.pdf` (ab 2021) |
| SON26 | Sonic Healthcare, Financial and Operational Review, Year ended 30 June 2026 (Germany A$2,729 m; LADR-Integration; GOÄ ≈ 1/3 des deutschen Umsatzes) | <https://investors.sonichealthcare.com/FormBuilder/_Resource/_module/T8Ln_c4ibUqyFnnNe9zNRA/docs/CEO/Financial_and_Operational_Review_30_June_2026.pdf> |
| SYN | SYNLAB AG, „SYNLAB delivers robust performance in FY 2023“, 25.03.2024 (Segment Germany 2023: 536,2 Mio. €, 2022: 703,2 Mio. €) | <https://www.eqs-news.com/news/corporate/synlab-delivers-robust-performance-in-fy-2023/e97e0cea-ffd7-4621-a72e-99b41e7f74b0_en> |
| ALM20 | ALM e.V., Pressemitteilung 18.06.2020 (Boilerplate: über 200 Labore, 900 Fachärzte, rund 500 Naturwissenschaftler, etwa 25.000 Mitarbeiter; gleichlautend bis 03/2022) | <https://www.alm-ev.de/wp-content/uploads/2020/06/180620-PM-ALM-Corona-Warn-App.pdf> |
| ALM26 | ALM e.V., „Über den ALM e.V.“ und Mitgliederseite (über 200 Labore, mehr als 1.000 Fachärzt:innen, über 150 Ärzt:innen in Weiterbildung, rund 500 Naturwissenschaftler:innen, 25.000 Mitarbeitende; 20 Mitgliedsgruppen gelistet) | <https://www.alm-ev.de/alm/ueber-den-alm-ev/>, <https://www.alm-ev.de/alm/mitglieder/> |
| ALM24 | ALM e.V., offener Brief 15.08.2024 zur Laborreform (Abwertung „durchschnittlich minus 10 Prozent“; Laborkosten „seit Jahren unter 3 Prozent der Gesamtausgaben“) | <https://www.alm-ev.de/wp-content/uploads/2024/08/150824-ALM-PM-offener-Brief.pdf> |
| AME | amedes, „Über amedes“ (rund 4.500 Mitarbeitende, über 100 Standorte in DE/BE/AT/Dubai, über 580.000 Laboranalysen täglich; ohne Stand) | <https://www.amedes-group.com/unternehmen/ueber-amedes.html> |
| LIM | Limbach Gruppe, Startseite (über 30 Labore, mehr als 8.000 Fachkräfte, mehr als 400 Fachärzt:innen; ohne Stand) | <https://www.limbachgruppe.com/> |

## 3. Definitionen

- **Fachgruppe Laboratoriumsmedizin (BAR):** bis 2019 „Laborärzte“ bzw. „Laboratoriumsmedizin“, ab 2020
  „Laboratoriumsmedizin/Biochemie/Mikrobiologie“. Enthält FA Laboratoriumsmedizin, FA Mikrobiologie (Virologie und
  Infektionsepidemiologie), SP Mikrobiologie, ab 2020 zusätzlich FA Biochemie (2025: 1) und FA Immunologie (2025: 4).
  Kein Bruch: Die Veränderung 2020 zum Vorjahr (+1,8 %) passt exakt zu 1.303 → 1.326. **Zählung nach Personen**,
  Stichtag 31.12. „Einrichtungen“ = MVZ, Einrichtungen nach § 402 Abs. 2 SGB V (ehemals § 311), KV- und kommunale
  Eigeneinrichtungen. Fast alle Laborärzte in Einrichtungen sind in MVZ (2025: 1.224 von 1.226, Tabelle 9).
- **FA-Zählung (Tabelle 1.1 / GD-FA):** Personen mit der jeweiligen Bezeichnung; Mehrfachzählung möglich. Deshalb ist
  FA Labor + FA Mikrobiologie (1.086 + 462 = 1.548) größer als die Fachgruppe (1.386). Nicht addieren.
- **BÄK „ambulant niedergelassen / angestellt“:** Meldedaten der Landesärztekammern, Hauptbezeichnung FA
  Laboratoriumsmedizin, alle Kostenträger (nicht nur GKV), ohne Mikrobiologie. Ermächtigte Krankenhausärzte zählen
  bei der BÄK als stationär. Nicht deckungsgleich mit dem BAR.
- **Honorarumsatz (HB):** „das (auf Praxisebene) ausgezahlte Honorar der Ärzte“, Einnahme der Praxis **für Leistungen
  und ggf. Sachkosten**, nicht Einkommen (HB-FAQ). Für Labore ist das überwiegend Kostenerstattung nach Kapitel 32 EBM.
  Nur zugelassene und angestellte Ärzte, **ohne Ermächtigte**. Abrechnungsgruppe nach tatsächlich abgerechneten
  Leistungen, nicht nach Facharzttitel. Nur GKV, kein Privat- (GOÄ) und kein Krankenhausumsatz.
- **Leistungshäufigkeit je GOP:** Zahl der Abrechnungen je Quartal, „gerundet auf ganze Tausend“. Die Kopfzeile sagt
  „in Tausend“, die Zellen enthalten aber bereits die gerundete Anzahl (z. B. Glukose 32057 bei Laborärzten
  3.452.000 im 1/2019; als Tausender gelesen wären es 3,5 Mrd.). In der CSV als Anzahl übernommen.
- **GOP 40092 (ab 01.01.2025):** „Zuschlag … für die **Bereitstellung eines Systems oder eines Moduls zur digitalen
  Auftragserteilung und -nachverfolgung**, einmal im Behandlungsfall, 0,60 €“. Pflichtmerkmale u. a. Übernahme von
  Patientenstammdaten, digitale Auftragserfassung, Etiketten, Statusinformationen, Abruf des Befundergebnisses
  (BA709). Abrechnen dürfen nur Ärzte mit Kapitel 11, 12 oder 19 bzw. Speziallabor-Genehmigung, also das
  **beauftragte Labor**. Laut Gründen: „Die erforderlichen Softwaremodule können den Arztpraxen von den Laboren zur
  Verfügung gestellt werden.“ Nicht berechnungsfähig innerhalb von MVZ, BAG, Laborgemeinschaft, Krankenhausgelände.
  Gyn. Zytologie/HPV: 40093 (0,30 €).
- **GOP 40094 (ab 01.01.2025):** Transport/Versand und Befundübermittlung für Auftragsleistungen (ohne gyn.
  Zytologie/HPV), einmal im Behandlungsfall, 2,80 €; gleiche Abrechnungsberechtigte und gleiche Ausschlüsse wie 40092.
  Deshalb taugt 40094 als Nenner für 40092 (siehe 4.6 – trotzdem nur Näherung).
- **Sonic „Germany“:** geografisches Segment im Konzernanhang (Umsatz in Tsd. A$, Geschäftsjahr 1.7.–30.6.),
  enthält GKV-, Privat- (≈ 1/3 laut SON26) und Krankenhausumsatz; ab GJ 2025/26 inklusive LADR.

## 4. Werte

### 4.1 Bundesarztregister, Fachgruppe Laboratoriumsmedizin (Personen, 31.12.)

| Jahr | gesamt | Zulassung | angestellt in Einrichtungen | davon MVZ | angestellt in freier Praxis | ermächtigt | Anteil angestellt in Einrichtungen (gerechnet) | Vertragsärzte in Einzelpraxen (gerechnet, T5) |
|---|---|---|---|---|---|---|---|---|
| 2013 | 1.166 | 288 | 793 | 791 | 50 | 35 | 68,0 % | 92 |
| 2014 | 1.173 | 237 | 849 | 847 | 57 | 30 | 72,4 % | 81 |
| 2015 | 1.199 | 220 | 885 | 883 | 65 | 29 | 73,8 % | 74 |
| 2016 | 1.218 | 195 | 932 | 930 | 61 | 29 | 76,5 % | 62 |
| 2017 | 1.245 | 177 | 988 | 986 | 53 | 27 | 79,4 % | 58 |
| 2018 | 1.255 | 170 | 1.009 | 1.007 | 48 | 28 | 80,4 % | 54 |
| 2019 | 1.303 | 164 | 1.060 | 1.058 | 55 | 24 | 81,4 % | 56 |
| 2020 | 1.326 | 150 | 1.090 | 1.089 | 62 | 24 | 82,2 % | 51 |
| 2021 | 1.332 | 148 | 1.097 | 1.096 | 63 | 24 | 82,4 % | 49 |
| 2022 | 1.360 | 147 | 1.147 | 1.146 | 46 | 20 | 84,3 % | 51 |
| 2023 | 1.378 | 120 | 1.188 | 1.187 | 51 | 19 | 86,2 % | 45 |
| 2024 | 1.370 | 104 | 1.202 | 1.201 | 44 | 20 | 87,7 % | 39 |
| 2025 | 1.386 | 99 | 1.226 | 1.224 | 44 | 16 | 88,5 % | 35 |

Jobsharing-Juniorpartner: 0 bzw. 1. Zulassung 2025 nach Ort (T5): 29 in BAG, 35 in Einrichtungen, 35 in
Einzelpraxen. FA Laboratoriumsmedizin (GD-FA) 934 (2016) → 1.086 (2025); FA Mikrobiologie 441 → 462.
Honorarbericht-Ärzte der Abrechnungsgruppe (ohne Ermächtigte) zur Kontrolle: 4/2023 1.395, BAR 2023 ohne
Ermächtigte 1.359 – passt.

### 4.2 BÄK-Ärztestatistik, FA Laboratoriumsmedizin (31.12.)

| Jahr | berufstätig | ambulant | davon niedergelassen | davon angestellt | stationär | Anteil angestellt an ambulant (gerechnet) |
|---|---|---|---|---|---|---|
| 2013 | 1.052 | 666 | 337 | 329 | 266 | 49,4 % |
| 2014 | 1.064 | 680 | 284 | 396 | 270 | 58,2 % |
| 2015 | 1.090 | 702 | 258 | 444 | 275 | 63,2 % |
| 2016 | 1.112 | 728 | 235 | 493 | 273 | 67,7 % |
| 2017 | 1.125 | 746 | 218 | 528 | 291 | 70,8 % |
| 2018 | 1.146 | 760 | 219 | 541 | 295 | 71,2 % |
| 2019 | 1.160 | 767 | 219 | 548 | 296 | 71,4 % |
| 2020 | 1.170 | 772 | 221 | 551 | 302 | 71,4 % |
| 2021 | 1.190 | 784 | 220 | 564 | 321 | 71,9 % |
| 2022 | 1.209 | 803 | 150 | 653 | 315 | 81,3 % |
| 2023 | 1.206 | 808 | 132 | 676 | 312 | 83,7 % |
| 2024 | 1.213 | 819 | 122 | 697 | 312 | 85,1 % |
| 2025 | 1.252 | 838 | 113 | 725 | 328 | 86,5 % |

Mikrobiologie (Gebiet, 2016 → 2025): ambulant 279 → 310, niedergelassen 93 → 38, angestellt 186 → 272 (CSV).

### 4.3 Volumen: GKV-Honorar und Laborleistungen

Jahreswerte = Summe der vier Quartale, **gerechnet** aus HB (Bund):

| Jahr | Honorarumsatz Laboratoriumsmedizin | Honorarumsatz alle Ärzte/PT | Anteil Labor | Behandlungsfälle Labor |
|---|---|---|---|---|
| 2013 | 1.278 Mio. € | 31,53 Mrd. € | 4,05 % | 53,0 Mio. |
| 2014 | 1.403 Mio. € | 32,73 Mrd. € | 4,29 % | 55,5 Mio. |
| 2015 | 1.482 Mio. € | 33,69 Mrd. € | 4,40 % | 57,3 Mio. |
| 2016 | 1.559 Mio. € | 35,11 Mrd. € | 4,44 % | 59,0 Mio. |
| 2017 | 1.621 Mio. € | 36,12 Mrd. € | 4,49 % | 61,4 Mio. |
| 2018 | 1.631 Mio. € | 37,20 Mrd. € | 4,39 % | 61,7 Mio. |
| 2019 | 1.670 Mio. € | 38,38 Mrd. € | 4,35 % | 62,5 Mio. |
| 2020 | 2.192 Mio. € | 40,06 Mrd. € | 5,47 % | 70,3 Mio. |
| 2021 | 2.320 Mio. € | 41,51 Mrd. € | 5,59 % | 73,6 Mio. |
| 2022 | 2.467 Mio. € | 42,09 Mrd. € | 5,86 % | 77,3 Mio. |
| 2023 | 2.139 Mio. € | 43,32 Mrd. € | 4,94 % | 69,6 Mio. |
| 2024 | nur 1–3/2024: 1.691 Mio. € | – | – | – |

2020–2022 enthalten SARS-CoV-2-Diagnostik (GOP 32816 bei allen Ärzten: 2020 10,2 Mio., 2021 13,1 Mio., 2022 16,1 Mio.,
2023 1,0 Mio. Abrechnungen; gerechnet aus GOP). Nicht als „Laborboom“ deuten.

Kapitel 32 EBM, Abrechnungen je Jahr (Summe aller GOP 32xxx und der vier Quartale, **gerechnet** aus GOP):

| Jahr | alle Ärzte/PT | Abrechnungsgruppe Laboratoriumsmedizin | Anteil Laborärzte |
|---|---|---|---|
| 2019 | 1.394 Mio. | 467 Mio. | 33,5 % |
| 2020 | 1.324 Mio. | 468 Mio. | 35,4 % |
| 2021 | 1.402 Mio. | 508 Mio. | 36,3 % |
| 2022 | 1.424 Mio. | 524 Mio. | 36,8 % |
| 2023 | 1.457 Mio. | 542 Mio. | 37,2 % |
| 2024 | 1.478 Mio. | 566 Mio. | 38,3 % |

Kapitel-32-Summen nicht in die CSV übernommen (Summe über 665 GOP-Zeilen; einzelne GOP bei Bedarf aus der KBV-Datei).
Wie Laborgemeinschaften (Direktabrechnung Abschnitt 32.2) den Abrechnungsgruppen zugeordnet werden, sagt die Quelle
nicht – Anteil Laborärzte deshalb nur als Richtung lesen.

### 4.4 Laborreform 2025 (BA709, KVS, ALM24)

Zum 01.01.2025 neu (je einmal im Behandlungsfall): Entnahmematerial 40089/40090 (0,95 €), Zuschlag Erregernachweis
40091 (1,98 €), **eAuftrag 40092 (0,60 €) / 40093 (0,30 €)**, Transport 40094 (2,80 €) / 40095 (1,05 €); gestrichen:
Transportpauschale 40100. Gegenfinanzierung „leistungsbedarfsneutral“ durch Minderung der Bewertung
in-vitro-diagnostischer Leistungen (BA709 Teil D); laut ALM durchschnittlich −10 %. Protokollnotiz: Überprüfung der
eAuftrags-Zuschläge erstmals zum 01.01.2028. Änderung der Legenden 40090/40092/40094 zum 01.07.2025 (BA787).

### 4.5 Konzentration (Unternehmensangaben)

Sonic Healthcare, Umsatz Segment Germany (Tsd. A$, GJ bis 30.06.): 2011 541.463 · 2012 541.733 · 2013 565.238 ·
2014 744.402 · 2015 805.022 · 2016 914.426 · 2017 958.650 · 2018 1.157.527 · 2019 1.249.723 · 2020 1.353.358 ·
2021 1.982.240 · 2022 2.025.115 · 2023 1.549.544 · 2024 1.769.093 · 2025 1.948.838 · 2026 2.729.000 (gerundet
veröffentlicht). Sprünge u. a. durch Zukäufe und Wechselkurs (in A$ berichtet), Corona-Tests 2021–2022, LADR ab GJ 2025/26. SON26: „11 federation members combined
into 3 operating divisions“.

SYNLAB Germany: 703,2 Mio. € (2022), 536,2 Mio. € (2023), rund 20 % des Konzernumsatzes. Spätere Segmentzahlen
nicht gefunden.

Herstellerangaben ohne Stichtag (nur Text, nicht CSV): Limbach „über 30 Labore“, „mehr als 8.000 Fachkräfte“,
„mehr als 400“ Fachärzt:innen; amedes „rund 4.500 Mitarbeitende“, „über 100 Standorte“ (vier Länder), „über
580.000 Laboranalysen“ täglich. ALM-Mitglieder laut Website: 20 Gruppen (u. a. amedes, Limbach, Sonic Healthcare
Germany, SYNLAB, LADR, Labor Berlin, Eurofins); Kartenfilter zeigt 183 Labore statt „über 200“.

### 4.6 Digitalisierung des Laborauftrags (ergänzend zu `schnittstellen.md`)

| Kennzahl | Wert | Quelle |
|---|---|---|
| GOP 40092 (eAuftrag-System bereitgestellt), alle Ärzte, 1/2025 | 15.139.000 | GOP |
| GOP 40094 (Transport), alle Ärzte, 1/2025 | 18.795.000 | GOP |
| Verhältnis 40092 / 40094 | **80,5 %** (gerechnet) | GOP |
| dto. nur Abrechnungsgruppe Laboratoriumsmedizin | 14.787.000 / 16.838.000 = **87,8 %** (gerechnet) | GOP |
| dto. Pathologie | 230.000 / 1.624.000 = 14,2 % (gerechnet) | GOP |
| Digitales Muster 10/10A zulässig seit | Juli 2017, freiwillig; Muster 10 mit qualifizierter Signatur (eHBA) | ÄZ17 |

Lesart: In vier von fünf Behandlungsfällen, in denen ein Labor eine Probe abholt, rechnet es auch die Pauschale für
ein bereitgestelltes digitales Auftragssystem ab. Das ist **kein** Beleg dafür, dass der einzelne Auftrag digital kam
(die Legende verlangt die Bereitstellung, nicht den Nachweis der Nutzung), und **kein** Beleg für LDT 3 aus dem PVS.
Es zeigt aber, wo die Schnittstelle sitzt: beim Order-Entry des Labors.

## 5. Lücken

| Lücke | Stand | Füllen |
|---|---|---|
| Zahl der Laborpraxen / Labor-MVZ / Laborstandorte | KBV weist Praxen nur haus-/fach-/psychotherapeutisch aus (GD I.1.3.2), MVZ-Statistik ohne Fachgruppe Labor; ALM nennt „über 200“ ohne Reihe | KBV (Versorgungsstruktur) um MVZ nach Fachgruppe bitten; DAkkS-Akkreditierungsverzeichnis (Norm 15189) auszählen – nicht gemacht |
| Honorarbericht 4/2024 und ab 2025 | Tabellendatei endet 3/2024 (Stand 09/2026), GOP-Datei endet 1/2025 | spätere KBV-Veröffentlichung abwarten; 40092/40094 als Zeitreihe erst dann |
| 40092/40094 als Reihe | nur 1/2025 | s. o.; für 2/2025 ff. auch Legendenänderung 07/2025 beachten |
| Sonic GJ 2010 und früher | AR 2008/2010 ohne Zeile „Germany“ im gleichen Format | nicht nötig für die Aussage |
| SYNLAB vor 2022 | Präsentation FY2021 nicht abrufbar (Webarchiv ohne PDF); Q3-Bericht 2021 nennt nur 9M (512,1 / 384,2 Mio. €) | Geschäftsbericht 2021/2022 direkt |
| Limbach, amedes, LADR: Umsatz je Jahr | keine Abschlüsse gefunden; Herstellerangaben ohne Stichtag und widersprüchlich | Bundesanzeiger (Konzernabschlüsse), nicht durchsucht |
| ALM: Untersuchungen pro Jahr | ALM nennt nur „hunderttausende Proben täglich“ | keine Reihe; nicht verwenden |
| Destatis Kostenstruktur Arztpraxen, Fachgebiet Labor | ALM24 zitiert Kostenquote 88,0 % für Facharztlabore; Destatis-Tabelle nicht eingesehen | Fachserie/Genesis 52913 prüfen, falls Kostenargument gebraucht wird |
| BAR 2012 und früher | anderer Tabellenaufbau, Methodenbruch 2013 (siehe `mvz.md` 5.4) | Grafik bei 2013 beginnen |

## 6. Widersprüche und Auffälligkeiten

1. **BÄK-Bruch 2021 → 2022:** niedergelassene Laborärzte 220 → 150 (−32 %) in einem Jahr, angestellte 564 → 653.
   Im BAR gibt es keinen solchen Sprung (Zulassung 148 → 147). Vermutlich Melde- oder Zuordnungsänderung bei den
   Kammern (z. B. Vertragsärzte im MVZ). In Grafik und Post nur BAR als Linie zeigen, BÄK als Gegenprobe im Text.
2. **BÄK niedergelassen > BAR Zulassung:** 2013: 337 vs. 288, obwohl das BAR zusätzlich Mikrobiologen enthält. Die BÄK
   zählt auch rein privat niedergelassene Ärzte und nach Selbstangabe.
3. **BAR 2013 Tabelle 1.0 vs. Tabelle 5:** Zulassung 288 vs. 293 (99 + 102 + 13 + 79), angestellt in Einrichtungen
   793 vs. 788. Ab 2014 stimmen beide Tabellen überein. Für Reihen Tabelle 1.0 nehmen.
4. **Honorarbericht vs. BAR:** HB zählt 4/2023 1.395 Ärzte der Abrechnungsgruppe, BAR 2023 1.378 Personen inkl.
   19 Ermächtigte – Abgrenzung nach Abrechnung vs. nach Fachgruppe. Kleine Differenz, keine Gegenaussage.
5. **Limbach-Mitarbeitende:** Pressemitteilung 12/2024 „über 5.000“ (laut Suchtreffer), Website 10/2026 „mehr als
   8.000“, Wikipedia 7.705. Unklar, ob Zukäufe oder andere Abgrenzung. Nicht als Zahl verwenden.
6. **ALM-Mitglieder:** „über 200 Labore“ (Text) vs. 183 Einträge in der Karte. Selbstangabe seit 2020 unverändert –
   keine Zeitreihe.
7. **„Leistungshäufigkeit in Tausend“:** Kopfzeile der KBV-Datei widerspricht den Zellwerten (siehe Definitionen).
8. **40092 ≠ digitaler Auftrag aus dem PVS:** Wer „80 % der Laboraufträge sind digital“ schreibt, überdehnt die Quelle.
   Richtig: „In 80 % der Laborfälle rechnet das Labor ein bereitgestelltes digitales Auftragssystem ab.“ Und: Im
   PraxisBarometer 2025 sagen 39 % der Praxen, sie senden Labordaten digital (`schnittstellen.md`) – das misst eine
   andere Ebene (Praxen, Selbstauskunft, inkl. Befunde).

## 7. Vorschlag für eine ehrliche Grafik

**Linie, 2013–2025, zwei Reihen, eine Quelle (Bundesarztregister), Einheit Personen:**
„Laborärztinnen und -ärzte in der Kassenversorgung: angestellt in MVZ und anderen Einrichtungen“ (793 → 1.226) und
„mit eigener Zulassung“ (288 → 99). Jedes Jahr belegt, keine Lücke, nichts gerechnet. Eine Aussage: **Das Labor ist
ein Angestelltenfach geworden.** Titelvorschlag nach der Begriffswelt der Quelle: „Laborärzte in der
vertragsärztlichen Versorgung: angestellt statt zugelassen“. Fußnote: Fachgruppe Laboratoriumsmedizin inkl.
Mikrobiologie, Zählung nach Personen, 31.12.; Einrichtungen = MVZ u. a. (2025: 1.224 von 1.226 in MVZ).
Optional dritte Linie „angestellt in freier Praxis“ (50 → 44) – sie bleibt flach und zeigt, dass die Anstellung nicht
in Praxen, sondern in MVZ stattfindet. Mehr nicht.

Nicht empfohlen: BAR und BÄK als Linien in einer Grafik (anderer Kreis, BÄK-Bruch 2022); Sonic-Umsatz in dieselbe
Grafik (A$, Geschäftsjahr, Privatumsatz); Honorar 2020–2022 ohne Corona-Hinweis.

Begleitend im Text oder als `::grafik` im Artikel: Kennzahl „80,5 % der Labor-Behandlungsfälle mit abgerechneter
eAuftrag-Pauschale (GOP 40092 / 40094, 1. Quartal 2025)“ neben „0 ärztliche PVS mit Zulassung LDT-Auftrag-Export“ –
beides mit der Definition, nicht als „Anteil digitaler Aufträge“.

## 8. Entwurf „Gerechnet / Quellen“ (für den LinkedIn-Post)

**Gerechnet:** Anteile (angestellt an allen Laborärzten 68,0 % → 88,5 %; Veränderung der Zulassungen −66 %) aus den
Personenzahlen des Bundesarztregisters. Vertragsärzte in Einzelpraxen als Summe zweier Spalten der Tabelle 5. Das
Verhältnis 80,5 % = Abrechnungen der GOP 40092 (Bereitstellung eines digitalen Auftragssystems) geteilt durch GOP
40094 (Probentransport), 1. Quartal 2025; es misst die Bereitstellung, nicht jeden einzelnen digitalen Auftrag.
Jahreswerte des Honorars als Summe von vier Quartalen.
**Wo sich Quellen überschneiden:** Bundesarztregister (KBV, nur Kassenversorgung, inkl. Mikrobiologie) und
Ärztestatistik der Bundesärztekammer (alle ambulant tätigen Fachärzte für Laboratoriumsmedizin) zählen
unterschiedliche Kreise; beide zeigen denselben Wechsel von niedergelassen zu angestellt (BÄK: 337 → 113
niedergelassen, 329 → 725 angestellt). Die BÄK-Reihe springt 2022 (Meldeänderung vermutet), die Grafik zeigt deshalb
nur das Bundesarztregister. Keine Werte geschätzt, keine Lücken gefüllt.
**Quellen:** KBV, Statistische Informationen aus dem Bundesarztregister 2013–2025 (Tabellen 1.0, 5, 9); KBV,
Leistungshäufigkeiten je GOP (Stand 11/2025); Bewertungsausschuss, 709. Sitzung; Bundesärztekammer, Ärztestatistik
2013–2025. Abruf 22.10.2026.
