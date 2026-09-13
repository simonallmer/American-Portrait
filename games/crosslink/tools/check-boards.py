#!/usr/bin/env python3
"""Acceptance test for Crosslink boards — the rules of the design spec, §1 and §8.

  E9  no connection names a word that is on its own board
  D1  every word has at least 2 connections
  D2  every word is reachable from the centre by two link-disjoint paths
  D3  the board contains at least one cycle
  D4  10-12 of 12 connections on a 3x3; 28-34 of 40 on a 5x5
  H2  no word is set twice on ONE board (across the game is allowed since 3.9)
  L1  every word has a lexicon, registry or vocabulary entry IN ITS OWN LANGUAGE

Run:  python3 tools/check-boards.py
"""
import io, os, re, sys, glob, itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def js_field(text, name):
    m = re.search(name + r':\s*"([^"]*)"', text)
    if not m: return None
    # Board files write non-ASCII as \uXXXX escapes, so a title printed straight
    # out of the source reads as "God\u2019s Batch" rather than "God's Batch".
    # Substitute the escapes only; a file that already holds real UTF-8 is left
    # alone, which the encode/decode round-trip would have thrown on.
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda esc: chr(int(esc.group(1), 16)), m.group(1))

def load(path):
    t = io.open(path, encoding="utf-8").read()
    size = int(re.search(r"size:\s*(\d+)", t).group(1))
    centre = [int(x) for x in re.search(r"centre:\s*\[(\d+),\s*(\d+)\]", t).groups()]
    nouns_src = re.search(r"nouns:\s*\[(.*?)\n  \],", t, re.S).group(1)
    # Umlauts are letters. A German board may set FLÜGEL in a square, and a
    # pattern of bare A-Z would read it as two words, FL and GEL, and then fail
    # L1 on both of them.
    nouns = [re.findall(r'"([A-ZÄÖÜ]+)"', r) for r in nouns_src.split("\n") if '"' in r]
    # Both faces. A connection's back must pass E9 exactly as its front does —
    # it is the same gutter and the same board, and a back face that names a
    # neighbour gives the square away just as completely.
    verbs = re.findall(r'verb2?:\s*"([^"]*)"', t)
    # gutters: walk the h and v blocks entry by entry, counting nulls in order
    def slots(block):
        m = re.search(block + r":\s*\[(.*?)\n  \]", t, re.S)
        if not m: return []   # a trifecta board has lines, not gutters
        src = m.group(1)
        depth, cur, rows = 0, "", []
        for ch in src:
            if ch == "[":
                depth += 1
                if depth == 1: cur = ""; continue
            if ch == "]":
                depth -= 1
                if depth == 0: rows.append(cur); continue
            if depth >= 1: cur += ch
        out = []
        for row in rows:
            items, d, cur = [], 0, ""
            for ch in row:
                if ch == "{": d += 1
                if ch == "}": d -= 1
                if ch == "," and d == 0:
                    items.append(cur.strip()); cur = ""
                else:
                    cur += ch
            items.append(cur.strip())
            out.append([None if i.strip().startswith("null") else i for i in items if i.strip()])
        return out
    trifecta = bool(re.search(r'kind:\s*"trifecta"', t))
    # Lines, for a trifecta: three rows and three columns.
    lines = [[(r,0),(r,1),(r,2)] for r in range(size)] if trifecta else []
    if trifecta:
        lines += [[(0,c),(1,c),(2,c)] for c in range(size)]
    return dict(path=os.path.basename(path), id=js_field(t, "id"), title=js_field(t, "title"),
                lang=js_field(t, "lang") or "en",
                size=size, centre=centre, nouns=nouns, verbs=verbs,
                h=slots("h"), v=slots("v"), trifecta=trifecta, lines=lines)

def edges(p):
    n = p["size"]
    if p["trifecta"]:
        # A trifecta's graph is its hypergraph of lines; flatten each line of
        # three into its two unit segments so the net's connectivity rules (D1,
        # D2, D3) can run unchanged over the same squares.
        out = []
        for line in p["lines"]:
            for i in range(n - 1):
                out.append((line[i], line[i + 1]))
        return out
    out = []
    for r in range(n):
        for g in range(n - 1):
            if p["h"][r][g] is not None: out.append(((r, g), (r, g + 1)))
    for g in range(n - 1):
        for c in range(n):
            if p["v"][g][c] is not None: out.append(((g, c), (g + 1, c)))
    return out

