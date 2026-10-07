// US city markers for the State Quiz map.
// Coordinates are in the us_map_data.js SVG user space (viewBox 0 0 959 593).
// Derived from real lat/lon via the Albers USA projection this map is drawn in
// (scale 1262.0277, translate [470.0172, 288.5343]), then verified point-in-path
// against each state's own <path>. Alaska and Hawaii use the map's inset projections.
//
// Fields: n = name, x/y = SVG coords, t = tier (1 = anchor city shown first,
// 2 = state's headline city, 3 = revealed when zoomed in), c = 1 if state capital.
const US_CITIES = [
    // AK
    { s: "AK", n: "Anchorage", x: 105.8, y: 520.8, t: 2, c: 0 },
    { s: "AK", n: "Fairbanks", x: 111.2, y: 492.3, t: 3, c: 0 },
    { s: "AK", n: "Juneau", x: 169.1, y: 538.8, t: 3, c: 1 },
    // AL
    { s: "AL", n: "Birmingham", x: 647.6, y: 395.6, t: 2, c: 0 },
    { s: "AL", n: "Huntsville", x: 649, y: 368.5, t: 3, c: 0 },
    { s: "AL", n: "Montgomery", x: 659.4, y: 420.1, t: 3, c: 1 },
    // AR
    { s: "AR", n: "Little Rock", x: 546.8, y: 375.2, t: 2, c: 1 },
    { s: "AR", n: "Fayetteville", x: 512.7, y: 346.9, t: 3, c: 0 },
    // AZ
    { s: "AZ", n: "Phoenix", x: 188.2, y: 380.5, t: 1, c: 1 },
    { s: "AZ", n: "Tucson", x: 203.8, y: 410.6, t: 3, c: 0 },
    // CA
    { s: "CA", n: "Los Angeles", x: 81, y: 345, t: 1, c: 0 },
    { s: "CA", n: "San Francisco", x: 30.6, y: 246.2, t: 1, c: 0 },
    { s: "CA", n: "Sacramento", x: 50.7, y: 233.2, t: 3, c: 1 },
    { s: "CA", n: "San Diego", x: 93.6, y: 378.3, t: 3, c: 0 },
    // CO
    { s: "CO", n: "Denver", x: 329.6, y: 258.3, t: 1, c: 1 },
    { s: "CO", n: "Colorado Springs", x: 330.5, y: 278.6, t: 3, c: 0 },
    { s: "CO", n: "Grand Junction", x: 268.3, y: 266.5, t: 3, c: 0 },
    // CT
    { s: "CT", n: "Hartford", x: 856.8, y: 174, t: 2, c: 1 },
    { s: "CT", n: "New Haven", x: 855.2, y: 184.9, t: 3, c: 0 },
    // DE
    { s: "DE", n: "Dover", x: 823.9, y: 241.2, t: 2, c: 1 },
    { s: "DE", n: "Wilmington", x: 820.9, y: 228.6, t: 3, c: 0 },
    // FL
    { s: "FL", n: "Miami", x: 795.5, y: 548.3, t: 1, c: 0 },
    { s: "FL", n: "Jacksonville", x: 751.4, y: 453.7, t: 3, c: 0 },
    { s: "FL", n: "Orlando", x: 762.7, y: 492, t: 3, c: 0 },
    { s: "FL", n: "Tallahassee", x: 701.8, y: 458.2, t: 3, c: 1 },
    { s: "FL", n: "Tampa", x: 743.8, y: 507.8, t: 3, c: 0 },
    // GA
    { s: "GA", n: "Atlanta", x: 690.8, y: 385.7, t: 1, c: 1 },
    { s: "GA", n: "Savannah", x: 756, y: 413.9, t: 3, c: 0 },
    // HI
    { s: "HI", n: "Honolulu", x: 275, y: 529, t: 2, c: 1 },
    { s: "HI", n: "Hilo", x: 333, y: 572, t: 3, c: 0 },
    // IA
    { s: "IA", n: "Des Moines", x: 519.1, y: 223.9, t: 2, c: 1 },
    { s: "IA", n: "Cedar Rapids", x: 550.7, y: 214.1, t: 3, c: 0 },
    // ID
    { s: "ID", n: "Boise", x: 161.9, y: 145.5, t: 2, c: 1 },
    { s: "ID", n: "Idaho Falls", x: 226.4, y: 160.7, t: 3, c: 0 },
    // IL
    { s: "IL", n: "Chicago", x: 616.3, y: 212, t: 1, c: 0 },
    { s: "IL", n: "Springfield", x: 586.6, y: 261, t: 3, c: 1 },
    // IN
    { s: "IN", n: "Indianapolis", x: 645, y: 256.3, t: 2, c: 1 },
    { s: "IN", n: "Fort Wayne", x: 658.7, y: 225.5, t: 3, c: 0 },
    // KS
    { s: "KS", n: "Wichita", x: 457.3, y: 310.9, t: 2, c: 0 },
    { s: "KS", n: "Dodge City", x: 411, y: 308.2, t: 3, c: 0 },
    { s: "KS", n: "Topeka", x: 485.7, y: 280.8, t: 3, c: 1 },
    // KY
    { s: "KY", n: "Louisville", x: 655.3, y: 289.1, t: 2, c: 0 },
    { s: "KY", n: "Frankfort", x: 670.5, y: 288.5, t: 3, c: 1 },
    { s: "KY", n: "Lexington", x: 677.2, y: 291.3, t: 3, c: 0 },
    // LA
    { s: "LA", n: "New Orleans", x: 593.2, y: 479.1, t: 1, c: 0 },
    { s: "LA", n: "Baton Rouge", x: 571.4, y: 469.3, t: 3, c: 1 },
    { s: "LA", n: "Shreveport", x: 521.8, y: 425.3, t: 3, c: 0 },
    // MA
    { s: "MA", n: "Boston", x: 878.9, y: 154.6, t: 1, c: 1 },
    { s: "MA", n: "Springfield", x: 856.3, y: 166.4, t: 3, c: 0 },
    // MD
    { s: "MD", n: "Baltimore", x: 805.4, y: 242.2, t: 2, c: 0 },
    { s: "MD", n: "Annapolis", x: 808.8, y: 248.5, t: 3, c: 1 },
    // ME
    { s: "ME", n: "Portland", x: 883.7, y: 123.5, t: 2, c: 0 },
    { s: "ME", n: "Augusta", x: 887.1, y: 107.6, t: 3, c: 1 },
    // MI
    { s: "MI", n: "Detroit", x: 689.1, y: 193.6, t: 1, c: 0 },
    { s: "MI", n: "Grand Rapids", x: 645.5, y: 184.9, t: 3, c: 0 },
    { s: "MI", n: "Lansing", x: 663.8, y: 187.9, t: 3, c: 1 },
    // MN
    { s: "MN", n: "Minneapolis", x: 522.8, y: 148.7, t: 2, c: 0 },
    { s: "MN", n: "Duluth", x: 539.3, y: 108.3, t: 3, c: 0 },
    { s: "MN", n: "St. Paul", x: 525.5, y: 149.2, t: 3, c: 1 },
    // MO
    { s: "MO", n: "Kansas City", x: 504.3, y: 279.5, t: 2, c: 0 },
    { s: "MO", n: "St. Louis", x: 579, y: 287.2, t: 2, c: 0 },
    { s: "MO", n: "Jefferson City", x: 545.5, y: 290, t: 3, c: 1 },
    // MS
    { s: "MS", n: "Jackson", x: 587.9, y: 427.5, t: 2, c: 1 },
    { s: "MS", n: "Biloxi", x: 613.3, y: 467.8, t: 3, c: 0 },
    // MT
    { s: "MT", n: "Billings", x: 288.6, y: 119, t: 2, c: 0 },
    { s: "MT", n: "Great Falls", x: 252.1, y: 75.4, t: 3, c: 0 },
    { s: "MT", n: "Helena", x: 237.8, y: 93.4, t: 3, c: 1 },
    // NC
    { s: "NC", n: "Charlotte", x: 749.4, y: 344.3, t: 2, c: 0 },
    { s: "NC", n: "Raleigh", x: 786, y: 325.5, t: 3, c: 1 },
    { s: "NC", n: "Wilmington", x: 804.5, y: 357.1, t: 3, c: 0 },
    // ND
    { s: "ND", n: "Fargo", x: 468.3, y: 107.5, t: 2, c: 0 },
    { s: "ND", n: "Bismarck", x: 407.9, y: 107.3, t: 3, c: 1 },
    { s: "ND", n: "Minot", x: 401.9, y: 75.7, t: 3, c: 0 },
    // NE
    { s: "NE", n: "Omaha", x: 481.3, y: 231.7, t: 2, c: 0 },
    { s: "NE", n: "Lincoln", x: 468.6, y: 241.5, t: 3, c: 1 },
    { s: "NE", n: "North Platte", x: 401.8, y: 232.7, t: 3, c: 0 },
    // NH
    { s: "NH", n: "Manchester", x: 869.1, y: 142.7, t: 2, c: 0 },
    { s: "NH", n: "Concord", x: 866.6, y: 138.5, t: 3, c: 1 },
    // NJ
    { s: "NJ", n: "Trenton", x: 831.6, y: 215.4, t: 2, c: 1 },
    { s: "NJ", n: "Atlantic City", x: 841.1, y: 232.7, t: 3, c: 0 },
    // NM
    { s: "NM", n: "Albuquerque", x: 290.3, y: 358.3, t: 2, c: 0 },
    { s: "NM", n: "Las Cruces", x: 281.4, y: 419, t: 3, c: 0 },
    { s: "NM", n: "Santa Fe", x: 304.4, y: 346.4, t: 3, c: 1 },
    // NV
    { s: "NV", n: "Las Vegas", x: 145.3, y: 311, t: 1, c: 0 },
    { s: "NV", n: "Elko", x: 156, y: 207.3, t: 3, c: 0 },
    { s: "NV", n: "Reno", x: 83.6, y: 220.2, t: 3, c: 0 },
    // NY
    { s: "NY", n: "New York", x: 843.8, y: 202.2, t: 1, c: 0 },
    { s: "NY", n: "Albany", x: 835.1, y: 159.1, t: 3, c: 1 },
    { s: "NY", n: "Buffalo", x: 755.7, y: 170.9, t: 3, c: 0 },
    // OH
    { s: "OH", n: "Cleveland", x: 715.7, y: 208.8, t: 2, c: 0 },
    { s: "OH", n: "Columbus", x: 697.1, y: 245.7, t: 2, c: 1 },
    { s: "OH", n: "Cincinnati", x: 674.3, y: 267.9, t: 3, c: 0 },
    // OK
    { s: "OK", n: "Oklahoma City", x: 453.3, y: 360.2, t: 2, c: 1 },
    { s: "OK", n: "Tulsa", x: 480.4, y: 345.2, t: 3, c: 0 },
    // OR
    { s: "OR", n: "Portland", x: 73.8, y: 80.1, t: 2, c: 0 },
    { s: "OR", n: "Bend", x: 85.6, y: 116.8, t: 3, c: 0 },
    { s: "OR", n: "Salem", x: 65, y: 90.7, t: 3, c: 1 },
    // PA
    { s: "PA", n: "Philadelphia", x: 826, y: 222.7, t: 1, c: 0 },
    { s: "PA", n: "Pittsburgh", x: 744.9, y: 227.5, t: 2, c: 0 },
    { s: "PA", n: "Harrisburg", x: 796.4, y: 221.7, t: 3, c: 1 },
    // RI
    { s: "RI", n: "Providence", x: 876.4, y: 167.6, t: 2, c: 1 },
    // SC
    { s: "SC", n: "Charleston", x: 774.6, y: 395.2, t: 2, c: 0 },
    { s: "SC", n: "Columbia", x: 750.3, y: 371.7, t: 3, c: 1 },
    // SD
    { s: "SD", n: "Sioux Falls", x: 468.6, y: 180.9, t: 2, c: 0 },
    { s: "SD", n: "Pierre", x: 411.9, y: 161.2, t: 3, c: 1 },
    { s: "SD", n: "Rapid City", x: 366.3, y: 164.8, t: 3, c: 0 },
    // TN
    { s: "TN", n: "Nashville", x: 642.4, y: 337.1, t: 1, c: 1 },
    { s: "TN", n: "Memphis", x: 588.1, y: 364.2, t: 2, c: 0 },
    { s: "TN", n: "Knoxville", x: 693, y: 335.9, t: 3, c: 0 },
    // TX
    { s: "TX", n: "Dallas", x: 465.6, y: 420.1, t: 1, c: 0 },
    { s: "TX", n: "Houston", x: 492.3, y: 486.8, t: 1, c: 0 },
    { s: "TX", n: "Austin", x: 447.1, y: 475.4, t: 2, c: 1 },
    { s: "TX", n: "Amarillo", x: 376.3, y: 362.7, t: 3, c: 0 },
    { s: "TX", n: "El Paso", x: 284.4, y: 430.3, t: 3, c: 0 },
    { s: "TX", n: "San Antonio", x: 432.4, y: 493.6, t: 3, c: 0 },
    // UT
    { s: "UT", n: "Salt Lake City", x: 218.6, y: 220.8, t: 2, c: 1 },
    { s: "UT", n: "St. George", x: 176.3, y: 296.1, t: 3, c: 0 },
    // VA
    { s: "VA", n: "Richmond", x: 799.3, y: 283.1, t: 2, c: 1 },
    { s: "VA", n: "Roanoke", x: 757.7, y: 296.9, t: 3, c: 0 },
    { s: "VA", n: "Virginia Beach", x: 827.2, y: 293, t: 3, c: 0 },
    // VT
    { s: "VT", n: "Burlington", x: 834, y: 117.8, t: 2, c: 0 },
    { s: "VT", n: "Montpelier", x: 844.9, y: 120, t: 3, c: 1 },
    // WA
    { s: "WA", n: "Seattle", x: 91.5, y: 37.4, t: 1, c: 0 },
    { s: "WA", n: "Olympia", x: 79.9, y: 47, t: 3, c: 1 },
    { s: "WA", n: "Spokane", x: 162.8, y: 54.5, t: 3, c: 0 },
    // WI
    { s: "WI", n: "Milwaukee", x: 609.7, y: 186.7, t: 2, c: 0 },
    { s: "WI", n: "Green Bay", x: 605.2, y: 154.4, t: 3, c: 0 },
    { s: "WI", n: "Madison", x: 585.7, y: 187.8, t: 3, c: 1 },
    // WV
    { s: "WV", n: "Charleston", x: 725.1, y: 277.8, t: 2, c: 1 },
    { s: "WV", n: "Morgantown", x: 748.6, y: 245.2, t: 3, c: 0 },
    // WY
    { s: "WY", n: "Cheyenne", x: 335.3, y: 227.6, t: 2, c: 1 },
    { s: "WY", n: "Casper", x: 315, y: 187.1, t: 3, c: 0 },
];
