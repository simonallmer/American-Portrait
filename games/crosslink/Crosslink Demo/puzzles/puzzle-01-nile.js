window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "01-nile",
  lang: "en",
  title: "The River of Life",
  standfirst: "Written by Simon Allmer",
  hue: "sand",
  size: 3,
  centre: [1, 1],

  // No wordplay here. The test this board has to pass is E6: each connection
  // carries something only its own answer satisfies. "is the capital of" would
  // fit a hundred countries; "buried its kings in a" fits one.
  //
  // Second faces added at 3.9, and none of them is the front sentence said
  // again. E16b's three legs are all used, but the split here is not the steam
  // board's — that board turned technical language plain, and this one has no
  // technical language to turn. What it has instead is a subject with more true
  // things in it than nine words can hold, so every back is a DIFFERENT FACT
  // about the same pair, and the turn is worth taking for what it tells you
  // rather than for how much easier it makes the square.
  //
  //   plainer     PYRAMID/SAND, NILE/AFRICA - a measurement instead of an image
  //   different   most of them - the Sphinx faces the sunrise, so it faces
  //               Cairo; Egypt kept its dead on the west bank, in the desert;
  //               a camel shuts its nose against a sandstorm
  //   harder      SPHINX/PYRAMID, which asks you to know that the Sphinx was
  //               cut from the quarry the pyramid was cut from, and EGYPT/
  //               PYRAMID, which moves off burial altogether and onto labour:
  //               the builders were housed, fed and paid, and their village
  //               and their bakery have both been dug up
  //
  // That last one was a restatement until 3.10. "Lost every king it ever
  // sealed in a" is the front sentence wearing a different verb — both faces
  // said Egypt puts kings in pyramids. A back that agrees with its front is
  // not a second face, it is the first one again, and E21 now says so.
  //
  // CAIRO/EGYPT is the one to read twice. Cairenes call their city Masr, which
  // is the Arabic for Egypt: the city wears the country's name. On a page that
  // opens with Berners-Lee on words defined only by other words, that is the
  // epigraph turning up inside the puzzle, and it was not planned.
  //
  // It printed as "CAIRO is called, by the people who live in it, simply
  // EGYPT" until 3.10, which is a sentence that is false in the language it is
  // written in. The fact is about two Arabic words; the board is in English,
  // and an English reader is told, flatly, that Cairo is called Egypt. Naming
  // Masr costs six words and makes the claim true as printed — and the fact
  // survives the repair, because the fact was never the English.
  nouns: [
    ["SAND",    "DESERT", "CAMEL"],
    ["PYRAMID", "EGYPT",  "NILE"],
    ["SPHINX",  "CAIRO",  "AFRICA"]
  ],

  h: [
    [ { verb: "is nothing but", verb2: "buries whatever stops moving in", dir: "left" },
      { verb: "goes a week without water in a", verb2: "shuts its nose against the wind of a", dir: "left" } ],
    [ { verb: "buried its kings in a", verb2: "housed and fed, in a village of its own, the men who raised a", dir: "left" },
      { verb: "is farmed along the",   verb2: "measured its years by the flood of the", dir: "right" } ],
    [ { verb: "keeps its riddle outside", verb2: "faces east, and watches the sun come up over", dir: "right" },
      { verb: "stands in the north-east corner of", verb2: "was, for five hundred years, the largest city in", dir: "right" } ]
  ],

  v: [
    [ { verb: "rises out of",    verb2: "was dragged into place over wetted", dir: "up"   },
      { verb: "is nine-tenths",  verb2: "kept its dead west of the river, out in the", dir: "up"   },
      { verb: "drinks from the", verb2: "takes a hundred litres in one stop at the", dir: "down" } ],
    [ { verb: "crouches before a",           verb2: "was cut from the stone left over by a", dir: "up" },
      { verb: "is the dust-blown capital of", verb2: "is called Masr by the people who live in it, which is also the Arabic for", dir: "up" },
      { verb: "is the longest river in",      verb2: "drains one-tenth of",      dir: "down" } ]
  ]
});