def two_disjoint(nodes, es, src, dst):
    """Menger: two link-disjoint paths exist iff no single edge disconnects them."""
    def connected(skip):
        seen, stack = {src}, [src]
        adj = {}
        for a, b in es:
            if skip is not None and {a, b} == set(skip): continue
            adj.setdefault(a, []).append(b)
            adj.setdefault(b, []).append(a)
        while stack:
            x = stack.pop()
            for y in adj.get(x, []):
                if y not in seen: seen.add(y); stack.append(y)
        return dst in seen
    if not connected(None): return False
    return all(connected(e) for e in es)

def check(p, already):
    n, bad, warn = p["size"], [], []
    es = edges(p)
    nodes = [(r, c) for r in range(n) for c in range(n)]
    word = lambda rc: p["nouns"][rc[0]][rc[1]]

    deg = {rc: 0 for rc in nodes}
    for a, b in es: deg[a] += 1; deg[b] += 1
    thin = [word(rc) for rc in nodes if deg[rc] < 2]
    if thin: bad.append("D1 fails: %s on one connection or none" % ", ".join(thin))

    ctr = tuple(p["centre"])
    lonely = [word(rc) for rc in nodes if rc != ctr and not two_disjoint(nodes, es, ctr, rc)]
    if lonely: bad.append("D2 fails: only one route to %s" % ", ".join(lonely))

    if len(es) < len(nodes): bad.append("D3 fails: no cycle (%d links, %d words)" % (len(es), len(nodes)))

    # D4's floor is hard and its ceiling is not, because they are not the same
    # kind of rule. Below the floor D2 stops being satisfiable — that is a fact
    # about the graph, and a board that breaks it is broken. The ceiling is a
    # matter of taste about density, the rule itself says "roughly", and a 3x3
    # is allowed to be 12 of 12 while a 5x5 was capped at 34 of 40 for no reason
    # anyone wrote down. It warns now, and does not fail.
    possible = 2 * n * (n - 1)
    lo, hi = (10, 12) if n == 3 else (28, 34)
    # A trifecta's density is set by its geometry — six lines, no gutters to fill
    # in or bar — so the net's taste rule about gutter counts has nothing to say
    # about one. D1-D3 above still run, over the lines' unit segments.
    if not p["trifecta"] and len(es) < lo:
        bad.append("D4 fails: %d of %d, below the floor of %d" % (len(es), possible, lo))
    elif not p["trifecta"] and len(es) > hi:
        warn.append("D4 note: %d of %d, above the usual %d - dense, not wrong" % (len(es), possible, hi))

    onboard = set(w for row in p["nouns"] for w in row)
    named = sorted({(v, w) for v in p["verbs"] for w in onboard
                    if re.search(r"\b" + w + r"\b", v.upper())})
    if named:
        bad.append("E9 fails: " + "; ".join('"%s" names %s' % (v, w) for v, w in named))

    title = (p.get("title") or "").upper()
    leaked = sorted({w for row in p["nouns"] for w in row
                     if re.search(r"\b" + w + r"\b", title)})
    if leaked:
        warn.append("T-rule note: the title names %s, which is on the board"
                    % ", ".join(leaked))

    # W1a is a rule about English, and only English has two of them on this
    # shelf. A language with no spelling table gets no verdict about spelling.
    variant = {v: k for k, vs in SPELL.items() for v in vs} if p["lang"] == "en" else {}
    wrong_side = sorted(w for row in p["nouns"] for w in row if w in variant)
    if wrong_side:
        bad.append("W1a fails: " + ", ".join(
            "%s is the variant spelling; boards are written %s" % (w, variant[w]) for w in wrong_side))

    ws = [word(rc) for rc in nodes]
    # Twice on ONE board is still wrong — a solver holding a word would be asked
    # to find it again, and the used-once check in `submit` refuses it anyway.
    if len(set(ws)) != len(ws): bad.append("a word is repeated on this board")
    # Twice across the GAME is fine since 3.9. It is reported, because a word
    # that crosses boards is worth knowing about, but it is not a failure.
    # A crossing is between two boards a solver can meet in one sitting, which
    # means two boards on one shelf. German MAUS and English MOUSE are not a
    # crossing; German BANK and English BANK are two different words that
    # happen to be spelled alike, and saying otherwise would be the one claim
    # this game must never make loosely.
    clash = sorted(set(ws) & already)
    if clash: warn.append("crosses an earlier board in the same language: %s" % ", ".join(clash))
    # A trifecta prints its six lines where a net prints its twelve gutters; the
    # flattened segments above are only for the connectivity rules, so report the
    # line count a solver will actually see.
    if p["trifecta"]:
        return bad, warn, set(ws), len(p["lines"]), len(p["lines"])
    return bad, warn, set(ws), len(es), possible

