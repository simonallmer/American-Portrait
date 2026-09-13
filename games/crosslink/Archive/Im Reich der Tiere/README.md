# Im Reich der Tiere — 5×5

Die lange Fassung, und zugleich die Werkstatt: Vorlagen, Engine und die beiden
Skripte liegen hier und bauen auch *Im Reich der Tiere 3x3* nebenan (neun Tiere,
nur das Wesentliche, ohne den Menschen) und *Verrückte Tiere* eine Ebene höher
(neun Wörter, die Tiere sind und keine meinen).
Ein Brett ist ein Ordner mit einem `brett.json`; alles andere wird gebaut.

> **Achtung, die Werkstatt liegt im Archiv.** Dieser Ordner ist nach `Archive/`
> gewandert, die Engine aber wird weiter gebraucht: *Verrückte Tiere* baut aus
> `Archive/Im Reich der Tiere/bauen.py`. Wer die Bretter trennen will, verschiebt
> `bauen.py`, `pruefen.py`, `spiel.js` und die beiden Vorlagen in einen eigenen
> Ordner — sie hängen an nichts außer dem `brett.json`, das ihnen übergeben wird.

Ein deutsches Crosslink-Brett, 5×5, außerhalb der Reihe gebaut: die Boards in
`puzzles/` sind englisch (W1), dieses ist es nicht, deshalb steht es in einem
eigenen Ordner und nicht in der Registry. Die Regeln sind trotzdem die des
Spiels — `pruefen.py` ist `tools/check-boards.py` auf dieses Brett gebogen und
läuft grün.

```
25 Tiere · 32 von 40 Verbindungen · 8 Balken · 32 Rückseiten · ★★
D1 ✓  D2 ✓  D3 ✓  D4 ✓ (32 liegt in 28–34)  E9 ✓  H2 ✓  T ✓
```

## Die Dateien

```
brett.json                       das Brett: Wörter, Verben, beide Seiten. Die einzige Quelle.
spiel.js                         die Engine dieses Bretts, für sich allein lauffähig
vorlage-spiel.html               Hülle für das Spiel     (__BRETT__, __SPIEL__, __WIDMUNG__)
vorlage-druck.html               Hülle für den Bogen     (vier Seiten A4 quer)
bauen.py                         baut beides; --pdf zieht den Bogen durch Chrome
pruefen.py                       der Abnahmetest; --saetze druckt alle 64 Sätze zum Lesen

Im Reich der Tiere.html          ← das Spiel. Eine Datei, nichts drumherum, kein Server.
Im Reich der Tiere — Druckbogen.html
Im Reich der Tiere.pdf           ← vier Seiten: Brett, Rückseiten, Lösung, Satzliste
```

Alles wird aus `brett.json` gebaut, damit Spiel und Druck nie auseinanderlaufen:

```
python3 bauen.py --pdf                        # dieses Brett
python3 pruefen.py --saetze                   # und seine 64 Sätze

python3 bauen.py "../Im Reich der Tiere 3x3" --pdf     # das kleine
python3 pruefen.py "../Im Reich der Tiere 3x3"

python3 bauen.py "../../Verrückte Tiere" --pdf         # das mit den Wortspielen
python3 pruefen.py "../../Verrückte Tiere"
```

Die Dateinamen der Ausgabe folgen dem `title` des Bretts, damit mehrere Bretter
nebeneinander liegen können; ebenso der Platz im `localStorage`, der jetzt aus
der `id` gebildet wird statt aus einem festen Namen — sonst räumt das zweite
Brett den Stand des ersten weg, sobald man es öffnet.

Was von der Größe abhängt — die Maße des Gitters, die Zahlen im Text, die
Spalten der Satzliste, die Sterne — steht in `MASSE` und `zahlen()` in
`bauen.py` und wird eingesetzt. In den Vorlagen steht keine Zahl.

## Was ein Brett selbst mitbringt

Drei Felder in `brett.json` steuern, wie viel Vorlage überhaupt gedruckt wird.
Alles davon ist optional; was fehlt, fällt weg, statt leer dazustehen:

```
widmung    leer  → die Zeile am Fuß entfällt                (<!--WIDMUNG-->)
notiz      leer  → der Absatz unter dem Brett entfällt       (<!--NOTIZ-->)
verb2      nirgends gesetzt → keine Rückseiten               (<!--RUECK-->)
alle Gassen belegt → kein Wort über Balken                   (<!--BALKEN-->)
kein Ä, Ö, Ü in den Wörtern → kein Wort über Umlaute         (<!--UMLAUT-->)
einseitig  true  → der Bogen ist nur das Brett          (<!--MEHRSEITIG-->)
```

