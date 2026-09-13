// Crosslink engine — the lattice, the edges, and the rendering of both.
// A board of size N is a (2N-1) x (2N-1) lattice: nouns on even coordinates,
// verb gutters on the mixed ones, structural corners on the odd ones.
(function () {
  var CL = window.CROSSLINK;

  var K = function (r, c) { return r + "," + c; };
  CL.K = K;

  // One gutter, resolved. `a` is the cell that comes first in board order (left
  // before right, top before bottom) and `b` the one after it; `fwd` is the dir
  // value that means "a acts on b".
  //
  // R2, the equivalence, is built here: `kind: "eq"` is a relation that reads the
  // same both ways, so it has no subject and no object to resolve and no head to
  // draw — the two cells are peers and the sentence prints in board order, which
  // is what §2 asked for when it specced this and nothing built it. `dir` is not
  // read at all for an eq, and a board that omits `kind` gets the directed
  // relation it always had.
  function edge(id, d, a, b, fwd) {
    var eq = d.kind === "eq";
    var f = d.dir === fwd;
    return {
      id: id,
      verb: d.verb, verb2: d.verb2 || null,
      kind: eq ? "eq" : "dir",
      arrow: eq ? null : (fwd === "right" ? (f ? "→" : "←") : (f ? "↓" : "↑")),
      subject: eq ? a : (f ? a : b),
      object:  eq ? b : (f ? b : a),
      cells: [a, b]
    };
  }

  // Every non-barred relation on the board, with its subject and object resolved.
  CL.edgeList = function (p) {
    var out = [], r, g, c, d;
    for (r = 0; r < p.size; r++) {
      for (g = 0; g < p.size - 1; g++) {
        d = p.h[r][g];
        if (!d) continue;
        out.push(edge("h:" + r + ":" + g, d, [r, g], [r, g + 1], "right"));
      }
    }
    for (g = 0; g < p.size - 1; g++) {
      for (c = 0; c < p.size; c++) {
        d = p.v[g][c];
        if (!d) continue;
        out.push(edge("v:" + g + ":" + c, d, [g, c], [g + 1, c], "down"));
      }
    }
    return out;
  };

  CL.edgesAt = function (st, r, c) {
    return st.edges.filter(function (e) {
      return e.cells.some(function (x) { return x[0] === r && x[1] === c; });
    });
  };

  // ---- the trifecta ----------------------------------------------------
  //
  // A second kind of board coexists with the net. Where the net joins adjacent
  // cells two at a time, a trifecta joins three cells that stand in a straight
  // line — a whole row or a whole column — and treats that line as one fact.
  // Nine nouns, six lines, no diagonals. Each line owns its two gutters (the
  // spans between its three squares) and wears its own colour, so a solver reads
  // the board as six coloured arrows long before a single square is filled.
  //
  // R3b: a board opts in by setting `kind: "trifecta"` and declaring its lines
  // in `tr` (the three row lines) and `tc` (the three column lines) instead of
  // the net's `h` and `v`. Everything else — the squares, the typing, the hints,
  // the error check, the closing page — is the same game.
  CL.isTrifecta = function (p) { return p.kind === "trifecta"; };

  // Where a long noun folds onto a second row, measured as the index of the
  // first letter kept down. Only the words that want a deliberate syllable
  // break are in here; everything else lets the box decide and returns non.
  CL.foldAt = function (word) {
    var folds = { ESTABLISHMENT: 5, RESERVATION: 5 };
    return folds[word] === undefined ? -1 : folds[word];
  };

  function line(d, cells) {
    // Reading order: the subject comes first. "right"/"down" read the line as
    // it is printed, so the first-listed word is the subject; "left"/"up" read
    // it backwards, so the last-listed one is.
    var fwd = d.dir === "right" || d.dir === "down";
    var ordered = fwd ? cells.slice() : cells.slice().reverse();
    var id = (d.axis === "h" ? "h:" + d.i : "v:" + d.i);
    return {
      id: id, axis: d.axis, i: d.i, dir: d.dir, color: d.color, verb: d.verb,
      ordered: ordered, cells: cells,
      gutters: d.axis === "h"
        ? [id + ":0", id + ":1"]
        : ["v:0:" + d.i, "v:1:" + d.i]
    };
  }

  // The six lines of a trifecta board, resolved. A line keeps its cells in board
  // order and its ordered words in subject-first reading order.
  CL.lineList = function (p) {
    var out = [], r, c, cells;
    for (r = 0; r < p.size; r++) {
      cells = [];
      for (c = 0; c < p.size; c++) cells.push([r, c]);
      out.push(line(p.tr[r], cells));
    }
    for (c = 0; c < p.size; c++) {
      cells = [];
      for (r = 0; r < p.size; r++) cells.push([r, c]);
      out.push(line(p.tc[c], cells));
    }
    return out;
  };

  CL.linesAt = function (st, r, c) {
    return st.lines.filter(function (ln) {
      return ln.cells.some(function (x) { return x[0] === r && x[1] === c; });
    });
  };

  // The full sentence of a line, its subject stated and its `_` slots filled in
  // reading order. Unknown words read as ellipses, exactly as a net's sentence
  // reads an empty neighbour.
  CL.lineSentence = function (st, ln) {
    var rest = ln.ordered.slice(1);
    var i = 0;
    var verb = ln.verb.replace(/_/g, function () {
      var w = st.filled[K(rest[i][0], rest[i][1])];
      i++;
      return w !== undefined ? w : "\u2026";
    });
    var subj = st.filled[K(ln.ordered[0][0], ln.ordered[0][1])];
    return (subj !== undefined ? subj : "\u2026") + " " + verb + ".";
  };

  CL.other = function (e, r, c) {
    return (e.cells[0][0] === r && e.cells[0][1] === c) ? e.cells[1] : e.cells[0];
  };

  CL.answer = function (st, r, c) { return st.puzzle.nouns[r][c]; };

  // ---- spellings ----------------------------------------------------
  // Built once, from spelling.js: every accepted variant mapped back to the one
  // form the boards and the lexicon are written in. A word not in the table is
  // its own canonical, which is nearly all of them.
  //
  // Keyed by language, because the two Englishes are a fact about English and
  // not about the game. German has no such pair on the shelf and wants no
  // table; a language that has one writes its own, and nothing here has to
  // learn about it beyond the lookup.
  var CANON = {};
  function canonMap() {
    var lang = CL.lang || "en";
    if (CANON[lang]) return CANON[lang];
    var map = CANON[lang] = {};
    var t = (CL.spellings && CL.spellings[lang]) || (lang === "en" ? (CL.spelling || {}) : {});
    var k, i;
    for (k in t) if (t.hasOwnProperty(k)) {
      map[k] = k;
      for (i = 0; i < t[k].length; i++) map[t[k][i]] = k;
    }
    return map;
  }

  // The one form of a word. Used wherever a typed word meets a written one, and
  // wherever a word is looked up in the lexicon.
  CL.canon = function (w) {
    if (!w) return w;
    var u = String(w).toUpperCase();
    return canonMap()[u] || u;
  };

  // Two words are the same word if they are the same word in either English.
  // Every comparison of a typed answer against a written one goes through here:
  // the error check, the noise a word makes, and the win.
  CL.same = function (a, b) { return CL.canon(a) === CL.canon(b); };

  // What the solver is allowed to see, given what they have solved.
  CL.derive = function (st) {
    var p = st.puzzle, ctr = p.centre;
    var solved = function (r, c) { return st.filled[K(r, c)] !== undefined; };

    // Every connection is shown from the first moment. It used to surface only
    // when one of its two words was known, which made the whole board hostage to
    // the centre: miss the first word and there was nothing else to think about.
    // Now the map is open and only the walking is gated.
    st.verbVisible = {};
    st.edges.forEach(function (e) { st.verbVisible[e.id] = true; });

    // Reachable: the centre, or any cell with a connection whose other end is solved.
    st.reachable = {};
    if (CL.isTrifecta(p)) {
      // Every square lies on a public line, so every square is reachable. The
      // net spreads from the centre; the trifecta is open at once.
      for (var ar = 0; ar < p.size; ar++)
        for (var ac = 0; ac < p.size; ac++) st.reachable[K(ar, ac)] = true;
      st.verbVisible = {};
      st.lines.forEach(function (ln) { st.verbVisible[ln.id] = true; });
      st.wrong = {};
      if (!st.check) return;
      for (var ay = 0; ay < p.size; ay++)
        for (var ax = 0; ax < p.size; ax++) {
          var ak = K(ay, ax);
          if (st.filled[ak] !== undefined && !CL.same(st.filled[ak], CL.answer(st, ay, ax))) st.wrong[ak] = true;
        }
      return;
    }
    st.reachable[K(ctr[0], ctr[1])] = true;
    for (var r = 0; r < p.size; r++) {
      for (var c = 0; c < p.size; c++) {
        CL.edgesAt(st, r, c).forEach(function (e) {
          if (!st.verbVisible[e.id]) return;
          var o = CL.other(e, r, c);
          if (solved(o[0], o[1])) st.reachable[K(r, c)] = true;
        });
      }
    }


    // Nothing on the board goes red unless error check is on; then a wrong word
    // says so the moment it is entered, and says it about itself.
    st.wrong = {};
    if (!st.check) return;
    for (var y = 0; y < p.size; y++) {
      for (var x = 0; x < p.size; x++) {
        var kk = K(y, x);
        if (st.filled[kk] !== undefined && !CL.same(st.filled[kk], CL.answer(st, y, x))) st.wrong[kk] = true;
      }
    }
  };

  // ---- the word tables, by language -----------------------------------
  //
  // Three of them, and each language answers for its own. English has all
  // three: the hand-written lexicon, the polysemous registry, and the general
  // quarry with its ease rating. German so far has two, and that is not a
  // deficiency to be filled in — the German shelf begins with the polysemous
  // words because VERRÜCKTE TIERE is made of nothing else. A missing table is
  // an empty object, so every reader of these gets an answer.
  function table(a, b) { return a || b || {}; }

  CL.lexicon = function (lang) {
    return (lang || CL.lang) === "de" ? table(CL.lexDe) : table(CL.lex);
  };
  CL.polysemes = function (lang) {
    return (lang || CL.lang) === "de" ? table(CL.registryDe) : table(CL.registry);
  };
  CL.quarry = function (lang) {
    return (lang || CL.lang) === "de" ? table(CL.wordsDe) : table(CL.words);
  };

  // How hard a board is, from the words on it: how ordinary they are, and how
  // many of them are being asked to wear a second coat. A puzzle may override
  // the reckoning with `stars`, because a constructor knows things this does not.
  CL.stars = function (p) {
    if (p.stars) return p.stars;
    // The reckoning is done against the board's OWN language. Weighing German
    // words in the English quarry would have found none of them, called every
    // word maximally obscure, and made every German board three stars by
    // arithmetic rather than by being hard.
    var quarry = CL.quarry(CL.boardLang ? CL.boardLang(p) : "en"),
        reg = CL.polysemes(CL.boardLang ? CL.boardLang(p) : "en");
    var n = 0, hard = 0, twist = 0;
    p.nouns.forEach(function (row) {
      row.forEach(function (w) {
        n++;
        var e = quarry[w] ? quarry[w].e : 3;
        hard += 3 - e;
        var doms = reg[w] ? reg[w].length : 0;
        if (doms >= 2) twist += Math.min(doms, 4) / 4;
      });
    });
    // Thin boards are hard boards: a word with one way in is a guess, not a
    // deduction. That is most of why board 02 is the monster it is.
    //
    // Board size is deliberately not in here. A 5x5 is longer than a 3x3, not
    // harder, and the board already says which it is: charging a big board two
    // tenths of a star made it impossible for a 5x5 of plain words to be rated
    // easy, which is a thing the scale should be able to say.
    var possible = 2 * p.size * (p.size - 1);
    // A trifecta's connections are its six lines, not gutters between adjacent
    // squares; count those, or a board with its real map open would read as an
    // unbuilt one and come out a star too hard.
    var bare = possible - (CL.isTrifecta(p) ? CL.lineList(p).length : CL.edgeList(p).length);
    var raw = (hard + twist) / n + bare / possible;
    return raw < 0.30 ? 1 : raw < 0.55 ? 2 : 3;
  };

  CL.starText = function (n) {
    return new Array(n + 1).join("\u2605") + new Array(4 - n).join("\u2606");
  };

  // Cell geometry is a function of board size: a bigger lattice takes smaller squares.
  CL.dims = function (size, lang) {
    // Both gutter measurements were set by the arrowhead and not by the words,
    // and both were a little too small for a connection written to E7's longer
    // shapes. Measured off the live board rather than guessed:
    //
    //   gutRow 48 -> 54   three lines of 10px text and an arrowhead below them
    //   gut    88 -> 104  the smallest width at which no connection on any board
    //                     runs past three lines, on either face. 88 left
    //                     seventeen of them at four. It costs 64px on a 5x5 -
    //                     912 to 976, seven per cent - and the board scales.
    //
    // Measure this with offsetHeight and never with getBoundingClientRect. The
    // board is fitted to the page with a CSS transform, so a rect is the SCALED
    // box: at 0.87 a genuine four-line label measures 43px against an unscaled
    // 12.5px line and rounds to three. That is how 96 was picked the first time,
    // and it was wrong by two whole steps.
    // ...and the numbers themselves are a fact about the LANGUAGE, so they
    // live with it in lang.js. English is what is measured above. German runs
    // longer — "ist so nah verwandt, dass es gemeinsame Junge gibt: er und
    // ein" went to five lines and over the edge of its gutter at the English
    // width — so its gutters are wider and its rows taller, measured the same
    // way on the standalone board before it came in here.
    var d = CL.language(lang).dims;
    return size >= 5 ? d.big : d.small;
  };

  // How wide the lattice wants to be, in pixels, before anything is scaled. It
  // is what decides whether a board gets the narrow sheet or the wide one, and
  // it has to be measured rather than guessed from `size`: a German 3x3 is
  // wider than an English one, because its gutters are, and the old rule —
  // wide if size >= 5 — put the first German board on the narrow sheet and
  // made it scroll sideways on its first screen.
  CL.boardWidth = function (p) {
    var d = CL.dims(p.size, CL.boardLang(p));
    return p.size * d.noun + (p.size - 1) * d.gut;
  };

  // Which of a connection's two faces is showing. A connection with no second
  // face has one, and `flipped` never touches it.
  CL.face = function (st, e) {
    return (e.verb2 && st.flipped && st.flipped[e.id]) ? e.verb2 : e.verb;
  };

  CL.sentence = function (st, e) {
    var s = st.filled[K(e.subject[0], e.subject[1])] || "…";
    var o = st.filled[K(e.object[0], e.object[1])] || "…";
    return s + " " + CL.face(st, e) + " " + o + ".";
  };

  CL.render = function (st, onPick) {
    var p = st.puzzle, board = document.getElementById("board"), n = 2 * p.size - 1;
    var d = CL.dims(p.size, CL.boardLang(p)), cols = [], rows = [];
    for (var i = 0; i < n; i++) {
      cols.push((i % 2 === 0 ? d.noun : d.gut) + "px");
      rows.push((i % 2 === 0 ? d.row : d.gutRow) + "px");
    }
    board.style.gridTemplateColumns = cols.join(" ");
    board.style.gridTemplateRows = rows.join(" ");
    board.setAttribute("data-size", p.size);
    board.innerHTML = "";
    for (var R = 0; R < n; R++) {
      for (var C = 0; C < n; C++) {
        var d = document.createElement("div");
        if (R % 2 === 0 && C % 2 === 0) paintNoun(st, d, R / 2, C / 2, onPick);
        else if (R % 2 === 0) paintGut(st, d, "h:" + (R / 2) + ":" + ((C - 1) / 2));
        else if (C % 2 === 0) paintGut(st, d, "v:" + ((R - 1) / 2) + ":" + (C / 2));
        else d.className = "dead";
        board.appendChild(d);
      }
    }
  };

  // The status line reads out where a square would take you, as a browser used to.
  var STATUS = null;
  CL.status = function (text) {
    if (!STATUS) STATUS = document.querySelector("footer p");
    if (!STATUS) return;
    if (text === null) { STATUS.textContent = STATUS.getAttribute("data-idle"); return; }
    if (!STATUS.getAttribute("data-idle")) STATUS.setAttribute("data-idle", STATUS.textContent);
    STATUS.textContent = text;
  };

  // The idle line is remembered the first time a hint replaces it, which means
  // it is remembered in whatever language was showing then. A language change
  // has to forget it, or the status bar falls back to English for the rest of
  // the session the first time the pointer leaves a square.
  CL.statusForget = function () {
    if (!STATUS) STATUS = document.querySelector("footer p");
    if (STATUS) STATUS.removeAttribute("data-idle");
  };

  function href(st, r, c) {
    var word = st.filled[CL.K(r, c)];
    var slug = word ? word.toLowerCase()
                    : new Array(CL.answer(st, r, c).length + 1).join("?");
    // A language is a directory. English is the root, the way it is the root of
    // everything else here, so nothing set in English changes address.
    var dir = CL.language(CL.boardLang(st.puzzle)).dir;
    return "http://simonallmer.com/crosslink/" + dir + st.puzzle.id + "/" + slug + ".html";
  }

  function wire(st, d, r, c, live) {
    d.onmouseenter = function () { CL.status(live ? href(st, r, c) : CL.t("gut.noLink")); };
    d.onmouseleave = function () { CL.status(null); };
  }

  function paintNoun(st, d, r, c, onPick) {
    var k = CL.K(r, c), ans = CL.answer(st, r, c), word = st.filled[k];
    d.className = "noun";
    d.setAttribute("role", "gridcell");

    // A couple of nouns are long enough to want a break at a syllable rather
    // than wherever the box happens to run out, so the fold reads as a word
    // break instead of a ragged edge. The same index is used by the typed slots
    // below, so the two stay identical and entering a word never moves it.
    var fold = CL.foldAt(ans);

    if (word !== undefined) {
      d.classList.add("done-" + (st.status[k] || "clean"));
      if (st.wrong[k]) d.classList.add("wrong");
      if (st.selected && st.selected[0] === r && st.selected[1] === c) d.classList.add("selected");
      // A word that is down keeps the slots it was typed into: same boxes, same
      // places, so nothing on the board shifts at the moment you enter it.
      d.innerHTML = '<span class="word"></span>';
      var w = d.querySelector(".word");
      for (var n = 0; n < word.length; n++) {
        if (fold === n) w.appendChild(document.createElement("br"));
        var sp = document.createElement("span");
        sp.textContent = word.charAt(n);
        w.appendChild(sp);
      }
      d.onclick = function () { onPick(r, c); };
      wire(st, d, r, c, true);
      return;
    }

    // Every square can be written in. `reachable` is no longer a gate, only a
    // mark: it says which squares a word you have placed already touches, which
    // is where the next one most easily comes from.
    if (st.reachable[k]) d.classList.add("reachable");
    if (st.selected && st.selected[0] === r && st.selected[1] === c) d.classList.add("selected");

    // The draft holds one slot per letter, revealed letters already seated in
    // theirs; the caret marks the next slot the solver still owes.
    var rev = st.revealed[k] || {}, out = "";
    var here = st.selected && st.selected[0] === r && st.selected[1] === c;
    var caret = -1;
    if (here) {
      for (var j = 0; j < st.draft.length; j++) if (!st.draft[j]) { caret = j; break; }
    }
    for (var i = 0; i < ans.length; i++) {
      var ch = here && st.draft[i] ? st.draft[i] : (rev[i] ? ans[i] : null);
      out += (fold === i ? "<br>" : "") +
            (ch ? '<span class="' + (rev[i] ? "rev" : "") + '">' + ch + "</span>"
                : '<span class="blank' + (i === caret ? " caret" : "") + '">&#160;</span>');
    }
    d.innerHTML = '<span class="slots">' + out + "</span>" +
                  '<span class="tick">' + ans.length + "</span>";
    d.onclick = function () { onPick(r, c); };
    wire(st, d, r, c, st.reachable[k]);
  }

  function paintGut(st, d, id) {
    if (CL.isTrifecta(st.puzzle)) return paintGutTrifecta(st, d, id);
    var e = null;
    for (var i = 0; i < st.edges.length; i++) if (st.edges[i].id === id) { e = st.edges[i]; break; }
    if (!e) { d.className = "gut barred"; d.title = CL.t("gut.barred"); return; }
    if (!st.verbVisible[id]) { d.className = "gut"; return; }
    var a = e.cells[0], b = e.cells[1];
    var both = st.filled[CL.K(a[0], a[1])] !== undefined && st.filled[CL.K(b[0], b[1])] !== undefined;
    var axis = id.charAt(0) === "h" ? "h" : "v";
    var HEAD = { "\u2192": "to-right", "\u2190": "to-left", "\u2193": "to-down", "\u2191": "to-up" };
    // An equivalence has no head to point: it gets the plain wire and says so.
    var head = e.kind === "eq" ? "level" : HEAD[e.arrow];
    var turnable = !!e.verb2, over = turnable && st.flipped[id];
    d.className = "gut shown " + axis + " " + head + (both ? " spent" : "")
                + (turnable ? " turnable" : "") + (over ? " over" : "")
                + (st.turning === id ? " turning" : "");
    d.innerHTML = '<span class="arrow" aria-hidden="true"></span><span class="label"></span>';
    d.lastChild.textContent = CL.face(st, e);
    d.title = both ? CL.sentence(st, e) : CL.face(st, e);

    // A connection with two faces turns over when you click it, and turns back.
    // It costs nothing and is counted nowhere: the back is another sentence
    // about the same relation, not the answer, so the deduction is still yours.
    if (!turnable || !CL.onTurn) return;
    d.onclick = function (ev) { ev.stopPropagation(); CL.onTurn(id); };
    d.onmouseenter = function () {
      CL.status(over ? CL.t("gut.turnBack") : CL.t("gut.turn"));
    };
    d.onmouseleave = function () { CL.status(null); };
  }

  // A trifecta gutter is a span of one of the board's six lines: two spans per
  // line, each coloured with the line's colour and pointed the way the reading
  // order runs. The line's sentence runs to three words, so it cannot sit in one
  // span; instead it is split at its word seats and each stretch is printed on
  // the wire between the two words it joins. The sentence then reads across the
  // two coloured wires exactly as a net's gutter reads between its two cells —
  // the board stays a page of sentences, and the middle word sits in its square
  // between the two halves.
  function paintGutTrifecta(st, d, id) {
    var ln = null, i, gi = -1;
    for (i = 0; i < st.lines.length; i++) {
      var g = st.lines[i].gutters.indexOf(id);
      if (g >= 0) { ln = st.lines[i]; gi = g; break; }
    }
    if (!ln) { d.className = "gut barred"; d.title = CL.t("gut.barred"); return; }
    var axis = id.charAt(0) === "h" ? "h" : "v";
    var head = (axis === "h")
      ? (ln.dir === "right" ? "to-right" : "to-left")
      : (ln.dir === "down" ? "to-down" : "to-up");
    // Split the template at its `_` word seats: parts[0] is the stretch after
    // the first word, parts[1] after the second, and this gutter carries the
    // stretch that runs up to the next word. (All six lines here read right or
    // down, so the physical gap order matches the template order.)
    var parts = ln.verb.split("_");
    var frag = (parts[gi] || "").replace(/^\s+|\s+$/g, "");
    d.className = "gut shown trifecta " + axis + " " + head + " line-" + ln.color;
    d.innerHTML = '<span class="arrow" aria-hidden="true"></span><span class="label"></span>';
    d.lastChild.textContent = frag;
    d.title = CL.lineSentence(st, ln);
  }
})();
