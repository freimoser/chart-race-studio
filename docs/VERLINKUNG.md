# Verlinkung zwischen den Seiten (SEO und GEO)

Stand 20.10.2026. Gilt für tiermedizin-in-zahlen.org, humanmedizin-in-zahlen.org und flexchange-medical.de.

## Grundsätze

1. **Links im Text statt Linktausch.** Suchmaschinen werten seitenweite Footer-Links zwischen Domains desselben
   Betreibers kaum und können sie als Linkschema lesen. Was zählt, sind Links mitten im Artikel, wo das Thema auf
   der anderen Seite tatsächlich weitergeht. Der Fuß trägt nur einen schlichten Hinweis auf die Schwesterseite.
2. **Ein Autor, eine Entität.** Beide Seiten zeichnen Thomas Freimoser als dieselbe `Person` aus: gleicher Name,
   `sameAs` mit LinkedIn **und der Über-Seite der jeweils anderen Domain**. Auf der Humanmedizin zusätzlich
   `jobTitle` und `worksFor` (FleXChange Medical GmbH). Antwortmaschinen verknüpfen so beide Seiten mit einer
   Person und zitieren sie eher als Experten. Felder: `autor` im Profil, JSON-LD der Über-Seiten und Leitartikel.
3. **Kein doppelter Inhalt.** Jeder Artikel steht auf genau einer Domain. Das Studio ist nur auf der Tiermedizin
   indexiert (`studioIndexieren`), das Datenformat gibt es nur dort; die Humanmedizin verlinkt hin.
4. **Vergleichsartikel als Brücke.** Themen, die es auf beiden Seiten gibt, bekommen je einen eigenen Artikel mit
   eigenem Winkel, die aufeinander verweisen. Kandidaten:
   - Praxissoftware beim Arzt und beim Tierarzt (Humanmedizin Post 10 ↔ Tiermedizin, neuer Artikel)
   - Praxisketten: Tierarztketten ↔ MVZ und Investoren in der Humanmedizin
   - Frauenanteil, Nachfolge, angestellte statt niedergelassene Ärzte bzw. Tierärzte
5. **Offener Interessenkonflikt.** Auf der Humanmedizin steht der FleXChange-Bezug auf der Über-Seite, im Fuß, im
   Leitartikel und in `llms.txt`. Das sichert Glaubwürdigkeit und Zitierfähigkeit und trennt Werbung erkennbar vom
   redaktionellen Inhalt (UWG § 5a).

## Stand

| Von | Nach | Wo | Stand |
|---|---|---|---|
| Humanmedizin | Tiermedizin | Fuß (Schwesterseite), Startseite „Wer hier schreibt“, Über-Seite, Datenherkunft, Leitartikel, llms.txt, `sameAs` | erledigt 20.10.2026 |
| Humanmedizin | Tiermedizin | Studio-Hinweis „Datenformat“ | erledigt (Profil `datenformatUrl`) |
| Humanmedizin | FleXChange | Fuß, Startseite, Über-Seite, llms.txt, `worksFor` | erledigt 20.10.2026 |
| Tiermedizin | Humanmedizin | Fuß (zweiter Satz unter „Schwesterseite“), Über-Seite „Wo es weitergeht“, llms.txt, `sameAs` in `profil.ts` | **offen – erst, wenn humanmedizin-in-zahlen.org live ist** (sonst tote Links) |
| FleXChange | Humanmedizin | Website-Relaunch: „Marktdaten“ im Fuß, Verweis aus Produktseite FLX Suite auf den PVS-Leitartikel | offen, gehört zum FleXChange-Projekt |
| beide | beide | Vergleichsartikel (siehe oben) | offen, Redaktionsplan |

## Was die Tiermedizin bewusst nicht tut

Die Tiermedizin bleibt ein privates Projekt ohne Firmenbezug (kein Petleo, keine FleXChange-Werbung). Sie verlinkt
die Humanmedizin als Schwesterseite desselben Herausgebers, nicht FleXChange.
