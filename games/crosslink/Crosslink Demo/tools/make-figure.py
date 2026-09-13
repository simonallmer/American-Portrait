# -*- coding: utf-8 -*-
"""The note's figure: Berners-Lee's 1989 proposal diagram, in Crosslink's dress.

Node and relation vocabulary checked against the real thing at
w3.org/History/1989/proposal-msw.html, whose arrows are labelled "includes",
"describes", "refers to", "is an example of", "depends on", "is part of" and
"made". Two of his are used here as he used them: `describes`, from the page you
are reading to the thing it is about, and `includes`. The author chain is his
exactly — a person wrote the document, and the document describes the proposal.
"""
import math, io, sys

N, ORDER = {}, []
def box(k, x, y, w, h, text, hub=False):
    N[k] = dict(x=x, y=y, w=w, h=h, text=text, hub=hub); ORDER.append(k)

# --- the old world, upper left -----------------------------------------
box('A',  24,  26, 158, 38, 'THE CROSSWORD')
box('E',  24, 130, 158, 38, 'A NEWSPAPER')
box('B', 252,  26,  98, 38, 'RECALL')
box('F', 252, 130,  98, 38, 'SPELLING')
# --- the new world, upper right ----------------------------------------
box('C', 412,  26, 118, 38, 'HYPERTEXT')
box('D', 612,  26, 122, 38, 'HYPERMEDIA')
box('G', 412, 130, 118, 38, 'THE WEB')
box('H', 612, 130, 122, 38, 'A BROWSER')
# --- the hub -----------------------------------------------------------
box('J', 288, 248, 186, 48, 'THE CROSSLINK', hub=True)
# --- what it is made of, lower left ------------------------------------
box('K',  60, 372, 122, 38, 'MEANING')
box('L', 316, 372, 122, 38, 'POLYSEMY')
# BANK sits centred over its own senses, not over POLYSEMY: a fan thrown from
# one end of a row rather than its middle put the outermost wire straight
# through the box next to its target.
box('N', 316, 452, 122, 38, 'BANK')
# --- what BANK means: the point of polysemy, drawn ---------------------
#
# Four of the registry's five domains, glossed from registry.js and not from
# memory. Both of the first two were paraphrased wrong on the way in and had to
# be put back: A RIVER is the water, not the land beside it, and MONEY is the
# stuff, not the house that holds it. On a square whose whole job is to show
# that senses are distinct, sliding one sense into its neighbour is the single
# error it cannot afford, and it happened twice.
#
# The registry's fifth, "to bank on something", is deliberately NOT here. It is
# the money sense wearing a coat: anyone reading "bank on it" is reading the
# institution, so as a branch it argues against itself. See E25.
box('S1',  48, 540, 166, 34, 'THE EDGE OF A RIVER')
box('S2', 230, 540, 166, 34, 'WHERE MONEY IS KEPT')
box('S3', 412, 540, 140, 34, 'A TIER OF SEATS')
box('S4', 568, 540, 138, 34, 'TO TILT A PLANE')
# --- what it runs on, and who made it, right ---------------------------
box('I', 560, 252, 140, 38, 'A DATABASE')
box('M', 560, 340, 140, 38, 'A COMPUTER')
box('O', 560, 420, 140, 38, 'SIMON ALLMER')

EDGES = [
    ('A','B',  'asks for'),
    ('A','E',  'is set in'),
    ('A','F',  'joins its words by'),
    ('C','D',  'extends with'),
    ('G','C',  'is'),
    ('G','H',  'is read in'),
    ('G','J',  'made possible'),
    ('J','K',  'joins its words by'),
    ('J','L',  'runs on'),
    ('J','I',  'is built on'),
    ('J','M',  'is played on'),
    ('L','N',  'for example'),
    ('N','S1', 'means'),
    ('N','S2', 'means'),
    ('N','S3', 'means'),
    ('N','S4', 'means'),
    ('O','J',  'invented'),
]

W, H = 754, 606
def centre(n): return (n['x'] + n['w']/2.0, n['y'] + n['h']/2.0)

