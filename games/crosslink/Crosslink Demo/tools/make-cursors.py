#!/usr/bin/env python3
"""Draws the two cursors as pixel art and writes them into cursors.css as data URIs.

Both are drawn by hand, pixel by pixel. Deriving them from polygons and an
erosion outline was tried four times and failed four times: at this size erosion
eats the arrow's heel into fragments, steps the tail unevenly, and turns the
hand's fingers into a mitten. An arrow is a couple of hundred pixels. Place them.

  X  outline (black)
  .  bone (#F6F0DC — white reads as a modern cursor, bone reads as drawn)
     space is nothing

Each drawing is enlarged by a whole number — two for an ordinary screen, four
for a retina one — so the pixels stay square and visible. Nothing is ever
resampled.
"""
import io, os, zlib, struct, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FILL = (246, 240, 220, 255)
INK  = (0, 0, 0, 255)

# Traced pixel for pixel from the Windows 95 arrow, normal size — the file on
# Wikimedia Commons (Windows_95_ARROW_M_32x32-4.png), which Commons holds to be
# public domain: "simple geometry ... ineligible for copyright". Loaded into a
# canvas, sampled at the centre of each of the 32x32 logical cells, printed.
#
# Five goes at drawing this from memory produced five wrong arrows, and every
# one of them was wrong in the same way: too short. The real head is fourteen
# rows of fill, not ten; the tail is three pixels wide, not two; and the heel
# takes five rows to come back to the left edge. Proportion is the whole thing,
# and proportion is exactly what memory does not keep.
ARROW_ART = [
    "X              ",
    "XX             ",
    "X.X            ",
    "X..X           ",
    "X...X          ",
    "X....X         ",
    "X.....X        ",
    "X......X       ",
    "X.......X      ",
    "X........X     ",
    "X.........X    ",
    "X..........X   ",
    "X...........X  ",
    "X............X ",
    "X.......XXXXXXX",
    "X...X...X      ",
    "X..X X...X     ",
    "X.X  X...X     ",
    "XX    X...X    ",
    "X     X...X    ",
    "       X...X   ",
    "       X...X   ",
    "        XXX    ",
]

# Two rows came off the tail at 3.12 — 25 rows to 23 — because beside the hand
# at 18x22 the arrow read as the bigger of the pair, and a pointer that looks
# heavier than the hand it alternates with makes the hand look like a state
# rather than a shape. Only the TAIL is shortened: the head keeps all fourteen
# rows of fill, which is the proportion the trace exists to protect and the one
# thing five drawings from memory each got wrong. The tail loses one of its
# five two-row steps and the terminator moves in a column to close it.

# Traced the same way, from Cursor_Hand.png on Wikimedia Commons — 19x24, and
# public domain on the same grounds. Four fingers, not two: the drawn-from-memory
# version had three too few and sat two rows shorter than the arrow, which is
# what made it look like the smaller of the pair.
HAND_ART = [
    "      XX          ",
    "     X..X         ",
    "     X..X         ",
    "     X..X         ",
    "     X..X         ",
    "     X..XXX       ",
    "     X..X..XXX    ",
    "     X..X..X..XX  ",
    "     X..X..X..X.X ",
    " XXX X..X..X..X..X",
    " X..XX........X..X",
    " X...X...........X",
    "  X..X...........X",
    "   X.X...........X",
    "   X.............X",
    "    X............X",
    "    X...........X ",
    "     X..........X ",
    "     X..........X ",
    "      X........X  ",
    "      X........X  ",
    "      XXXXXXXXXX  ",
]

def png(pixels, w, h):
    raw = b""
    for y in range(h):
        raw += b"\x00" + b"".join(bytes(pixels[y][x]) for x in range(w))
    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))

def from_art(art):
    h, w = len(art), max(len(r) for r in art)
    px = [[(0, 0, 0, 0) for _ in range(w)] for _ in range(h)]
    for y, row in enumerate(art):
        for x, ch in enumerate(row):
            if ch == "X": px[y][x] = INK
            elif ch == ".": px[y][x] = FILL
    return px, w, h

