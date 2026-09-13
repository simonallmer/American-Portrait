window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "03-bread",
  lang: "en",
  title: "God\u2019s Batch and Devil\u2019s Crust",
  standfirst: "Written by Simon Allmer",
  hue: "crust",
  size: 3,
  centre: [1, 1],

  // The easiest board in the game on purpose: every word is one you could draw,
  // every connection is one step, and no word is doing a second job.
  //
  // An earlier draft had BREAD and LOAF on the same board — two words for one
  // thing — and made CRUST something bread turns into, which it is not: a crust
  // is part of a loaf, not its successor. Both are gone. So is a knife that was
  // there to be scored with, which meant nothing to anyone who has not watched a
  // baker slash a loaf before it goes in.
  //
  // Second faces added at 3.9. The front of this board is the picture of
  // baking; the back is the WORKING of it, which is a different thing and the
  // reason the turn is worth taking here. Front: yeast lifts dough. Back: yeast
  // eats the sugar in it and breathes gas into it. Front: heat kills yeast.
  // Back: heat gives it one last push first, which is oven spring, and is why a
  // loaf is bigger than the dough that went in.
  //
  //   plainer     DOUGH/LOAF - "is left to rise twice before it is a" says the
  //               step count out loud, which the front does not
  //   different   most of them - a peel, a two-in-the-morning start, an oven
  //               that holds heat after the fire is raked out rather than
  //               making any
  //   harder      BAKER/FLOUR and DOUGH/FLOUR are the trade's own language, the
  //               way the steam board puts the weaver's words in the mill: a
  //               baker really does call every other weight a percentage of the
  //               flour, and dough really does get all its stretch from
  //               protein. CRUST/OVEN wants the cup of water thrown in at the
  //               start, which is the one thing on this board a home baker
  //               tends not to know.
  //
  // The knife stays out (see above) and so does anything needing a thermometer.
  // A back that cannot be pictured has no business on the easiest board.
  nouns: [
    ["WATER", "YEAST", "HEAT"],
    ["FLOUR", "DOUGH", "OVEN"],
    ["BAKER", "LOAF",  "CRUST"]
  ],

  h: [
    [ { verb: "wakes in",   verb2: "is asleep in the packet until it meets", dir: "left"  },
      { verb: "kills",      verb2: "gives a last push to, and then kills,",  dir: "left"  } ],
    [ { verb: "is made of", verb2: "gets all its stretch from the protein in", dir: "left"  },
      { verb: "goes into an", verb2: "is slid off a long wooden peel into an", dir: "right" } ],
    [ { verb: "shapes a",   verb2: "has been awake since two in the morning for a", dir: "right" },
      { verb: "wears a",    verb2: "keeps its colour, and most of its taste, in the", dir: "right" } ]
  ],

  v: [
    [ { verb: "takes",   verb2: "will drink two-thirds its own weight in", dir: "up"   },
      { verb: "lifts",   verb2: "eats the sugar in, and breathes gas into,", dir: "down" },
      { verb: "throws",  verb2: "holds, long after the fire is raked out, its", dir: "up"   } ],
    [ { verb: "weighs",             verb2: "calls every other weight a percentage of the", dir: "up"   },
      { verb: "is shaped into a",   verb2: "is left to rise twice before it is a", dir: "down" },
      { verb: "hardens in an",      verb2: "comes out glossy only if steam is thrown into an", dir: "up"   } ]
  ]
});