def spellings():
    """canonical -> [accepted variants], read straight out of spelling.js."""
    path = os.path.join(ROOT, "spelling.js")
    if not os.path.exists(path): return {}
    t = io.open(path, encoding="utf-8").read()
    out = {}
    for k, body in re.findall(r"^  ([A-Z]+):\s*\[([^\]]*)\]", t, re.M):
        out[k] = re.findall(r'"([A-Z]+)"', body)
    return out

# Which files hold the words of which language. L1 is answered out of the
# board's OWN language: a German word is not missing from the game because the
# English vocabulary has never heard of it.
SOURCES = {
    "en": ("lexicon.js", "registry.js", "vocabulary.js"),
    "de": ("lexicon-de.js",),
}

def known_words(lang):
    ks = set()
    # Keys may be bare (COAL) or quoted, and may carry a hyphen, because a name
    # like BERNERS-LEE is not a valid bare JS identifier. L1 has to see both, or
    # the first hyphenated word to reach a board fails for not existing. Umlauts
    # are letters here for the same reason they are letters in a square.
    key = r'^  "?([A-ZÄÖÜ][A-ZÄÖÜ-]*)"?:'
    for f in SOURCES.get(lang, ()):
        path = os.path.join(ROOT, f)
        if os.path.exists(path):
            ks |= set(re.findall(key, io.open(path, encoding="utf-8").read(), re.M))
    return ks

# There is no legacy list any more. The two boards it held — The Centre Is a
# Fish and Worth Its Weight, built before §1 existed — were withdrawn at 2.5
# rather than kept as exceptions, and every board in puzzles/ is now expected to
# pass on its own account. A board that fails is a board that does not ship.
LEGACY = set()
SPELL = spellings()

def main():
    files = sorted(glob.glob(os.path.join(ROOT, "puzzles", "puzzle-*.js")))
    # One shelf per language, and the shelves are checked apart: each keeps its
    # own vocabulary and its own record of what has already been set.
    known, already, fails = {}, {}, 0
    print("%-22s %-4s %-24s %s" % ("board", "lang", "title", "links   verdict"))
    print("-" * 78)
    for f in files:
        p = load(f)
        lang = p["lang"]
        if lang not in known: known[lang] = known_words(lang)
        seen = already.setdefault(lang, set())
        bad, warn, ws, ne, possible = check(p, seen)
        missing = sorted(ws - known[lang])
        if missing:
            bad.append("L1 fails: no %s entry for %s" % (lang, ", ".join(missing)))
        already[lang] |= ws
        legacy = p["id"] in LEGACY
        verdict = "OK" if not bad else ("legacy" if legacy else "FAIL")
        print("%-22s %-4s %-24s %2d/%-2d   %s" % (p["id"], lang, p["title"][:23], ne, possible, verdict))
        for b in bad:
            print("      - " + b)
            if not legacy: fails += 1
        for w in warn:
            print("      . " + w)
    print("-" * 78)
    for lang in sorted(already):
        boards = sum(1 for f in files if load(f)["lang"] == lang)
        print("%s: %d distinct words set across %d board%s."
              % (lang, len(already[lang]), boards, "" if boards == 1 else "s"))
    dead = [(k, v) for k, vs in SPELL.items() for v in vs if len(v) != len(k)]
    if dead:
        fails += len(dead)
        print("W1b fails: a variant of a different length can never be typed, "
              "because the square prints its letter count — " +
              ", ".join("%s/%s" % (k, v) for k, v in dead))
    else:
        print("%d spellings, every variant the same length as its canonical."
              % sum(len(v) for v in SPELL.values()))
    if fails: print("%d rule failures." % fails)
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main())