`einseitig` betrifft allein den Druckbogen: eine Seite, das leere Brett, sonst
nichts — keine Rückseiten, keine Lösung, keine Satzliste. Die Fußzeile zählt
dann auch keine Seiten mehr, sondern heißt nur noch *Das Brett*. Im Spiel ändert
sich nichts; wer dort die Antwort will, nimmt *Wort zeigen* oder Shift + S.

Die letzten beiden liest `bauen.py` selbst aus dem Brett, sie stehen in keinem
Feld. Ein Brett, auf dem jedes Feld an allen seinen Nachbarn hängt, erklärt
keinen grauen Balken; ein Brett ohne Umlaute erklärt nicht, wie man sie tippt.
Beides stand vorher fest in der Vorlage und log auf einem Brett, das es nicht
betraf.

Dazu eine Marke an der einzelnen Verbindung: `"neu": true` färbt sie rot — im
Spiel, im Druckbogen und in der Satzliste. Das ist die Werkstattfarbe für einen
Satz, der noch nicht vom Autor stammt; das Feld streichen und neu bauen macht ihn
wieder schwarz.

Ohne Rückseiten verschwinden der Knopf *Alle umdrehen*, die Zeile darüber in der
Anleitung, die zweite Seite des Druckbogens, die zweite Zeile in der Satzliste
und der Schlusssatz im Gewonnen-Fenster; die Seiten des Bogens zählen dann von
selbst 1–2–3 statt 1–2–3–4. Gebaut ist das so im Ordner *Verrückte Tiere*.

Der Absatz `notiz` (`titel` und `text`, HTML erlaubt) steht unter dem Brett im
Spiel. Er gehört dem Brett, nicht der Vorlage — der Bären-Absatz weiter unten
steht deshalb jetzt in den beiden `brett.json` und nicht mehr in
`vorlage-spiel.html`.

## Ein Wort ins Feld setzen

Übernommen aus dem großen Spiel (`app.js`): das getippte Wort steht **erst dann
im Feld, wenn man es einträgt** — mit Enter oder mit dem Knopf *Wort eintragen*,
der grau bleibt, solange ein Buchstabe fehlt. Vorher sprang das Wort von selbst
ins Feld, sobald der letzte Buchstabe fiel; das nahm einem den Moment, in dem
man es noch einmal ansieht, und machte jeden Tippfehler sofort zur roten
Fehlmeldung. Steht das Wort, heißt der Knopf *Wieder wegnehmen* und hebt es auf:
nichts ist endgültig, und ein Feld, das man wieder wegnimmt, behält die
Buchstaben, die es schon verraten hat. Backspace tut dasselbe, genau wie
`back()` im großen Spiel.

## Shift + S

Löst das ganze Brett auf einmal: jedes Feld bekommt sein Wort und gilt als
gegeben, wie `giveUp()` im großen Spiel. Zwei Tasten, und zwar aus demselben
Grund wie dort — ein bloßes S hätte beim ersten Vertippen das ganze Rätsel
weggeworfen, und dieser Zug ist der eine, der nicht zurückgeht. Er greift mit
und ohne ausgewähltes Feld; das S landet nicht im Feld, weil der Griff vor dem
Tippen liegt. Danach hilft nur *Von vorn*.

Wer so endet, bekommt im Schlussfenster nicht die Zahl 0 vorgehalten, sondern
den Satz *„Das ganze Brett, gegeben."*

## Das Ende

Wer das Brett löst, bekommt ein Fenster mit zwei Knöpfen: *Brett ansehen* legt es
weg, *Von vorn* räumt das Brett leer. Der zweite ist der wichtigere. Vorher stand
im Fenster nur *Brett ansehen*, und weil ein gelöstes Brett im `localStorage`
liegt, kam es bei jedem Aufruf gelöst und mit offenem Fenster zurück — das
Fenster deckt die Seite ab, also war der Knopf *Von vorn* in der Werkzeugzeile
gar nicht erreichbar. Das gelöste Brett klebte im Browser fest. Beide Wege
laufen jetzt durch dieselbe Funktion, die auch die Marke `data-shown` löscht,
damit das Fenster beim nächsten Mal wieder aufgehen kann.

