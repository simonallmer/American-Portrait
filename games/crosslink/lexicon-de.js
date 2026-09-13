// Das deutsche Wörterbuch — von Hand geschrieben, im Ton des Hauses.
//
// Zwei Tabellen, wie auf der englischen Seite: `lexDe` sind die Bedeutungen in
// ganzen Sätzen, `registryDe` ist der Steinbruch der mehrdeutigen Wörter, nach
// Bereichen sortiert. Was hier steht, ist nicht übersetzt. Es ist nicht
// übersetzbar: ein Crosslink lebt davon, dass ein Wort zufällig zwei Dinge
// meint, und diese Zufälle gehören der Sprache, nicht dem Spiel. UHU heißt
// Vogel und Klebstoff — dafür gibt es kein englisches Wort und also auch kein
// englisches Brett, von dem dieses eine Fassung wäre.
window.CROSSLINK = window.CROSSLINK || {};

// Der Steinbruch: jedes Wort mit den Bereichen, in denen es zu Hause ist. Zwei
// Bereiche oder mehr, und es taugt für ein Feld.
window.CROSSLINK.registryDe = {
  // --- die neun von Brett № 1 ---------------------------------------------
  MAUS:     [["Tier", "der kleine Nager mit dem langen Schwanz"], ["Technik", "was die Hand auf dem Schreibtisch schiebt"], ["Mensch", "als Kosewort für einen Menschen"], ["Geld", "Mäuse, in der Mehrzahl und salopp"]],
  SCHLANGE: [["Tier", "das Reptil ohne Beine"], ["Alltag", "die Reihe der Wartenden"], ["Technik", "die Rohrschlange im Kessel"], ["Mensch", "wer hinterhältig ist"]],
  KREBS:    [["Tier", "das Schalentier, das seitwärts geht"], ["Körper", "die Krankheit der wuchernden Zellen"], ["Himmel", "das vierte Zeichen des Tierkreises"], ["Musik", "der Krebsgang: dieselbe Melodie von hinten gelesen"]],
  UHU:      [["Tier", "die größte Eule Europas"], ["Alltag", "der Klebstoff, nach dem Vogel benannt und in seinen Farben verkauft"]],
  HAHN:     [["Tier", "der Vogel, der den Morgen ausruft"], ["Technik", "was das Wasser laufen lässt, und was das Fass anzapft"], ["Waffe", "der Hahn, der gespannt wird"], ["Mensch", "der Hahn im Korb"]],
  TAUBE:    [["Tier", "der Vogel der Städte und der Schläge"], ["Politik", "wer den Frieden will, gegen den Falken"], ["Körper", "taub: ohne Gehör"], ["Natur", "die taube Nuss, in der nichts ist"]],
  FLIEGE:   [["Tier", "das Insekt, das im Sommer nicht abzuschütteln ist"], ["Kleidung", "die Schleife unterm Kinn"], ["Sprache", "zwei Fliegen mit einer Klappe"]],
  KATER:    [["Tier", "die männliche Katze"], ["Körper", "das Kopfweh am Morgen danach"], ["Mensch", "der gestiefelte, aus dem Märchen"]],
  BULLE:    [["Tier", "das männliche Rind"], ["Mensch", "der Polizist, salopp und selten freundlich"], ["Geld", "wer an der Börse auf steigende Kurse setzt"]],

  // --- was auf ein Brett wartet ------------------------------------------
  BANK:     [["Möbel", "worauf man im Park sitzt"], ["Geld", "wo das Geld verwahrt wird"], ["Natur", "die Sandbank im Fluss"], ["Handwerk", "die Werkbank"], ["Schule", "die Schulbank"]],
  SCHLOSS:  [["Bau", "das Haus des Fürsten"], ["Technik", "was der Schlüssel öffnet"]],
  BALL:     [["Spiel", "die runde Kugel im Sport"], ["Fest", "der Abend, an dem getanzt wird"]],
  BIRNE:    [["Natur", "die Frucht neben dem Apfel"], ["Technik", "die Glühbirne"], ["Körper", "der Kopf, salopp"]],
  DECKE:    [["Alltag", "die Wolldecke über den Knien"], ["Bau", "was über dem Kopf ist"], ["Verkehr", "die Fahrbahndecke"]],
  "FLÜGEL": [["Tier", "was den Vogel trägt"], ["Musik", "das große Klavier"], ["Bau", "der Seitentrakt eines Hauses"], ["Sport", "die Position ganz außen"], ["Politik", "die Richtung innerhalb einer Partei"]],
  GERICHT:  [["Recht", "wo geurteilt wird"], ["Essen", "was auf den Teller kommt"]],
  KIEFER:   [["Körper", "der Knochen, der das Kauen macht"], ["Natur", "der Nadelbaum auf dem Sand"]],
  LEITER:   [["Technik", "die Sprossen zum Hinaufsteigen"], ["Mensch", "wer eine Sache führt"], ["Physik", "was den Strom durchlässt"]],
  MUTTER:   [["Mensch", "wer geboren hat"], ["Technik", "was auf die Schraube gedreht wird"]],
  SCHIMMEL: [["Natur", "der Pilz auf dem alten Brot"], ["Tier", "das weiße Pferd"]],
  STRAUSS:  [["Tier", "der große Vogel, der nicht fliegt"], ["Natur", "die gebundenen Blumen"], ["Musik", "der, dem Wien seine Walzer verdankt"]],
  TAU:      [["Natur", "was am Morgen auf dem Gras liegt"], ["Schifffahrt", "das dicke Seil an Bord"]],
  ZUG:      [["Verkehr", "die Bahn auf der Schiene"], ["Spiel", "was man beim Schach macht"], ["Mensch", "der Charakterzug"], ["Alltag", "die Luft, die durch die offene Tür geht"], ["Körper", "der Schluck, und der an der Zigarette"]],
  ATLAS:    [["Sprache", "das Buch der Karten"], ["Körper", "der oberste Halswirbel, der den Kopf trägt"], ["Stoff", "das glänzende Gewebe"]],
  BAND:     [["Musik", "die Gruppe auf der Bühne"], ["Alltag", "der Streifen Stoff"], ["Sprache", "der Band im Regal"], ["Technik", "das Fließband"]],
  BLATT:    [["Natur", "was am Baum hängt"], ["Sprache", "die Zeitung"], ["Spiel", "die Karten in der Hand"], ["Alltag", "das Papier"]],
  BOGEN:    [["Waffe", "womit der Pfeil fliegt"], ["Bau", "der Träger, der sich krümmt"], ["Alltag", "das Blatt Papier"], ["Musik", "womit die Geige gestrichen wird"]],
  KURS:     [["Geld", "was eine Aktie gerade wert ist"], ["Schifffahrt", "die Richtung, die gehalten wird"], ["Schule", "der Lehrgang"]],
  NOTE:     [["Musik", "das Zeichen auf der Linie"], ["Schule", "was am Ende unter der Arbeit steht"], ["Geld", "der Schein"]],
  SATZ:     [["Sprache", "die Wörter bis zum Punkt"], ["Sport", "der Abschnitt im Tennis"], ["Musik", "der Teil einer Sinfonie"], ["Alltag", "der Sprung"]],
  STOCK:    [["Alltag", "der Stab in der Hand"], ["Bau", "das Geschoss über dem Erdgeschoss"], ["Tier", "der Bienenstock"]],
  STEUER:   [["Geld", "was der Staat nimmt"], ["Technik", "das Rad, an dem gelenkt wird"]],
  TON:      [["Musik", "der Klang"], ["Natur", "die Erde, aus der der Töpfer arbeitet"], ["Mensch", "der Ton, in dem etwas gesagt wird"]]
};

