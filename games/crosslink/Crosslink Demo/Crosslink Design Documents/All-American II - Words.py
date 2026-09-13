# -*- coding: utf-8 -*-
"""All-American II — Word suggestions for a 5x5 Crosslink board."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, KeepTogether, Table, TableStyle)
import os

HERE = os.path.dirname(os.path.abspath(__file__))

INK = colors.HexColor("#1B1A17")
SOFT = colors.HexColor("#55524A")
FAINT = colors.HexColor("#8C887D")
RULE = colors.HexColor("#C9C3B2")
LIVE = colors.HexColor("#0F6E56")
RED = colors.HexColor("#9B2335")

SERIF, SERIF_B, SERIF_I = "Times-Roman", "Times-Bold", "Times-Italic"
SANS, SANS_B = "Helvetica", "Helvetica-Bold"

S = {
 "title":  ParagraphStyle("t", fontName=SERIF, fontSize=27, leading=31, textColor=INK, spaceAfter=7),
 "sub":    ParagraphStyle("s", fontName=SERIF, fontSize=11.5, leading=16.5, textColor=SOFT, spaceAfter=13),
 "body":   ParagraphStyle("b", fontName=SERIF, fontSize=10.5, leading=15.5, textColor=INK, spaceAfter=9),
 "eyebrow":ParagraphStyle("e", fontName=SANS_B, fontSize=7.5, leading=11, textColor=FAINT, spaceAfter=5),
 "tier":   ParagraphStyle("h", fontName=SERIF, fontSize=15.5, leading=19, textColor=INK, spaceBefore=15, spaceAfter=2),
 "tiersub":ParagraphStyle("hs", fontName=SANS, fontSize=8.5, leading=12, textColor=FAINT, spaceAfter=9),
 "word":   ParagraphStyle("w", fontName=SANS_B, fontSize=11, leading=14, textColor=INK,
                          spaceBefore=8, spaceAfter=1.5),
 "sense":  ParagraphStyle("sn", fontName=SERIF, fontSize=9.5, leading=13.5, textColor=SOFT,
                          leftIndent=9, spaceAfter=1.5),
 "added":  ParagraphStyle("a", fontName=SERIF, fontSize=9.5, leading=13.5, textColor=LIVE,
                          leftIndent=9, spaceAfter=1.5),
 "note":   ParagraphStyle("nt", fontName=SERIF_I, fontSize=9.5, leading=13.5, textColor=RED,
                          leftIndent=9, spaceAfter=3),
}


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rule(width=170 * mm, colour=RULE, thick=0.5, before=0, after=6):
    t = Table([[""]], colWidths=[width], rowHeights=[0.1])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), thick, colour),
                           ("TOPPADDING", (0, 0), (-1, -1), before),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), after)]))
    return t


def word_entry(word, meanings, added=False):
    """One word with its meanings."""
    bits = []
    label = '<font color="#8C887D" size="8">+</font>&nbsp;&nbsp;' if added else ""
    bits.append(Paragraph(label + esc(word), S["word"]))
    for meaning in meanings:
        style = S["added"] if added else S["sense"]
        bits.append(Paragraph("—&nbsp;&nbsp;" + esc(meaning), style))
    return KeepTogether(bits)


def grid_preview():
    """Render the 5x5 grid as a table."""
    grid = [
        ["STAR",    "FLAG",    "DRAFT",   "VET",     "TRUST"],
        ["SEAL",    "STATE",   "STRIKE",  "PIONEER", "PRIVATE"],
        ["BUSH",    "PARTY",   "BAND",    "RACE",    "LOBBY"],
        ["TICKET",  "ACT",     "PARK",    "BAT",     "BILL"],
        ["TRAIN",   "FRONTIER","MUSTANG", "CHARGE",  "HOUSE"],
    ]
    added_words = {"FLAG", "BAND", "BILL", "TRAIN", "FRONTIER", "CHARGE", "HOUSE"}
    rows = []
    for row in grid:
        cells = []
        for w in row:
            if w in added_words:
                cells.append(Paragraph('<font color="#0F6E56"><b>%s</b></font>' % w, S["sense"]))
            else:
                cells.append(Paragraph('<b>%s</b>' % w, S["sense"]))
        rows.append(cells)
    t = Table(rows, colWidths=[34 * mm] * 5, rowHeights=[10 * mm] * 5)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, RULE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FAF8F5")),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


WORDS = [
    # Row 1
    ("STAR", ["Celestial body in space", "Celebrity / famous person", "Hotel or restaurant rating", "Star on the American flag"], False),
    ("FLAG", ["Stars and Stripes / national emblem", "Signals for attention"], True),
    ("DRAFT", ["Military conscription", "Cold breeze indoors", "First version of a document"], False),
    ("VET", ["War veteran / former service member", "Animal doctor / veterinarian"], False),
    ("TRUST", ["Historic monopoly / business consolidation", "Belief in reliability", "Confidence in someone"], False),
    # Row 2
    ("SEAL", ["Navy commando / special forces", "Emblem or emblematic device", "Closes or fastens shut", "Marine mammal"], False),
    ("STATE", ["Political territory / nation or province", "Condition or mode of being", "To declare or express"], False),
    ("STRIKE", ["Baseball out / three strikes", "Labor walkout / protest", "To hit or impact"], False),
    ("PIONEER", ["First settler in frontier territory", "Innovator / trailblazer"], False),
    ("PRIVATE", ["Military rank (lowest)", "Personal / not public", "Not shared with others"], False),
    # Row 3
    ("BUSH", ["President / political dynasty", "Wild shrubland / wilderness", "Thick vegetation"], False),
    ("PARTY", ["Political faction or group", "Birthday celebration / social gathering", "Celebration or festivity"], False),
    ("BAND", ["Musical group / ensemble", "Striped ring or strip", "To bind or attach"], True),
    ("RACE", ["Speed competition / NASCAR", "Ethnic heritage or ancestry", "To compete in a race"], False),
    ("LOBBY", ["To influence lawmakers / advocacy", "Hotel entrance hall", "Large open space in a building"], False),
    # Row 4
    ("TICKET", ["Election ballot / political slate", "Cinema or event pass", "A citation or fine"], False),
    ("ACT", ["Piece of legislation", "Theatre or movie performance", "To take action"], False),
    ("PARK", ["Central green space / urban park", "To put vehicle in gear and stop", "A recreational area"], False),
    ("BAT", ["Wooden stick used by batter", "Flying nocturnal mammal", "To take a turn batting"], False),
    ("BILL", ["Paper currency / money", "Proposed law / legislation", "A statement of charges"], True),
    # Row 5
    ("TRAIN", ["Locomotive on rails", "To coach or teach / instruction", "A series of connected things"], True),
    ("FRONTIER", ["Edge of settled territory", "Cutting edge of a field", "Boundary between known and unknown"], True),
    ("MUSTANG", ["Ford car model / automotive", "Wild horse of the American West"], False),
    ("CHARGE", ["Military advance / cavalry charge", "Cost or fee / price", "To accuse formally", "Electrical charge"], True),
    ("HOUSE", ["Building to live in / dwelling", "Lower chamber of Congress", "Legislative body", "A household or family"], True),
]


def build(path):
    doc = BaseDocTemplate(path, pagesize=A4,
                          leftMargin=20 * mm, rightMargin=20 * mm,
                          topMargin=18 * mm, bottomMargin=18 * mm,
                          title="All-American II — Word Suggestions",
                          author="Simon Allmer")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def furniture(canvas, d):
        canvas.saveState()
        canvas.setFont(SANS, 7.5)
        canvas.setFillColor(FAINT)
        if canvas.getPageNumber() > 1:
            canvas.drawString(doc.leftMargin, A4[1] - 12 * mm, "CROSSLINK  ·  ALL-AMERICAN II")
        canvas.drawRightString(A4[0] - doc.rightMargin, 11 * mm, str(canvas.getPageNumber()))
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id="p", frames=[frame], onPage=furniture)])

    story = []

    story.append(Paragraph("CROSSLINK &middot; ALL-AMERICAN II", S["eyebrow"]))
    story.append(Paragraph("Words That Do Two Jobs", S["title"]))
    story.append(Paragraph(
        "A 5x5 board of polysemous English words with strong American connections. "
        "Each word has at least two distinct meanings — one tied to American culture "
        "(government, frontier, sport, military, enterprise) and one everyday sense. "
        "Green words are additions to fill the grid.", S["sub"]))
    story.append(rule())

    # Grid preview
    story.append(Paragraph("Proposed Grid", S["tier"]))
    story.append(Paragraph(
        "GREEN = added to complete the 5x5 layout", S["tiersub"]))
    story.append(grid_preview())
    story.append(Spacer(1, 12))

    story.append(rule())

    # Word list
    story.append(Paragraph("Word List", S["tier"]))
    story.append(Paragraph(
        "25 polysemous words, each with multiple meanings. The solver must figure out "
        "which sense applies to each connection.", S["tiersub"]))

    for item in WORDS:
        word = item[0]
        meanings = item[1]
        added = item[2] if len(item) > 2 else False
        story.append(word_entry(word, meanings, added))

    story.append(Spacer(1, 12))
    story.append(rule())

    # Connection examples
    story.append(Paragraph("Sample Connections", S["tier"]))
    story.append(Paragraph(
        "How words might link across the grid (horizontal and vertical). "
        "These are suggestions — the final verb pairs will be refined.", S["tiersub"]))

    connections = [
        ("STAR — FLAG", "The stars on the American flag"),
        ("FLAG — DRAFT", "A flag signals a breeze (draft = wind)"),
        ("DRAFT — VET", "A veteran of the draft"),
        ("VET — TRUST", "You trust your vet"),
        ("SEAL — STATE", "The official state seal"),
        ("STATE — STRIKE", "A state of strike (labor dispute)"),
        ("STRIKE — PIONEER", "Pioneer a strike (first to strike)"),
        ("PIONEER — PRIVATE", "A private pioneer (personal innovator)"),
        ("BUSH — PARTY", "A bush party (political event)"),
        ("PARTY — BAND", "A party band (musical group)"),
        ("BAND — RACE", "A band of racers"),
        ("RACE — LOBBY", "Race to lobby (political campaign)"),
        ("TICKET — ACT", "A ticket to act (performance pass)"),
        ("ACT — PARK", "An act of park (legislation for parkland)"),
        ("PARK — BAT", "Park the bat (baseball metaphor)"),
        ("BAT — BILL", "The bat bill (cost of equipment)"),
        ("TRAIN — FRONTIER", "A train to the frontier"),
        ("FRONTIER — MUSTANG", "A frontier mustang (wild horse)"),
        ("MUSTANG — CHARGE", "A mustang charge (cavalry advance)"),
        ("CHARGE — HOUSE", "Charge the house (political rally)"),
    ]

    conn_rows = []
    for pair, clue in connections:
        conn_rows.append([
            Paragraph('<b>%s</b>' % esc(pair), S["sense"]),
            Paragraph(esc(clue), S["sense"]),
        ])
    t = Table(conn_rows, colWidths=[45 * mm, 125 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.25, RULE),
    ]))
    story.append(t)

    doc.build(story)
    return path


if __name__ == "__main__":
    out = os.path.join(HERE, "All-American II - Words.pdf")
    build(out)
    print("written:", out, os.path.getsize(out), "bytes")
