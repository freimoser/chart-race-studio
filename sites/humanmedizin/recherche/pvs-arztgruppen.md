# Praxissoftware je Fachgruppe – KBV-Berichte je Arztgruppe (Recherche 26.10.2026)

Grundlage für Post 12 „Welche Praxissoftware Allgemeinmediziner nutzen“ (Redaktionsplan) und für Abschnitte der
Säulenseite. Daten: `sites/humanmedizin/data/raw/pvs-kbv-arztgruppen.csv` (460 Zeilen, nur belegte Werte).

## Quelle

KBV, „TOP 20 Systeme je Fachgruppe“, Installationsbestand gemäß ADT-Abrechnungen, Datenstand 31.12.2025, mit
Vorquartal 30.09.2025 und Differenz:
<https://update.kbv.de/ita-update/Service-Informationen/Installationsstatistiken/TOP_20_je_Fachgruppe.pdf>, abgerufen am
26.10.2026. Dieselben Zahlen stehen in den Einzelberichten `Arztgruppe_<Gruppe>.pdf` im selben Verzeichnis (geprüft für
Allgemeinmediziner). Ausgelesen mit `pdftotext -layout`; die Differenzspalte der KBV stimmt in 458 von 460 Zeilen mit
Q4 − Q3 überein (Ausnahmen: ORBIS bei Lungenärzten und x.concept bei Mund-Kiefer-Chirurgie, je 1 gegen 0 mit Differenz 0
– Kleinstwerte, unverändert übernommen).

## Gegenproben

- **Psychotherapeuten:** Summe der Top 20 = 35.271, derselbe Wert wie aus dem Einzelbericht (Abschnitt 6 von
  `pvs-kbv-historie.md`, in Post 3 verwendet).
- **Je System:** Die Summe eines Systems über alle Gruppen ist nie größer als sein Wert in der Gesamtliste. CGM MEDISTAR
  (9.617) und Medical Office (5.700) erscheinen vollständig, Elefant zu 10.845 von 10.967.
- **Elefant bei Psychotherapeuten:** 10.645 von 10.967 = 97 Prozent, wie in Post 3.
- **Alle Top 20 zusammen:** 109.464 von 116.954 Installationen; der Rest liegt in Systemen außerhalb der Top 20 je Gruppe.

## Ergebnisse (Q4/2025)

| Fachgruppe | Top 20 zusammen | Platz 1 | Platz 2 | Platz 3 |
|---|---|---|---|---|
| Allgemeinmediziner | 18.909 | medatixx 1.892 | CGM MEDISTAR BLACK PRO 1.857 | TURBOMED 1.850 |
| Internisten | 13.638 | CGM MEDISTAR BLACK PRO 1.493 | x.isynet 1.351 | TURBOMED 1.281 |
| Frauenärzte | 6.992 | CGM MEDISTAR BLACK PRO 1.643 | TURBOMED 748 | ORBIS 576 |
| Kinderärzte | 4.698 | CGM MEDISTAR BLACK PRO 677 | Medical Office 601 | TURBOMED 375 |
| Orthopäden | 3.737 | CGM MEDISTAR BLACK PRO 894 | x.isynet 401 | ORBIS 336 |
| Nervenärzte | 3.647 | TURBOMED 376 | x.isynet 353 | CGM MEDISTAR BLACK PRO 332 |
| Chirurgen | 2.729 | ORBIS 590 | CGM MEDISTAR BLACK PRO 259 | x.isynet 243 |
| Augenärzte | 2.670 | FIDUS 518 | CGM MEDISTAR BLACK PRO 506 | IFA-AUGENARZT 386 |
| HNO-Ärzte | 2.400 | CGM MEDISTAR BLACK PRO 427 | medatixx 292 | x.isynet 203 |
| Hautärzte | 2.078 | CGM MEDISTAR BLACK PRO 375 | tomedo 284 | TURBOMED 223 |
| Radiologen | 1.044 | medavis RIS 219 | ORBIS 185 | SAP 81 |
| Psychotherapeuten | 35.271 | Elefant 10.645 | psyprax 10.119 | Epikur 5.673 |

Alle 23 Gruppen in der CSV. Allgemeinmediziner weiter: T2med 1.737 (Platz 4), Medical Office 1.548, x.isynet 1.493,
x.concept 1.162, ALBIS 1.056, QUINCY WIN 1.018, tomedo 920.

## Fallen

1. **Arztgruppe ist nicht Versorgungsbereich.** „Allgemeinmediziner“ und „Praktiker“ sind getrennte KBV-Gruppen;
   hausärztlich tätige Internisten stehen bei den Internisten, zusammen mit fachärztlichen. Ein Titel mit „Hausärzte“
   verspräche mehr, als die Daten zeigen.
2. **Nur Top 20.** Die Gruppensumme ist ein Mindestwert, Anteile innerhalb der Gruppe deshalb „an den 20 größten Systemen“.
3. **Installationen, nicht Ärzte** – wie in der Gesamtstatistik; ein MVZ zählt einmal, in der Gruppe seiner Abrechnung.
4. **Krankenhaussysteme in Facharztgruppen** (ORBIS bei Chirurgen, Frauenärzten, Orthopäden): Klinikambulanzen und
   Krankenhaus-MVZ rechnen in diesen Gruppen ab.

## Offen

Zeitreihe: Archivierte Einzelberichte je Arztgruppe für Q4/2021 bis Q4/2024 (Webarchiv, wie für die Psychotherapeuten)
erheben, dann ist für Allgemeinmediziner ein Line Race 2021–2025 ohne Lücke möglich.
