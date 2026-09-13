# -*- coding: utf-8 -*-
"""Render the polysemy reference as a PDF. A4, one column, ranked by domain count."""

import importlib.util, os, collections

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                               Spacer, KeepTogether, Table, TableStyle)

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("words", os.path.join(HERE, "words.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
WORDS = mod.WORDS

INK = colors.HexColor("#1B1A17")
SOFT = colors.HexColor("#55524A")
FAINT = colors.HexColor("#8C887D")
RULE = colors.HexColor("#C9C3B2")
LIVE = colors.HexColor("#0F6E56")

SERIF, SERIF_B, SERIF_I = "Times-Roman", "Times-Bold", "Times-Italic"
SANS, SANS_B = "Helvetica", "Helvetica-Bold"

S = {
 "title":  ParagraphStyle("t", fontName=SERIF, fontSize=27, leading=31, textColor=INK, spaceAfter=7),
 "sub":    ParagraphStyle("s", fontName=SERIF, fontSize=11.5, leading=16.5, textColor=SOFT, spaceAfter=13),
 "body":   ParagraphStyle("b", fontName=SERIF, fontSize=10.5, leading=15.5, textColor=INK, spaceAfter=9),
 "eyebrow":ParagraphStyle("e", fontName=SANS_B, fontSize=7.5, leading=11, textColor=FAINT, spaceAfter=5),
 "tier":   ParagraphStyle("h", fontName=SERIF, fontSize=15.5, leading=19, textColor=INK, spaceBefore=15, spaceAfter=2),
 "tiersub":ParagraphStyle("hs", fontName=SANS, fontSize=8.5, leading=12, textColor=FAINT, spaceAfter=9),
 "word":   ParagraphStyle("w", fontName=SANS_B, fontSize=10, leading=13.5, textColor=INK,
                          spaceBefore=6, spaceAfter=1.5),
 "sense":  ParagraphStyle("sn", fontName=SERIF, fontSize=9.5, leading=13.5, textColor=SOFT,
                          leftIndent=9, spaceAfter=1.5),
 "note":   ParagraphStyle("nt", fontName=SERIF_I, fontSize=9.5, leading=13.5, textColor=LIVE,
                          leftIndent=9, spaceAfter=3),
}


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def domain_count(entry):
    return len({d for d, _ in entry[1]})


def rule(width=170 * mm, colour=RULE, thick=0.5, before=0, after=6):
    t = Table([[""]], colWidths=[width], rowHeights=[0.1])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), thick, colour),
                           ("TOPPADDING", (0, 0), (-1, -1), before),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), after)]))
    return t


def entry_flow(word, senses, note, rank):
    """One word, kept on a single page."""
    doms = []
    for d, _ in senses:
        if d not in doms:
            doms.append(d)
    bits = []
    head = ('<font color="#8C887D" size="8">%d&nbsp;&nbsp;</font>%s'
            '<font name="Helvetica" size="7.5" color="#8C887D">&nbsp;&nbsp;%d domains &middot; %s</font>'
            % (rank, esc(word), len(doms), esc(" &middot; ".join(doms)).replace("&amp;", "&")))
    bits.append(Paragraph(head, S["word"]))
    for d, g in senses:
        bits.append(Paragraph('<font name="Helvetica" size="7.5" color="#8C887D">%s</font>&nbsp;&nbsp;%s'
                              % (esc(d.upper()), esc(g)), S["sense"]))
    if note:
        bits.append(Paragraph(esc(note), S["note"]))
    return KeepTogether(bits)