// Die Bedeutungen. Die zweite ist oft die, die das Brett meint — deshalb ist
// das hier eine Hilfe und keine Lösung.
window.CROSSLINK.lexDe = {
  MAUS:     { pos: "die", senses: ["Ein kleiner Nager mit langem, nacktem Schwanz.", "Das Gerät, mit dem eine Hand den Zeiger über den Bildschirm führt — benannt nach dem Tier, dem es ähnlich sah.", "Kosewort."] },
  SCHLANGE: { pos: "die", senses: ["Ein Reptil ohne Beine, das sich in Windungen fortbewegt.", "Eine Reihe von Menschen, die hintereinander warten.", "Ein gewundenes Rohr, das Wärme abgibt oder aufnimmt."] },
  KREBS:    { pos: "der", senses: ["Ein Schalentier mit Scheren, das seitwärts läuft.", "Eine Krankheit, bei der Zellen wachsen, wo sie nicht sollen.", "Das vierte Zeichen des Tierkreises, vom 21. Juni an.", "In der Musik: eine Melodie, von hinten nach vorn gelesen."] },
  UHU:      { pos: "der", senses: ["Die größte europäische Eule; jagt nachts, und wird tagsüber schlafend angetroffen.", "Ein Alleskleber, 1932 in Bühl auf den Namen des Vogels getauft, weil die Firma zuvor Vogelnamen für Leime benutzte."] },
  HAHN:     { pos: "der", senses: ["Der männliche Vogel im Hühnerhof, der den Morgen ausruft.", "Ein Absperrventil: der Wasserhahn an der Leitung, der Zapfhahn am Fass.", "Der Teil des Gewehrs, der gespannt und ausgelöst wird.", "Der Hahn im Korb: der einzige Mann unter Frauen."] },
  TAUBE:    { pos: "die", senses: ["Ein Vogel, in den Städten zu Tausenden und auf dem Land in Schlägen gehalten.", "Sinnbild des Friedens; in der Politik das Gegenstück zum Falken.", "taub (Adj.): ohne Gehör — oder ohne Inhalt, wie die taube Nuss."] },
  FLIEGE:   { pos: "die", senses: ["Ein Insekt mit zwei Flügeln, das im Sommer nicht abzuschütteln ist.", "Eine Schleife, die zum Anzug unter dem Kragen gebunden wird.", "Zwei Fliegen mit einer Klappe: zwei Dinge auf einmal erledigen."] },
  KATER:    { pos: "der", senses: ["Die männliche Katze.", "Das Kopfweh am Morgen nach dem Trinken; vermutlich aus „Katarrh“ verschliffen.", "Der Gestiefelte, aus dem Märchen."] },
  BULLE:    { pos: "der", senses: ["Das männliche Rind, ungeschnitten und schwer.", "Ein Polizist — salopp, und selten freundlich gemeint.", "An der Börse: wer auf steigende Kurse setzt, gegen den Bären."] },

  "BERNERS-LEE": { pos: "Eigenname", senses: ["Tim Berners-Lee, der 1989 am CERN das World Wide Web vorschlug und es verschenkte.", "Sein Vorschlag war als Netz gezeichnet: Kästen mit Wörtern, Pfeile mit Beschriftung. Also ein Crosslink, vier Jahre bevor es eines gab."] },

  BANK:     { pos: "die", senses: ["Ein Sitzmöbel für mehrere, ohne Lehne oder mit.", "Ein Haus, das fremdes Geld verwahrt und weiterverleiht.", "Eine Untiefe aus Sand im Fluss oder vor der Küste.", "Die Werkbank, an der gearbeitet wird."] },
  "FLÜGEL": { pos: "der", senses: ["Womit ein Vogel fliegt.", "Ein Klavier, dessen Saiten waagerecht liegen — benannt nach seiner Form.", "Der Seitentrakt eines großen Hauses.", "In einer Partei: die Richtung am Rand."] },
  LEITER:   { pos: "die / der", senses: ["die Leiter: zwei Holme mit Sprossen dazwischen.", "der Leiter: wer eine Sache führt.", "der Leiter: ein Stoff, der den Strom durchlässt."] },
  MUTTER:   { pos: "die", senses: ["Wer ein Kind geboren hat.", "Das Gegenstück zur Schraube, mit Gewinde innen. Mehrzahl: Muttern, nicht Mütter."] },
  ZUG:      { pos: "der", senses: ["Eine Reihe von Wagen auf der Schiene.", "Was ein Spieler auf dem Brett tut, wenn er an der Reihe ist.", "Ein Merkmal eines Menschen: ein freundlicher Zug.", "Bewegte Luft, die durch eine offene Tür geht."] }
};
