#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Abnahmetest für 'Im Reich der Tiere' — dieselben Regeln wie tools/check-boards.py.

  E9  keine Verbindung nennt ein Wort, das auf ihrem eigenen Brett steht
  D1  jedes Wort hat mindestens 2 Verbindungen
  D2  jedes Wort ist von der Mitte auf zwei kantendisjunkten Wegen erreichbar
  D3  das Brett enthält mindestens einen Kreis
  D4  10-12 von 12 auf einem 3x3, 28-34 von 40 auf einem 5x5
  H2  kein Wort steht zweimal auf demselben Brett
  T   der Titel nennt kein Wort des Bretts

Aufruf:  python3 pruefen.py [ordner]           Regeln prüfen
         python3 pruefen.py [ordner] --saetze  alle Sätze, beide Seiten, zum Lesen
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ORDNER = os.path.abspath([a for a in sys.argv[1:] if not a.startswith("--")][0]) \
    if [a for a in sys.argv[1:] if not a.startswith("--")] else HERE
P = json.load(io.open(os.path.join(ORDNER, "brett.json"), encoding="utf-8"))
N = P["size"]
W = lambda r, c: P["nouns"][r][c]


def edges():
    out = []
    for r in range(N):
        for g in range(N - 1):
            d = P["h"][r][g]
            if d: out.append((d, (r, g), (r, g + 1), "right", "h:%d:%d" % (r, g)))
    for g in range(N - 1):
        for c in range(N):
            d = P["v"][g][c]
            if d: out.append((d, (g, c), (g + 1, c), "down", "v:%d:%d" % (g, c)))
    return out


def sentence(d, a, b, fwd):
    """Wie die Verbindung ausgeschrieben aussteht, mit Vorder- und Rückseite."""
    eq = d.get("kind") == "eq"
    subj, obj = (a, b) if (eq or d.get("dir") == fwd) else (b, a)
    front = "%s %s %s." % (W(*subj), d["verb"], W(*obj))
    back = "%s %s %s." % (W(*subj), d["verb2"], W(*obj)) if d.get("verb2") else None
    return front, back


def two_disjoint(es, src, dst):
    def connected(skip):
        adj = {}
        for a, b in es:
            if skip is not None and {a, b} == set(skip): continue
            adj.setdefault(a, []).append(b)
            adj.setdefault(b, []).append(a)
        seen, stack = {src}, [src]
        while stack:
            x = stack.pop()
            for y in adj.get(x, []):
                if y not in seen: seen.add(y); stack.append(y)
        return dst in seen
    return connected(None) and all(connected(e) for e in es)


def main():
    es_full = edges()
    es = [(a, b) for _, a, b, _, _ in es_full]
    nodes = [(r, c) for r in range(N) for c in range(N)]
    bad, note = [], []

    deg = dict((rc, 0) for rc in nodes)
    for a, b in es: deg[a] += 1; deg[b] += 1
    thin = [W(*rc) for rc in nodes if deg[rc] < 2]
    if thin: bad.append("D1: nur eine Verbindung oder keine — %s" % ", ".join(thin))

    ctr = tuple(P["centre"])
    lonely = [W(*rc) for rc in nodes if rc != ctr and not two_disjoint(es, ctr, rc)]
    if lonely: bad.append("D2: nur ein Weg zu %s" % ", ".join(lonely))

    if len(es) < len(nodes): bad.append("D3: kein Kreis (%d Kanten, %d Wörter)" % (len(es), len(nodes)))

    possible = 2 * N * (N - 1)
    lo, hi = (10, 12) if N == 3 else (28, 34)
    if len(es) < lo: bad.append("D4: %d von %d, unter dem Boden von %d" % (len(es), possible, lo))
    elif len(es) > hi: note.append("D4: %d von %d, über den üblichen %d — dicht, nicht falsch" % (len(es), possible, hi))

    onboard = set(W(r, c) for r in range(N) for c in range(N))
    named = []
    for d, a, b, fwd, gid in es_full:
        for face in ("verb", "verb2"):
            v = d.get(face)
            if not v: continue
            for w in onboard:
                if re.search(r"\b" + w + r"\b", v.upper()):
                    named.append('%s (%s) nennt %s' % (gid, face, w))
    if named: bad.append("E9: " + "; ".join(named))

    title = P["title"].upper()
    leak = [w for w in onboard if re.search(r"\b" + w + r"\b", title)]
    if leak: bad.append("T: der Titel nennt %s" % ", ".join(leak))

    ws = [W(*rc) for rc in nodes]
    if len(set(ws)) != len(ws): bad.append("H2: ein Wort steht zweimal auf dem Brett")

    missing = [gid for d, a, b, f, gid in es_full if not d.get("verb2")]
    if missing: note.append("ohne zweite Seite: %s" % ", ".join(missing))

    print("%s (%dx%d) — %d Wörter, %d von %d Verbindungen, %d zweite Seiten"
          % (P["title"], N, N, len(nodes), len(es), possible,
             len([1 for d, a, b, f, g in es_full if d.get("verb2")])))
    longest = max(len(d[face]) for d, a, b, f, g in es_full for face in ("verb", "verb2") if d.get(face))
    print("längster Satzteil: %d Zeichen" % longest)
    for n in note: print("  . " + n)
    for x in bad: print("  - " + x)
    print("VERDIKT: " + ("BESTANDEN" if not bad else "DURCHGEFALLEN"))
    if "--saetze" in sys.argv:
        print("-" * 74)
        for d, a, b, fwd, gid in es_full:
            f, bk = sentence(d, a, b, fwd)
            kind = "=" if d.get("kind") == "eq" else "→"
            print("%-8s %s  %s" % (gid, kind, f))
            if bk: print("%-8s    %s" % ("", bk))
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main())
