window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "02-landfall",
  lang: "en",
  title: "Water World",
  standfirst: "Written by Simon Allmer",
  hue: "blue",
  size: 5,
  centre: [2, 2],

  // A 5x5 built to the rule board 02 broke: nothing hangs from a single link.
  // Weather at the top, the ship through the middle, the seabed at the bottom.
  // The connections are written to different shapes on purpose — a board of
  // "rides a / carries a / hauled by a" is a board nobody remembers a line from.
  //
  // Retitled from *Landfall* at 3.10, and three sentences repaired with it:
  //
  //   GALE -> GLASS at (0,3), under E23. A gale is a storm that has not been
  //     promoted, and STORM was sitting one row down and one column over, so
  //     the grid offered two homes for every heavy-weather clue and "is a hard
  //     WIND" was closer to a definition than a connection. GLASS is the
  //     barometer — not a weather word but the instrument that reads one — so
  //     the column keeps its subject and loses the synonym.
  //   "CLOUD puts out the MOON" -> "slides across the face of the". To put out
  //     a light is to extinguish it, and a cloud does no such thing; it passes
  //     in front. The old verb borrowed the wrong physics for the sake of a
  //     short line.
  //   "REEF makes a WRECK" -> "opens a hull below the waterline and leaves a".
  //     True either way, but *makes* is a manufacturing verb and says nothing
  //     about how a reef does it.
  //
  // And the back of that same gutter went at 3.11, for three faults at once.
  // It read "shows nothing at all at the hour it makes a WRECK", meaning that a
  // reef with just enough water over it does not break white and so gives no
  // warning. That much is true. But the tide will not support the sentence: the
  // hour a reef is shallowest is low water, and low water is also the hour it is
  // most likely to show, so the moment of most danger and the moment of least
  // warning do not reliably coincide. "At the hour" was then vague enough that a
  // reader took the whole line for cryptic wordplay — fatal on a board whose one
  // promise is that every sentence is plainly true. Worst of the three, "makes
  // a" WAS the front verb until it was replaced above, so the back had quietly
  // fossilised the sentence it was supposed to be the alternative to.
  //
  // The first replacement was worse in a way peculiar to this game. "Was put on
  // the chart only after its first WRECK" is true, but CHART is a word that
  // leads two lives, and a board that spends its whole time teaching you to
  // look for second senses had trained the reader to find the wrong one: it
  // read as a record going up the charts. A polysemous word used for only one
  // of its senses is a liability HERE that it would not be anywhere else.
  //
  // The second attempt was ambiguous rather than wrong: "was marked, before it
  // was lit, by an older WRECK" puts "lit" next to "by an older WRECK", and the
  // reader attaches them — a wreck setting fire to a reef, underwater. An
  // interpolated clause that lands between a passive verb and its agent will be
  // read as the agent of the wrong verb, every time.
  //
  // What stands now has one reading only. Before a rock was lit, the thing that
  // warned you off it was whatever had already died on it, so the back says
  // what the front cannot and hands to BEACON two squares away, which is lit
  // against this same reef and took over the job.
  //
  // Second faces on all thirty-four, added at 3.9. The front of this board is
  // what a passenger sees; the back is what the crew knows, and that is the
  // whole organising idea rather than E16b's usual three legs applied at
  // random. A passenger sees a ship drop an anchor. A sailor knows it is the
  // seven lengths of chain behind it that hold, and that the anchor has to be
  // dragged along the bottom before it digs in at all.
  //
  //   plainer     ANCHOR/SEABED, TIDE/SHORE, ANCHOR/DECK - a mechanism or a
  //               measurement where the front had an image
  //   different   the weather row, mostly - a moon fifty minutes late every
  //               day and a tide fifty minutes behind it; a cloud that
  //               flattens at the top once it is a storm; a storm whose swell
  //               arrives a day before the storm does
  //   harder      the rigging - halyards and sheets, ratlines, mast wedges,
  //               and the fact that a knot costs a rope half its strength.
  //               These are the sailor's own words, put in deliberately, the
  //               way the steam board puts the weaver's words in the mill.
  //
  // SAILOR/KNOT is the one to read twice: the unit is named after actual knots
  // in a line paid over the stern and counted against a sandglass. A word that
  // still carries the object it was measured with is the epigraph's argument
  // turning up in the rigging.
  //
  // KNOWN FAULT, front face, v:1:1 — "HARBOUR is worth having only in a STORM"
  // is not true and is not uniquely answered; see §14. Left standing at 3.9
  // only because this pass was specified as backs-only. Its back tells the
  // truth about ports in heavy weather and does not lean on the front.
  nouns: [
    ["MOON",   "CLOUD",   "RAIN",   "GLASS", "FLAG"],
    ["TIDE",   "STORM",   "WAVE",   "WIND",  "SAIL"],
    ["SHORE",  "HARBOUR", "SHIP",   "MAST",  "ROPE"],
    ["BEACON", "REEF",    "ANCHOR", "DECK",  "KNOT"],
    ["ISLAND", "WRECK",   "SEABED", "CARGO", "SAILOR"]
  ],

  h: [
    [ { verb: "slides across the face of the", verb2: "wears a ring of ice around the",             dir: "left"  },
      { verb: "cannot hold its",       verb2: "carries its water too small to fall, until it is", dir: "right" },
      { verb: "falls a day before the", verb2: "is tapped twice a watch, and its fall promises",  dir: "left"  },
      { verb: "is a full day ahead of a", verb2: "falls while there is still nothing showing on a", dir: "right" } ],
    [ null,
      { verb: "makes a mountain of a", verb2: "arrives a day early, and only as a", dir: "right" },
      null,
      { verb: "is only any use in a",  verb2: "pulls, more than it pushes, a",      dir: "right" } ],
    [ { verb: "is a bite taken out of the", verb2: "is the one corner the weather cannot reach of a", dir: "left"  },
      { verb: "needs deep water in a",      verb2: "pays by the ton to lie a night in a",             dir: "left"  },
      { verb: "carries a",                  verb2: "is called a sloop, a brig or a barque by the count of its", dir: "right" },
      { verb: "climbs a",                   verb2: "is tarred, tied in rungs, and climbed up a",      dir: "left"  } ],
    [ { verb: "is lit against a",        verb2: "stands on iron legs in open water over a", dir: "right" },
      { verb: "will not hold on a",      verb2: "is cut away and left behind on a",         dir: "left"  },
      { verb: "comes up muddy onto a",   verb2: "is hauled in by a windlass bolted to a",   dir: "right" },
      null ],
    [ { verb: "ends up on an",   verb2: "is driven ashore on the lee side of an", dir: "left"  },
      { verb: "joins the",       verb2: "is colonised in ten years, and becomes new ground on the",      dir: "right" },
      null,
      { verb: "is paid to shift", verb2: "is paid off only when the hold is empty of", dir: "left" } ]
  ],

  v: [
    [ { verb: "pulls the",         verb2: "is fifty minutes late every day, and so is the", dir: "down" },
      { verb: "grows up into a",   verb2: "flattens off at the top once it has become a",   dir: "down" },
      null,
      { verb: "falling fast means, above all else,", verb2: "is why canvas comes in before there is any", dir: "down" },
      { verb: "shows early what a", verb2: "is the smallest piece of cloth aboard, and reads the weather before a", dir: "down" } ],
    [ { verb: "goes out and leaves a",       verb2: "rises fifteen metres in the worst places, and drowns a", dir: "down" },
      { verb: "is worth having only in a",   verb2: "shuts its gates and turns ships away in a",    dir: "up"   },
      { verb: "is built to survive a",       verb2: "bends, bow and stern, as it rides over a",     dir: "up"   },
      { verb: "leans on a",                  verb2: "is carried down into the keel through a",      dir: "down" },
      { verb: "is trimmed with a",           verb2: "is hoisted by a halyard and held by a sheet, and both are", dir: "down" } ],
    [ { verb: "marks the worst of a", verb2: "is told from every other by the count of its flashes on a", dir: "up" },
      null,
      { verb: "drops an",             verb2: "pays out seven times the depth in chain behind an", dir: "down" },
      { verb: "is stepped through a", verb2: "is wedged tight where it passes a",                 dir: "down" },
      { verb: "ends in a",            verb2: "loses as much as half its strength wherever it is tied in a",  dir: "down" } ],
    [ { verb: "is the only light on an", verb2: "was kept by three men who saw nobody for a month, on an", dir: "down" },
      { verb: "opens a hull below the waterline and leaves a", verb2: "was, for centuries, marked by nothing but an older", dir: "down" },
      { verb: "bites the",               verb2: "is dragged along until it digs itself into the",  dir: "down" },
      { verb: "is stowed under a",       verb2: "will shift, and capsize everything, if it is not lashed under a", dir: "up"   },
      { verb: "counts speed in a",       verb2: "took the word from real knots in a line paid over the stern, and still says a", dir: "up" } ]
  ]
});
