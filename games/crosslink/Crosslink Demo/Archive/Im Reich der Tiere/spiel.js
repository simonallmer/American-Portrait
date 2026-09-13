/* Im Reich der Tiere — ein Crosslink-Brett, für sich allein lauffähig.
   Die Regeln sind die der Engine des Spiels: das Gitter, die Sichtbarkeit,
   die Leiter der Hinweise, die zweite Seite jeder Verbindung. */
(function () {
"use strict";

var P = JSON.parse(document.getElementById("brett").textContent);
var N = P.size, SPEICHER = "crosslink-" + P.id;
var K = function (r, c) { return r + "," + c; };

/* ---- Umlaute -----------------------------------------------------
   Getippt wird A, O, U; auf dem Brett stehen Ä, Ö, Ü. Verglichen wird
   immer die entpunktete Form, hingeschrieben immer die richtige. */
function norm(s) {
  return String(s).toUpperCase()
    .replace(/Ä/g, "A").replace(/Ö/g, "O").replace(/Ü/g, "U").replace(/ß/g, "S");
}

/* ---- die Kanten --------------------------------------------------- */
function kante(id, d, a, b, fwd) {
  var eq = d.kind === "eq", f = d.dir === fwd;
  return { id: id, verb: d.verb, verb2: d.verb2 || null, neu: !!d.neu, kind: eq ? "eq" : "dir",
           arrow: eq ? null : (fwd === "right" ? (f ? "→" : "←")
                                               : (f ? "↓" : "↑")),
           subject: eq ? a : (f ? a : b), object: eq ? b : (f ? b : a), cells: [a, b] };
}
var KANTEN = (function () {
  var out = [], r, g, c, d;
  for (r = 0; r < N; r++) for (g = 0; g < N - 1; g++) {
    d = P.h[r][g]; if (d) out.push(kante("h:" + r + ":" + g, d, [r, g], [r, g + 1], "right"));
  }
  for (g = 0; g < N - 1; g++) for (c = 0; c < N; c++) {
    d = P.v[g][c]; if (d) out.push(kante("v:" + g + ":" + c, d, [g, c], [g + 1, c], "down"));
  }
  return out;
})();
function kantenAn(r, c) {
  return KANTEN.filter(function (e) {
    return e.cells.some(function (x) { return x[0] === r && x[1] === c; });
  });
}
function andere(e, r, c) {
  return (e.cells[0][0] === r && e.cells[0][1] === c) ? e.cells[1] : e.cells[0];
}
function antwort(r, c) { return P.nouns[r][c]; }
function gesicht(e) { return (e.verb2 && st.flipped[e.id]) ? e.verb2 : e.verb; }
function satz(e) {
  return antwort(e.subject[0], e.subject[1]) + " " + gesicht(e) + " " +
         antwort(e.object[0], e.object[1]) + ".";
}

/* ---- der Stand ---------------------------------------------------- */
var st = { filled: {}, given: {}, revealed: {}, flipped: {}, selected: null, draft: [], falsch: null };

function laden() {
  try {
    var raw = localStorage.getItem(SPEICHER);
    if (!raw) return;
    var s = JSON.parse(raw);
    if (s && s.id === P.id) {
      st.filled = s.filled || {}; st.given = s.given || {};
      st.revealed = s.revealed || {}; st.flipped = s.flipped || {};
    }
  } catch (e) { /* privates Fenster, gelöschte Daten: dann eben von vorn */ }
}
function sichern() {
  try {
    localStorage.setItem(SPEICHER, JSON.stringify({
      id: P.id, filled: st.filled, given: st.given, revealed: st.revealed, flipped: st.flipped }));
  } catch (e) {}
}

/* Erreichbar: die Mitte, und jedes Feld, dessen Nachbar schon steht. */
function erreichbar() {
  var out = {}, r, c;
  out[K(P.centre[0], P.centre[1])] = true;
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
    kantenAn(r, c).forEach(function (e) {
      var o = andere(e, r, c);
      if (st.filled[K(o[0], o[1])] !== undefined) out[K(r, c)] = true;
    });
  }
  return out;
}

/* ---- zeichnen ----------------------------------------------------- */
/* Die Maße der Engine sind für englische Sätze gesetzt (112/104/56/54 auf
   einem 5x5). Deutsch ist länger — "ist so nah verwandt, dass es gemeinsame
   Junge gibt: er und ein" lief bei 118/56 auf fünf Zeilen und über die Gasse
   hinaus. Gemessen, nicht geraten: so bleibt keine Verbindung über vier
   Zeilen, auf beiden Brettgrößen. Ein kleineres Gitter bekommt größere
   Felder, genau wie im Spiel. */
var MASS = N >= 5 ? { noun: 112, gut: 136, row: 70, gutRow: 64 }
                  : { noun: 150, gut: 176, row: 84, gutRow: 78 };
var brett = document.getElementById("board");

function zeichnen() {
  var n = 2 * N - 1, cols = [], rows = [], i, R, C, reach = erreichbar();
  for (i = 0; i < n; i++) {
    cols.push((i % 2 === 0 ? MASS.noun : MASS.gut) + "px");
    rows.push((i % 2 === 0 ? MASS.row : MASS.gutRow) + "px");
  }
  brett.style.gridTemplateColumns = cols.join(" ");
  brett.style.gridTemplateRows = rows.join(" ");
  brett.innerHTML = "";
  for (R = 0; R < n; R++) for (C = 0; C < n; C++) {
    var d = document.createElement("div");
    if (R % 2 === 0 && C % 2 === 0) malenWort(d, R / 2, C / 2, reach);
    else if (R % 2 === 0) malenGasse(d, "h:" + (R / 2) + ":" + ((C - 1) / 2), "h");
    else if (C % 2 === 0) malenGasse(d, "v:" + ((R - 1) / 2) + ":" + (C / 2), "v");
    else d.className = "dead";
    brett.appendChild(d);
  }
  passen();
  standAnzeigen();
  knopfStand();
}

function malenWort(d, r, c, reach) {
  var k = K(r, c), ans = antwort(r, c), wort = st.filled[k], i;
  d.className = "noun"; d.setAttribute("role", "gridcell");
  if (st.selected && st.selected[0] === r && st.selected[1] === c) d.classList.add("selected");
  if (st.falsch === k) d.classList.add("wrong");

  if (wort !== undefined) {
    d.classList.add(st.given[k] ? "given" : "done");
    var w = document.createElement("span"); w.className = "word";
    for (i = 0; i < wort.length; i++) {
      var sp = document.createElement("span"); sp.textContent = wort.charAt(i); w.appendChild(sp);
    }
    d.appendChild(w);
    d.onclick = function () { waehlen(r, c); };
    d.title = wort;
    return;
  }
  var rev = st.revealed[k] || {}, hier = st.selected && st.selected[0] === r && st.selected[1] === c;
  var caret = -1, slots = document.createElement("span");
  slots.className = "slots";
  if (hier) for (i = 0; i < st.draft.length; i++) if (!st.draft[i]) { caret = i; break; }
  for (i = 0; i < ans.length; i++) {
    var ch = hier && st.draft[i] ? st.draft[i] : (rev[i] ? ans.charAt(i) : null);
    var s = document.createElement("span");
    if (ch) { s.textContent = ch; if (rev[i]) s.className = "rev"; }
    else { s.innerHTML = "&#160;"; s.className = "blank" + (i === caret ? " caret" : ""); }
    slots.appendChild(s);
  }
  d.appendChild(slots);
  var tick = document.createElement("span");
  tick.className = "tick"; tick.textContent = ans.length; d.appendChild(tick);
  if (!reach[k]) d.style.opacity = ".92";
  d.onclick = function () { waehlen(r, c); };
}

function malenGasse(d, id, achse) {
  var e = null, i;
  for (i = 0; i < KANTEN.length; i++) if (KANTEN[i].id === id) { e = KANTEN[i]; break; }
  if (!e) { d.className = "gut barred " + achse; d.title = "Hier wird nichts behauptet."; return; }
  var a = e.cells[0], b = e.cells[1];
  var beide = st.filled[K(a[0], a[1])] !== undefined && st.filled[K(b[0], b[1])] !== undefined;
  var HEAD = { "→": "to-right", "←": "to-left", "↓": "to-down", "↑": "to-up" };
  var kopf = e.kind === "eq" ? "level" : HEAD[e.arrow];
  var dreh = !!e.verb2, um = dreh && st.flipped[e.id];
  d.className = "gut shown " + achse + " " + kopf + (beide ? " spent" : "") +
                (dreh ? " turnable" : "") + (um ? " over" : "") + (e.neu ? " neu" : "");
  var pfeil = document.createElement("span"); pfeil.className = "arrow"; d.appendChild(pfeil);
  var lab = document.createElement("span"); lab.className = "label";
  lab.textContent = gesicht(e); d.appendChild(lab);
  d.title = beide ? satz(e) : gesicht(e);
  if (!dreh) return;
  d.onclick = function (ev) {
    ev.stopPropagation();
    st.flipped[e.id] = !st.flipped[e.id]; sichern(); zeichnen();
  };
  d.onmouseenter = function () { melden(um ? "(zurückdrehen)" : "(das liest sich auch anders)"); };
  d.onmouseleave = function () { melden(null); };
}

/* Das Brett ist 1048 Punkte breit; die Seite ist es selten. */
function passen() {
  var wrap = brett.parentNode;
  brett.style.transform = "none"; brett.style.margin = "0";
  var w = brett.offsetWidth, h = brett.offsetHeight;
  if (!w) return;
  var s = Math.min(1, (wrap.clientWidth - 4) / w);
  if (s > .999) return;
  brett.style.transform = "scale(" + s + ")";
  brett.style.marginRight = -Math.round(w * (1 - s)) + "px";
  brett.style.marginBottom = -Math.round(h * (1 - s)) + "px";
}
window.addEventListener("resize", passen);

/* ---- Statuszeile --------------------------------------------------- */
var STATUS = document.getElementById("status");
function melden(text) {
  if (text === null) { STATUS.textContent = STATUS.getAttribute("data-idle"); return; }
  STATUS.textContent = text;
}
function standAnzeigen() {
  var n = 0, r, c;
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (st.filled[K(r, c)] !== undefined) n++;
  var mitte = P.nouns[P.centre[0]][P.centre[1]].length;
  var drauf = kantenAn(P.centre[0], P.centre[1]).length;
  STATUS.setAttribute("data-idle", n === 0
    ? "Fang in der Mitte an: " + mitte + " Buchstaben, " + drauf + " Sätze zeigen darauf."
    : n + " von " + (N * N) + " Tieren stehen.");
  melden(null);
  if (n === N * N) gewonnen();
}

/* ---- Eingabe ------------------------------------------------------- */
function waehlen(r, c) {
  st.selected = [r, c];
  var k = K(r, c), ans = antwort(r, c), rev = st.revealed[k] || {}, i;
  st.draft = [];
  for (i = 0; i < ans.length; i++) st.draft.push(rev[i] ? ans.charAt(i) : "");
  st.falsch = null;
  zeichnen();
  if (verborgen) { verborgen.focus({ preventScroll: true }); }
}

function tippen(ch) {
  if (!st.selected) return;
  var k = K(st.selected[0], st.selected[1]);
  if (st.filled[k] !== undefined) return;
  var rev = st.revealed[k] || {}, i;
  for (i = 0; i < st.draft.length; i++) {
    if (!st.draft[i] && !rev[i]) { st.draft[i] = ch; break; }
  }
  st.falsch = null;
  zeichnen();
}

function loeschen() {
  if (!st.selected) return;
  var k = K(st.selected[0], st.selected[1]), rev = st.revealed[k] || {}, i;
  if (st.filled[k] !== undefined) { delete st.filled[k]; delete st.given[k]; sichern(); waehlen(st.selected[0], st.selected[1]); return; }
  for (i = st.draft.length - 1; i >= 0; i--) {
    if (st.draft[i] && !rev[i]) { st.draft[i] = ""; break; }
  }
  zeichnen();
}

function abgeben() {
  if (!st.selected) return;
  var r = st.selected[0], c = st.selected[1], k = K(r, c);
  var wort = st.draft.join(""), ans = antwort(r, c);
  if (!voll()) { melden("Dieses Feld nimmt " + ans.length + " Buchstaben."); return; }
  if (norm(wort) === norm(ans)) {
    st.filled[k] = ans; st.falsch = null; st.selected = null; st.draft = [];
    sichern(); zeichnen();
    melden("„" + ans + "“ steht.");
  } else {
    st.falsch = k; zeichnen();
    melden("„" + wort + "“ passt hier nicht. Lies noch einmal, was auf den Strichen steht.");
    setTimeout(function () { st.falsch = null; zeichnen(); }, 1100);
  }
}

/* Eine unsichtbare Zeile, damit ein Telefon die Tastatur hochschiebt. */
var verborgen = document.createElement("input");
verborgen.setAttribute("aria-hidden", "true");
verborgen.style.cssText = "position:fixed;opacity:0;pointer-events:none;left:-9999px;top:0";
verborgen.autocapitalize = "characters"; verborgen.autocomplete = "off";
verborgen.setAttribute("enterkeyhint", "go");
document.body.appendChild(verborgen);
verborgen.addEventListener("input", function () {
  var v = verborgen.value; verborgen.value = "";
  for (var i = 0; i < v.length; i++) {
    var ch = norm(v.charAt(i));
    if (/[A-Z]/.test(ch)) tippen(ch);
  }
});

document.addEventListener("keydown", function (ev) {
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  if (ev.shiftKey && (ev.key === "S" || ev.key === "s")) {
    ev.preventDefault(); aufgeben(); return;
  }
  if (ev.key === "Backspace") { ev.preventDefault(); loeschen(); return; }
  if (ev.key === "Enter") { ev.preventDefault(); abgeben(); return; }
  if (ev.key === "Escape") { st.selected = null; st.draft = []; zeichnen(); return; }
  if (ev.key && ev.key.length === 1) {
    var ch = norm(ev.key);
    if (/^[A-Z]$/.test(ch)) { ev.preventDefault(); tippen(ch); }
  }
});

/* ---- eintragen und wieder wegnehmen ---------------------------------
   Wie im großen Spiel: das getippte Wort steht erst im Feld, wenn du es
   einträgst — mit Enter oder mit dem Knopf. Vorher stand es von selbst da,
   sobald der letzte Buchstabe fiel; das nahm einem den Moment, in dem man
   das Wort noch einmal ansieht. Nichts ist endgültig: ein Feld, das du
   wieder wegnimmst, behält die Buchstaben, die es schon verraten hat. */
function voll() {
  if (!st.draft.length) return false;
  for (var i = 0; i < st.draft.length; i++) if (!st.draft[i]) return false;
  return true;
}

function wegnehmen(r, c) {
  var k = K(r, c);
  delete st.filled[k]; delete st.given[k];
  sichern();
  waehlen(r, c);
  melden("Wieder frei. Was das Feld schon verraten hat, steht noch da.");
}

var EINGEBEN = document.getElementById("eingeben");
function knopfStand() {
  if (!EINGEBEN) return;
  var k = st.selected ? K(st.selected[0], st.selected[1]) : null;
  var steht = k !== null && st.filled[k] !== undefined;
  EINGEBEN.textContent = steht ? "Wieder wegnehmen" : "Wort eintragen";
  EINGEBEN.disabled = steht ? false : !(k !== null && voll());
  EINGEBEN.onclick = steht
    ? function () { wegnehmen(st.selected[0], st.selected[1]); }
    : function () { abgeben(); verborgen.focus({ preventScroll: true }); };
}

/* ---- die Leiter der Hinweise ---------------------------------------- */
document.getElementById("verb").onclick = function () {
  if (!st.selected) { melden("Erst ein Feld anklicken, dann zeigt es einen Buchstaben."); return; }
  var r = st.selected[0], c = st.selected[1], k = K(r, c);
  if (st.filled[k] !== undefined) { melden("Das Feld steht schon."); return; }
  var ans = antwort(r, c), rev = st.revealed[k] || (st.revealed[k] = {}), frei = [], i;
  for (i = 0; i < ans.length; i++) if (!rev[i]) frei.push(i);
  if (!frei.length) { melden("Mehr Buchstaben hat das Wort nicht."); return; }
  var pick = frei[Math.floor(Math.random() * frei.length)];
  rev[pick] = true; st.draft[pick] = ans.charAt(pick);
  sichern(); zeichnen();
  melden("Ein Buchstabe steht jetzt in Rot.");
};

document.getElementById("wort").onclick = function () {
  if (!st.selected) { melden("Erst ein Feld anklicken, dann verrät es sich."); return; }
  var r = st.selected[0], c = st.selected[1], k = K(r, c);
  if (st.filled[k] !== undefined) { melden("Das Feld steht schon."); return; }
  st.filled[k] = antwort(r, c); st.given[k] = true;
  st.selected = null; st.draft = [];
  sichern(); zeichnen();
};

var HAT_RUECK = KANTEN.some(function (e) { return !!e.verb2; });
var umdrehen = document.getElementById("umdrehen");
if (umdrehen) umdrehen.onclick = function () {
  var an = this.getAttribute("aria-pressed") === "true";
  KANTEN.forEach(function (e) { if (e.verb2) st.flipped[e.id] = !an; });
  this.setAttribute("aria-pressed", an ? "false" : "true");
  this.textContent = an ? "Alle umdrehen" : "Alle zurückdrehen";
  sichern(); zeichnen();
};

function aufgeben() {
  var r, c, k;
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
    k = K(r, c);
    st.filled[k] = antwort(r, c);
    st.given[k] = true;
  }
  st.selected = null; st.draft = []; st.falsch = null;
  sichern(); zeichnen();
  melden("Das ganze Brett, gegeben.");
}

