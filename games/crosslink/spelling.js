// Spellings. Answers are written in one English (W1a — British, because the
// house voice already is: `centre` is a data key in every puzzle file, and the
// prose says colour, harbour, grey, neighbour, fibre, travelling throughout).
// The other English is accepted on entry, and the lexicon carries one entry.
//
// WHY THIS IS A LIST AND NOT A RULE
//
// The obvious implementation is a pair of substitutions — "-ISE == -IZE",
// "-RE == -ER" — applied to any word. It is wrong, and wrong in a way that
// shows up on the current shelf:
//
//   -RE == -ER   would accept WIER for WIRE, which is on board №1. FIER for
//                FIRE, EMPIER for EMPIRE. None of those are words, so the
//                board would be marking a misspelling correct and going green
//                while it did it. That is worse than refusing a real variant.
//   -ISE == -IZE would accept RIZE for RISE and WIZE for WISE. Worse, PRISE
//                and PRIZE are *different words* — to lever open, and an award
//                — and a rule cannot tell which one the square meant.
//
// So: every pair is written down, and nothing is accepted that was not. It is
// the same instinct as E5 — a generator may propose, it may not publish.
//
// WHAT THE LETTER COUNT ALREADY HANDLES
//
// Only same-length pairs need to be here at all. Every square prints how many
// letters it takes, so the whole -our/-or class (HARBOUR/HARBOR, COLOUR/COLOR,
// RUMOUR/RUMOR), the -ll-/-l- class (TRAVELLER/TRAVELER), -ogue/-og, -ae-/-e-
// and PLOUGH/PLOW are already refused by the interface before a solver can
// submit them. HARBOUR is on board №3 and needs no entry here.
//
// The class that needed the least work is the one that looks most like a rule:
// **-ISE/-IZE barely applies**, because every answer in this game is a noun and
// that ending is overwhelmingly verbal. The nouns it reaches are the long
// -ISATION forms. The classes that actually bite are -RE/-ER and -CE/-SE.
window.CROSSLINK = window.CROSSLINK || {};

// canonical (as written on boards and in the lexicon) : also accepted
window.CROSSLINK.spelling = {
  // -re / -er
  CENTRE:       ["CENTER"],
  METRE:        ["METER"],
  LITRE:        ["LITER"],
  FIBRE:        ["FIBER"],
  THEATRE:      ["THEATER"],
  SPECTRE:      ["SPECTER"],
  SABRE:        ["SABER"],
  LUSTRE:       ["LUSTER"],
  OCHRE:        ["OCHER"],
  CALIBRE:      ["CALIBER"],
  SEPULCHRE:    ["SEPULCHER"],

  // -ce / -se. Only the nouns: PRACTICE is the noun in both Englishes, so it
  // is not a pair here, and every answer is a noun.
  DEFENCE:      ["DEFENSE"],
  OFFENCE:      ["OFFENSE"],
  PRETENCE:     ["PRETENSE"],
  LICENCE:      ["LICENSE"],

  // -isation / -ization. The whole of the S=Z class that a noun can reach.
  ORGANISATION: ["ORGANIZATION"],
  CIVILISATION: ["CIVILIZATION"],
  REALISATION:  ["REALIZATION"],

  // and the ones that belong to no class at all
  GREY:         ["GRAY"],
  KERB:         ["CURB"],
  TYRE:         ["TIRE"],
  GAOL:         ["JAIL"]
};

// PLOUGHSHARE/PLOWSHARE was written here on the first pass and taken out again:
// eleven letters against nine, so a solver could never have typed the American
// form into the square anyway. `check-boards.py` caught it (W1b) before it had
// been on disk a minute, which is the argument for having taught it to look.
