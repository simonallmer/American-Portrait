// Crosslink — state, typing, the hint ladder, and the quiet error check.
(function () {
  var CL = window.CROSSLINK, P = null;
  var st, ghost = document.getElementById("ghost-input");

  function load(i) {
    P = CL.puzzles[i];
    // The number is the board's place on its OWN shelf. Each language counts
    // from 1: there is an English No. 1 and a German Brett № 1, and neither is
    // waiting on the other to be built.
    var eyebrowText = CL.t("play.eyebrow", { n: CL.boardNo(CL.puzzles.indexOf(P)), stars: CL.starText(CL.stars(P)) });
    var flagHtml = P.theme === "american" ? ' <a class="flag-link" href="https://simonallmer.com/americanportrait" target="_blank" rel="noopener" aria-label="American portrait"><span class="flag-icon" style="vertical-align:middle"><b></b></span></a>' : '';
    document.getElementById("eyebrow").innerHTML = eyebrowText + flagHtml;
    document.getElementById("title").textContent = P.title;
    document.getElementById("standfirst").textContent = P.size + "\u00D7" + P.size + " \u00B7 " + CL.starText(CL.stars(P));
    // The narrow sheet is 700px with 26 either side, so 648 of lattice fits in
    // it. Asked of the board rather than of its size, so a language with wider
    // gutters gets the wide sheet at 3x3 without anything here being told
    // about that language.
    document.body.classList.toggle("wide", CL.boardWidth(P) > 648);
    // A board carries its own colour. It goes on the body rather than on the
    // view, so the paper, the side windows and the chips the wires run behind
    // all turn together — one document, one colour, which is how a page of this
    // period announced what it was about.
    document.body.setAttribute("data-hue", P.hue || "");
    reset();
  }

  function reset() {
    if (typeof demoStop === "function") demoStop();
    st = {
      puzzle: P,
      edges: CL.isTrifecta(P) ? [] : CL.edgeList(P),
      lines: CL.isTrifecta(P) ? CL.lineList(P) : [],
      filled: {}, status: {}, revealed: {}, surfaced: {}, mark: {},
      // Which connections are showing their second face. Restart clears them
      // with everything else; nothing else ever does.
      flipped: {},
      selected: null, draft: [],
      check: document.getElementById("check").checked
    };
    document.getElementById("finish").hidden = true;
    document.getElementById("panel").hidden = false;
    ghost.blur();
    say("");
    draw();
  }

  // Turning a connection over. Free, uncounted, and reversible — see A11. The
  // board redraws so the sentence in the script window follows the face that is
  // showing, and so a turned gutter keeps its mark while you work elsewhere.
  CL.onTurn = function (id) {
    st.flipped[id] = !st.flipped[id];
    if (CL.sfx && CL.sfx.key) CL.sfx.key();   // before the redraw, as everywhere
    st.turning = id;   // only this gutter animates, and only on this redraw
    draw();
    st.turning = null;
  };

  function draw() {
    CL.derive(st);
    CL.render(st, pick);
    panel();
    scriptWin();
    lexWin();
    fit();
  }

  // The lattice keeps its proportions, and shrinks to the page — but only so far.
  // Past MIN_SCALE the verbs stop being readable, so the board scrolls sideways instead.
  var MIN_SCALE = 0.82;

  // …unless you ask for the whole thing. Zoomed out, the floor is lifted and
  // every square is on screen at whatever scale that takes. The verbs stop
  // being readable, and that is the entire cost — paid on purpose. What it buys
  // is the shape of the board: which squares are down, which are still open,
  // and how far the one you are working on stands from the one you have just
  // solved. That is a thing the panel cannot tell you and a sideways scroll
  // actively hides.
  //
  // It also gives back the height the board was spending, because the margin
  // that collapses the transform's layout box collapses with it — so more of
  // the sentences underneath are on screen at the same time. On a phone that
  // is half the reason to press it.
  //
  // A map, then, and not a reading view. The button says which of the two you
  // are looking at by changing its own name.
  var zoomedOut = false;

  function fit() {
    var wrap = document.querySelector(".board-scroll"), board = document.getElementById("board");
    if (!board.offsetWidth && !board.offsetHeight) return;
    board.style.transform = "none";
    board.style.margin = "0";
    var w = board.offsetWidth, h = board.offsetHeight;
    // The scale at which all of it shows. At or above MIN_SCALE the board
    // already fits and there is nothing to zoom out of — so the state is
    // dropped rather than kept, and a window dragged wide while zoomed out
    // comes back reading rather than staying tiny in a page with room to spare.
    var whole = wrap.clientWidth / w;
    if (whole >= MIN_SCALE) zoomedOut = false;
    var s = Math.min(1, zoomedOut ? whole : Math.max(MIN_SCALE, whole));
    board.style.transformOrigin = "top left";
    board.style.transform = "scale(" + s + ")";
    // Collapse the layout box the transform left behind, so the scroller measures true.
    board.style.marginRight = -Math.round(w * (1 - s)) + "px";
    board.style.marginBottom = -Math.round(h * (1 - s)) + "px";
    wrap.style.height = "";
    // When all of it is showing there is nowhere to scroll, so the scroller is
    // switched off rather than left on with nowhere to go.
    //
    // That is tidiness on a desktop and a repair on a phone. `.board-scroll`
    // carries `-webkit-overflow-scrolling: touch`, which puts it on a layer of
    // its own, and Safari does not bring that layer back when the content
    // underneath it shrinks to fit: zoom out while scrolled right and the board
    // stays parked off the left edge, leaving an empty frame where it was. A
    // clamp cannot be relied on to fix that, because the offset Safari reports
    // is the stale one. `overflow-x: hidden` can: a box with no scroll range
    // has no stale position to hold.
    var fits = w * s <= wrap.clientWidth + 1;
    if (fits) wrap.scrollLeft = 0;
    wrap.style.overflowX = fits ? "hidden" : "auto";
    // Offered only where it would do something. A control that cannot change
    // anything is worse than no control at all, and on a desktop this one never
    // could: every board on the shelf already fits its sheet there.
    var btn = document.getElementById("zoom");
    btn.hidden = whole >= MIN_SCALE;
    btn.textContent = CL.t(zoomedOut ? "play.zoomIn" : "play.zoomOut");
    btn.title = CL.t(zoomedOut ? "play.zoomInTip" : "play.zoomOutTip");
  }
  window.addEventListener("resize", function () { if (st) fit(); });

  // The hidden input is what a phone or tablet raises its keyboard for, so it
  // must not be focused while the demonstration is driving. Blurring it after
  // the fact is not enough — the keyboard has already begun to come up, and what
  // you see is it flickering open and shut. Nothing focuses it during a demo.
  function takeFocus() {
    if (typeof DEMO !== "undefined" && DEMO && DEMO.on) return;
    ghost.focus({ preventScroll: true });
  }

  function pick(r, c) {
    if (st.filled[CL.K(r, c)] !== undefined) {
      st.selected = [r, c]; st.draft = freshDraft(r, c); say("");
      lexOpen(st.filled[CL.K(r, c)]);
      draw(); takeFocus(); return;
    }
    st.selected = [r, c];
    st.draft = freshDraft(r, c);
    say("");
    draw();
    takeFocus();
  }

  function firstUnfilled() {
    for (var r = 0; r < P.size; r++)
      for (var c = 0; c < P.size; c++)
        if (!st.filled[CL.K(r, c)]) return [r, c];
    return null;
  }

  function nextCell(r, c) {
    var lines = CL.isTrifecta(P)
      ? CL.linesAt(st, r, c)
      : CL.edgesAt(st, r, c);
    for (var i = 0; i < lines.length; i++) {
      var cells = lines[i].cells;
      for (var j = 0; j < cells.length; j++) {
        if (cells[j][0] === r && cells[j][1] === c) {
          for (var k = j + 1; k < cells.length; k++) {
            if (!st.filled[CL.K(cells[k][0], cells[k][1])]) return cells[k];
          }
          for (var k = j - 1; k >= 0; k--) {
            if (!st.filled[CL.K(cells[k][0], cells[k][1])]) return cells[k];
          }
        }
      }
    }
    return firstUnfilled();
  }

  function selectNext(r, c) {
    var lines = CL.isTrifecta(P)
      ? CL.linesAt(st, r, c)
      : CL.edgesAt(st, r, c);
    for (var i = 0; i < lines.length; i++) {
      var cells = lines[i].cells;
      for (var j = 0; j < cells.length; j++) {
        if (cells[j][0] === r && cells[j][1] === c) {
          for (var k = j + 1; k < cells.length; k++) {
            if (!st.filled[CL.K(cells[k][0], cells[k][1])]) return cells[k];
          }
        }
      }
    }
    for (var i = 0; i < lines.length; i++) {
      var cells = lines[i].cells;
      for (var j = 0; j < cells.length; j++) {
        if (cells[j][0] === r && cells[j][1] === c) {
          for (var k = j - 1; k >= 0; k--) {
            if (!st.filled[CL.K(cells[k][0], cells[k][1])]) return cells[k];
          }
        }
      }
    }
    return firstUnfilled();
  }

  function move(dr, dc) {
    if (!st.selected) return;
    var r = st.selected[0] + dr, c = st.selected[1] + dc;
    if (r < 0 || r >= P.size || c < 0 || c >= P.size) return;
    st.selected = [r, c];
    st.draft = freshDraft(r, c);
    say("");
    draw();
    takeFocus();
  }

  function lift(r, c) {
    delete st.filled[CL.K(r, c)];
    st.selected = [r, c];
    st.draft = freshDraft(r, c);
    say("");
    draw();
    takeFocus();
  }

  // ---- the draft: one slot per letter ---------------------------------
  // A revealed letter already stands in its slot, so typing steps over it
  // instead of asking for a letter the board has handed over.

  // A slot the solver cannot be asked to type is seated for them. Typing only
  // ever admits A-Z (see the ghost's input handler), so a hyphen in COCA-COLA or
  // BERNERS-LEE would otherwise be a slot nobody could fill. It is printed from
  // the start, like a revealed letter that costs nothing, and `nextSlot` steps
  // over it exactly as it steps over one.
  // ...and which letters those are is a fact about the language: English is
  // A-Z, German is A-Z and the three umlauts. A square that will not take an Ä
  // cannot hold a German word, so the alphabet is asked for rather than
  // assumed.
  function seated(ch) { return !CL.language().letters.test(ch); }

  function freshDraft(r, c) {
    var ans = CL.answer(st, r, c), rev = st.revealed[CL.K(r, c)] || {}, d = [];
    for (var i = 0; i < ans.length; i++) d.push((rev[i] || seated(ans[i])) ? ans[i] : null);
    return d;
  }

  // Seats a newly revealed letter without disturbing what is already typed.
  function reseat(r, c) {
    var ans = CL.answer(st, r, c), rev = st.revealed[CL.K(r, c)] || {}, prev = st.draft, d = [];
    var keep = prev.length === ans.length;
    for (var i = 0; i < ans.length; i++)
      d.push((rev[i] || seated(ans[i])) ? ans[i] : (keep ? prev[i] : null));
    return d;
  }

  function draftFull() {
    if (!st.draft.length) return false;
    for (var i = 0; i < st.draft.length; i++) if (!st.draft[i]) return false;
    return true;
  }

  // The next slot the solver still owes — revealed and filled slots are skipped.
  function nextSlot() {
    for (var i = 0; i < st.draft.length; i++) if (!st.draft[i]) return i;
    return -1;
  }

  function typeIn(letters) {
    if (CL.sfx) CL.sfx.key();
    var r = st.selected[0], c = st.selected[1], k = CL.K(r, c);
    if (st.filled[k] !== undefined) delete st.filled[k];
    if (st.draft.length !== CL.answer(st, r, c).length) st.draft = freshDraft(r, c);
    for (var n = 0; n < letters.length; n++) {
      var i = nextSlot();
      if (i < 0) break;
      st.draft[i] = letters.charAt(n);
    }
    draw();
  }

  // ---- the clue panel -------------------------------------------------

  function panel() {
    var empty = document.getElementById("panel-empty"),
        body = document.getElementById("panel-body");
    if (!st.selected) {
      empty.hidden = false; body.hidden = true;
      empty.textContent = CL.t(Object.keys(st.filled).length ? "play.pick" : "play.pickAny");
      return;
    }
    empty.hidden = true; body.hidden = false;

    var r = st.selected[0], c = st.selected[1], k = CL.K(r, c), ans = CL.answer(st, r, c);
    var down = st.filled[k];
    document.getElementById("panel-count").textContent =
      down !== undefined ? CL.t("play.down", { word: down, n: ans.length })
                         : CL.t("play.letters", { n: ans.length });

    var ul = document.getElementById("routes");
    ul.innerHTML = "";
    if (CL.isTrifecta(P)) {
      // Two sentences pass through every square — its row and its column. Show
      // each with this square's word masked, so the square asks which of the
      // two it is.
      CL.linesAt(st, r, c).forEach(function (ln) {
        var li = document.createElement("li");
        li.className = "line " + ln.color;
        li.innerHTML = lineText(st, ln, r, c);
        ul.appendChild(li);
      });
    } else {
      CL.edgesAt(st, r, c).filter(function (e) { return st.verbVisible[e.id]; }).forEach(function (e) {
        var li = document.createElement("li");
        li.innerHTML = term(e.subject, r, c) + " " + e.verb + " " + term(e.object, r, c);
        ul.appendChild(li);
      });
    }
    if (!ul.children.length) {
      ul.innerHTML = '<li class="gap"></li>';
      ul.firstChild.textContent = CL.t("play.nothingHere");
    }
    var more = document.createElement("li");
    more.className = "more";
    more.textContent = CL.t("play.readAll");
    ul.appendChild(more);
    ul.title = CL.t("play.readAllTip");
    ul.onclick = function () { show("win-script", true); };

    var enter = document.getElementById("enter"), btn = document.getElementById("hint");

    if (down !== undefined) {
      enter.textContent = CL.t("play.takeBack");
      enter.disabled = false;
      enter.onclick = function () { lift(r, c); };
      btn.textContent = "";
      btn.hidden = true;
      document.getElementById("hint-note").textContent = CL.t("play.takeBackNote");
      return;
    }

    enter.textContent = CL.t("play.enter");
    enter.disabled = !draftFull();
    enter.onclick = function () { submit(); ghost.focus({ preventScroll: true }); };

    var h = nextHint(r, c);
    btn.hidden = false;
    btn.textContent = h ? h.label : CL.t("play.spent");
    btn.disabled = !h;
    btn.onclick = function () { if (h) { h.run(); say(h.note, true); draw(); ghost.focus({ preventScroll: true }); } };
    document.getElementById("hint-note").textContent = CL.t("play.hintNote");
  }

  function term(xy, r, c) {
    var k = CL.K(xy[0], xy[1]);
    if (st.filled[k] !== undefined) return "<em>" + st.filled[k] + "</em>";
    if (xy[0] === r && xy[1] === c) return '<span class="gap">' + dashes(CL.answer(st, r, c).length) + "</span>";
    // Every sentence is public now, so every word's length is too: the clue panel
    // and the written form must not disagree about what is knowable.
    return '<span class="gap">' + dashes(CL.answer(st, xy[0], xy[1]).length) + "</span>";
  }

  function dashes(n) { var s = ""; for (var i = 0; i < n; i++) s += "_"; return s; }

  // A trifecta line, rendered for the clue panel: subject first, then the verb
  // with its slots. A word already down is set as a link-open `em`; a word not
  // yet down is dashes showing its length.
  function lineText(st, ln, r, c) {
    var subj = ln.ordered[0], rest = ln.ordered.slice(1), i = 0;
    var verb = ln.verb.replace(/_/g, function () {
      var w = rest[i++], k = CL.K(w[0], w[1]);
      return st.filled[k] !== undefined
        ? "<em>" + st.filled[k] + "</em>"
        : '<span class="gap">' + dashes(CL.answer(st, w[0], w[1]).length) + "</span>";
    });
    var sk = CL.K(subj[0], subj[1]);
    var subject = st.filled[sk] !== undefined
      ? "<em>" + st.filled[sk] + "</em>"
      : '<span class="gap">' + dashes(CL.answer(st, subj[0], subj[1]).length) + "</span>";
    return subject + " " + verb;
  }

  // ---- the two side windows -------------------------------------------

  function show(id, on) {
    var el = document.getElementById(id);
    if (CL.sfx && el.hidden === on) CL.sfx[on ? "open" : "shut"]();
    el.hidden = !on;
    refresh();
  }

  function refresh() {
    if (st && here && here.name === "play") draw();
    else { scriptWin(); lexWin(); }
  }

  // Left: every sentence the board has surfaced, whole or half-known.
  function scriptWin() {
    if (document.getElementById("win-script").hidden) return;
    var ul = document.getElementById("script-list");
    ul.innerHTML = "";
    if (!st) { ul.innerHTML = '<li class="gap"></li>'; ul.firstChild.textContent = CL.t("script.none"); return; }
    if (CL.isTrifecta(P)) {
      st.lines.forEach(function (ln) {
        var down = 0;
        ln.ordered.forEach(function (rc) { if (st.filled[CL.K(rc[0], rc[1])] !== undefined) down++; });
        var li = document.createElement("li");
        li.className = (down === 3 ? "closed" : "open") + " line " + ln.color;
        // Rebuild with the line's own words honoured as em.
        li.innerHTML = scriptLineText(st, ln);
        Array.prototype.forEach.call(li.querySelectorAll("em"), function (em) {
          em.onclick = function () { lexOpen(em.textContent); refresh(); };
        });
        ul.appendChild(li);
      });
      if (!ul.children.length) {
        ul.innerHTML = '<li class="gap"></li>';
        ul.firstChild.textContent = CL.t("script.nothing");
      }
      return;
    }
    st.edges.forEach(function (e) {
      if (!st.verbVisible[e.id]) return;
      var s = st.filled[CL.K(e.subject[0], e.subject[1])],
          o = st.filled[CL.K(e.object[0], e.object[1])];
      var li = document.createElement("li");
      li.className = (s !== undefined && o !== undefined) ? "closed" : "open";
      li.innerHTML = piece(e.subject, s) + " " + e.verb + " " + piece(e.object, o) + ".";
      Array.prototype.forEach.call(li.querySelectorAll("em"), function (em) {
        em.onclick = function () { lexOpen(em.textContent); refresh(); };
      });
      ul.appendChild(li);
    });
    if (!ul.children.length) {
      ul.innerHTML = '<li class="gap"></li>';
      ul.firstChild.textContent = CL.t("script.nothing");
    }
  }

  function piece(xy, word) {
    if (word !== undefined) return "<em>" + word + "</em>";
    return '<span class="gap">' + dashes(CL.answer(st, xy[0], xy[1]).length) + "</span>";
  }

  // A trifecta line, whole, for the script window and the closing page: every
  // down word is a link, every blank is dashes showing its length.
  function scriptLineText(st, ln) {
    var subj = ln.ordered[0], rest = ln.ordered.slice(1), i = 0;
    var verb = ln.verb.replace(/_/g, function () {
      var w = rest[i++];
      return piece(w, st.filled[CL.K(w[0], w[1])]);
    });
    return piece(subj, st.filled[CL.K(subj[0], subj[1])]) + " " + verb;
  }

  // Right: the entry for the last word you clicked, and the words on the board.
  var lexWord = null;

  function lexOpen(word) {
    // One entry per word, whichever English it was typed in (W1a).
    lexWord = CL.canon(word);
    document.getElementById("win-lex").hidden = false;
  }

  function lexWin() {
    if (document.getElementById("win-lex").hidden) return;
    // Each language answers out of its own three tables. A German word looked
    // up in the English lexicon is not merely absent, it is a category error.
    var hand = lexWord ? CL.lexicon()[lexWord] : null;
    var reg  = lexWord ? CL.polysemes()[lexWord] : null;
    var gen  = lexWord ? CL.quarry()[lexWord] : null;
    document.getElementById("lex-word").textContent = lexWord || "";
    document.getElementById("lex-pos").textContent =
      hand ? hand.pos : (gen ? gen.k : (reg ? "n." : ""));

    var ol = document.getElementById("lex-senses"), note = document.getElementById("lex-note");
    ol.innerHTML = "";
    note.textContent = "";
    if (!lexWord) note.textContent = CL.t("lex.prompt");
    else if (!hand && !reg && !gen) note.textContent = CL.t("lex.unknown");
    else if (!hand && !reg && gen) {
      var li0 = document.createElement("li");
      li0.textContent = gen.d;
      ol.appendChild(li0);
    }
    else if (hand) {
      hand.senses.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        ol.appendChild(li);
      });
      if (reg) note.textContent = CL.t("lex.domains",
        { list: reg.map(function (x) { return x[0]; }).join(" \u00B7 ") });
    } else if (reg) {
      reg.forEach(function (x) {
        var li = document.createElement("li");
        li.innerHTML = '<b></b> \u2014 <span></span>';
        li.children[0].textContent = x[0];
        li.children[1].textContent = x[1];
        ol.appendChild(li);
      });
    }

    var where = document.getElementById("lex-where");
    where.innerHTML = "";
    if (lexWord) {
      // Every board it is set in, since 3.9 allows more than one.
      // Only the shelf you are standing in front of. A word is not "also on
      // board 4" when board 4 is in a language this page is not written in.
      var on = [];
      CL.shelf().forEach(function (i) {
        CL.puzzles[i].nouns.forEach(function (row) {
          if (row.indexOf(lexWord) >= 0 && on.indexOf(i) < 0) on.push(i);
        });
      });
      if (!on.length) where.textContent = CL.t("lex.notSet");
      else {
        where.appendChild(document.createTextNode(CL.t("lex.setIn")));
        on.forEach(function (i, n) {
          if (n) where.appendChild(document.createTextNode(CL.t("lex.and")));
          var b = document.createElement("button");
          b.type = "button"; b.className = "lex-play";
          b.textContent = "\u2116" + CL.boardNo(i) + " \u2014 " + CL.puzzles[i].title;
          b.onclick = function () { go("play", i); };
          where.appendChild(b);
        });
      }
    }

    var ul = document.getElementById("lex-list");
    ul.innerHTML = "";
    if (!st) { ul.innerHTML = '<li class="gap"></li>'; ul.firstChild.textContent = CL.t("lex.noBoard"); return; }
    for (var r = 0; r < P.size; r++) {
      for (var c = 0; c < P.size; c++) {
        var w = st.filled[CL.K(r, c)];
        if (w === undefined) continue;
        var li = document.createElement("li"), b = document.createElement("button");
        b.type = "button";
        b.textContent = w;
        if (w === lexWord) b.className = "here";
        b.onclick = (function (word) { return function () { lexOpen(word); refresh(); }; })(w);
        li.appendChild(b);
        ul.appendChild(li);
      }
    }
    if (!ul.children.length) {
      ul.innerHTML = '<li class="gap"></li>';
      ul.firstChild.textContent = CL.t("lex.empty");
    }
  }

  // ---- where in the site you are ---------------------------------------

  var SITE = "http://simonallmer.com/crosslink/";
  // A view names the string its window bar carries and, where it has one, the
  // page it stands for on the site. Neither is written out here any more: the
  // title comes from the language's own table, and the file name from the
  // language too, because a German page is not called rulebook.html.
  var VIEWS = {
    menu:    { el: "view-menu",    doc: "doc.home" },
    play:    { el: "view-play",    doc: "doc.home" },
    puzzles: { el: "view-puzzles", doc: "doc.puzzles", loc: "puzzles" },
    words:   { el: "view-words",   doc: "doc.words",   loc: "words" },
    rules:   { el: "view-rules",   doc: "doc.rules",   loc: "rules" },
    intro:   { el: "view-intro",   doc: "doc.intro",   loc: "intro" },
    promo:   { el: "view-promo",   doc: "doc.home" }
  };
  var here = null, trail = [];

  // The sites this one belongs to, offered from the location bar.
  // Not alphabetical, because alphabetical is a filing order and this is a
  // masthead: the group first, then the person, then the six studios in the
  // order they are always named, and only then the rest of the network A-Z.
  var SITES = [
    "allmergroup.com", "simonallmer.com",
    "allmercomics.com", "allmerfilms.com", "allmermusic.com",
    "allmergames.com", "allmerjournals.com", "allmersnacks.com"
  ].concat([
    "casinocamino.com", "colbu.com", "futory.com", "lunyra.com",
    "scaretales.com", "sevenwondersgames.com", "societyreview.org"
  ].sort());

  function go(name, arg, back) {
    if (typeof demoStop === "function") demoStop();
    // Going to the page you are already on is not a step, and it must not leave
    // one behind. It used to: clicking Puzzles while on Puzzles pushed Puzzles,
    // so Back sent you to the page you were looking at, and the trail never
    // emptied — nav-back was permanently enabled and, after enough of them,
    // Back from the front page walked you *forward* into a stale board. The
    // button always had this; binding Escape to it is what made it obvious.
    if (here && !back && !(here.name === name && here.arg === arg)) {
      trail.push([here.name, here.arg]);
    }
    here = { name: name, arg: arg };
    Object.keys(VIEWS).forEach(function (k) {
      document.getElementById(VIEWS[k].el).hidden = (k !== name);
    });
    if (name === "play") load(arg);
    else document.body.removeAttribute("data-hue");   // only a board is coloured
    if (name === "promo") emblem();
    if (name === "words") wordList();
    else if (name === "puzzles") puzzleIndex();
    chrome();
    document.getElementById("nav-back").disabled = !trail.length;
    window.scrollTo(0, 0);
  }

  function chrome() {
    // A language is a directory on the site, and English is the root — the way
    // it is the root of everything else here. So nothing set in English ever
    // changes address, and /de/ appears the day German does.
    var v = VIEWS[here.name], L = CL.language();
    var title = CL.t(v.doc), loc = SITE + L.dir + (v.loc ? L.loc[v.loc] : "");
    if (here.name === "play") {
      title = CL.t("doc.board", { title: P.title });
      loc = SITE + CL.language(CL.boardLang(P)).dir + P.id + "/";
    }
    document.getElementById("win-name").textContent = title;
    document.getElementById("loc").textContent = loc;
  }

  // Every word Crosslink knows: the registry, plus anything set in a board.
  // H2 was repealed at 3.9: a word may be set on more than one board. So a word
  // knows every board it is on, not the last one that happened to claim it —
  // which is what the old `board: -1` single slot silently did.
  //
  // One quarry per language, and they do not pool. The English list is the
  // registry plus the general words plus anything set in an English board; the
  // German list is the German registry plus anything set in a German one. A
  // word that exists in both — BANK is the obvious one — is two words here,
  // with two sets of senses, which is exactly what it is.
  function vocabulary() {
    var map = {}, k;
    var reg = CL.polysemes(), gen = CL.quarry(), lex = CL.lexicon();
    for (k in reg) if (reg.hasOwnProperty(k)) map[k] = { boards: [] };
    for (k in gen) if (gen.hasOwnProperty(k) && !map[k]) map[k] = { boards: [] };
    for (k in lex) if (lex.hasOwnProperty(k) && !map[k]) map[k] = { boards: [] };
    CL.shelf().forEach(function (i) {
      CL.puzzles[i].nouns.forEach(function (row) {
        row.forEach(function (w) {
          var e = map[w] || (map[w] = { boards: [] });
          if (e.boards.indexOf(i) < 0) e.boards.push(i);
        });
      });
    });
    return map;
  }

  function wordList() {
    var map = vocabulary(), words = Object.keys(map).sort();
    var onBoards = 0;
    var ul = document.getElementById("word-index");
    ul.innerHTML = "";
    words.forEach(function (w) {
      var boards = map[w].boards;
      if (boards.length) onBoards++;
      var li = document.createElement("li");
      li.className = boards.length ? "open" : "none";
      var b = document.createElement("button");
      b.type = "button"; b.className = "w"; b.textContent = w;
      b.onclick = function () { lexOpen(w); refresh(); };
      li.appendChild(b);
      boards.forEach(function (board) {
        var a = document.createElement("button");
        a.type = "button"; a.className = "b";
        a.textContent = "\u2116" + CL.boardNo(board);
        a.title = CL.t("puzzles.playTip", { title: CL.puzzles[board].title });
        a.onclick = function () { go("play", board); };
        li.appendChild(a);
      });
      ul.appendChild(li);
    });
    document.getElementById("words-sub").textContent =
      CL.t("words.sub", { n: words.length, m: onBoards });
  }

  function puzzleIndex() {
    var t = document.getElementById("puzzle-index");
    t.innerHTML = "";
    CL.shelf().filter(function (i) { return CL.puzzles[i].id !== "07-americana"; }).forEach(function (i, place) {
      var p = CL.puzzles[i];
      var tr = document.createElement("tr");
      tr.innerHTML = '<td class="no"></td><td class="ti"></td><td class="sz"></td>' +
                     '<td class="st"></td><td class="flag"></td><td class="ac"></td>';
      tr.children[0].textContent = "\u2116" + (place + 1);
      tr.children[2].textContent = p.size + "\u00D7" + p.size;
      tr.children[3].textContent = CL.starText(CL.stars(p));
      tr.children[3].className = "st stars";

      // American flag icon for American-themed puzzles
      if (p.theme === "american") {
        tr.children[4].innerHTML = '<a class="flag-link" href="https://simonallmer.com/americanportrait" target="_blank" rel="noopener" aria-label="American portrait"><span class="flag-icon" title="American theme"><b></b></span></a>';
      }

      // The title is a link, and behaves like one.
      var open = function () { go("play", i); };
      var a = document.createElement("button");
      a.type = "button"; a.className = "ti-link";
      a.textContent = p.title;
      a.onclick = open;
      tr.children[1].appendChild(a);

      var b = document.createElement("button");
      b.type = "button"; b.className = "ghost";
      b.textContent = CL.t("puzzles.play");
      b.onclick = open;
      tr.children[5].appendChild(b);
      t.appendChild(tr);
    });

    // No longer a warning. A word on two boards is a crossing between them, and
    // the footer says how many there are rather than complaining about them.
    var seen = {}, shared = [];
    CL.shelf().forEach(function (i) {
      CL.puzzles[i].nouns.forEach(function (row) { row.forEach(function (w) {
        if (seen[w] === 1) shared.push(w);
        seen[w] = (seen[w] || 0) + 1;
      }); });
    });
    var total = Object.keys(seen).length;
    document.getElementById("puzzle-foot").textContent =
      !total ? CL.t("puzzles.none")
      : shared.length ? CL.t("puzzles.shared",
          { total: total, n: shared.length, list: shared.sort().join(", ") })
      : CL.t("puzzles.alone", { total: total });
  }

  // N3b generalised: anything printed with a `data-lex` opens that entry. The
  // epigraph's attribution is the first — a name set in type on the rulebook page
  // is a word in the game like any other, and it was the one word on that page
  // you could not look up.
  Array.prototype.forEach.call(document.querySelectorAll("[data-lex]"), function (el) {
    el.title = CL.t("lookup", { word: el.getAttribute("data-lex") });
    el.onclick = function () { lexOpen(el.getAttribute("data-lex")); refresh(); };
  });

  // The daily is the day of the week. Monday is No. 1 and Sunday is No. 7, so a
  // board comes round again seven days later and the tile changes at midnight
  // without anything having to be published.
  //
  // `getDay()` counts from Sunday, and this week starts on Monday, hence the
  // shift. The modulo is the whole failure plan: with six boards on the shelf
  // Sunday falls back to No. 1, and the day a seventh is added the mapping is
  // exactly Monday-to-Sunday with nothing here to change. Wrapping is also what
  // stops the tile opening `undefined` the moment a board is withdrawn, which
  // has happened once already this month.
  // The shelf is the one for the language you are reading in, so a language
  // with one board has that board every day and a language with none has no
  // daily to open — which the tile handles rather than throwing.
  function dailyIndex() {
    var shelf = CL.shelf();
    if (!shelf.length) return -1;
    var weekday = (new Date().getDay() + 6) % 7;      // 0 = Monday ... 6 = Sunday
    return shelf[weekday % shelf.length];
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-go]"), function (a) {
    a.onclick = function (ev) {
      ev.preventDefault();
      var d = a.getAttribute("data-go");
      if (d === "daily") { var i = dailyIndex(); go(i < 0 ? "puzzles" : "play", i < 0 ? undefined : i); }
      else go(d);
    };
  });

  function navBack() {
    if (!trail.length) return;
    if (CL.sfx) CL.sfx.click();                 // the key sounds like the button
    var p = trail.pop();
    go(p[0], p[1], true);
  }
  document.getElementById("nav-back").onclick = navBack;
  document.getElementById("nav-home").onclick = function () { go("menu"); };

  // Light or dark, by the sun and moon in the toolbar. The system's preference
  // is the default; a choice made here outranks it, and is kept for the session
  // only — long enough to matter, not long enough to be a promise.
  var themeBtn = document.getElementById("theme-toggle");
  function darkNow() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paintTheme() {
    var dark = darkNow();
    themeBtn.className = "tool ico" + (dark ? " is-dark" : "");
    themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    themeBtn.title = CL.t(dark ? "nav.themeDark" : "nav.themeLight");
  }
  try {
    var kept = window.sessionStorage && sessionStorage.getItem("crosslink-theme");
    if (kept) document.documentElement.setAttribute("data-theme", kept);
  } catch (e) {}
  themeBtn.onclick = function () {
    var next = darkNow() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { if (window.sessionStorage) sessionStorage.setItem("crosslink-theme", next); } catch (e) {}
    paintTheme();
    demoTap();
  };

  // ---- the demonstration ------------------------------------------------
  //
  // Four clicks on the sun-and-moon inside four seconds and the board solves
  // itself; four more and it stops. It is for recording the game being played,
  // so the whole design brief is that it must not look like a machine:
  //
  //   * it starts at the middle, because that is where a person starts
  //   * it works outward along what it has already placed, but not always —
  //     roughly one word in five is a jump to somewhere else on the board,
  //     which is what a solver does when a far square suddenly occurs to them
  //   * within the frontier it prefers squares with more solved neighbours,
  //     because those are the ones that would actually come easiest
  //   * letters do not arrive at a constant rate, and every so often it stops
  //     mid-word for as long as it takes to think
  //   * it pauses before a word as well as during it, and longer before a long
  //     one, as though reading the clues around it first
  //
  // The randomness is bounded on purpose: the pace has to stay steady enough to
  // watch, so the jitter is a spread around a rhythm rather than free.
  var DEMO = { on: false, timer: null, taps: [] };

  function demoTap() {
    var now = Date.now();
    DEMO.taps.push(now);
    DEMO.taps = DEMO.taps.filter(function (t) { return now - t < 4000; });
    if (DEMO.taps.length < 4) return;
    DEMO.taps = [];
    if (DEMO.on) demoStop("stopped"); else demoStart();
  }

  function demoStop(why) {
    DEMO.on = false;
    if (DEMO.timer) { clearTimeout(DEMO.timer); DEMO.timer = null; }
    ghost.removeAttribute("inputmode");
    if (why) say("");
  }

  function wait(ms, fn) { DEMO.timer = setTimeout(function () { if (DEMO.on) fn(); }, ms); }
  function jitter(base, spread) { return base + Math.round((Math.random() - 0.5) * 2 * spread); }

  function demoStart() {
    if (!st || !here || here.name !== "play") return;
    DEMO.on = true;
    // Belt and braces on top of takeFocus(): if anything at all reaches the
    // hidden input while this is running, inputmode="none" stops a soft keyboard
    // coming up for it. Blur once here in case it already had focus.
    ghost.setAttribute("inputmode", "none");
    ghost.blur();
    wait(700, demoWord);
  }

  // Which square a person would go to next.
  function demoPick() {
    var open = [], r, c;
    for (r = 0; r < P.size; r++) for (c = 0; c < P.size; c++)
      if (st.filled[CL.K(r, c)] === undefined) open.push([r, c]);
    if (!open.length) return null;

    var done = Object.keys(st.filled).length;
    if (!done) return P.centre.slice();

    // How many placed words each open square already touches.
    var scored = open.map(function (rc) {
      var n = CL.edgesAt(st, rc[0], rc[1]).filter(function (e) {
        var o = CL.other(e, rc[0], rc[1]);
        return st.filled[CL.K(o[0], o[1])] !== undefined;
      }).length;
      return { rc: rc, n: n };
    });
    var touching = scored.filter(function (x) { return x.n > 0; });

    // One word in five, go somewhere else entirely — but only if there is
    // somewhere else, and never at the very start.
    var elsewhere = scored.filter(function (x) { return x.n === 0; });
    if (elsewhere.length && done > 1 && Math.random() < 0.2)
      return pickOne(elsewhere).rc;
    if (!touching.length) return pickOne(scored).rc;

    // Otherwise the best-connected square, with the near-misses still in play.
    var best = Math.max.apply(null, touching.map(function (x) { return x.n; }));
    var top = touching.filter(function (x) { return x.n >= best - (Math.random() < 0.35 ? 1 : 0); });
    return pickOne(top).rc;
  }

  function demoWord() {
    if (!DEMO.on) return;
    var rc = demoPick();
    if (!rc) { demoStop(); return; }
    var ans = CL.answer(st, rc[0], rc[1]);
    pick(rc[0], rc[1]);
    // A beat to read the square's clues, longer for a longer word.
    wait(jitter(520 + ans.length * 45, 220), function () { demoLetter(ans, 0); });
  }

  function demoLetter(ans, i) {
    if (!DEMO.on) return;
    if (i >= ans.length) {
      wait(jitter(560, 200), function () {
        submit();
        if (Object.keys(st.filled).length >= P.size * P.size) { demoStop(); return; }
        wait(jitter(760, 320), demoWord);
      });
      return;
    }
    if (!/[A-Z]/.test(ans.charAt(i))) { demoLetter(ans, i + 1); return; }   // seated already
    typeIn(ans.charAt(i));
    // Most letters come quickly; now and then the hand stops.
    var pause = Math.random() < 0.13 ? jitter(620, 260) : jitter(155, 65);
    wait(Math.max(70, pause), function () { demoLetter(ans, i + 1); });
  }

  // Leaving the board or restarting it ends the demonstration. Hooked at the
  // source rather than by reassigning `reset`, which could never have worked:
  // the Restart button was bound to the original function long before this line.
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", paintTheme);
  }
  paintTheme();

  var soundBtn = document.getElementById("sound-toggle");
  function paintSound() {
    var on = !CL.sfx || CL.sfx.isOn();
    soundBtn.textContent = CL.t(on ? "nav.soundOn" : "nav.soundOff");
    soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
    soundBtn.classList.toggle("off", !on);
  }
  soundBtn.onclick = function () {
    CL.sfx.on(!CL.sfx.isOn());
    paintSound();
  };

  // The emblem is the index in miniature: click it once and it numbers itself,
  // click a square and you are on that board.
  var hero = document.getElementById("hero"), numbered = false;
  hero.onclick = function () {
    if (numbered) return;
    numbered = true;
    hero.classList.add("numbered");
    document.getElementById("hero-note").textContent = CL.t("hero.picked");
  };
  // The nine squares are the first nine boards of the language you are reading
  // in, so the emblem is a picture of that shelf and of how young it is. It has
  // to be redrawn when the language turns: a square that opened No. 4 in
  // English opens nothing at all in German, and must not go on offering to.
  function paintHero() {
    var shelf = CL.shelf();
    Array.prototype.forEach.call(hero.querySelectorAll(".cell"), function (g) {
      var i = shelf[+g.getAttribute("data-n") - 1];
      g.classList.toggle("empty", i === undefined);
      g.onclick = function (ev) {
        if (!numbered) return;
        ev.stopPropagation();
        if (i !== undefined) go("play", i);
      };
    });
    document.getElementById("hero-note").textContent = CL.t(numbered ? "hero.picked" : "hero.note");
  }

  var siteList = document.getElementById("sitelist"), siteArrow = document.getElementById("loc-arrow");
  SITES.forEach(function (host) {
    var li = document.createElement("li"), a = document.createElement("a");
    a.href = "https://" + host;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "http://" + host + "/";
    li.appendChild(a);
    siteList.appendChild(li);
  });
  function sites(on) {
    siteList.hidden = !on;
    siteArrow.setAttribute("aria-expanded", on ? "true" : "false");
  }
  siteArrow.onclick = function (ev) { ev.stopPropagation(); langs(false); sites(siteList.hidden); };
  document.addEventListener("click", function () { sites(false); langs(false); });

  // ---- the language -----------------------------------------------------
  //
  // A list and not a switch, because two is where this starts and not where it
  // stops. It sits with the sound and the light rather than with the location,
  // because it is a preference about the reader and not a place on the site —
  // even though, one line down in `chrome`, it turns out to be both.
  var langBtn = document.getElementById("lang-toggle"),
      langNow = document.getElementById("lang-now"),
      langList = document.getElementById("langlist");

  CL.languages.forEach(function (L) {
    var li = document.createElement("li"), b = document.createElement("button");
    b.type = "button";
    b.lang = L.code;                       // so a screen reader says the name right
    b.textContent = L.name;                // in that language, never translated
    b.onclick = function (ev) { ev.stopPropagation(); langs(false); setLang(L.code); };
    li.appendChild(b);
    langList.appendChild(li);
  });

  function langs(on) {
    langList.hidden = !on;
    langBtn.setAttribute("aria-expanded", on ? "true" : "false");
  }
  langBtn.onclick = function (ev) { ev.stopPropagation(); sites(false); langs(langList.hidden); };

  // The change is a turn of the page and not a flicker. The whole desktop goes
  // out, every string is replaced while nothing is being read, and it comes
  // back — which is why the strings are written into the document rather than
  // the document being rebuilt: the layout never moves, so there is nothing to
  // see between the two halves of the fade.
  var TURN = 150;

  function turn(fn) {
    var el = document.querySelector(".desktop");
    if (!el) { fn(); return; }
    el.classList.add("turning");
    setTimeout(function () {
      fn();
      // One frame for the new text to land in. Lifting the class in the same
      // tick as the swap shows the first frame of the fade with the old
      // page's measurements still in it.
      if (window.requestAnimationFrame) requestAnimationFrame(function () { el.classList.remove("turning"); });
      else el.classList.remove("turning");
    }, TURN);
  }

  // Everything in the document that is written in a language, put back in the
  // one now showing. `data-i18n` is for labels, `data-lang` for whole blocks of
  // prose — the rulebook is written twice rather than translated key by key,
  // because a rulebook is a piece of writing and not a row of buttons.
  function paintStrings() {
    function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
    each("[data-i18n]",       function (el) { el.textContent = CL.t(el.getAttribute("data-i18n")); });
    each("[data-i18n-html]",  function (el) { el.innerHTML = CL.t(el.getAttribute("data-i18n-html")); });
    each("[data-i18n-title]", function (el) { el.title = CL.t(el.getAttribute("data-i18n-title")); });
    each("[data-i18n-label]", function (el) { el.setAttribute("aria-label", CL.t(el.getAttribute("data-i18n-label"))); });
    each("[data-lang]",       function (el) { el.hidden = el.getAttribute("data-lang") !== CL.lang; });
    each("[data-lex]",        function (el) { el.title = CL.t("lookup", { word: el.getAttribute("data-lex") }); });
    langNow.textContent = CL.language().name;
    langNow.lang = CL.lang;
    paintTheme();
    paintSound();
    paintHero();
  }

  function setLang(code) {
    if (code === CL.lang || CL.language(code).code !== code) return;
    if (CL.sfx) CL.sfx.click();
    turn(function () {
      CL.lang = code;
      try { if (window.sessionStorage) sessionStorage.setItem("crosslink-lang", code); } catch (e) {}
      document.documentElement.setAttribute("lang", code);
      CL.statusForget();
      paintStrings();
      // The board you were on is not on the shelf you are now standing in
      // front of, so the one page that cannot simply be repainted is a board.
      // It goes to the index rather than to some other language's No. 1: the
      // honest answer to changing language mid-board is here is that
      // language's shelf, not here is a board you did not ask for.
      var name = (here && here.name === "play") ? "puzzles" : (here ? here.name : "menu");
      go(name, name === here.name ? here.arg : undefined, true);
    });
  }

  // Kept for the session only, the same as the theme and for the same reason:
  // long enough to matter, not long enough to be a promise. English is the
  // default and is not sniffed from the browser — a German reader arriving on
  // six English boards and one German one is better served by the widest shelf
  // and a button than by being shown the narrowest without being asked.
  try {
    var keptLang = window.sessionStorage && sessionStorage.getItem("crosslink-lang");
    if (keptLang && CL.language(keptLang).code === keptLang) {
      CL.lang = keptLang;
      document.documentElement.setAttribute("lang", keptLang);
    }
  } catch (e) {}
  // Escape unwinds, innermost thing first: the site list if it is open, then the
  // square you are standing on, then the page you are on. Only the last of those
  // is new — the other two were already bound, and putting "go back" underneath
  // them rather than over them is the whole of the design. Escape should never
  // take the page out from under someone who only meant to shut a menu.
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    if (ev.defaultPrevented) return;            // something nearer already took it
    if (!langList.hidden) { langs(false); return; }
    if (!siteList.hidden) { sites(false); return; }
    // The square, whether or not the hidden input happens to hold focus. When it
    // does, its own handler has already run and preventDefault kept us out.
    if (here && here.name === "play" && st && st.selected) {
      st.selected = null; st.draft = []; draw(); return;
    }
    navBack();
  });

  document.getElementById("x-script").onclick = function () { show("win-script", false); };
  document.getElementById("x-lex").onclick = function () { show("win-lex", false); };
  document.getElementById("x-main").onclick = function () { location.href = "https://simonallmer.com"; };

  // ---- the emblem -----------------------------------------------------
  //
  // The masthead, square, at whatever size the frame will give it: a
  // promotional image of the game rather than a picture of a board. Shift+A
  // from the front page.
  //
  // It is its own SVG rather than the front page's banner in a square box. That
  // banner's art is a 600x210 field sliced to fit, so in a square container the
  // browser scales it on the taller axis and crops away two thirds of the
  // width — four of the six rays go off the sides, and the thing that survives
  // is a gradient. The recipe is shared (A7b) and the composition is not: same
  // sky, same dither, same glow, same gold, rays laid out for a square.
  //
  // Type is drawn in the SVG rather than set in HTML over it, so the whole
  // emblem is one object that scales without a font size having to agree with a
  // container width — which is what a promotional image is for.

  var EM_SKY = [
    '<defs>',
    '<linearGradient id="em-sky" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0" stop-color="#123A63"/><stop offset="0.55" stop-color="#0D2A48"/>',
    '<stop offset="1" stop-color="#0A1D33"/></linearGradient>',
    '<pattern id="em-dither" width="4" height="4" patternUnits="userSpaceOnUse">',
    '<rect width="4" height="4" fill="none"/>',
    '<rect x="0" y="0" width="1" height="1" fill="#FFFFFF" opacity="0.10"/>',
    '<rect x="2" y="2" width="1" height="1" fill="#FFFFFF" opacity="0.06"/></pattern>',
    '<radialGradient id="em-glow" cx="0.5" cy="0.62" r="0.62">',
    '<stop offset="0" stop-color="#2E7FA8" stop-opacity="0.85"/>',
    '<stop offset="1" stop-color="#2E7FA8" stop-opacity="0"/></radialGradient>',
    '</defs>'
  ].join("");

  // Six rays from a low apex, as on the front page. Four leave through the top
  // and two through the sides, which is what stops a square reading as a fan.
  var EM_RAYS = [
    [70, 160], [215, 268], [332, 385], [440, 530]
  ].map(function (r) {
    return '<path d="M300 588 L' + r[0] + ' 0 L' + r[1] + ' 0 Z"/>';
  }).concat([
    '<path d="M300 588 L0 118 L0 196 Z"/>',
    '<path d="M300 588 L600 118 L600 196 Z"/>'
  ]).join("");

  var EM_SERIF = "\'Times New Roman\', Times, Georgia, serif";

  function up(s) {
    return String(s).toUpperCase().replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function emblem() {
    var out = ['<svg viewBox="0 0 600 600" role="img" aria-label="' +
               CL.t("emblem.label").replace(/"/g, "&quot;") + '">'];
    out.push(EM_SKY);
    out.push('<rect width="600" height="600" fill="url(#em-sky)"/>');
    out.push('<g class="rays">' + EM_RAYS + '</g>');
    out.push('<rect width="600" height="600" fill="url(#em-glow)"/>');
    out.push('<rect width="600" height="600" fill="url(#em-dither)"/>');

    // The name twice: the lower copy is the drop shadow the masthead sets in
    // CSS as `text-shadow: 3px 3px 0 #06172B`, which SVG has no equivalent for.
    // Set in capitals, out of the same two strings the banner uses, so the
    // masthead and the emblem cannot come to disagree about what the game is
    // called in a language.
    out.push('<text class="em-kick" x="300" y="248">' + up(CL.t("banner.kicker")) + '</text>');
    out.push('<text class="em-name em-shadow" x="304" y="334">CROSSLINK</text>');
    out.push('<text class="em-name" x="300" y="330">CROSSLINK</text>');
    out.push('<rect class="em-rule" id="em-rule-l" x="0" y="372" width="40" height="3"/>');
    out.push('<text class="em-sub" x="300" y="378">' + up(CL.t("banner.sub")) + '</text>');
    out.push('<rect class="em-rule" id="em-rule-r" x="0" y="372" width="40" height="3"/>');
    out.push('</svg>');
    var host = document.getElementById("promo");
    host.innerHTML = out.join("");

    var svg = host.firstChild;
    emFit(svg);
    // Measured once is measured too early. Text metrics before the face has
    // settled are the fallback's, and a fallback is narrower — which threw the
    // rules inward, across the letters. Nothing here is expensive, so it is
    // simply done again once the fonts report ready.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { emFit(svg); });
  }

  // Everything that depends on a measurement, in one place, safe to run twice.
  function emFit(svg) {
    // Letter-spacing puts a gap after the LAST letter too, so a middle-anchored
    // line sits half a gap right of centre. All three lines are tracked and the
    // widest is tracked most, so they would agree neither with each other nor
    // with the box.
    function centre(el, extra) {
      var track = parseFloat(getComputedStyle(el).letterSpacing) || 0;
      el.setAttribute("x", 300 - track / 2 + (extra || 0));
    }
    // `.em-name` matches the shadow too, and the shadow comes first in document
    // order — selecting on it re-centred the shadow and left the name where it
    // was, so the drop shadow sat exactly behind the letters and did not show.
    centre(svg.querySelector(".em-kick"));
    centre(svg.querySelector(".em-name.em-shadow"), 4);
    centre(svg.querySelector(".em-name:not(.em-shadow)"));
    centre(svg.querySelector(".em-sub"));

    // The rules go off the ends of the subtitle's INK — `getBBox` and not
    // `getComputedTextLength`, because the advance width carries the trailing
    // letter-space and the ink does not, and it is the ink they must clear.
    var sub = svg.querySelector(".em-sub"), box = sub.getBBox();
    // A hidden or unlaid-out element measures zero. Taking that at face value
    // makes the half-width negative and puts BOTH rules inside the word, which
    // is a line through the middle of the subtitle rather than a rule beside
    // it. If there is no measurement, draw no rules.
    var ok = box.width > 40;
    // 26 units held the rules too far off; the masthead sets its own at about
    // 19 and 11 either side of the words. 16 is nearer that and still four
    // times the clearance a rule needs not to read as a strikethrough.
    var gap = 16, len = 40;
    var l = svg.querySelector("#em-rule-l"), r = svg.querySelector("#em-rule-r");
    l.setAttribute("visibility", ok ? "visible" : "hidden");
    r.setAttribute("visibility", ok ? "visible" : "hidden");
    if (!ok) return;
    l.setAttribute("x", box.x - gap - len);
    r.setAttribute("x", box.x + box.width + gap);
  }

  // ---- the hint ladder: a verb first, letters second, the word last ----

  function nextHint(r, c) {
    var k = CL.K(r, c), ans = CL.answer(st, r, c);
    var hidden = CL.edgesAt(st, r, c).filter(function (e) { return !st.verbVisible[e.id]; });
    if (hidden.length) {
      return { label: CL.t("hint.link"), note: CL.t("hint.linkNote"),
        run: function () { st.surfaced[pickOne(hidden).id] = true; } };
    }
    var rev = st.revealed[k] || (st.revealed[k] = {});
    var missing = [];
    for (var i = 0; i < ans.length; i++) if (!rev[i]) missing.push(i);
    if (missing.length > 1) {
      return { label: CL.t("hint.letter"), note: CL.t("hint.letterNote"),
        run: function () { rev[pickOne(missing)] = true; st.mark[k] = "partial"; st.draft = reseat(r, c); } };
    }
    return { label: CL.t("hint.word"), note: CL.t("hint.wordNote"),
      run: function () { st.filled[k] = ans; st.mark[k] = "given"; st.status[k] = "given"; st.selected = null; st.draft = []; } };
  }

  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ---- entering a word ------------------------------------------------

  function submit() {
    if (!st.selected) return;
    var r = st.selected[0], c = st.selected[1], k = CL.K(r, c),
        ans = CL.answer(st, r, c);

    if (!draftFull()) { say(CL.t("msg.takes", { n: ans.length })); return; }
    var w = st.draft.join("").toUpperCase();
    // Compared as one word, so CENTER cannot be set down beside CENTRE.
    //
    // A word only counts as spent if it is RIGHT where it stands. A wrong word
    // is an error occupying a square, not a word used up, and refusing to let
    // you write it where it does belong was the board holding your own mistake
    // against you — the one place in the game where being wrong once cost you
    // something later.
    //
    // With the check off the rule stays structural, and deliberately: there,
    // the board makes no claim about right and wrong, so any placement blocks.
    // Dedupe against correct placements only and a refusal would announce that
    // the word already down is correct, which is a verdict, and A8b says the
    // speakers and the page are both silent on verdicts while the check is off.
    var dup = Object.keys(st.filled).filter(function (kk) {
      if (!CL.same(st.filled[kk], w)) return false;
      if (!st.check) return true;
      var rc = kk.split(",");
      return CL.same(st.filled[kk], CL.answer(st, +rc[0], +rc[1]));
    });
    if (dup.length) { say(CL.t("msg.dup", { word: w })); return; }

    st.filled[k] = w;
    st.status[k] = st.mark[k] || "clean";
    say("");
    if (st.check && CL.same(w, ans)) {
      var nxt = selectNext(r, c);
      if (nxt) { st.selected = nxt; st.draft = freshDraft(nxt[0], nxt[1]); }
      else { st.selected = null; st.draft = []; }
    } else {
      st.selected = null; st.draft = [];
    }
    say("");
    // The noise first, then the board. A full redraw of a 5x5 is eighty-one
    // elements and some six milliseconds, and it used to sit between the key
    // going down and the sound coming out for no reason at all: the sound is
    // the answer to what you just did, the redraw is only its consequence.
    if (CL.sfx) {
      if (st.check) CL.sfx[CL.same(w, ans) ? "good" : "bad"]();
      else CL.sfx.place();
    }
    draw();
    checkWin();
  }

  // Shift+S gives the whole board up, but only if pressed twice in under a
  // second — to prevent accidental solves. Everything it fills is marked
  // given, and the report at the close says so — there is no way to take the
  // board this way and have it read as solved.
  var lastShiftS = 0;
  function giveUp() {
    if (!st || !here || here.name !== "play") return;
    for (var r = 0; r < P.size; r++) {
      for (var c = 0; c < P.size; c++) {
        var k = CL.K(r, c);
        st.filled[k] = CL.answer(st, r, c);
        st.status[k] = "given";
        st.mark[k] = "given";
      }
    }
    st.selected = null;
    st.draft = [];
    say(CL.t("msg.gaveUp"), true);
    if (CL.sfx) CL.sfx.giveup();
    draw();
    finish(true);
  }

  function checkWin() {
    for (var r = 0; r < P.size; r++) for (var c = 0; c < P.size; c++) {
      if (!CL.same(st.filled[CL.K(r, c)], CL.answer(st, r, c))) return;
    }
    finish();
  }

  function finish(gaveUp) {
    var clean = 0, partial = 0, given = 0;
    Object.keys(st.status).forEach(function (k) {
      if (st.status[k] === "clean") clean++;
      else if (st.status[k] === "partial") partial++;
      else given++;
    });
    var bits = [CL.t("finish.clean", { n: clean })];
    if (partial) bits.push(CL.t("finish.partial", { n: partial }));
    if (given) bits.push(CL.t("finish.given", { n: given }));
    document.getElementById("finish-sub").textContent = bits.join(", ") + ".";

    var ul = document.getElementById("sentences");
    ul.innerHTML = "";
    if (CL.isTrifecta(P)) {
      // At the close every word is down, so each line is a full sentence with
      // all three of its words set in type.
      st.lines.forEach(function (ln) {
        var li = document.createElement("li");
        li.className = "line " + ln.color;
        li.innerHTML = '<span class="n"></span> ' + ln.verb.replace(/_/g, '<span class="n"></span>');
        var words = ln.ordered, i = 0;
        Array.prototype.forEach.call(li.querySelectorAll(".n"), function (n) {
          n.textContent = st.filled[CL.K(words[i][0], words[i][1])];
          n.title = CL.t("lookup", { word: n.textContent });
          n.onclick = (function (word) { return function () { lexOpen(word); refresh(); }; })(n.textContent);
          i++;
        });
        ul.appendChild(li);
      });
    } else {
    st.edges.forEach(function (e) {
      var li = document.createElement("li");
      li.innerHTML = '<span class="n"></span> ' + e.verb + ' <span class="n"></span>.';
      li.children[0].textContent = st.filled[CL.K(e.subject[0], e.subject[1])];
      li.children[1].textContent = st.filled[CL.K(e.object[0], e.object[1])];
      // Every word on the closing page opens its entry, the same as everywhere
      // else a word is set in type. A word that looks like a link is one.
      Array.prototype.forEach.call(li.children, function (n) {
        n.title = CL.t("lookup", { word: n.textContent });
        n.onclick = function () { lexOpen(n.textContent); refresh(); };
      });
      ul.appendChild(li);
    });
    }
    if (CL.sfx && !gaveUp) CL.sfx.close();
    document.getElementById("panel-empty").textContent = "";
    document.getElementById("panel").hidden = true;
    document.getElementById("finish").hidden = false;
    document.getElementById("finish").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function say(msg, ok) {
    var el = document.getElementById("message");
    el.textContent = msg || "";
    el.className = "message" + (ok ? " ok" : "");
  }

  // ---- input ----------------------------------------------------------

  function back() {
    if (!st.selected) return;
    var r = st.selected[0], c = st.selected[1], k = CL.K(r, c);
    if (st.filled[k] !== undefined) { lift(r, c); return; }
    var rev = st.revealed[k] || {};
    for (var i = st.draft.length - 1; i >= 0; i--) {
      if (st.draft[i] && !rev[i]) { st.draft[i] = null; break; }
    }
    draw();
  }

  // iOS (and any IME) treats predictive-text entry as a *composition*: the
  // letters are tentative until the user taps a suggestion or presses space.
  // During a composition the `input` event fires with the in-progress text, and
  // clearing `ghost.value` underneath it cancels the composition mid-flight —
  // which makes iOS lose the keystroke or scroll the viewport to the hidden
  // input. The fix is to leave the value alone while composing, and process the
  // committed text once on `compositionend`.
  var composing = false;

  ghost.addEventListener("compositionstart", function () { composing = true; });
  ghost.addEventListener("compositionend", function () {
    composing = false;
    var letters = ghost.value.toUpperCase().replace(CL.language().strip, "");
    ghost.value = "";
    if (!st || !st.selected || !letters) return;
    typeIn(letters);
  });

  ghost.addEventListener("input", function (ev) {
    if (composing) return;            // let compositionend handle it
    if (ev.inputType === "deleteContentBackward" || ev.inputType === "deleteContentForward") {
      ghost.value = "";
      back();
      return;
    }
    var letters = ghost.value.toUpperCase().replace(CL.language().strip, "");
    ghost.value = "";
    if (!st.selected || !letters) return;
    typeIn(letters);
  });

  ghost.addEventListener("keydown", function (ev) {
    // Shift+S gives the board up, and it is Shift+S everywhere — with a square
    // selected or without one. A bare S used to do it while nothing was
    // selected, which meant one stray keystroke before you had clicked anywhere
    // threw the whole board away. Giving up is the one move that cannot be
    // taken back, so it is the one move that asks for two keys.
    if ((ev.key === "s" || ev.key === "S") && ev.shiftKey) {
      ev.preventDefault();
      var now = Date.now();
      if (now - lastShiftS < 1000) { lastShiftS = 0; giveUp(); }
      else { lastShiftS = now; say(CL.t("msg.giveUpConfirm") || "Press Shift+S again to solve"); }
      return;
    }
    if (!st || !st.selected) return;
    if (ev.key === "Backspace") { ev.preventDefault(); back(); }
    else if (ev.key === "Enter") { ev.preventDefault(); submit(); }
    else if (ev.key === "Escape") { ev.preventDefault(); st.selected = null; st.draft = []; draw(); }
    else if (ev.key === "ArrowUp")    { ev.preventDefault(); move(-1, 0); }
    else if (ev.key === "ArrowDown")  { ev.preventDefault(); move(1, 0); }
    else if (ev.key === "ArrowLeft")  { ev.preventDefault(); move(0, -1); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); move(0, 1); }
  });

  document.addEventListener("keydown", function (ev) {
    if (document.activeElement === ghost) return;
    // Shift+S does two things, and which one depends on where you are standing.
    // On a board it gives the board up; on the front page it opens the note,
    // which is the only way in to that page for now. The two never overlap —
    // `giveUp` has always refused to run anywhere but `play` — so this is a
    // second use of a free key rather than a key doing double duty.
    if ((ev.key === "s" || ev.key === "S") && ev.shiftKey) {
      ev.preventDefault();
      var now = Date.now();
      if (now - lastShiftS < 1000) {
        lastShiftS = 0;
        if (here && here.name === "menu") go("intro"); else giveUp();
      } else {
        lastShiftS = now;
        say(CL.t("msg.giveUpConfirm") || "Press Shift+S again to solve");
      }
      return;
    }
    // Shift+A, from the front page only: the emblem, filled in and square.
    if ((ev.key === "a" || ev.key === "A") && ev.shiftKey && here && here.name === "menu") {
      ev.preventDefault(); go("promo"); return;
    }
    // `st` does not exist until a board has been loaded, so this has to test for
    // the state before it tests the state. It threw on every keystroke made on
    // the front page — harmless while nobody typed there, and not harmless now
    // that the front page is somewhere you press a key on purpose (A14).
    if (!st || !st.selected) return;
    if (ev.key.length === 1 && CL.language().letters.test(ev.key.toUpperCase())) {
    ghost.focus({ preventScroll: true });
    typeIn(ev.key.toUpperCase());
    }
  });

  document.getElementById("check").addEventListener("change", function (ev) {
    st.check = ev.target.checked; draw();
  });
  document.getElementById("restart").addEventListener("click", reset);
  // Zooming changes how much of the board you can see and nothing about what is
  // on it, so it redraws nothing: `fit` is the whole of the work.
  document.getElementById("zoom").addEventListener("click", function () {
    zoomedOut = !zoomedOut;
    if (CL.sfx) CL.sfx.click();
    fit();
  });

  // The rulebook ends with the same drawing the note opens with. Cloned rather
  // than repeated in the markup, so tools/make-figure.py stays the one source
  // and a regenerated figure cannot land on one page and not the other.
  (function () {
    var src = document.querySelector("#view-intro .fig"),
        dst = document.querySelector("#rules-fig .fig-scroll");
    if (src && dst) dst.appendChild(src.cloneNode(true));
  })();

  paintStrings();

  var hash = window.location.hash;
  if (hash.indexOf('#play-') === 0) {
    var idx = parseInt(hash.replace('#play-', ''), 10);
    if (!isNaN(idx)) {
      go("play", idx);
    } else {
      go("menu");
    }
  } else {
    go("menu");
  }
})();