def clip(n, tx, ty):
    cx, cy = centre(n)
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0: return cx, cy
    hw, hh = n['w']/2.0 + 3, n['h']/2.0 + 3
    t = min(hw/abs(dx) if dx else 1e9, hh/abs(dy) if dy else 1e9)
    return cx + dx*t, cy + dy*t

out, labels, lines = [], [], []
add = out.append
add('<svg class="fig" viewBox="0 0 %d %d" role="img" aria-label="%s">' % (W, H,
    'The argument drawn as a board. The crossword is set in a newspaper, joins its '
    'words by spelling and asks for recall. The Web is hypertext, includes hypermedia, '
    'is read in a browser, and made the Crosslink possible. The Crosslink joins its '
    'words by meaning, runs on polysemy, is built on a database and is played on a '
    'computer. BANK, for example, means the edge of a river, where money is kept, '
    'a tier of seats, and to tilt a plane. Simon Allmer invented it.'))

add('  <g class="wires">')
for a, b, label in EDGES:
    na, nb = N[a], N[b]
    ca, cb = centre(na), centre(nb)
    x1, y1 = clip(na, *cb)
    x2, y2 = clip(nb, *ca)
    ang = math.atan2(y2 - y1, x2 - x1)
    hx, hy = x2 - math.cos(ang)*9, y2 - math.sin(ang)*9
    add('    <line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (x1, y1, hx, hy))
    lines.append((x1, y1, hx, hy, a, b))
    bx, by = x2 - math.cos(ang)*10, y2 - math.sin(ang)*10
    px, py = -math.sin(ang)*4.5, math.cos(ang)*4.5
    add('    <polygon class="head" points="%.1f,%.1f %.1f,%.1f %.1f,%.1f"/>'
        % (x2, y2, bx + px, by + py, bx - px, by - py))
    mx, my = (x1 + hx)/2.0, (y1 + hy)/2.0
    w = len(label) * 4.5 + 8
    labels.append((mx - w/2, my - 6.5, w, label))
    add('    <g class="lbl">')
    add('      <rect x="%.1f" y="%.1f" width="%.1f" height="13" rx="1"/>' % (mx - w/2, my - 6.5, w))
    add('      <text x="%.1f" y="%.1f">%s</text>' % (mx, my + 3.5, label))
    add('    </g>')
add('  </g>')

add('  <g class="cells">')
for k in ORDER:
    n = N[k]
    add('    <g class="%s">' % ('cell hub' if n['hub'] else 'cell'))
    add('      <rect x="%d" y="%d" width="%d" height="%d"/>' % (n['x'], n['y'], n['w'], n['h']))
    add('      <text x="%.1f" y="%.1f">%s</text>' % (n['x'] + n['w']/2.0, n['y'] + n['h']/2.0 + 5, n['text']))
    add('    </g>')
add('  </g>')
add('</svg>')

# --- the checks that squinting at a screenshot does not perform ---------
bad = []
for lx, ly, lw, txt in labels:
    for k, n in N.items():
        if lx < n['x']+n['w'] and lx+lw > n['x'] and ly < n['y']+n['h'] and ly+13 > n['y']:
            bad.append('label "%s" overlaps %s (%s)' % (txt, k, n['text']))
for x1, y1, x2, y2, a, b in lines:
    for k, n in N.items():
        if k in (a, b): continue
        for i in range(1, 400):
            t = i/400.0
            x, y = x1+(x2-x1)*t, y1+(y2-y1)*t
            if n['x']+1 < x < n['x']+n['w']-1 and n['y']+1 < y < n['y']+n['h']-1:
                bad.append('wire %s->%s passes through %s (%s)' % (a, b, k, n['text'])); break
for k, n in N.items():
    if n['x'] < 0 or n['y'] < 0 or n['x']+n['w'] > W or n['y']+n['h'] > H:
        bad.append('%s (%s) is outside the canvas' % (k, n['text']))

io.open(sys.argv[1] if len(sys.argv) > 1 else 'fig.svg', 'w', encoding='utf-8').write('\n'.join(out))
print('%d squares, %d wires' % (len(N), len(EDGES)))
if bad:
    print('FAULTS (%d):' % len(bad))
    for x in sorted(set(bad)): print('  -', x)
else:
    print('clean: no label over a square, no wire through one, nothing off-canvas')
