window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "04-orchard",
  lang: "en",
  title: "Human Nature",
  standfirst: "Written by Simon Allmer",
  hue: "green",
  size: 5,
  centre: [2, 2],

  // S7 override, up from the one star the reckoning gives it. Every word here
  // is easy to picture and none of them is doing a second job, which is exactly
  // what `ease` and `twist` measure, so the arithmetic sees an easy board. What
  // it cannot see is that the CONNECTIONS are the work: a squirrel and a trunk
  // are both trivial, and "runs head first down" is the only sentence that
  // joins them. Six bare gutters on top of that leave several squares reachable
  // from one direction only. Two stars, by hand, for the same reason board 06
  // has them — the scale has no term for what a clue asks you to know (E19).
  stars: 2,

  // Retitled from *From the Ground Up* at 3.13. The old title described the
  // layout — soil at the bottom, sky at the top — which the board already shows
  // and a title should not spend itself repeating. *Human Nature* is doing two
  // jobs instead: it is the pun the grid is built on, since twenty-four of these
  // words are nature and the twenty-fifth is the man standing in it with a
  // spade, and it names what the board is actually about. The last connection
  // on it is a gardener planting an orchard he will not eat from, which is not
  // a fact about gardens.
  //
  // Second rewrite, from a playtest. Three faults, all of them rules now:
  //
  //   E10  A clue must not fit a neighbour better than its own answer.
  //        "BARK is the skin of a TRUNK" was hopeless with TREE sitting next to
  //        BARK — and the lexicon says bark is the skin of a tree, so the game
  //        was arguing with itself. "reaches for the SKY" fitted TREE and TRUNK
  //        as well as BRANCH. Both gone.
  //   E11  A clue written as a universal law invites the category, not the
  //        instance. "a TREE bears an" reads as a fact about trees, so the
  //        answer feels like TRUNK or ROOT. Hedged — "may be the kind that
  //        bears an" — it reads as one tree, and the answer can be a fruit.
  //   E12  No plurals. Every square holds one word, so every clue is written
  //        for one thing: "is carried a thousand times into a", not "a
  //        thousand of these".
  //
  // Also cut: blossom on a BRANCH (a stem or a stalk fits as well), a BEE
  // "dusted yellow" (which reads as why bees are yellow, and that is genetics),
  // a SQUIRREL and a TWIG (no association at all), and a SPADE that "turns up"
  // a WORM (which sounds like a volume knob).
  //
  // ---- the second faces, added at 3.12 --------------------------------
  //
  // The last board to get them, and it needed an axis of its own. E21 says each
  // board declares what kind of fact its backs carry, and the five already
  // written had taken the obvious ones: another fact (01), the working behind
  // the picture (03), what the crew knows and a passenger does not (02), the
  // same twist read from the other trade (05), plain language for technical
  // (06). Reaching for any of those here would have produced the one thing this
  // board must not have: the front sentence again in other words.
  //
  // So: THE FRONT IS THE MOMENT, THE BACK IS THE CLOCK.
  //
  // A garden is the only subject on this shelf where everything runs on a
  // different timescale, and the fronts here are all snapshots - a bird asleep
  // on a branch, an apple going into a basket, moss on the wet side of a trunk.
  // Every back puts a clock on the same relation. Blossom is three days to a
  // bee and a whole year to the tree that made it. A worker bee is six weeks. A
  // tree is the best part of a decade to its first apple. An inch of topsoil is
  // a thousand years.
  //
  // Turn the whole board and it stops being a garden you are looking at and
  // becomes a set of clocks running at different speeds inside one another,
  // which is the one thing a front face cannot say however it is written. It
  // also pays off the best line already here - the gardener planting for
  // someone else - by making the whole board about it, and by giving that
  // gutter the longest clock on the board as its back.
  //
  // Three that carry the idea furthest:
  //
  //   SKY/BRANCH     "shows through for half the year only" - that the sky is
  //                  a seasonal fact is something no front face here admits
  //   TREE/BRANCH    "will never lift, by so much as an inch, a" - a tree
  //                  grows from its tips, so a branch stays at the height it
  //                  started at. Most people believe the opposite.
  //   WORM/APPLE     "was left there as an egg before there was an" - the moth
  //                  lays in the young fruit, so the worm predates the apple
  //
  // Two fronts already had a clock in them - BRANCH "is white for one week
  // with" BLOSSOM, and SEED "waits years in the" SOIL - so their backs go the
  // other way rather than deeper into the same measure: the year the tree
  // spends to make that one week, and the century a seed can wait rather than
  // the years.
  nouns: [
    ["TWIG",     "NEST",  "SKY",    "HONEY",   "HIVE"],
    ["SQUIRREL", "BIRD",  "BRANCH", "BLOSSOM", "BEE"],
    ["TRUNK",    "BARK",  "TREE",   "APPLE",   "BASKET"],
    ["MOSS",     "GRASS", "ROOT",   "WORM",    "ORCHARD"],
    ["STONE",    "SOIL",  "SEED",   "SPADE",   "GARDENER"]
  ],

  h: [
    [ { verb: "is carried a thousand times into a", verb2: "is fetched for a fortnight to finish a", dir: "right" },
      { verb: "is a nursery with no roof, open to the", verb2: "is used for one season, then left to the", dir: "right" },
      null,
      { verb: "is robbed from a", verb2: "will still be good in a thousand years, out of a", dir: "right" } ],
    [ null,
      { verb: "will sleep standing on a", verb2: "does not let go all night of a", dir: "right" },
      { verb: "is white for one week with", verb2: "spends a whole year making one week of", dir: "right" },
      { verb: "smells sweet to bring in a", verb2: "has about three days to be found by a", dir: "right" } ],
    [ { verb: "is thickest at the foot of a", verb2: "cracks as it is outgrown by a", dir: "left"  },
      { verb: "belongs to a dog and to a", verb2: "is shed and made again, year on year, by a", dir: "right" },
      { verb: "may be the kind that bears an", verb2: "waits the best part of a decade before its first", dir: "right" },
      { verb: "is picked by hand and laid in a", verb2: "will still be sound at Christmas if it went unbruised into a", dir: "right" } ],
    [ null,
      { verb: "hides most of itself below as", verb2: "replaces, every season, the whole of its", dir: "right" },
      { verb: "makes room for a", verb2: "turns over every inch of a field in twenty years, for a", dir: "left"  },
      null ],
    [ { verb: "is what frost lifts out of the", verb2: "rises one winter at a time out of the", dir: "right" },
      { verb: "may wait years in the", verb2: "can lie a hundred years and still wake in the", dir: "left" },
      { verb: "opens a line for a", verb2: "does in a minute what will take a season, for a", dir: "left" },
      { verb: "leans on a", verb2: "gets thirty years, and sometimes fifty, out of one", dir: "left" } ]
  ],

  v: [
    [ { verb: "snaps under a", verb2: "is only this year's growth, and will not hold a", dir: "down" },
      { verb: "builds a", verb2: "spends a week building, and one season using, a", dir: "up"   },
      { verb: "shows through a", verb2: "is let through for half the year only by a", dir: "down" },
      { verb: "ends up in a jar as", verb2: "must be visited two million times for one jar of", dir: "up"  },
      { verb: "dances directions inside a", verb2: "lives six weeks, and spends most of them inside a", dir: "up" } ],
    [ { verb: "runs head first down a", verb2: "buries more than it will ever find again, at the foot of a", dir: "down" },
      { verb: "hunts grubs under", verb2: "takes in one morning what spent three years under", dir: "down" },
      { verb: "puts out a", verb2: "will never lift, by so much as an inch, a", dir: "up"   },
      { verb: "begins as", verb2: "is a hundred and fifty days on from", dir: "up"   },
      null ],
    [ { verb: "grows on the wet side of a", verb2: "greens again within the hour, after years dry, on a", dir: "up"   },
      null,
      { verb: "sinks a", verb2: "spends its first years making almost nothing but", dir: "down" },
      { verb: "might be found halfway through an", verb2: "was left there as an egg before there was an", dir: "up"   },
      { verb: "goes row by row through an", verb2: "is filled in the three weeks a year that matter to an", dir: "down" } ],
    [ { verb: "gathers on a still", verb2: "is what a hundred years of standing still does to a", dir: "down" },
      { verb: "binds the", verb2: "holds down what took a thousand years to make, the", dir: "down" },
      { verb: "lets down a", verb2: "sends down, before anything shows above, a", dir: "up"   },
      { verb: "brings up, without meaning to, a", verb2: "undoes in one turn a season's work by a", dir: "up" },
      { verb: "plants, for someone else, an", verb2: "will be under the ground before the best year of an", dir: "up" } ]
  ]
});
