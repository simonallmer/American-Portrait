# Crosslink

A game of connections. Nouns sit in the cells; the relations between them sit in
the gutters. The board is a (2N−1)² lattice: for N = 3 that is 5 × 5 — nine nouns,
twelve gutters, four structural corners.

Open it with the `crosslink` launch config (`python3 -m http.server 8812`). The
front page leads to the daily board, the puzzle index, the word list and the
rulebook; every rule below holds at any odd size.

## What the engine implements

**The centre opens.** The board starts empty except for the four verbs around the
middle square and its letter count. The first move is to deduce a four-letter noun
from *"⟶ swims in"*, *"⟵ catches"*, *"↓ hatches into"* and *"↓ becomes, in Latin,"*.
Nothing else on the board is legible until that word lands. One move teaches the
whole format.

**The board unfolds.** A verb surfaces when one of its two nouns is known; a cell
shows its letter count when a solved neighbour reaches it. So the puzzle grows
outward from the centre like a crystal, and the finished grid is a record of the
order you found things in.

**Three gutter states.** Printed (a live verb), hidden (a real relation you cannot
see yet), and barred (no relation is claimed here — the flat dash). Barred gutters
are printed from the start, exactly as a crossword prints its black squares: a
gutter that is dark but *not* barred is itself a clue.

**Verb-first hints.** The ladder is: surface a hidden verb → reveal a letter →
reveal the word. A verb is a route in and costs nothing; letters mark the square,
and the mark is on the board in paler ink, not in a statistics panel.

**Quiet, edge-local error checking.** A gutter turns red only when both of its
nouns are down and the pair cannot both be right. It never says which side is
wrong, and it says nothing at all while a neighbour is still empty.

**Words are used once on a board.** Entering a word already on the board is
refused — but a word may be set in more than one board across the game, and the
Word List carries a number for each place it appears.

**A hyphen is seated for you.** The board only takes A–Z from the keyboard, so a
slot holding anything else — the hyphen in BERNERS-LEE or COCA-COLA — is printed
from the start like a revealed letter that costs nothing. You type the letters
and the hyphen is already there.

**Either English is accepted** (on an English board). Boards and the lexicon are written in British
English; the American spelling is taken on entry and the square keeps whatever
was typed. Only same-length pairs need declaring — CENTRE/CENTER, GREY/GRAY,
DEFENCE/DEFENSE — because the letter count printed on every square already
refuses HARBOR for HARBOUR. The pairs are a written list in `spelling.js`, not a
substitution rule: a rule that swapped -RE for -ER would mark WIER correct for
WIRE, and one that swapped -ISE for -IZE cannot tell PRISE from PRIZE.

**Not every connection is an arrow.** A gutter may be an *equivalence* — a plain
line with no head, reading the same from either end, for a pair where an arrow
would be a lie about which way the fact runs. `HEADLINE — DEADLINE` is the first.

**A connection can turn over.** Where a board gives a gutter a second face,
clicking it turns the sentence over to another way of saying the same join —
sometimes plainer, sometimes only different, sometimes harder. It is free and
counted nowhere: a board solved with every connection turned is solved outright.
That is a category distinction, not leniency — revealing a letter short-circuits
the deduction, and a second sentence about the same relation does not. **Every
board now carries a full set — 159 second faces in all.** Each board declares
what kind of fact its backs hold, so that turning is worth something different
on each: another fact (№1), what the crew knows and a passenger does not (№2),
the working behind the picture (№3), the clock behind the moment (№4), the twist
read from the other trade (№5), plain language for technical (№6).

## The languages

**English is the base language and stays the widest.** The polysemous registry,
the general quarry, the two spellings and every second face on every gutter are
English assets, and none of them is waiting to be translated.

**A board in another language is not this game translated.** It cannot be. A
Crosslink lives on a word meaning two things by accident, and the accidents
belong to the language: German UHU is a horned owl and a tube of glue, because a
firm in Bühl named its adhesives after birds in 1932. There is no English word
that is both, so there is no English board *Verrückte Tiere* is a version of. The
riddles are built from the ground up, in the language, out of that language's own
coincidences — which is the whole reason the format survives the crossing at all.

**Each language is a shelf, and counts its own boards from № 1.** There is an
English No. 1 and a German Brett № 1 and neither waits on the other. The Puzzles
page, the Word List, the daily tile and the nine squares of the front-page emblem
all show one shelf: the one you are reading in. So does the Lexicon — English
BANK and German BANK are two words that happen to be spelled alike, and the game
never says otherwise.

**A language is a directory.** English is the root, the way it is the root of
everything else here, so nothing set in English changes address; German pages sit
under `/de/` and are called `anleitung.html` rather than `rulebook.html`.

**The button is in the toolbar,** beside the sound and the light, and it opens a
list rather than toggling, because two is where this starts and not where it
stops. Changing language turns the page: the whole desktop fades out, every
string is replaced while nothing is legible, and it fades back — only opacity
moves, so the layout never shifts under the reader, and `prefers-reduced-motion`
turns the fade off without turning the button off. The choice is kept for the
session, the same as the theme and for the same reason. English is the default
and is *not* sniffed from the browser: a German reader arriving on six English
boards and one German one is better served by the widest shelf and a button than
by being handed the narrowest without being asked.

