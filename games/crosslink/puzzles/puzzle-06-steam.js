window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "06-steam",
  lang: "en",
  title: "A Fire That Learned to Push",
  standfirst: "Written by Simon Allmer",
  hue: "red",
  size: 5,
  centre: [2, 2],

  // S7 override, up from the one star the reckoning gives it, and the reason is
  // a hole in the scale rather than a quarrel with this board.
  //
  // `ease` measures how easily a word can be PICTURED. Every word here scores
  // well on that and should: a LOOM, a BOILER, a SHAFT, a FURNACE are all things
  // you can see at once. But picturing a loom is not knowing what a loom does,
  // and this board asks the second thing of nearly every square — that a seam is
  // a band of coal, that a boiler feeds an engine, that a mill stood by a river
  // before steam, that a wheel needs a lip to hold a rail. A reader who is not
  // technical meets a board of familiar objects joined by unfamiliar facts, and
  // the arithmetic cannot see the difference because it only ever looks at the
  // words.
  //
  // Two stars, by hand, from a playtest: the first reader found it hard, and a
  // reader is a better instrument than a formula that was never measuring this.
  // Logged in §14 as E19 — the scale has no term for domain knowledge.
  stars: 2,

  // The second kind of board (E4a), at the largest size the format admits, and
  // built so that the layout itself is the argument. Read it as five bands:
  //
  //   row 0   what is taken out of the ground
  //   row 1   what the ground is turned into
  //   row 2   the machine, with STEAM at the exact centre
  //   row 3   the two things the machine was pointed at — cloth, and distance
  //   row 4   what it cost and what it left behind
  //
  // And as four arms off the centre: the fire to the north, the iron to the
  // west, the railway to the east, the mill and the town to the south. Solve it
  // and you have not learned twenty-five facts, you have learned one shape.
  //
  // Every clue carries its own fact rather than testing for it (E3). The gauze
  // on the lamp, the yard of coal in a mile of seam, the belt from the ceiling,
  // the lip on the wheel, the country agreeing on one clock — a solver who knew
  // none of them can still reach every square, and knows them afterwards. That
  // is the whole argument for the net board: it is not a quiz that happens to be
  // a grid, it is a subject you walk around.
  //
  // The bare eight are bare on purpose. SHAFT to FURNACE, CHIMNEY to ENGINE,
  // LUNG to WHEEL, IRON to COTTON: nothing true and non-trivial joins those
  // pairs, and a gutter filled to make the count is worse than a gutter left
  // open. (D4's ceiling stopped being a failure at 3.3, so 32 is a choice and
  // not a budget; the bars are here because they say something.)
  //
  // Second faces added at 3.7, to E16b's split rather than a blanket softening:
  //
  //   plainer     most of them - "sends its heat up a" for "will not draw
  //               without a", "is dug down to reach a" for "is sunk straight
  //               down until it meets a"
  //   different   same difficulty, another angle - a CHIMNEY that "stands tall
  //               for no reason but" SMOKE; an ENGINE that "chokes its own
  //               driver in a" TUNNEL rather than blackening its roof
  //   harder      COTTON "is strung as warp across a" LOOM and THREAD "is woven,
  //               warp and weft, into" CLOTH, which are the weaver's words and
  //               are meant to be; a LOOM that "beats each row tight into"
  //               CLOTH is what the reed actually does
  //
  // A solver who turns everything gets an easier board in most places and a
  // technical one in the mill, which is the point: you cannot know in advance
  // what is behind, so turning stays a choice.
  nouns: [
    ["LAMP",   "SEAM",    "COAL",    "SMOKE",   "SOOT"],
    ["MINE",   "SHAFT",   "FURNACE", "CHIMNEY", "LUNG"],
    ["IRON",   "BOILER",  "STEAM",   "ENGINE",  "WHEEL"],
    ["COTTON", "LOOM",    "MILL",    "TUNNEL",  "RAIL"],
    ["THREAD", "CLOTH",   "CITY",    "STATION", "CLOCK"]
  ],

  h: [
    [ { verb: "wears gauze so that it can burn in a", verb2: "burns behind wire in a", dir: "right" },
      { verb: "runs for a mile and is a yard of", verb2: "is a flat black band of",                   dir: "right" },
      { verb: "pays for its heat in", verb2: "burns dirty, and the dirt is",                               dir: "right" },
      { verb: "settles on the sill as", verb2: "leaves a black film called",                             dir: "right" } ],
    [ { verb: "is reached by nothing but a", verb2: "drops its cage down a", dir: "right" },
      null,
      { verb: "will not draw without a", verb2: "sends its heat up a",     dir: "right" },
      { verb: "is built tall to carry its dirt past a", verb2: "puts its dirt above a", dir: "right" } ],
    [ { verb: "is riveted, plate to plate, into a", verb2: "is beaten into the shell of a", dir: "right" },
      { verb: "turns still water into moving", verb2: "is kept at pressure, full of",      dir: "right" },
      { verb: "turns heat into motion by way of", verb2: "is only a kettle without",   dir: "left"  },
      { verb: "is worth nothing until it is bolted to a", verb2: "turns, in the end, a", dir: "right" } ],
    [ { verb: "goes in at one end of a", verb2: "is strung as warp across a",              dir: "right" },
      { verb: "was a roof put over the noise of a", verb2: "is a building full of the",   dir: "left"  },
      null,
      { verb: "will not climb, so it is given a", verb2: "goes through a hill by a", dir: "left" } ],
    [ { verb: "goes over and under itself until it is", verb2: "is woven, warp and weft, into", dir: "right" },
      null,
      { verb: "grew, in a single lifetime, around a", verb2: "was built outward from a",   dir: "right" },
      { verb: "is read by a whole platform in a", verb2: "hangs high over the crowd in a", dir: "left" } ]
  ],

  v: [
    [ { verb: "is the only light allowed down a", verb2: "is carried in the hand down a",        dir: "down" },
      { verb: "is sunk straight down until it meets a", verb2: "is dug down to reach a",  dir: "up"   },
      { verb: "is shovelled by the ton into a", verb2: "is burnt, night and day, in a",          dir: "down" },
      { verb: "is a hole built upward for", verb2: "stands tall for no reason but",              dir: "up"   },
      { verb: "finds its way at last into a", verb2: "is breathed in and stays in a",            dir: "down" } ],
    [ { verb: "starts as a rock nobody would look at twice, down a", verb2: "is dug as dull red ore from a", dir: "up" },
      null,
      { verb: "boils a ton of water an hour into", verb2: "is lit for no other end than", dir: "down" },
      null,
      null ],
    [ null,
      { verb: "drives, by a belt from the ceiling, a", verb2: "sends power along a belt to a",          dir: "down" },
      { verb: "stood beside falling water until it was freed by", verb2: "left the river when it got", dir: "up" },
      { verb: "blackens the roof of a", verb2: "chokes its own driver in a",                         dir: "down" },
      { verb: "was given a lip so that it could not leave a", verb2: "keeps to one line, a",   dir: "down" } ],
    [ { verb: "is combed straight and spun into", verb2: "is twisted into a length of", dir: "down" },
      { verb: "turns out nothing but", verb2: "beats each row tight into",            dir: "down" },
      { verb: "drew a village after it until the village was a", verb2: "turned a village into a", dir: "down" },
      null,
      { verb: "made a whole country agree on one", verb2: "ended local time and set one", dir: "down" } ]
  ]
});