def build(path):
    doc = BaseDocTemplate(path, pagesize=A4,
                          leftMargin=20 * mm, rightMargin=20 * mm,
                          topMargin=18 * mm, bottomMargin=18 * mm,
                          title="Polysemous Words for Crosslink",
                          author="Simon Allmer")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def furniture(canvas, d):
        canvas.saveState()
        canvas.setFont(SANS, 7.5)
        canvas.setFillColor(FAINT)
        if canvas.getPageNumber() > 1:
            canvas.drawString(doc.leftMargin, A4[1] - 12 * mm, "CROSSLINK  ·  POLYSEMOUS WORDS")
        canvas.drawRightString(A4[0] - doc.rightMargin, 11 * mm, str(canvas.getPageNumber()))
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id="p", frames=[frame], onPage=furniture)])

    ranked = sorted(WORDS, key=lambda e: (-domain_count(e), e[0]))
    story = []

    story.append(Paragraph("CROSSLINK &middot; DESIGN REFERENCE", S["eyebrow"]))
    story.append(Paragraph("Words That Do Two Jobs", S["title"]))
    story.append(Paragraph(
        "Polysemous English words, ranked by how many <i>different domains</i> their senses fall into. "
        "These are the hinge words for Crosslink: put one in a crossing square and the two verbs "
        "touching it read on two different meanings, so the solver has to notice that the board "
        "is using the word twice.", S["sub"]))
    story.append(rule())

    story.append(Paragraph("How this is ranked", S["tier"]))
    story.append(Paragraph(
        "Not by raw sense count. A dictionary gives <b>break</b> sixty-odd senses, but they are all "
        "shades of one idea, and shades are no use here — two verbs cannot pick them apart. What a "
        "hinge needs is <i>distance</i>: senses that sit in unrelated corners of the world, so a verb "
        "attached to one cannot possibly be read as the other. <b>CRANE</b> has only three senses and is "
        "close to perfect, because a bird and a lifting machine share nothing but a silhouette.",
        S["body"]))
    story.append(Paragraph(
        "So each word here is scored by the number of distinct domains its senses occupy — Animal, "
        "Music, Money, Body, Law, and so on. The domains are printed beside each word so you can "
        "disagree with the count at a glance.", S["body"]))

    story.append(Paragraph("How to use one", S["tier"]))
    story.append(Paragraph(
        "Give the square two verbs that cannot both be true of the same sense:", S["body"]))
    story.append(Paragraph(
        "<font name=\"Helvetica\" size=\"9\">MINT &nbsp;&mdash;strikes a&mdash;&gt;&nbsp; COIN</font><br/>"
        "<font name=\"Helvetica\" size=\"9\">MINT &nbsp;&mdash;flavours&mdash;&gt;&nbsp; TEA</font>",
        S["sense"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "One cell, two referents, and the solver only sees it when the second verb lands. A word with "
        "a clean two-way split (QUARRY, SENTENCE, CABINET) is often a better hinge than one with seven "
        "blurry senses — rank is a starting point, not a verdict. Watch for the ones marked with a "
        "note: those are the pairings worth building a board around.", S["body"]))
    story.append(Paragraph(
        "Two free difficulty levers appear repeatedly below. <b>Stress shift</b> — PRESent and preSENT, "
        "OBject and obJECT — and <b>outright different pronunciation</b> — LEAD, BOW, ROW, SOW, BASS, "
        "MINUTE. A printed board cannot show either, so the page keeps the ambiguity the ear would "
        "resolve.", S["body"]))
    story.append(Spacer(1, 3))
    story.append(Paragraph(
        "<b>Provenance.</b> This list and its domain tags are hand-built, not machine-extracted from "
        "WordNet, so treat the counts as an argument rather than a measurement. A WordNet pass would "
        "be exhaustive but noisier; it would also rank <i>break</i> and <i>set</i> at the top, which "
        "for this purpose is wrong.", S["body"]))

    tiers = [
        (7, 99, "The hinges", "Seven or more domains. Rich enough to build a whole board around."),
        (6, 6,  "Six domains", "Still comfortably more meanings than any one puzzle needs."),
        (5, 5,  "Five domains", "The working middle of the list."),
        (4, 4,  "Four domains", "Reliable, and less likely to feel like a trick."),
        (3, 3,  "Three domains", "Usually one strong pairing and a spare."),
        (2, 2,  "Clean two-way splits",
                "Fewest senses, least ambiguity, and often the most elegant crossings on a board."),
    ]

    for lo, hi, name, blurb in tiers:
        group = [e for e in ranked if lo <= domain_count(e) <= hi]
        if not group:
            continue
        story.append(Spacer(1, 5))
        story.append(rule(after=2))
        story.append(Paragraph("%s <font name=\"Helvetica\" size=\"9\" color=\"#8C887D\">&nbsp;&nbsp;%d words</font>"
                               % (name, len(group)), S["tier"]))
        story.append(Paragraph(blurb.upper(), S["tiersub"]))
        for i, (w, s, n) in enumerate(group, 1):
            story.append(entry_flow(w, s, n, i))

    # Closing index by domain
    story.append(Spacer(1, 8))
    story.append(rule(after=2))
    story.append(Paragraph("Index by domain", S["tier"]))
    story.append(Paragraph(
        "WHICH WORDS CAN REACH INTO EACH CORNER OF THE WORLD", S["tiersub"]))
    by_dom = collections.defaultdict(list)
    for w, s, _ in WORDS:
        for d, _g in s:
            if w not in by_dom[d]:
                by_dom[d].append(w)
    rows = []
    for d in sorted(by_dom):
        rows.append([Paragraph('<font name="Helvetica-Bold" size="8">%s</font>' % esc(d.upper()), S["sense"]),
                     Paragraph('<font size="9">%s</font>' % esc(", ".join(sorted(by_dom[d]))), S["sense"])])
    t = Table(rows, colWidths=[26 * mm, 144 * mm])
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
    out = os.path.join(HERE, "Crosslink - Polysemous Words.pdf")
    build(out)
    counts = collections.Counter(domain_count(e) for e in WORDS)
    print("words:", len(WORDS))
    print("by domain count:", dict(sorted(counts.items(), reverse=True)))
    print("written:", out, os.path.getsize(out), "bytes")
