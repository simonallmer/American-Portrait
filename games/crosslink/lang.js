// Crosslink in more than one language.
//
// English is the base and stays the widest: the polysemous registry, the general
// quarry, the two spellings, and every second face on every gutter are English
// assets, and none of them is waiting to be translated. A board in another
// language is not this game translated — it is this game built again out of that
// language's own coincidences, because the coincidences are the game. VERRÜCKTE
// TIERE is nine German animals, none of which means an animal; there is no
// English board it is a version of, and there could not be one.
//
// So this file holds two things and no more:
//
//   * the interface, in each language it is offered in
//   * what the engine has to know about a language that is not a string —
//     which letters may be typed into a square, and how much room a sentence
//     in it needs in a gutter
//
// The words on the boards, their lexicon and their connections live with the
// boards, one file per language, exactly as the English ones always have.
window.CROSSLINK = window.CROSSLINK || {};
(function () {
  var CL = window.CROSSLINK;

  // ---- the languages ---------------------------------------------------
  //
  // `letters` is what the keyboard is allowed to put in a square. English is
  // A-Z; German adds the three umlauts, because a square that will not take an
  // Ä is a square that cannot hold a German word, and the day a board wants
  // one it must already work. ß is deliberately absent: a Crosslink square is
  // set in capitals and the capital of ß is SS, which the browser's own
  // toUpperCase already delivers.
  //
  // `dims` is the width of a gutter, and it is a fact about the language and
  // not about taste. The English numbers were measured off the live board (see
  // CL.dims); the German ones were measured the same way for the standalone
  // VERRÜCKTE TIERE, where the English measurements ran a connection to five
  // lines and over the edge of its gutter. German is simply longer, and the
  // grid has to be told so.
  CL.languages = [
    {
      code: "en",
      name: "English",
      letters: /[A-Z]/,
      strip: /[^A-Z]/g,
      dims: { big:   { noun: 112, gut: 104, row: 56, gutRow: 54 },
              small: { noun: 140, gut: 104, row: 62, gutRow: 56 } },
      // Where the four standing pages sit on the site. English is the root,
      // the way it is the root of everything else here.
      dir: "",
      loc: { puzzles: "puzzles.html", words: "words.html",
             rules: "rulebook.html", intro: "intro.html" }
    },
    {
      code: "de",
      name: "Deutsch",
      letters: /[A-ZÄÖÜ]/,
      strip: /[^A-ZÄÖÜ]/g,
      dims: { big:   { noun: 112, gut: 136, row: 70, gutRow: 64 },
              small: { noun: 150, gut: 176, row: 84, gutRow: 78 } },
      dir: "de/",
      loc: { puzzles: "raetsel.html", words: "woerter.html",
             rules: "anleitung.html", intro: "einfuehrung.html" }
    }
  ];

  CL.lang = "en";

  CL.language = function (code) {
    var list = CL.languages;
    for (var i = 0; i < list.length; i++) if (list[i].code === (code || CL.lang)) return list[i];
    return list[0];
  };

  // ---- the interface ---------------------------------------------------
  //
  // Short strings only. The long prose — the rulebook, the epigraph, the line
  // under the banner — is written out in index.html, once per language, marked
  // `data-lang`, because a rulebook is a piece of writing and not a row of
  // labels. Translating it key by key would have produced English sentences
  // wearing German words.
  //
  // {n}, {word} and the rest are filled by CL.t's second argument.
  CL.strings = {

    en: {
      "win.close":       "Close",
      "nav.back":        "Back",
      "nav.home":        "Home",
      "nav.loc":         "Location:",
      "nav.sites":       "Other sites",
      "nav.sound":       "Sound",
      "nav.soundOn":     "♪ On",
      "nav.soundOff":    "♪ Off",
      "nav.theme":       "Light or dark",
      "nav.themeDark":   "Dark. Click for light.",
      "nav.themeLight":  "Light. Click for dark.",
      "nav.lang":        "Language",

      "banner.kicker":   "Simon Allmer Presents",
      "banner.sub":      "A Game of Connections",

      "tile.daily":      "Play Daily",
      "tile.words":      "Word List",
      "tile.puzzles":    "Puzzles",
      "tile.rules":      "Rulebook",

      "hero.label":      "A three by three lattice. Click it for the board numbers.",
      "hero.note":       "Click the board.",
      "hero.picked":     "Pick a square.",
      "front.note":      "Welcome to the Crosslink Home Page on the World Wide Web.",
      "front.out":       "Back to Simon Allmer",

      "play.eyebrow":    "Crosslink · No. {n} · {stars}",
      "play.check":      "Error check",
      "play.restart":    "Restart",
      "play.board":      "Crosslink board",
      "play.pickAny":    "Pick any square and begin. The middle is the usual way in.",
      "play.pick":       "Pick a square.",
      "play.nothingHere":"Nothing has surfaced here yet.",
      "play.readAll":    "Read every sentence →",
      "play.readAllTip": "Read every sentence the board has shown you",
      "play.takeBack":   "Take it back",
      "play.takeBackNote":"Nothing is final. A square you take back keeps any mark it earned.",
      "play.enter":      "Enter word",
      "play.spent":      "Nothing left to give",
      "play.hintNote":   "A letter marks the square as partly solved. The word marks it as given.",
      "play.letters":    "{n} letters",
      "play.down":       "{word} — {n} letters",
      "play.zoomOut":    "Zoom Out",
      "play.zoomOutTip": "Show the whole board at once",
      "play.zoomIn":     "Zoom In",
      "play.zoomInTip":  "Back to the size the verbs can be read at",

      "hint.link":       "Surface a link",
      "hint.linkNote":   "A route in, at no cost to the square.",
      "hint.letter":     "Reveal a letter",
      "hint.letterNote": "This square will read as partly solved.",
      "hint.word":       "Reveal the word",
      "hint.wordNote":   "This square will read as given, not solved.",

      "msg.takes":       "That square takes {n} letters.",
      "msg.dup":         "Each word is used once, and {word} is already on the board.",
      "msg.giveUpConfirm": "Press Shift+S again to solve",
      "msg.gaveUp":      "The whole board, given.",

      "finish.head":     "The board closes.",
      "finish.clean":    "{n} solved outright",
      "finish.partial":  "{n} with letters revealed",
      "finish.given":    "{n} given",

      "lookup":          "Look up {word}",

      "script.title":    "Written form",
      "script.none":     "No board is open.",
      "script.nothing":  "Nothing has surfaced yet.",

      "lex.title":       "Lexicon",
      "lex.head":        "Words on this board",
      "lex.prompt":      "Click a word you have placed, or any word in the list.",
      "lex.unknown":     "Not in the Crosslink word list.",
      "lex.domains":     "Domains: {list}",
      "lex.notSet":      "Not yet set in a board.",
      "lex.setIn":       "Set in ",
      "lex.and":         " and ",
      "lex.noBoard":     "Nothing on the board.",
      "lex.empty":       "Nothing yet.",

      "puzzles.title":   "Puzzles",
      "puzzles.sub":     "Every Crosslink so far. A word may be set in more than one of them.",
      "puzzles.play":    "Play",
      "puzzles.playTip": "Play {title}",
      "puzzles.shared":  "{total} words set so far. {n} of them cross two boards or more: {list}.",
      "puzzles.alone":   "{total} words set so far, none yet on two boards.",
      "puzzles.none":    "No board is set in this language yet.",

      "words.title":     "Word List",
      "words.sub":       "{n} words in the quarry. {m} have been set in a board so far; the rest are waiting for one. A word may be set in more than one, and carries a number for each.",
      "words.keyOpen":   "Set in a board — click the number to play it",
      "words.keyNone":   "Waiting for a board",

      "rules.title":     "Rulebook",
      "rules.credit":    "Game Design: Simon Allmer",
      "intro.title":     "Crosslink Introduction",

      "foot.idle":       "Words in the cells. Connections in the gutters. Any square, any order.",
      "foot.notice":     "© 2026 Simon Allmer Entertainment",

      "gut.barred":      "No relation is claimed here.",
      "gut.noLink":      "(no link from here yet)",
      "gut.turnBack":    "(turn back)",
      "gut.turn":        "(this one reads another way)",

      "doc.home":        "Crosslink",
      "doc.puzzles":     "Crosslink — Puzzles",
      "doc.words":       "Crosslink — Word List",
      "doc.rules":       "Crosslink — Rulebook",
      "doc.intro":       "Crosslink — Introduction",
      "doc.board":       "Crosslink — {title}",
      "emblem.label":    "Simon Allmer presents Crosslink, a game of connections."
    },

    // The German interface. Where the standalone VERRÜCKTE TIERE had already
    // set a word — *Wort eintragen*, *Wieder wegnehmen*, *Buchstabe zeigen*,
    // *Wort zeigen*, *Von vorn* — that word is kept, because it is the same
    // game and it should not learn a second vocabulary on the way in here.
    de: {
      "win.close":       "Schließen",
      "nav.back":        "Zurück",
      "nav.home":        "Start",
      "nav.loc":         "Adresse:",
      "nav.sites":       "Andere Seiten",
      "nav.sound":       "Ton",
      "nav.soundOn":     "♪ An",
      "nav.soundOff":    "♪ Aus",
      "nav.theme":       "Hell oder dunkel",
      "nav.themeDark":   "Dunkel. Klick für hell.",
      "nav.themeLight":  "Hell. Klick für dunkel.",
      "nav.lang":        "Sprache",

      "banner.kicker":   "Simon Allmer präsentiert",
      "banner.sub":      "Ein Spiel der Verbindungen",

      "tile.daily":      "Tagesbrett",
      "tile.words":      "Wortliste",
      "tile.puzzles":    "Rätsel",
      "tile.rules":      "Anleitung",

      "hero.label":      "Ein Gitter aus drei mal drei Feldern. Klick darauf für die Brettnummern.",
      "hero.note":       "Klick auf das Brett.",
      "hero.picked":     "Wähle ein Feld.",
      "front.note":      "Willkommen auf der Crosslink-Startseite im World Wide Web.",
      "front.out":       "Zurück zu Simon Allmer",

      "play.eyebrow":    "Crosslink · Brett № {n} · {stars}",
      "play.check":      "Fehlerprüfung",
      "play.restart":    "Von vorn",
      "play.board":      "Crosslink-Brett",
      "play.pickAny":    "Wähle ein Feld und fang an. Die Mitte ist der übliche Weg hinein.",
      "play.pick":       "Wähle ein Feld.",
      "play.nothingHere":"Hier ist noch nichts aufgetaucht.",
      "play.readAll":    "Alle Sätze lesen →",
      "play.readAllTip": "Alle Sätze lesen, die das Brett gezeigt hat",
      "play.takeBack":   "Wieder wegnehmen",
      "play.takeBackNote":"Nichts ist endgültig. Ein Feld, das du wieder leerst, behält seine Markierung.",
      "play.enter":      "Wort eintragen",
      "play.spent":      "Nichts mehr zu geben",
      "play.hintNote":   "Ein Buchstabe zählt das Feld als halb gelöst. Das Wort zählt es als geschenkt.",
      "play.letters":    "{n} Buchstaben",
      "play.down":       "{word} — {n} Buchstaben",
      "play.zoomOut":    "Verkleinern",
      "play.zoomOutTip": "Das ganze Brett auf einmal zeigen",
      "play.zoomIn":     "Vergrößern",
      "play.zoomInTip":  "Zurück zu der Größe, in der die Verben lesbar sind",

      "hint.link":       "Verbindung aufdecken",
      "hint.linkNote":   "Ein Weg hinein, und er kostet das Feld nichts.",
      "hint.letter":     "Buchstabe zeigen",
      "hint.letterNote": "Dieses Feld gilt dann als halb gelöst.",
      "hint.word":       "Wort zeigen",
      "hint.wordNote":   "Dieses Feld gilt dann als geschenkt, nicht als gelöst.",

      "msg.takes":       "Dieses Feld nimmt {n} Buchstaben.",
      "msg.dup":         "Jedes Wort steht nur einmal, und {word} steht schon auf dem Brett.",
      "msg.giveUpConfirm": "Nochmal Shift+S drücken zum Lösen",
      "msg.gaveUp":      "Das ganze Brett, geschenkt.",

      "finish.head":     "Das Brett schließt.",
      "finish.clean":    "{n} selbst gelöst",
      "finish.partial":  "{n} mit gezeigten Buchstaben",
      "finish.given":    "{n} geschenkt",

      "lookup":          "{word} nachschlagen",

      "script.title":    "Wortlaut",
      "script.none":     "Kein Brett ist offen.",
      "script.nothing":  "Noch ist nichts aufgetaucht.",

      "lex.title":       "Wörterbuch",
      "lex.head":        "Wörter auf diesem Brett",
      "lex.prompt":      "Klick auf ein Wort, das du gesetzt hast, oder auf eines in der Liste.",
      "lex.unknown":     "Steht nicht in der Crosslink-Wortliste.",
      "lex.domains":     "Bereiche: {list}",
      "lex.notSet":      "Steht noch auf keinem Brett.",
      "lex.setIn":       "Steht auf ",
      "lex.and":         " und ",
      "lex.noBoard":     "Nichts auf dem Brett.",
      "lex.empty":       "Noch nichts.",

      "puzzles.title":   "Rätsel",
      "puzzles.sub":     "Jedes Crosslink bisher. Ein Wort darf auf mehr als einem stehen.",
      "puzzles.play":    "Spielen",
      "puzzles.playTip": "{title} spielen",
      "puzzles.shared":  "{total} Wörter bisher gesetzt. {n} davon stehen auf zwei Brettern oder mehr: {list}.",
      "puzzles.alone":   "{total} Wörter bisher gesetzt, noch keines auf zwei Brettern.",
      "puzzles.none":    "In dieser Sprache steht noch kein Brett.",

      "words.title":     "Wortliste",
      "words.sub":       "{n} Wörter im Steinbruch. {m} stehen bisher auf einem Brett; der Rest wartet auf eines. Ein Wort darf auf mehr als einem stehen und trägt für jedes eine Nummer.",
      "words.keyOpen":   "Steht auf einem Brett — klick auf die Nummer, um es zu spielen",
      "words.keyNone":   "Wartet auf ein Brett",

      "rules.title":     "Anleitung",
      "rules.credit":    "Spielidee: Simon Allmer",
      "intro.title":     "Crosslink — Einführung",

      "foot.idle":       "Wörter in den Feldern. Verbindungen in den Gassen. Jedes Feld, in jeder Reihenfolge.",
      "foot.notice":     "© 2026 Simon Allmer Entertainment",

      "gut.barred":      "Hier wird nichts behauptet.",
      "gut.noLink":      "(von hier führt noch kein Weg)",
      "gut.turnBack":    "(zurückdrehen)",
      "gut.turn":        "(die liest sich auch anders)",

      "doc.home":        "Crosslink",
      "doc.puzzles":     "Crosslink — Rätsel",
      "doc.words":       "Crosslink — Wortliste",
      "doc.rules":       "Crosslink — Anleitung",
      "doc.intro":       "Crosslink — Einführung",
      "doc.board":       "Crosslink — {title}",
      "emblem.label":    "Simon Allmer präsentiert Crosslink, ein Spiel der Verbindungen."
    }
  };

  // A missing key falls back to English rather than printing itself. A new
  // language may therefore ship half-finished and still be playable, which is
  // the point of having a base language at all.
  CL.t = function (key, vals) {
    var table = CL.strings[CL.lang] || CL.strings.en;
    var s = table[key];
    if (s === undefined) s = CL.strings.en[key];
    if (s === undefined) return key;
    if (!vals) return s;
    return s.replace(/\{(\w+)\}/g, function (whole, name) {
      return vals[name] !== undefined ? String(vals[name]) : whole;
    });
  };

  // ---- the boards, by language ----------------------------------------
  //
  // `CL.puzzles` stays one flat list and a board's index in it stays its
  // identity — every link in the game already points that way. What the
  // language gives is an ORDER and a NUMBER: board № 1 means the first board of
  // the language you are reading in, and the two shelves are numbered apart.
  CL.boardLang = function (p) { return p.lang || "en"; };

  CL.shelf = function (code) {
    var want = code || CL.lang, out = [];
    (CL.puzzles || []).forEach(function (p, i) {
      if (CL.boardLang(p) === want && p.id !== "07-americana") out.push(i);
    });
    return out;
  };

  // Where a board stands on its own shelf, counting from 1.
  CL.boardNo = function (i) {
    var shelf = CL.shelf(CL.boardLang(CL.puzzles[i]));
    return shelf.indexOf(i) + 1;
  };
})();
