#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Baut aus brett.json die beiden Dateien: das Spiel und den Druckbogen.

  python3 bauen.py [ordner]          beide HTML-Dateien bauen
  python3 bauen.py [ordner] --pdf    danach den Bogen durch Chrome als PDF ziehen

Ohne Ordner ist der eigene gemeint. Die Vorlagen und die Engine liegen hier;
jedes Brett liegt in seinem Ordner und hat nur ein brett.json. Eine Quelle,
zwei Ausgaben: die Sätze stehen nur dort, damit Spiel und Druck nie
auseinanderlaufen können.

Beide Brettgrößen kommen durch dieselben Vorlagen: was von der Größe abhängt —
die Maße des Gitters, die Zahlen im Text, die Spalten der Satzliste — steht in
MASSE und wird eingesetzt, nicht in die Vorlage geschrieben.
"""
import io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
_arg = [a for a in sys.argv[1:] if not a.startswith("--")]
ORDNER = os.path.abspath(_arg[0]) if _arg else HERE

lies = lambda n: io.open(os.path.join(HERE, n), encoding="utf-8").read()
liesBrett = lambda n: io.open(os.path.join(ORDNER, n), encoding="utf-8").read()
schreib = lambda n, t: io.open(os.path.join(ORDNER, n), "w", encoding="utf-8").write(t)

P = json.loads(liesBrett("brett.json"))
N = P["size"]
W = lambda r, c: P["nouns"][r][c]

# Was von der Brettgröße abhängt. Die Höhen sind gegen die Seite gemessen:
# 190 mm abzüglich Kopf, Einleitung und Fußzeile lassen dem Gitter rund 161 mm.
MASSE = {
    3: dict(noun=52, gut=46, row=32, gutRow=30, labpt=6.4, wortpt=15, spalten=2),
    5: dict(noun=32.6, gut=27, row=18, gutRow=16.5, labpt=5.2, wortpt=10.5, spalten=3),
}[N]

ZAHLWORT = {3: "drei", 4: "vier", 5: "fünf", 6: "sechs", 7: "sieben", 8: "acht",
            9: "neun", 10: "zehn", 11: "elf", 12: "zwölf"}


def spur(mass_a, mass_b):
    """Die Spalten- bzw. Zeilenvorgabe des Gitters: Feld, Gasse, Feld, ..."""
    return " ".join(("%gmm" % (mass_a if i % 2 == 0 else mass_b))
                    for i in range(2 * N - 1))

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SPIEL = P["title"] + ".html"
DRUCK = P["title"] + " — Druckbogen.html"
PDF = P["title"] + ".pdf"

# Hat ueberhaupt eine Verbindung eine zweite Seite? Ein Brett ohne Rueckseiten
# bekommt keinen Umdrehen-Knopf, keine Rueckseiten-Seite und keine zweite
# Zeile in der Satzliste — statt leerer Kaesten faellt alles davon weg.
HAT_RUECK = any(d.get("verb2") for zeile in (P["h"] + P["v"]) for d in zeile if d)
KANTEN = len([1 for zeile in (P["h"] + P["v"]) for d in zeile if d])
BALKEN = 2 * N * (N - 1) - KANTEN
HAT_UMLAUT = any(c in "ÄÖÜß" for r in P["nouns"] for w in r for c in w)


def gitter():
    """Jede Gasse als (id, Achse, Zeile, Spalte, daten-oder-None)."""
    out = []
    for r in range(N):
        for g in range(N - 1):
            out.append(("h:%d:%d" % (r, g), "h", r, g, P["h"][r][g]))
    for g in range(N - 1):
        for c in range(N):
            out.append(("v:%d:%d" % (g, c), "v", g, c, P["v"][g][c]))
    return out


def kopf(d, achse):
    """Die Pfeilspitze, wie die Engine sie setzt."""
    if d.get("kind") == "eq":
        return "level"
    fwd = "right" if achse == "h" else "down"
    vor = d.get("dir") == fwd
    if achse == "h":
        return "to-right" if vor else "to-left"
    return "to-down" if vor else "to-up"


# ---- das Spiel ---------------------------------------------------------
def zahlen():
    """Die Zahlen, die im Text stehen — aus dem Brett, nicht aus der Vorlage."""
    kanten = len([1 for gid, a, i, j, d in gitter() if d])
    balken = 2 * N * (N - 1) - kanten
    mitte = W(*P["centre"])
    drauf = len([1 for gid, achse, i, j, d in gitter() if d and P["centre"] in (
        [i, j], [i, j + 1] if achse == "h" else [i + 1, j])])
    return {
        "__TITEL__": P["title"],
        "__STERNE__": "\u2605" * P.get("stars", 1) + "\u2606" * (3 - P.get("stars", 1)),
        "__NUMMER__": P.get("nummer", "Brett № %d" % (1 if N >= 5 else 2)),
        "__KANTEN__": str(kanten),
        "__ANZAHL__": ("%d Tiere · %d Verbindungen · %d Balken" % (N * N, kanten, balken))
                      if balken else ("%d Tiere · %d Verbindungen" % (N * N, kanten)),
        "__TIPPZEILE__": "Klick auf ein Feld und tippe."
                         + (" Umlaute darfst du als A, O, U eingeben." if HAT_UMLAUT else ""),
        "__MITTE__": "%s Buchstaben, %s Sätze zeigen darauf"
                     % (ZAHLWORT.get(len(mitte), len(mitte)), ZAHLWORT.get(drauf, drauf)),
        "__SCHLUSS__": P.get("schluss", ""),
        "__WIDMUNG__": P.get("widmung", ""),
        "__FUER__": P.get("fuer", ""),
        "__RUECKSEITEN__": P.get("rueckseiten", ""),
        "__COLS__": spur(MASSE["noun"], MASSE["gut"]),
        "__ROWS__": spur(MASSE["row"], MASSE["gutRow"]),
        "__LABPT__": str(MASSE["labpt"]),
        "__WORTPT__": str(MASSE["wortpt"]),
        "__SPALTEN__": str(MASSE["spalten"]),
        "__NOTIZ_TITEL__": P.get("notiz", {}).get("titel", ""),
        "__NOTIZ__": P.get("notiz", {}).get("text", ""),
        "__FUSS1__": "Das Brett" if P.get("einseitig") else "Seite 1 · Das Brett",
        "__NR_LOESUNG__": "3" if HAT_RUECK else "2",
        "__NR_SAETZE__": "4" if HAT_RUECK else "3",
        "__SATZTITEL__": "Alle Verbindungen, beide Seiten" if HAT_RUECK
                         else "Alle Verbindungen zum Nachlesen",
        "__SATZKOPF__": ("%d Verbindungen · %d Rückseiten" % (kanten, kanten)) if HAT_RUECK
                        else ("%d Verbindungen · %d Balken" % (kanten, balken)) if balken
                        else ("%d Verbindungen" % kanten),
    }


def einsetzen(t):
    for k, v in zahlen().items():
        t = t.replace(k, v)
    # Was das Brett nicht hat, wird auch nicht erklärt: die Anleitung, der Bogen
    # und das Spiel reden nur von dem, was auf diesem Brett vorkommt. Steht der
    # Block auf einer eigenen Zeile, geht die Zeile mit — sonst bleiben Löcher.
    def weg(marke, wenn):
        if wenn: return
        raus.append(marke)

    raus = []
    weg("WIDMUNG", P.get("widmung"))     # keine Widmung: keine leere Zeile am Fuß
    weg("RUECK", HAT_RUECK)              # keine zweiten Seiten: kein Umdrehen
    weg("NOTIZ", P.get("notiz"))         # kein Absatz unter dem Brett
    weg("BALKEN", BALKEN)                # alles verbunden: kein Wort über Balken
    weg("UMLAUT", HAT_UMLAUT)            # kein Ä, Ö, Ü auf dem Brett: nichts zu tippen
    weg("MEHRSEITIG", not P.get("einseitig"))   # einseitig: nur das Brett, keine Lösung
    for marke in raus:
        t = re.sub(r"[ \t]*<!--%s-->.*?<!--/%s-->[ \t]*\n?" % (marke, marke),
                   "", t, flags=re.S)
    # Was stehen bleibt, steht ohne die Marken da.
    return re.sub(r"<!--/?(WIDMUNG|RUECK|NOTIZ|BALKEN|UMLAUT|MEHRSEITIG)-->", "", t)


def spiel():
    t = lies("vorlage-spiel.html")
    t = einsetzen(t)
    t = t.replace("__BRETT__", json.dumps(P, ensure_ascii=False, indent=1))
    t = t.replace("__SPIEL__", lies("spiel.js"))
    schreib(SPIEL, t)
    return SPIEL


# ---- der Druckbogen ----------------------------------------------------
# Vier Seiten A4 quer: das leere Brett zum Ausfüllen, dieselbe Seite mit den
# Rückseiten, die Lösung, und die Sätze zum Nachlesen.
def zelle(r, c, leer):
    w = W(r, c)
    if leer:
        return ('<div class="z leer"><span class="tick">%d</span>'
                '<span class="kaest">%s</span></div>'
                % (len(w), "".join('<i></i>' for _ in w)))
    return '<div class="z voll"><span class="wort">%s</span></div>' % w


def gasse(gid, achse, i, j, d, rueck):
    if not d:
        return '<div class="g bar %s"></div>' % achse
    text = d.get("verb2") if (rueck and d.get("verb2")) else d["verb"]
    return ('<div class="g an %s %s%s"><span class="lab">%s</span></div>'
            % (achse, kopf(d, achse), " neu" if d.get("neu") else "", text))


def brett_html(leer=True, rueck=False):
    n = 2 * N - 1
    out = []
    for R in range(n):
        for C in range(n):
            if R % 2 == 0 and C % 2 == 0:
                out.append(zelle(R // 2, C // 2, leer))
            elif R % 2 == 0:
                r, g = R // 2, (C - 1) // 2
                out.append(gasse("h:%d:%d" % (r, g), "h", r, g, P["h"][r][g], rueck))
            elif C % 2 == 0:
                g, c = (R - 1) // 2, C // 2
                out.append(gasse("v:%d:%d" % (g, c), "v", g, c, P["v"][g][c], rueck))
            else:
                out.append('<div class="tot"></div>')
    return "\n".join(out)


def saetze_html():
    zeilen = []
    for gid, achse, i, j, d in gitter():
        if not d:
            continue
        if achse == "h":
            a, b, fwd = (i, j), (i, j + 1), "right"
        else:
            a, b, fwd = (i, j), (i + 1, j), "down"
        eq = d.get("kind") == "eq"
        subj, obj = (a, b) if (eq or d.get("dir") == fwd) else (b, a)
        zeichen = "&#8212;" if eq else "&#8594;"
        zweite = ('<span class="s2">%s <i>%s</i> %s.</span>'
                  % (W(*subj), d["verb2"], W(*obj))) if d.get("verb2") else ""
        zeilen.append(
            '<li%s><span class="paar">%s <span class="pf">%s</span> %s</span>'
            '<span class="s1">%s <i>%s</i> %s.</span>%s</li>'
            % (' class="neu"' if d.get("neu") else "",
               W(*subj), zeichen, W(*obj),
               W(*subj), d["verb"], W(*obj), zweite))
    return "\n".join(zeilen)


def druck():
    t = einsetzen(lies("vorlage-druck.html"))
    t = (t.replace("__BRETT_LEER__", brett_html(leer=True, rueck=False))
          .replace("__BRETT_RUECK__", brett_html(leer=True, rueck=True))
          .replace("__BRETT_LOESUNG__", brett_html(leer=False, rueck=False))
          .replace("__SAETZE__", saetze_html()))
    schreib(DRUCK, t)
    return DRUCK


def pdf():
    src = os.path.join(ORDNER, DRUCK)
    ziel = os.path.join(ORDNER, PDF)
    if not os.path.exists(CHROME):
        print("Chrome nicht gefunden — den Druckbogen im Browser mit Cmd+P sichern.")
        return None
    subprocess.check_call([
        CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
        "--print-to-pdf=" + ziel, "--virtual-time-budget=4000",
        "file://" + src.replace(" ", "%20")],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return ziel


if __name__ == "__main__":
    print("gebaut:", spiel())
    if os.path.exists(os.path.join(HERE, "vorlage-druck.html")):
        print("gebaut:", druck())
        if "--pdf" in sys.argv:
            z = pdf()
            if z:
                print("gebaut: %s (%d kB)" % (os.path.basename(z), os.path.getsize(z) // 1024))
