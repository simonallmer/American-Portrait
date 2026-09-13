window.CROSSLINK = window.CROSSLINK || {};
(window.CROSSLINK.puzzles = window.CROSSLINK.puzzles || []).push({
  id: "09-general-command",
  lang: "en",
  title: "General Command",
  standfirst: "Written by Simon Allmer",
  hue: "america",
  theme: "american",
  stars: 1,
  size: 3,
  centre: [1, 1],

  nouns: [
    ["BILL",    "ALASKA",   "FLEET"],
    ["STATE",   "SEAL",     "NAVY"],
    ["COMPANY", "PRIVATE",  "ARMY"]
  ],

  h: [
    [ { verb: "of $7.2 million purchased", dir: "right" },
      { verb: "needs icebreakers to traverse", dir: "left" } ],
    [ { verb: "stamps official documents with its official", dir: "right" },
      { verb: "deploys Team Six's elite", dir: "left" } ],
    [ { verb: "buys back its public stock to go", dir: "right" },
      { verb: "serves as the entry rank in the", dir: "right" } ]
  ],

  v: [
    [ { verb: "legislature votes to pass a", dir: "up" },
      { verb: "lounges on the icy coastlines of", dir: "up" },
      { verb: "commands the Pacific", dir: "up" } ],
    [ { verb: "Street trades heavily on Wall Street to buy a", dir: "down" },
      { verb: "keeps covert military operations strictly", dir: "down" },
      { verb: "was established in 1775 alongside the", kind: "eq" } ]
  ]
});