function zuruecksetzen() {
  st.filled = {}; st.given = {}; st.revealed = {}; st.flipped = {};
  st.selected = null; st.draft = []; st.falsch = null;
  var box = document.getElementById("won");
  box.classList.remove("on");
  box.removeAttribute("data-shown");
  sichern(); zeichnen();
}

document.getElementById("neu").onclick = function () {
  if (!window.confirm("Alles löschen und von vorn anfangen?")) return;
  zuruecksetzen();
};

document.getElementById("ansehen").onclick = function () {
  document.getElementById("won").classList.remove("on");
};
document.getElementById("nochmal").onclick = zuruecksetzen;

/* ---- das Ende --------------------------------------------------------- */
function gewonnen() {
  var eigen = 0, r, c;
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (!st.given[K(r, c)]) eigen++;
  var box = document.getElementById("won");
  if (box.getAttribute("data-shown") === "1") return;
  box.setAttribute("data-shown", "1");
  document.getElementById("wontext").innerHTML =
    (P.schluss || "") + (eigen
      ? " <b>" + eigen + "</b> von " + (N * N) + " hast du selbst gefunden."
      : " Das ganze Brett, gegeben.") +
    (HAT_RUECK ? "<br><br>Dreh jetzt jede Verbindung um: hinter jedem Satz steht noch einer." : "");
  box.classList.add("on");
}

/* ---- los -------------------------------------------------------------- */
document.getElementById("stars").textContent =
  new Array((P.stars || 1) + 1).join("★") + new Array(4 - (P.stars || 1)).join("☆");
laden();
zeichnen();
})();
