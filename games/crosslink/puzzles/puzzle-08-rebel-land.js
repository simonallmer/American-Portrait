window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "08-rebel-land",
  lang: "en",
  title: "Rebel Land",
  standfirst: "Written by Simon Allmer",
  hue: "america",
  kind: "trifecta",
  theme: "american",
  stars: 1,
  size: 3,
  centre: [1, 1],

  // A trifecta board. Nine nouns stand in a 3x3 grid and the connections are
  // the six straight lines: three rows and three columns. Each line is one
  // sentence about all three of its words, and each line carries its own colour
  // so the six of them can be told apart at a glance. There are no diagonals on
  // this board — a diagonal would have to borrow a colour someone already wears.
  //
  // `tr` is the three row lines and `tc` the three column lines. `dir` names the
  // reading order, so "right"/"down" mean the first-listed word is the subject
  // of the sentence and "left"/"up" mean the last one is. `verb` is a template:
  // the first word is stated, and each `_` is a word seat filled by the next
  // word in the line, reading order. So row one reads,
  //
  //   OUTLAW hideouts were often raided by a BAND of warriors from a local TRIBE.
  //
  // On the board the sentence is split at its `_` seats and each stretch is
  // written on the wire between the two words it joins, so it reads across the
  // two coloured lines with the middle word seated between them — the same way
  // any other gutter in the game carries its verb between two squares.
  //
  // The board is solved exactly as any other: every square takes a word, the
  // two sentences that pass through it are the two routes in, and once all nine
  // are down the board is closed.
  nouns: [
    ["OUTLAW",        "BAND",   "TRIBE"],
    ["CORE",          "ROCK",   "CLAIM"],
    ["ESTABLISHMENT", "STAR",   "RESERVATION"]
  ],

  tr: [
    { axis: "h", i: 0, dir: "right", color: "r0", verb: "hideouts were often raided by a _ of warriors from a local _" },
    { axis: "h", i: 1, dir: "right", color: "r1", verb: "samples are drilled from deep _ to prove the gold value of a mining _" },
    { axis: "h", i: 2, dir: "right", color: "r2", verb: "with at least one _ usually requires an advance _" }
  ],

  tc: [
    { axis: "v", i: 0, dir: "down", color: "c0", verb: "factions threaten the very _ of the political _" },
    { axis: "v", i: 1, dir: "down", color: "c1", verb: "playing hard _ often breaks up when the lead singer becomes a _" },
    { axis: "v", i: 2, dir: "down", color: "c2", verb: "must file a legal land _ to establish the borders of a sovereign _" }
  ]
});
