# Verrückte Tiere — 3×3

Neun Tiere, und keines ist eins. In jedem Feld steht ein Wort, das im Tierbuch
steht und im Alltag etwas ganz anderes meint: Klebstoff, Warteschlange,
Wasserhahn, Kopfweh, Polizist, Sternbild, Schleife unterm Kinn, ein Befehl.

```
MAUS       SCHLANGE   KREBS
UHU        HAHN       TAUBE
FLIEGE     KATER      BULLE
```

```
9 Tiere · 12 von 12 Verbindungen · kein Balken · keine Rückseiten · ★★
D1 ✓  D2 ✓  D3 ✓  D4 ✓ (12 ist die Obergrenze)  E9 ✓  H2 ✓  T ✓
10 Sätze vom Autor, wortgleich · 2 übernommene (SCHLANGE → HAHN, TAUBE → BULLE)
```

**Der Bogen ist einseitig und ohne Lösung** (`"einseitig": true`): eine Seite A4
quer, das leere Brett und die Sätze auf den Strichen. Wer die Antwort will,
nimmt sie im Spiel — *Wort zeigen*, oder Shift + S für das ganze Brett.

**Jedes Feld hängt an allen seinen Nachbarn.** Zwölf von zwölf Gassen sind
belegt, es gibt keinen Balken; deshalb erklärt dieses Brett auch keinen. Ebenso
kommt in keinem der neun Wörter ein Ä, Ö oder Ü vor, also steht auch nichts über
Umlaute in der Anleitung — beides entscheidet `bauen.py` aus dem Brett heraus.

## Die Dateien

```
brett.json                       das Brett: Wörter, Verben, Richtungen. Die einzige Quelle.
Verrückte Tiere.html             ← das Spiel. Eine Datei, kein Server, nichts drumherum.
Verrückte Tiere.pdf              ← eine Seite A4 quer: das Brett, sonst nichts
Verrückte Tiere — Druckbogen.html
```

Gebaut wird aus der Werkstatt, die im Ordner *Archive/Im Reich der Tiere* liegt:

```
python3 "../Archive/Im Reich der Tiere/bauen.py"   . --pdf
python3 "../Archive/Im Reich der Tiere/pruefen.py" . --saetze
```

## Die elf Sätze

```
MAUS      → SCHLANGE  stellt sich hinter Reptilien an und wird dabei selbst Teil der
SCHLANGE  → KREBS     weicht im seichten Wasser den Scheren aus vom
UHU       — HAHN      erblickt nur einen schlafenden
SCHLANGE  → HAHN      steht im Festzelt und wird nur kürzer durch einen zweiten
TAUBE     → HAHN      hören nicht das Krähen vom lauten
KATER     → FLIEGE    ist in modebewusster, gestiefelter Form auch anzutreffen mit
BULLE     → KATER     sorgt, aus beruflichen Gründen, für den Aufhalt und Entzug von Herr
UHU       → MAUS      sorgt bei Falschanwendung zum Cursorstillstand der
KREBS     → TAUBE     steht in den schicksalhaften Sternen über jedem weltlichen Flug einer
FLIEGE    → UHU       kann, als Befehl verstanden, ausgeführt werden vom
HAHN      → KATER     spendet Leitungswasser zur Vertreibung des
TAUBE     → BULLE     hält im Rat den Zins tief; darüber freut sich an der Börse der
```

Zehn davon sind die Sätze des Autors, Wort für Wort; gedreht ist nur die
Stellung, weil die Engine den Satz um das Feld herum baut und deshalb das
Subjekt vorn und das Objekt hinten braucht. Zwei — SCHLANGE → HAHN und
TAUBE → BULLE — sind übernommen und eingelockt.

**UHU — HAHN ist die eine Verbindung ohne Pfeilspitze.** Sie gilt in beide
Richtungen, weil sie in beide Richtungen wahr ist: der eine sieht den anderen
immer nur schlafend, und umgekehrt genauso. Ein Pfeil wäre hier eine Lüge.

## Wie es gebaut ist

**In der Mitte steht der HAHN**, vier Buchstaben, und vier Sätze zeigen darauf —
als Zapfhahn, als Wasserhahn, als Vogel, der kräht, und als der, der immer
schläft, wenn der andere wach ist. Das ist die Mitte, weil an ihr das Prinzip
des Bretts am deutlichsten steht: dasselbe Wort, vier Bedeutungen.

Der **Rand ist ein geschlossener Ring** — MAUS, SCHLANGE, KREBS, TAUBE, BULLE,
KATER, FLIEGE, UHU und zurück. Alle acht Außenverbindungen stehen, dazu alle
vier Speichen zur Mitte (SCHLANGE, UHU, TAUBE, KATER). Damit führt zu jedem Feld
mehr als ein Weg (D2), und man kann an jeder Ecke anfangen.

**Keinen Balken.** Auf den anderen Brettern heißt eine graue Sprosse: hier wird
nichts behauptet. Hier ist jede Gasse belegt, also gibt es die Sprosse nicht und
auch nicht den Satz, der sie erklärt.

**Keine Rückseiten.** Dieses Brett hat nur eine Seite pro Verbindung. Die Engine
weiß das: ohne `verb2` fallen der Umdrehen-Knopf, die Rückseiten-Seite des
Druckbogens und die zweite Zeile der Satzliste weg, statt leer dazustehen.

## Was nicht hineinpasste, und warum

Aus der Vorlage waren neun Verbindungen vorgegeben. Fünf davon bilden einen
Kreis über fünf Felder:

```
KREBS — TAUBE — HAHN — KATER — BULLE — KREBS
```

**Ein Gitter kann keinen Kreis über eine ungerade Zahl von Feldern.** Färbt man
das Brett wie ein Schachbrett, so wechselt jeder Schritt die Farbe; wer nach
einer ungeraden Zahl von Schritten wieder am Anfang stehen will, müsste auf der
anderen Farbe landen als der, von der er losging. Vier gehen, fünf nie — egal
wie man die neun Wörter dreht.

Draußen bleibt deshalb **BULLE → KREBS** (der Optimist am Kapitalmarkt, der in
Medikamente investiert): die einzige der fünf, die aus zwei Sätzen besteht, und
die einzige, die den BÄR nennt, den es auf dem Brett nicht gibt. Jede der
anderen vier ginge genauso — dann stellt sich das Gitter anders auf, und die
zwölfte Gasse liegt woanders.

Zwölf von zwölf Gassen sind trotzdem belegt: der Satz fehlt nicht, weil kein
Platz mehr wäre, sondern weil BULLE und KREBS in dieser Aufstellung keine
Nachbarn sind — sie stehen in derselben Spalte, mit der TAUBE dazwischen. Kein
Feld auf dem Brett wartet auf etwas; nur diese eine Behauptung hat kein Feldpaar
mehr gefunden, an das sie sich hängen könnte.