def blow(px, w, h, k):
    """Nearest-neighbour upscale by a whole number: square pixels, hard edges."""
    return [[px[y // k][x // k] for x in range(w * k)] for y in range(h * k)]

def bone_is_whole(px):
    """The bone must be one connected region. Where the shape narrows the two
    outlines can meet and pinch the white line shut, and one black pixel across
    the middle of a cursor is the first thing the eye finds — and the last thing
    a screenshot will ever show you, because a screenshot has no cursor in it.
    So it is a test, not a look."""
    h, w = len(px), len(px[0])
    seeds = [(y, x) for y in range(h) for x in range(w) if px[y][x] == FILL]
    if not seeds: return False, 0
    seen, stack = {seeds[0]}, [seeds[0]]
    while stack:
        y, x = stack.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (y + dy, x + dx)
            if 0 <= n[0] < h and 0 <= n[1] < w and px[n[0]][n[1]] == FILL and n not in seen:
                seen.add(n); stack.append(n)
    return len(seen) == len(seeds), len(seeds)

def uri(px, w, h):
    return "data:image/png;base64," + base64.b64encode(png(px, w, h)).decode()

def build(art, name):
    px, w, h = from_art(art)
    whole, count = bone_is_whole(px)
    print("%-6s %dx%d art = %dx%d css px, %d bone pixels, %s"
          % (name, w, h, w, h, count,
             "unbroken" if whole else "BROKEN — a black pixel splits the white"))
    return uri(px, w, h), uri(blow(px, w, h, 2), w * 2, h * 2), px, w, h

a1, a2, apx, aw, ah = build(ARROW_ART, "arrow")
h1, h2, hpx, hw, hh = build(HAND_ART, "hand")

css = """/* The cursors, drawn as pixel art by tools/make-cursors.py. This file OWNS the
   cursor: style.css must not set one anywhere, because a rule like
   `button.ghost { cursor: pointer }` outranks the plain `button` here and drops
   that control back to the system arrow. Both sizes are the same drawing
   enlarged twice, so a retina screen gets crisp edges and not a blurred-up
   nine-pixel arrow. Every rule keeps a system keyword as the last fallback, so
   a browser that refuses the image still has a cursor. */
:root {
  --arrow: url(%s) 0 0;
  --hand:  url(%s) 6 0;
}

/* Everything, including the SVG in the middle of the front page — an element
   the rules missed once, and the cursor changed back to the system one the
   moment you crossed the emblem. */
*, *::before, *::after { cursor: var(--arrow), default; }
* { cursor: image-set(url(%s) 1x, url(%s) 2x) 0 0, default; }

a, button, .tile, .tile *, .noun, .noun *, .win-x, .tool,
.toggle, .toggle *, select#which, .wordgrid button, .lex-list button, .lex-play,
.ti-link, .routes, .routes *, .hero.numbered .cell, .hero.numbered .cell *,
.script li em, .sentences li .n, [data-lex], .gut.spent, .gut.spent *,
.gut.turnable .label {
  cursor: image-set(url(%s) 1x, url(%s) 2x) 6 0, pointer;
}
button:disabled, .tool:disabled, .hero.numbered .cell.empty,
.hero.numbered .cell.empty * { cursor: var(--arrow), default; }
.noun.selected, .noun.selected * { cursor: var(--arrow), text; }
""" % (a1, h1, a1, a2, h1, h2)

io.open(os.path.join(ROOT, "cursors.css"), "w", encoding="utf-8").write(css)
print("wrote cursors.css")

io.open(os.path.join(ROOT, "tools", "cursor-preview.html"), "w", encoding="utf-8").write(
 '<body style="background:#C6C6BE;padding:20px;font:12px sans-serif">'
 '<p>arrow 1x / 2x, hand 1x / 2x &mdash; shown at 8&times;, nearest neighbour</p>'
 + "".join('<img src="%s" style="image-rendering:pixelated;width:%dpx;margin-right:24px;'
           'background:#fff;outline:1px solid #999">' % (u, w)
           for u, w in ((a1, aw * 8), (a2, aw * 8), (h1, hw * 8), (h2, hw * 8))) +
 '<p style="margin-top:24px">and at their real size, 1&times;:</p>'
 + "".join('<img src="%s" style="margin-right:24px;background:#fff;outline:1px solid #999">' % u
           for u in (a1, h1)) + '</body>')