**What the engine had to be told.** Two things about a language are not strings.
The first is which letters may be typed into a square — A–Z in English, A–Z and
the three umlauts in German, because a square that will not take an Ä cannot hold
a German word. The second is how much room a sentence needs: German runs longer,
so its gutters are wider and its rows taller, measured off the live board exactly
as the English ones were. That second fact broke a rule that had been true since
the first 5×5 — *wide sheet if size ≥ 5* — because a German 3×3 is 802px of
lattice and the narrow sheet holds 648. The sheet now asks the board how wide it
is rather than how big.

## The boards

**Play Daily** is the day of the week: Monday is No. 1 and Sunday is No. 7, so
the tile turns over at midnight and a board comes round again a week later.
Nothing expires — every board is on the Puzzles page every day. With six boards
on the shelf Sunday falls back to No. 1, and the day a seventh is built the
mapping is exactly Monday to Sunday with no code to change. See H5a. The shelf is
the one for the language you are reading in, so German — one board — has that
board every day, and will have seven the day it has seven.


Every board now opens with the same line — **Written by Simon Allmer** — and
nothing else. The standfirsts used to describe the subject, which handed over
the first deduction a board offers before a square was filled. What replaces
them is colour: each board tints the paper for as long as it is open, sand
through to firebrick, which says a board has a character and says nothing about
what it is. See E27 and A15.


### English — eight

Every one of them passes `tools/check-boards.py` on its own account.
Three used to stand in front of them. *The Centre Is a Fish* and *Worth Its
Weight* were built before §1 of the spec existed and were withdrawn at 2.5
rather than kept as exceptions: between them they broke D1, D2, D4 and E9, and
the first was built on the staged reveal that R0 took away at 1.5.
*Everything Flows* followed them at 3.9, for a different reason — not a rule
broken but a board that did not cohere. Its standfirst promised two worlds,
water and money, and the nine words ran to six: BANK kept the promise, but NOTE
went to music, CURRENT to electricity, VAULT to church masonry, and ORGAN had
no leg in either half at all. See E20. Each time, the boards below renumbered up
into the gap.

| № | Title | Size | Links | Backs | Stars | What it is |
|---|---|---|---|---|---|---|
| 1 | The River of Life | 3×3 | 12/12 | 12 | ★ | The net. No wordplay anywhere on it; every connection is a plain fact, and the only difficulty is which fact goes where. |
| 2 | Water World | 5×5 | 34/40 | 34 | ★ | The long one. Weather across the top, the ship through the middle, the seabed at the bottom. |
| 3 | God’s Batch and Devil’s Crust | 3×3 | 12/12 | 12 | ★ | The easiest board in the game on purpose: nine things you could draw, and no word doing a second job. |
| 4 | Human Nature | 5×5 | 34/40 | 34 | ★★ | A garden, which is already a network before anyone puts a grid on it — twenty-four squares of nature and one man in it with a spade. Turn it and it becomes a set of clocks: three days of blossom, six weeks of bee, a thousand years of topsoil. |
| 5 | Set, Inked and Pulled | 5×5 | 35/40 | 35 | ★★★ | The riddle, and the hardest board here. Metal in the west, newsprint in the east, PRESS in the middle meaning both. |
| 6 | A Fire That Learned to Push | 5×5 | 32/40 | 32 | ★★ | A subject board at full size. Five bands and four arms, with STEAM in the middle. Two stars by hand, not by the scale — see E19. |
| 7 | Crosslink Americana | 5×5 | 40/40 | 40 | ★ | The frontier built large out of the game's own register: TRAIN, BILL, STAR, STRIKE and the rest, five rows of a country settling itself. The frame is the thing — every word is reachable from the centre and the board is one dense national net. |
| 8 | All-American | 3×3 | 6/6 | 0 | ★★ | The first trifecta — R3b. Nine words and the six straight lines through them, three rows and three columns, each line one sentence in its own colour. OUTLAW hideouts raided by a BAND of warriors from a TRIBE; a CORE drilled from ROCK to prove a CLAIM. |

Boards 1 and 5 are two kinds the format admits, and the spec names them as
such under E4a: a *net*, where the pleasure is that everything really is joined
to everything, and a *riddle*, where the pleasure is the twist. Neither is the
lesser kind — but the riddle is the harder one to build, which is the lesson of
*Everything Flows*: a riddle that does not hold one twist all the way across is
not a riddle, it is a pile of puns.

Board 8 is a third kind, R3b: a **trifecta**, where the connection is not a
gutter between two squares but a straight line through three. It carries no
`h`/`v` tables and no barred gutters — its six lines are the whole of its map,
and a diagonal is deliberately not one of them, because a diagonal would have to
borrow a colour a row or a column already wears. It keeps everything else: type
to place, hints reveal a letter then the word, error check on its own switch,
and a closing page of all six sentences.

