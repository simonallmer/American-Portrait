window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "05-press",
  lang: "en",
  title: "Set, Inked and Pulled",
  standfirst: "Written by Simon Allmer",
  hue: "grey",
  size: 5,
  centre: [2, 2],

  // Grown from a 3x3 at 2.7, and the reason for growing it is the centre square.
  // PRESS is the machine, and PRESS is the newspapers, and those are not two
  // meanings that happen to share a spelling — one became the other, because the
  // thing that could print a thousand sheets a night is the thing that could
  // print the news. A 3x3 had no room to put both halves on the board. This one
  // does, and it is built as an argument about that:
  //
  //   west of centre    LEAD, CASE, TYPE, PLATE, PRINTER, FRANKLIN — the metal
  //   east of centre    COPY, HEADLINE, PAPER, NEWS, STORY, SCOOP — the trade
  //   south             what the machine leaves behind: a page, a book, a reader
  //   the centre        PRESS, which is both, and PRINTER beside it, which is
  //                     the person and the machine in the same seven letters
  //
  // Three squares carry the double openly and it is the point of each of them:
  //
  //   PRESS     the frame that squeezes, and the trade that shouts
  //   PRINTER   the person and the machine in one word — carried not by an
  //             announcement but by which subjects use it: FRANKLIN chooses it
  //             for a gravestone, while it clamps a plate and numbers a page
  //   COLUMN    a strip of newsprint, and the pillar on the library portico.
  //             Its four clues split two and two, and the LIBRARY one is the
  //             only place on the board where the second meaning is the answer.
  //
  // FRANKLIN earns W4 twice over: an encyclopaedia entry in any century, and a
  // name that is also a common noun. That clue is the board's best line and it is
  // literally true — the signer of the Declaration, the postmaster, the diplomat,
  // chose "B. Franklin, Printer" for the gravestone. The trade, not the offices.
  //
  // RAG and PULP are gone. Both were true and both were the wrong kind of hard:
  // a solver who does not happen to know that paper was beaten from cloth has no
  // second route to them, and E6 is not satisfied by a clue that teaches a fact
  // the solver cannot check against anything else on the board. Every word here
  // has an everyday sense to arrive from — a case, a plate, a proof, a story, a
  // scoop, a column — and the printing sense is what the neighbours add.
  nouns: [
    ["LEAD",     "CASE",    "PROOF",  "COPY",     "EDITOR"],
    ["TYPE",     "PLATE",   "INK",    "HEADLINE", "DEADLINE"],
    ["FRANKLIN", "PRINTER", "PRESS",  "PAPER",    "NEWS"],
    ["BOOK",     "PAGE",    "COLUMN", "STORY",    "SCOOP"],
    ["SPINE",    "MARGIN",  "LIBRARY","READER",   "LIBEL"]
  ],

  h: [
    [ { verb: "is melted and cast, letter by letter, for a",
        verb2: "is sorted, upper and lower, into a", dir: "right" },
      { verb: "drops a wrong letter back into its", verb2: "shows which letter goes back in a", dir: "left" },
      { verb: "is marked up against the", verb2: "must agree with the", dir: "right" },
      { verb: "waits for the blue pencil of an", verb2: "is cut and changed by an",   dir: "right" } ],
    [ { verb: "is set once and cast as a", verb2: "is frozen in metal as a", dir: "right" },
      null,
      { verb: "is what you get for making a", verb2: "is used up fastest on a", dir: "right" },
      // R2, and the board's one word-level connection (E17). No arrow: it
      // reads the same from either end, which is what §2 wanted this for.
      { verb: "shares its last word with", verb2: "is one letter away from", kind: "eq" } ],
    [ { verb: "chose for a gravestone the word", verb2: "is an American, and by trade a", dir: "right" },
      { verb: "pulls, by hand, a", verb2: "works, and is named for, a", dir: "right" },
      { verb: "runs all night for the morning", verb2: "throws out, every day, a",   dir: "right" },
      { verb: "is one day, folded, of", verb2: "is where you go to read the",           dir: "right" } ],
    [ { verb: "will not open flat at any one", verb2: "is turned one at a time, by the", dir: "right" },
      { verb: "is ruled top to bottom into a", verb2: "is split into a narrow", dir: "right" },
      { verb: "is measured by the inch of", verb2: "is cut short to fit a",    dir: "left"  },
      { verb: "nobody else has yet is a", verb2: "got first is a",      dir: "right" } ],
    [ { verb: "is widest where it meets a", verb2: "is left white beside the",   dir: "left"  },
      null,
      { verb: "is a building that assumes a", verb2: "is quiet, and full of the", dir: "right" },
      { verb: "is nothing until it reaches a", verb2: "is a printed lie seen by a", dir: "left" } ]
  ],

  v: [
    [ { verb: "is soft enough to cast and hard enough for", verb2: "is the grey metal poured to make", dir: "down" },
      null,
      { verb: "is barely dry on a", verb2: "goes on the trial sheet called a", dir: "up" },
      { verb: "is cut to fit under a", verb2: "is the small print under a", dir: "down" },
      { verb: "is the one thing that will not be moved by an", verb2: "is the hour set by an", dir: "up" } ],
    [ { verb: "was apprenticed at twelve to set", verb2: "is the American of the kite and the key, who set",        dir: "up"   },
      { verb: "clamps down, and squares up, a", verb2: "locks a flat sheet of metal, a",          dir: "up"   },
      { verb: "is rolled on, and taken off again, by a", verb2: "is spread by the roller of a", dir: "down" },
      { verb: "is set in the largest letter of a", verb2: "shouts from the front of a",       dir: "down" },
      { verb: "is worth nothing an hour after a", verb2: "must be in before a",        dir: "up"   } ],
    [ { verb: "opened the first place that would lend a", verb2: "wrote an almanac, which is a", dir: "down" },
      { verb: "is numbered by nobody but the", verb2: "comes off the machine, and the person, called a",      dir: "up"   },
      { verb: "fills, morning after morning, a", verb2: "prints in one narrow strip, a",    dir: "down" },
      { verb: "will hold its front for a big", verb2: "is filled front to back with a",      dir: "down" },
      null ],
    [ { verb: "is read from the shelf by its", verb2: "has its title down the",   dir: "down" },
      { verb: "is bordered, edge to edge, by a", verb2: "keeps a white edge called a", dir: "down" },
      { verb: "is the kind of building given a", verb2: "wears a portico held up by a", dir: "up"   },
      null,
      { verb: "that ruins a good name is a", verb2: "printed about a person, and false, is a", dir: "down" } ]
  ]
});