Darunter steht der Weg zu den anderen Brettern:
<https://simonallmer.com/crosslink>.

## Der Name

Unter dem Titel steht in Spiel und Druck **Erstellt von Simon**; das ist die
Zeile der Reihe und steht in den beiden Vorlagen, nicht im Brett.

`brett.json`, zwei Felder ganz oben — `widmung` steht am Fuß des Spiels und auf
der Lösungsseite, `fuer` in der Fußzeile des Drucks. Ändern, `python3 bauen.py
--pdf` laufen lassen, fertig. Ist `widmung` leer, fällt die Zeile ganz weg statt
leer gedruckt zu werden; so ist das kleine Brett gebaut.

## Was auf dem Brett steht

In der Mitte steht **MENSCH**, und das ist die Pointe: vierundzwanzig Tiere und
einer, der glaubt, er sei keines. Vier Sätze zeigen auf die Mitte, und mit
*„teilt sein Feuer seit fünfzehntausend Jahren mit einem …“* ist der erste Zug
zu machen, ohne ein einziges anderes Feld zu kennen.

Die Ränder sind Landschaften: oben das Eis und die Vögel, rechts das Meer von
oben nach unten (PINGUIN, WAL, HAI, KRAKE), unten das Kleine und das Fremde,
links die Kette, die jeder kennt — EULE, KATZE, MAUS, und der ELEFANT, der
angeblich vor ihr erschrickt.

**Der Hund ist das Scharnier.** Vier Verbindungen laufen bei ihm zusammen: der
Mensch, von dem er das Feuer hat; der Wolf, der dieselbe Art ist; das Schaf, das
er bewacht; die Katze, mit der er sich sprichwörtlich nicht verträgt.

## Die Rückseiten

Jede der 32 Verbindungen lässt sich umdrehen, und alle 32 haben eine zweite
Seite. Die Achse (E21) heißt hier: **vorne die Szene, hinten der Satz, den man
kaum glaubt.** Der Eisbär riecht die Robbe unter einem Meter Schnee. Der Wal hat
eine Zunge, die schwerer ist als ein ausgewachsener Hai. Das Krokodil ist mit
einem Huhn näher verwandt als mit einem Frosch. Der schwarze Schwan galt für
unmöglich, bis jemand Australien fand.

Zwei Rückseiten sind Sonderfälle: die von SPINNE → FLIEGE ist die eine
Wort-Verbindung, die das Brett sich nimmt (E17) — beide Tiere heißen nach dem,
was sie tun. Und die Rückseite von HUND → SCHAF trägt die Gefahr, für die auf
dem Gitter kein Platz war, siehe unten.

## Zwei Dinge, die du wissen solltest

**1. Eisbär und Braunbär — die Behauptung stimmt so nicht.**
„Von der Tierart ein andersfelliger Braunbär“ wäre falsch: *Ursus maritimus* und
*Ursus arctos* sind **zwei verschiedene Arten**. Richtig ist das Erstaunlichere:
sie sind so nah verwandt, dass ihre gemeinsamen Jungen selbst wieder Junge
bekommen können (Grolar, Pizzly), und der Eisbär stammt vom Braunbären ab. So
steht es jetzt auf dem Brett, vorne und hinten.

Der Gegenfall liegt zwei Felder weiter: **Hund und Wolf sind wirklich dieselbe
Art** (*Canis lupus*, der Hund als zahme Unterart). Die beiden Verbindungen
sehen gleich aus und sind es nicht — das ist der beste Satz, den das Brett
nebenbei beibringt.

**2. Von deinen vier Verbindungen um Hund, Wolf und Schaf gehen nur drei.**
Du wolltest MENSCH–HUND, HUND–WOLF, WOLF–SCHAF *und* HUND–SCHAF. Die letzten
drei wären ein Dreieck, und ein Gitter hat keine Dreiecke: jedes Feld hat nur
Nachbarn oben, unten, links, rechts, nie über Eck. Zwei von dreien gehen immer,
alle drei nie.

Gebaut ist deshalb der Stern mit dem Hund in der Mitte — MENSCH–HUND, HUND–WOLF,
HUND–SCHAF —, und die vierte, WOLF reißt ein SCHAF, steht auf der Rückseite von
HUND → SCHAF, wo sie ohnehin am schärfsten ist:

> vorne: *HUND läuft im Kreis um die Herde und bringt heim jedes SCHAF.*
> hinten: *HUND bewacht heute, was seine wilden Verwandten reißen: ein SCHAF.*