### German — one

| № | Title | Size | Links | Backs | Stars | What it is |
|---|---|---|---|---|---|---|
| 1 | Verrückte Tiere | 3×3 | 12/12 | 0 | ★★ | Neun Tiere, und keines ist eins. Nine German animals, not one of which means an animal on this board: glue, a queue, a tap, a hangover, a policeman, a constellation, a bow tie, an imperative. HAHN is the centre and four sentences point at it. |

Twelve of twelve gutters are filled, so there is no barred gutter on it and it
therefore explains none. It carries **no second faces**: the 159 backs in this
game are English and only English, each one written by hand, and the engine
already knew what to do without them — no `verb2`, no turn, no dotted rule under
the sentence, rather than an empty offer. That is not a gap waiting to be closed.
It is the difference between a language six boards deep and a language starting
with this one.

It came in from the standalone print edition in *Verrückte Tiere/*, which stays
where it is: that folder is a one-sheet A4 board built by `bauen.py` and is a
different object from a board on the shelf here.

Boards 5 and 6 are a third thing, and E14 names it: a **subject board**, where
the layout itself is the argument. Board 6's rows are a sequence and its arms are
branches, and both are legible before a single square is filled — solve it and
you are not holding twenty-five facts about the industrial revolution, you are
holding one shape. Every clue on a subject board carries the fact it depends on
rather than testing for it, so a solver who knew none of them still reaches every
square, and knows them afterwards.

## The note

Why the game exists, led by a figure: the argument drawn as a graph of labelled
relations, in the manner of *Information Management: A Proposal* and in the
board's own dress — nineteen squares, seventeen wires, every colour and face
lifted from the game rather than invented, and BANK fanned out into four senses
because four arrows off one word argue for polysemy where a sentence about it
can only assert. There is no prose: the figure is the argument, and it fits one
screen. Generated by `tools/make-figure.py`, which refuses to emit a drawing
whose labels or wires collide. Reached by **Shift+S from the front page** and by
nothing else for now. It is deliberately not a fifth tile: the four tiles
are the game, and a note about why there is a game is a different kind of thing.
See A14.

Shift+S gives a board up while you are on one. The two never meet — giving up
has always refused to run anywhere but a board — so the key was free on the
front page.

## The emblem

**Shift+A from the front page.** The masthead at 1:1, filling the frame — a
promotional image of the game rather than a picture of a board. It shares the
banner's recipe (sky, dither, glow, gold) and not its composition: the rays are
laid out for a square, and the type is drawn in the SVG so the whole thing is
one object that scales. See A17.

## Known limitation, and what it implies

The error check compares against the answer key, so it will flag *FISH swims in
WATER* — which is true — as a contradiction. Proving an edge false rather than
merely not-the-answer needs a corpus that holds false relations, not a key. That
corpus is also what makes the archive browsable and what a competitor cannot copy
in a weekend. It is the asset; the mechanic is not.

## Files

```
index.html                  shell
style.css                   the look, light and dark
engine.js                   lattice, edges, visibility rules, rendering
app.js                      state, typing, hint ladder, error check, finish
lang.js                     the interface in each language, and what is not a string
lexicon.js                  the definitions, written by hand
registry.js                 the polysemous quarry
vocabulary.js               the general quarry
lexicon-de.js               the German definitions and the German polysemous quarry
sound.js                    the noises
cursors.css                 the drawn cursors
puzzles/puzzle-*.js         one file per board, in order; puzzle-de-* is the German shelf
tools/check-boards.py       the acceptance test — D1-D4, H2, L1, E9
```

The long prose is *not* in `lang.js`. The rulebook is written out in
`index.html`, once per language, marked `data-lang` — a rulebook is a piece of
writing, and translated key by key it would have come out as English sentences
wearing German words. The German one carries a section the English one does not
need and the English one carries a section the German one does not, which is the
point. Short labels are keyed and live in `lang.js`; a missing key falls back to
English, so a new language may ship half-finished and still be playable.

Adding a puzzle is one file pushed onto `CROSSLINK.puzzles`, plus a `<script>` tag.
A board declares `lang` (`"en"` if it says nothing) and is filed on that shelf:
a grid of nouns, an `h` table of horizontal verbs and
a `v` table of vertical ones, with `null` where a gutter is barred. `dir` names the
subject: `"right"`/`"down"` mean the first noun acts, `"left"`/`"up"` mean the
second one does.

A trifecta (R3b) replaces the two tables with its six lines: `kind: "trifecta"`,
then `tr` for the three row lines and `tc` for the three column lines, each a
`{ dir, color, verb }` where `verb` is a template holding a `_` for every word
after the first. Six lines, six colours, no `null` to bar and no diagonal to
draw; the gutter count rule D4 has nothing to say about a board whose map is
fixed by geometry, so that one check stands down. The engine, the clue panel,
the script window and the closing page read the same `nouns` grid and the same
six sentences as every other board reads its own.

Board geometry follows `size` automatically — cells shrink for a bigger lattice and
the whole board scales to the page, so a 7×7 needs no CSS.
