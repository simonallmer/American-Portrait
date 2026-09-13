window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "01-tiere",
  lang: "de",
  title: "Verrückte Tiere",
  standfirst: "Herausgegeben von Simon Allmer",
  hue: "plum",
  size: 3,
  centre: [1, 1],
  stars: 2,

  // Das erste deutsche Brett, und der Grund, warum es hier ein `lang` gibt.
  //
  // Neun Tiere, und keines meint ein Tier: Klebstoff, Warteschlange,
  // Wasserhahn, Kopfweh, Polizist, Sternbild, Schleife unterm Kinn, ein
  // Befehl. Das ist kein übersetztes Brett und könnte keines sein. UHU heißt
  // Eule und Alleskleber, weil eine Firma in Bühl 1932 ihre Leime nach Vögeln
  // benannte; FLIEGE heißt Insekt und Schleife und ist außerdem die
  // Befehlsform von fliegen. Für keinen dieser Zufälle gibt es ein englisches
  // Wort, also gibt es auch kein englisches Brett, von dem dies eine Fassung
  // wäre. Die Zufälle sind das Spiel, und sie gehören der Sprache.
  //
  // In der Mitte steht der HAHN, vier Buchstaben, und vier Sätze zeigen darauf
  // — als Zapfhahn, als Wasserhahn, als Vogel, der kräht, und als der, der
  // immer schläft, wenn der andere wach ist. An ihm steht das Prinzip des
  // Bretts am deutlichsten: dasselbe Wort, vier Bedeutungen.
  //
  // Der Rand ist ein geschlossener Ring — MAUS, SCHLANGE, KREBS, TAUBE, BULLE,
  // KATER, FLIEGE, UHU und zurück — und dazu stehen alle vier Speichen zur
  // Mitte. Zwölf von zwölf Gassen sind belegt: es gibt auf diesem Brett keinen
  // Balken, und deshalb erklärt es auch keinen.
  //
  // KEINE RÜCKSEITEN. Die zweiten Gesichter sind bisher englisch und nur
  // englisch — 159 auf sechs Brettern, jedes von Hand geschrieben. Dieses Brett
  // hat eine Seite je Verbindung, und die Engine weiß das: ohne `verb2` fällt
  // das Umdrehen weg, statt leer dazustehen. Das ist keine Lücke, die
  // geschlossen werden muss, sondern der Unterschied zwischen einer Sprache,
  // die seit sechs Brettern gebaut wird, und einer, die mit dieser anfängt.
  nouns: [
    ["MAUS",   "SCHLANGE", "KREBS"],
    ["UHU",    "HAHN",     "TAUBE"],
    ["FLIEGE", "KATER",    "BULLE"]
  ],

  h: [
    [ { verb: "stellt sich hinter Reptilien an und wird dabei selbst Teil der", dir: "right" },
      { verb: "weicht im seichten Wasser den Scheren aus vom",                  dir: "right" } ],
    // Die eine Verbindung ohne Pfeilspitze: sie gilt in beide Richtungen, weil
    // sie in beide Richtungen wahr ist. Der eine sieht den anderen immer nur
    // schlafend, und umgekehrt genauso. Ein Pfeil wäre hier eine Lüge.
    [ { verb: "erblickt nur einen schlafenden", kind: "eq" },
      { verb: "hören nicht das Krähen vom lauten",                              dir: "left"  } ],
    [ { verb: "ist in modebewusster, gestiefelter Form auch anzutreffen mit",   dir: "left"  },
      { verb: "sorgt, aus beruflichen Gründen, für den Aufhalt und Entzug von Herr", dir: "left" } ]
  ],

  v: [
    [ { verb: "sorgt bei Falschanwendung zum Cursorstillstand der",             dir: "up"    },
      { verb: "steht im Festzelt und wird nur kürzer durch einen zweiten",      dir: "down"  },
      { verb: "steht in den schicksalhaften Sternen über jedem weltlichen Flug einer", dir: "down" } ],
    [ { verb: "kann, als Befehl verstanden, ausgeführt werden vom",             dir: "up"    },
      { verb: "spendet Leitungswasser zur Vertreibung des",                     dir: "down"  },
      { verb: "hält im Rat den Zins tief; darüber freut sich an der Börse der",  dir: "down"  } ]
  ]
});
