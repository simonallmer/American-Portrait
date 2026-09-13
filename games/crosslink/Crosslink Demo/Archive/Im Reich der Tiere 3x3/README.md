# Im Reich der Tiere — 3×3

Das kleine Brett: neun Tiere, elf von zwölf Verbindungen, ein Balken. Nur das
Wesentliche — vom Eis über den Fluss auf die Weide, und keines steht für sich.

```
BRAUNBÄR   EISBÄR   PINGUIN
LACHS      ROBBE    SCHWAN
WOLF       HUND     SCHAF
```

```
9 Tiere · 11 von 12 Verbindungen · 1 Balken · 11 Rückseiten · ★
D1 ✓  D2 ✓  D3 ✓  D4 ✓ (11 liegt in 10–12)  E9 ✓  H2 ✓  T ✓
```

## Die Dateien

```
brett.json                       das Brett: Wörter, Verben, beide Seiten. Die einzige Quelle.
Im Reich der Tiere.html          ← das Spiel. Eine Datei, kein Server, nichts drumherum.
Im Reich der Tiere.pdf           ← vier Seiten A4 quer: Brett, Rückseiten, Lösung, Satzliste
Im Reich der Tiere — Druckbogen.html
```

Gebaut wird aus dem Nachbarordner, wo Vorlagen und Engine liegen:

```
python3 "../Im Reich der Tiere/bauen.py"   . --pdf
python3 "../Im Reich der Tiere/pruefen.py" .
python3 "../Im Reich der Tiere/pruefen.py" . --saetze
```

## Wie es gebaut ist

**In der Mitte steht die ROBBE**, fünf Buchstaben, und drei Sätze zeigen darauf.
Der erste Zug ist der Name: *„trägt in einem ihrer beiden Namen ein ganz anderes
Tier: einen HUND“* — der Seehund. Das ist die eine Wort-Verbindung, die sich das
Brett nimmt (E17), und sie ist zugleich das Scharnier: sie hält die Wasserhälfte
oben und die Weidehälfte unten zusammen. Ihre Rückseite macht aus dem Wortspiel
eine Beobachtung: *„bellt auch so, wenn sie auf einem Felsen liegt, wie ein
HUND.“*

Der **Rand ist ein geschlossener Ring** — alle acht Außenverbindungen stehen, von
BRAUNBÄR über EISBÄR, PINGUIN, SCHWAN, SCHAF, HUND, WOLF und LACHS zurück. Damit
führt zu jedem Feld mehr als ein Weg (D2), und man kann an jeder Ecke anfangen.

Der einzige **Balken** liegt zwischen ROBBE und SCHWAN: da wird nichts behauptet.

## Zwei Dinge, die auf dem Brett stehen und nicht offensichtlich sind

**Eisbär und Braunbär sind zwei verschiedene Arten** — *Ursus maritimus* und
*Ursus arctos* —, nicht ein Bär in zwei Fellfarben. Richtig, und erstaunlicher,
ist: sie sind so nah verwandt, dass ihre gemeinsamen Jungen selbst wieder Junge
bekommen (Grolar, Pizzly), und der Eisbär stammt vom Braunbären ab. So steht es
vorne und hinten auf dem Brett.

**Hund und Wolf dagegen sind wirklich dasselbe Tier** (*Canis lupus*, der Hund
als zahme Unterart). Die beiden Verbindungen stehen mit Absicht auf demselben
Brett: sie sehen gleich aus und sind es nicht.

## Was nicht hineinpasste, und warum

Hund–Wolf, Wolf–Schaf und Hund–Schaf wären ein Dreieck, und ein Gitter hat keine
Dreiecke: jedes Feld hat Nachbarn oben, unten, links, rechts — nie über Eck.
Zwei von dreien gehen immer, alle drei nie.

Gebaut sind Wolf–Hund und Hund–Schaf; die dritte, der Wolf reißt das Schaf,
steht auf der Rückseite von HUND → SCHAF, wo sie schärfer ist als vorne:

> vorne: *HUND läuft im Kreis um die Herde und bringt heim jedes SCHAF.*
> hinten: *HUND bewacht heute, was seine wilden Verwandten reißen: ein SCHAF.*

Die große Fassung mit 25 Tieren — mit Krokodil, Elefant, Spinne und dem Menschen
in der Mitte — liegt im Nachbarordner *Im Reich der Tiere*.
