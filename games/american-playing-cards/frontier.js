// --- Constants & Data ---
const SUITS = {
    WEST_FRONTIER: { id: 'WEST_FRONTIER', name: 'Western Frontier', symbol: '<svg class="suit-icon" viewBox="0 0 100 100"><path d="M 45 22 L 45 35 Q 45 45 35 45 L 22 45 L 22 55 L 35 55 Q 45 55 45 65 L 45 78 L 55 78 L 55 65 Q 55 55 65 55 L 78 55 L 78 45 L 65 45 Q 55 45 55 35 L 55 22 Z"/><circle cx="50" cy="14" r="12"/><circle cx="39" cy="23" r="9"/><circle cx="61" cy="23" r="9"/><circle cx="50" cy="86" r="12"/><circle cx="39" cy="77" r="9"/><circle cx="61" cy="77" r="9"/><circle cx="14" cy="50" r="12"/><circle cx="23" cy="39" r="9"/><circle cx="23" cy="61" r="9"/><circle cx="86" cy="50" r="12"/><circle cx="77" cy="39" r="9"/><circle cx="77" cy="61" r="9"/></svg>', color: 'var(--west-frontier-text)', bg: 'var(--west-frontier-bg)', border: 'var(--west-frontier-border)', align: 'Union' },
    INDUST_EAST: { id: 'INDUST_EAST', name: 'Indust. East', symbol: '<svg class="suit-icon" viewBox="0 0 100 100"><path d="M 50 50 C 48 48, 35 40, 35 28 C 35 15, 45 10, 50 5 C 55 10, 65 15, 65 28 C 65 40, 52 48, 50 50 C 52 48, 60 35, 72 35 C 85 35, 90 45, 95 50 C 90 55, 85 65, 72 65 C 60 65, 52 52, 50 50 C 52 52, 65 60, 65 72 C 65 85, 55 90, 50 95 C 45 90, 35 85, 35 72 C 35 60, 48 52, 50 50 C 48 52, 40 65, 28 65 C 15 65, 10 55, 5 50 C 10 45, 15 35, 28 35 C 40 35, 48 48, 50 50 Z" fill="currentColor"/></svg>', color: 'var(--indust-east-text)', bg: 'var(--indust-east-bg)', border: 'var(--indust-east-border)', align: 'Union' },
    DEEP_SOUTH: { id: 'DEEP_SOUTH', name: 'Deep South', symbol: '<svg class="suit-icon" viewBox="0 0 100 100"><path d="M 50 18 C 60 8, 78 10, 78 25 C 78 40, 54 35, 54 50 C 54 65, 78 60, 78 75 C 78 90, 60 92, 50 82 C 40 92, 22 90, 22 75 C 22 60, 46 65, 46 50 C 46 35, 22 40, 22 25 C 22 10, 40 8, 50 18 Z" fill="currentColor"/></svg>', color: 'var(--deep-south-text)', bg: 'var(--deep-south-bg)', border: 'var(--deep-south-border)', align: 'Confederacy' },
    UPPER_SOUTH: { id: 'UPPER_SOUTH', name: 'Upper/Western South', symbol: '<svg class="suit-icon" viewBox="0 0 100 100"><path d="M 50 8 A 120 120 0 0 0 78 50 A 120 120 0 0 0 50 92 A 120 120 0 0 0 22 50 A 120 120 0 0 0 50 8 Z" fill="currentColor"/></svg>', color: 'var(--upper-south-text)', bg: 'var(--upper-south-bg)', border: 'var(--upper-south-border)', align: 'Confederacy' },
    BORDER: { id: 'BORDER', name: 'Border States', symbol: '<svg class="suit-icon" viewBox="0 0 100 100"><path d="M 50 12 L 61 31 L 83 31 L 72 50 L 83 69 L 61 69 L 50 88 L 39 69 L 17 69 L 28 50 L 17 31 L 39 31 Z" fill="currentColor"/><circle cx="50" cy="12" r="6" fill="currentColor"/><circle cx="83" cy="31" r="6" fill="currentColor"/><circle cx="83" cy="69" r="6" fill="currentColor"/><circle cx="50" cy="88" r="6" fill="currentColor"/><circle cx="17" cy="69" r="6" fill="currentColor"/><circle cx="17" cy="31" r="6" fill="currentColor"/></svg>', color: 'var(--border-text)', bg: 'var(--border-bg)', border: 'var(--border-border)', align: 'Neutral' }
};

const STATES = {
    ATLANTIC_CORRIDOR: [
        "Maine", "Vermont", "New Hampshire", "Massachusetts", "Rhode Island",
        "Connecticut", "New York", "New Jersey", "Delaware", "Maryland"
    ],
    PACIFIC_SUN: [
        "California", "Oregon", "Washington", "Hawaii", "Illinois",
        "Minnesota", "Colorado", "New Mexico", "Virginia", "Nevada"
    ],
    SOUTHERN_HEART: [
        "South Carolina", "Alabama", "Mississippi", "Louisiana", "Arkansas",
        "Tennessee", "Kentucky", "West Virginia", "Oklahoma", "Texas"
    ],
    GREAT_FRONTIER: [
        "Kansas", "Nebraska", "South Dakota", "North Dakota", "Montana",
        "Wyoming", "Idaho", "Utah", "Missouri", "Indiana"
    ],
    WILD_SWINGS: [
        "Pennsylvania", "Florida", "Ohio", "Michigan", "Wisconsin",
        "Georgia", "Arizona", "North Carolina", "Iowa", "Alaska"
    ]
};

const PRESIDENTS = {
    BLACK: [
        "washington", "adams-john", "jefferson", "madison", "monroe",
        "adams-quincy", "harrison-william", "tyler", "taylor", "fillmore"
    ],
    BLUE: [
        "jackson", "van-buren", "polk", "pierce", "buchanan",
        "johnson-andrew", "cleveland-1", "wilson", "roosevelt-franklin", "truman",
        "kennedy", "johnson-lyndon", "carter", "clinton", "obama", "biden"
    ],
    RED: [
        "lincoln", "grant", "hayes", "garfield", "arthur",
        "harrison-benjamin", "mckinley", "roosevelt-theodore", "taft", "harding",
        "coolidge", "hoover", "eisenhower", "nixon", "ford",
        "reagan", "bush-herbert", "bush-walker", "trump"
    ]
};

const BASE_BET_UNIT = 1;

// Circle bisected by a vertical line — represents both 0 (circle) and 1 (line)
const CYPHER_SVG = `<svg class="cypher-svg" viewBox="0 0 20 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cypher"><line x1="10" y1="0" x2="10" y2="32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="10" cy="16" r="8" stroke="currentColor" stroke-width="3.5"/></svg>`;

function cardDisplayVal(val) {
    if (val === 10) return CYPHER_SVG;
    if (val === 1)  return 'I';
    return val;
}

const CARD_IMG_SUIT_ORDER = ['INDUST_EAST', 'WEST_FRONTIER', 'DEEP_SOUTH', 'UPPER_SOUTH', 'BORDER'];
const CARD_IMG_SUIT_NAMES = { INDUST_EAST: 'Clubs', WEST_FRONTIER: 'Spades', DEEP_SOUTH: 'Hearts', UPPER_SOUTH: 'Diamonds', BORDER: 'Stars' };
function getCardImageUrl(suitId, val) {
    const fileNum = (CARD_IMG_SUIT_ORDER.indexOf(suitId) * 10) + val;
    const valStr = val === 10 ? 'Cypher' : String(val);
    return `resources/cards/${String(fileNum).padStart(2, '0')}_${CARD_IMG_SUIT_NAMES[suitId]}_${valStr}.png`;
}

// --- Helper Functions ---
function createDeck(edition = 'STANDARD') {
    let newDeck = [];
    Object.keys(SUITS).forEach(suitKey => {
        const suit = SUITS[suitKey];
        for (let val = 1; val <= 10; val++) {
            let presidentId = null;
            let stateName = null;
            if (edition === 'PRESIDENT') {
                if (suitKey === 'BORDER') {
                    presidentId = PRESIDENTS.BLACK[val - 1] || null;
                } else if (suitKey === 'WEST_FRONTIER') { // Spades (Row 1)
                    presidentId = PRESIDENTS.BLUE[val - 1] || null;
                } else if (suitKey === 'INDUST_EAST') { // Clubs (Row 4)
                    presidentId = PRESIDENTS.BLUE[10 + val - 1] || null;
                } else if (suitKey === 'DEEP_SOUTH') { // Hearts (Row 2)
                    presidentId = PRESIDENTS.RED[val - 1] || null;
                } else if (suitKey === 'UPPER_SOUTH') { // Diamonds (Row 3)
                    presidentId = PRESIDENTS.RED[10 + val - 1] || null;
                }
            } else if (edition === 'STATE') {
                if (suitKey === 'INDUST_EAST') {
                    stateName = STATES.ATLANTIC_CORRIDOR[val - 1] || null;
                } else if (suitKey === 'WEST_FRONTIER') {
                    stateName = STATES.PACIFIC_SUN[val - 1] || null;
                } else if (suitKey === 'DEEP_SOUTH') {
                    stateName = STATES.SOUTHERN_HEART[val - 1] || null;
                } else if (suitKey === 'UPPER_SOUTH') {
                    stateName = STATES.GREAT_FRONTIER[val - 1] || null;
                } else if (suitKey === 'BORDER') {
                    stateName = STATES.WILD_SWINGS[val - 1] || null;
                }
            }

            const president = presidentId ? presidentsData.find(p => p.id === presidentId) : null;
            const state = stateName ? getStateByName(stateName) : null;

            newDeck.push({
                id: `${suitKey}-${val}`,
                suit: suit,
                name: val === 10 ? 'Cypher' : `Rank ${val}`,
                val: val,
                isCypher: val === 10,
                president: president ? president.name : null,
                state: stateName,
                portraitUrl: president ? president.portraitUrl : null,
                flagUrl: state ? state.flagUrl : null
            });
        }
    });

    // Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
}

// Hand Strength (Rules V4, Section 5). A hand is any own cards plus any Table Cards.
// Compare top-down: Size › Type › Color › Total. Hands without a combination skip Size and Type.
const COMBO_TYPES = {
    4: { tier: "Symbol Run", style: "color: #f472b6; font-weight: 900;" },
    3: { tier: "Same Value", style: "color: #c084fc; font-weight: 900;" },
    2: { tier: "Same Symbol", style: "color: #60a5fa; font-weight: 900;" },
    1: { tier: "Run", style: "color: #fbbf24; font-weight: 900;" }
};
const COLOR_NAMES = { 3: "One Color", 2: "One Color + Black", 1: "Red + Blue" };

// Consecutive distinct values; the Cypher (10) links 9 and 1, so the circle may wrap.
function isRunValues(values) {
    const v = [...values].sort((a, b) => a - b);
    if (new Set(v).size !== v.length) return false;
    if (v.length === 10) return true;
    let gaps = 0;
    for (let i = 0; i < v.length; i++) {
        const next = i + 1 < v.length ? v[i + 1] : v[0] + 10;
        if (next - v[i] !== 1) gaps++;
    }
    return gaps === 1;
}

function evaluateHand(cards) {
    if (!cards || cards.length === 0) {
        return { name: "No cards", score: 0, style: "color: #78716c;", tier: "Empty Hand", count: 0, isCombo: false };
    }

    const n = cards.length;
    const totalValue = cards.reduce((acc, c) => acc + c.val, 0);

    // Color: One Color (all Red, all Blue or all Black) › One Color + Black › Red + Blue. A lone card has none.
    const aligns = new Set(cards.map(c => c.suit.align));
    let colorRank = 0;
    if (n > 1) {
        if (aligns.size === 1) colorRank = 3;
        else if (aligns.size === 2 && aligns.has('Neutral')) colorRank = 2;
        else colorRank = 1;
    }
    const colorName = COLOR_NAMES[colorRank] || "";

    // Type: Symbol Run › Same Value › Same Symbol › Run. A Combination is 2+ cards sharing a trait.
    let type = 0;
    if (n >= 2) {
        const sameSymbol = cards.every(c => c.suit.id === cards[0].suit.id);
        const sameValue = cards.every(c => c.val === cards[0].val);
        const run = isRunValues(cards.map(c => c.val));
        if (sameSymbol && run) type = 4;
        else if (sameValue) type = 3;
        else if (sameSymbol) type = 2;
        else if (run) type = 1;
    }

    // Lexicographic score; each weight exceeds the sum of every lower key (total value ≤ 95).
    if (type > 0) {
        const { tier, style } = COMBO_TYPES[type];
        return {
            name: `${n} cards · ${colorName} · ${totalValue}`,
            score: 1000000 + n * 10000 + type * 1000 + colorRank * 100 + totalValue,
            style, tier, type, count: n, isCombo: true, color: colorName
        };
    }

    return {
        name: n === 1 ? `Value ${totalValue}` : `${n} cards · ${colorName} · ${totalValue}`,
        score: colorRank * 100 + totalValue,
        style: n === 1 ? "color: #a8a29e;" : "color: #9ca3af; font-weight: bold;",
        tier: n === 1 ? "Single Card" : "No Combination",
        type: 0, count: n, isCombo: false, color: colorName
    };
}

// --- Main Game Class ---
class FrontierGame {
    constructor() {
        this.deck = [];
        this.discardPile = [];
        this.pot = 0;
        this.players = [];
        this.allGlobalPlayers = [];

        this.currentRoundNum = 1;
        this.roundActivePlayers = []; // players still in this round (not folded)
        this.roundBet = 0;            // highest total bet this round
        this.bets = {};               // playerId -> total put in this round
        this.needsToAct = new Set();  // players who must still act before betting closes
        this.betLimit = 0;            // poorest player's cash when the round began
        this.raiseCount = 0;
        this.wager = 0;               // amount on the human bet stepper
        this.activePlayerId = 0;      // index in this.players
        this.dealerId = 0;
        this.gameHistory = [];

        this.tableCards = [];
        this.selections = {};         // playerId -> { own: [hand indices], table: [table indices] }
        this.selectedCardIndices = [];
        this.selectedTableIndices = [];
        this.refillQueue = [];
        this.refillLog = [];          // public: who discarded what this refill
        this.turnKind = 'BET';        // 'BET' or 'REFILL'
        this.phase = 'SETUP'; // SETUP, TRANSITION, PLAYING, REFILL, ROUND_OVER, GAME_OVER
        this.currentGame = 'FRONTIER';

        // DOM Elements
        this.els = {
            cardsContainer: document.getElementById('cards-container'),
            controlsArea: document.getElementById('controls-area'),
            mainHud: document.getElementById('main-hud'),
            playerStatusGrid: document.getElementById('player-status-grid'),
            overlay: document.getElementById('overlay'),
            overlayTitle: document.getElementById('overlay-title'),
            overlayDesc: document.getElementById('overlay-desc'),
            rulesModal: document.getElementById('rules-modal'),
            msgArea: document.getElementById('message-area'),
            historyPanel: document.getElementById('history-panel'),
            historyContent: document.getElementById('history-content'),
            menuDropdown: document.getElementById('frontier-menu-dropdown'),
            allCardsModal: document.getElementById('all-cards-modal'),
            allCardsGrid: document.getElementById('all-cards-grid'),
            rulesInnerWrapper: document.getElementById('rules-inner-content-wrapper')
        };

        this.edition = 'STANDARD'; // 'STANDARD' or 'PRESIDENT'
        this.currentGame = 'FRONTIER'; // 'FRONTIER', 'STATE_QUIZ', 'PRESIDENT_QUIZ'

        // this.loadGlobalPlayers(); // Removed as we now use showSetup()

        // window.addEventListener('keydown', (e) => { ... }) // Removed to consolidate in app.js


        window.addEventListener('click', (e) => {
            // Close modals if backdrop (the .modal shell) is clicked
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }

            // Close menu dropdown if clicking outside
            if (this.els.menuDropdown.classList.contains('active')) {
                const isMenuBtn = document.getElementById('frontier-menu-btn').contains(e.target);
                const isInsideMenu = this.els.menuDropdown.contains(e.target);
                if (!isMenuBtn && !isInsideMenu) {
                    this.els.menuDropdown.classList.remove('active');
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                if (this.phase === 'TRANSITION') {
                    const overlayBtn = document.getElementById('overlay-main-btn');
                    if (overlayBtn && overlayBtn.style.display !== 'none') {
                        e.preventDefault();
                        this.startTurn();
                    }
                } else if (this.phase === 'PLAYING' && (this.edition === 'PRESIDENT' || this.edition === 'STATE')) {
                    e.preventDefault();
                    this.toggleProfilePanel();
                }
            }
        });
    }

    closeAllModals() {
        this.els.rulesModal.classList.remove('visible');
        this.els.allCardsModal.classList.remove('visible');
        this.els.menuDropdown.classList.remove('active');
    }

    /* loadGlobalPlayers & saveGlobalPlayers removed (absorbed into initGame) */

    toggleRules() {
        this.updateRulesContent();
        this.els.rulesModal.classList.toggle('visible');
        this.els.menuDropdown.classList.remove('active');
    }

    updateRulesContent() {
        if (!this.els.rulesInnerWrapper) return;
        
        if (this.currentGame === 'PRESIDENT_QUIZ') {
            this.els.rulesInnerWrapper.innerHTML = `
                <button class="modal-close" onclick="frontierGame.toggleRules()">&times;</button>
                <h2 style="font-size: 2rem; color: var(--gold); margin-bottom: 20px;">President Quiz Rulebook</h2>
                <div id="rules-inner-content" style="text-align: left; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #ccc;">
                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">1. Objective</h3>
                    <p>Identify the years during which each President served in office.</p>
                    
                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">2. The Deck (50 Cards)</h3>
                    <p>The game uses the <strong>President Edition</strong> of American Playing Cards, featuring the Presidents of the United States.</p>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">3. Round Structure</h3>
                    <p>The game lasts <strong>5 Rounds</strong>. Each round follows this sequence:</p>
                    <ol>
                        <li><strong>Ante:</strong> Every player contributes $2 to the Pot at the start of the round.</li>
                        <li><strong>Reveal:</strong> A President card is revealed to all players.</li>
                        <li><strong>Guessing:</strong> Players use the keypad to log their guess (a specific year).</li>
                        <li><strong>Confidentiality:</strong> To ensure fair play, your guess is hidden after entry.</li>
                    </ol>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">4. Scoring & Victory</h3>
                    <p>After all players have guessed, the President's tenure is revealed.</p>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Correct Year:</strong> Any year that falls within the President's actual tenure is considered a direct hit!</li>
                        <li><strong>Distance:</strong> If no one guesses a year within the tenure, the player(s) closest to the tenure (either before start or after end) win.</li>
                    </ul>
                    <p>The player(s) with the <strong>best guess</strong> win the entire Pot. If multiple players are equally close or correct, the Pot is split.</p>
                    <p>The ultimate winner is the player with the <strong>most wins</strong> after 5 rounds.</p>
                    
                    <p style="text-align: center; margin-top: 3rem; font-size: 0.7rem; opacity: 0.5; letter-spacing: 2px;">DESIGN: SIMON ALLMER</p>
                </div>
            `;
        } else if (this.currentGame === 'STATE_QUIZ') {
            this.els.rulesInnerWrapper.innerHTML = `
                <button class="modal-close" onclick="frontierGame.toggleRules()">&times;</button>
                <h2 style="font-size: 2rem; color: var(--gold); margin-bottom: 20px;">The State Quiz Rulebook</h2>
                <div id="rules-inner-content" style="text-align: left; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #ccc;">
                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">1. Objective</h3>
                    <p>Test your knowledge of the Union by identifying the location of each state on the US map.</p>
                    
                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">2. The Deck (50 Cards)</h3>
                    <p>The game uses the <strong>State Edition</strong> of American Playing Cards, featuring all 50 states of the Union.</p>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">3. Round Structure</h3>
                    <p>The game lasts <strong>5 Rounds</strong>. Each round follows this sequence:</p>
                    <ol>
                        <li><strong>Ante:</strong> Every player contributes $2 to the Pot at the start of the round.</li>
                        <li><strong>Reveal:</strong> A target state is revealed to all players.</li>
                        <li><strong>Guessing:</strong> Players take turns clicking on the map to place their pin.</li>
                        <li><strong>Blind Mechanic:</strong> To ensure fair play in local multiplayer, each player's pin is visible for only <strong>2 seconds</strong> before disappearing.</li>
                    </ol>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">4. Scoring & Victory</h3>
                    <p>After all players have guessed, the true location is revealed.</p>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Distance 0:</strong> Perfect guess! You are on the target state.</li>
                        <li><strong>Distance 1:</strong> You clicked a state that borders the target.</li>
                        <li><strong>Distance 2+:</strong> You are multiple borders away from the target.</li>
                    </ul>
                    <p>The player(s) with the <strong>closest guess</strong> (minimum distance) win the entire Pot. If multiple players are equally close, the Pot is split.</p>
                    <p>The ultimate winner is the player with the <strong>most wins</strong> after 5 rounds.</p>
                    
                    <p style="text-align: center; margin-top: 3rem; font-size: 0.7rem; opacity: 0.5; letter-spacing: 2px;">DESIGN: SIMON ALLMER</p>
                </div>
            `;
        } else {
            this.els.rulesInnerWrapper.innerHTML = `
                <button class="modal-close" onclick="frontierGame.toggleRules()">&times;</button>
                <h2 style="font-size: 2rem; color: var(--gold); margin-bottom: 20px;">The Frontier Rulebook</h2>
                <div id="rules-inner-content" style="text-align: left; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #ccc;">
                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">1. Objective</h3>
                    <p>Five rounds. Each round, build the strongest hand from your own cards and the shared <strong>Table Cards</strong>, and bet on it. Leave the table with more money than you brought.</p>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">2. The Cards</h3>
                    <p>50 cards in five <strong>Symbols</strong> of ten: 1–9 and the <strong>Cypher (Ø)</strong>, worth 10. The Symbols belong to three <strong>Colors</strong>: Red (Hearts, Diamonds), Blue (Spades, Clubs) and Black (Stars).</p>
                    <p><strong>The Circle.</strong> In a Run, Ø links 9 and 1: 8–9–Ø–I is a Run. Ø still counts 10, and I counts 1.</p>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">3. A Round</h3>
                    <p>Six cards are always in reach: in round 1 you hold 1 card and 5 Table Cards lie open, in round 2 you hold 2 and 4 lie open, and so on.</p>
                    <ul style="padding-left: 20px;">
                        <li><strong>Betting.</strong> The player left of the dealer <strong>opens</strong> (at least $1), then play goes clockwise: <strong>call</strong> the highest bet, <strong>raise</strong> it, or <strong>fold</strong> — folding before you've bet costs $1. Betting continues until everyone still in has put in the same amount.</li>
                        <li><strong>Limit.</strong> No bet may exceed what the poorest player at the table held when the round began.</li>
                        <li><strong>Showdown.</strong> Reveal the cards you play and the Table Cards you add. The strongest hand takes the pot; ties split it.</li>
                        <li><strong>Refill.</strong> Played cards and Table Cards are discarded; unplayed cards stay in your hand. Clockwise, each player may then discard any number of cards face up. Anyone left with nothing is out. The deal passes one seat clockwise.</li>
                    </ul>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">4. Hand Strength</h3>
                    <p>Your <strong>hand</strong> is the cards you play: any of your own plus any Table Cards — Table Cards alone are allowed. A Table Card serves every player at once.</p>
                    <p>A <strong>Combination</strong> is two or more cards that share a trait. A hand holds one combination or none — a card that doesn't fit breaks it, so play only what fits and keep the rest.</p>
                    <ul style="background: rgba(255,255,255,0.03); padding: 16px 16px 16px 34px; border: 1px solid #333; font-size: 0.9rem;">
                        <li><strong style="color: #f472b6;">Symbol Run</strong> — consecutive values in one Symbol</li>
                        <li><strong style="color: #c084fc;">Same Value</strong> — equal value</li>
                        <li><strong style="color: #60a5fa;">Same Symbol</strong> — one Symbol</li>
                        <li><strong style="color: #fbbf24;">Run</strong> — consecutive values</li>
                    </ul>
                    <p><strong>Which hand wins?</strong> Compare top-down; the first difference decides:</p>
                    <ol style="background: rgba(255,255,255,0.03); padding: 16px 16px 16px 34px; border: 1px solid #333; font-size: 0.9rem;">
                        <li><strong>Size</strong> — Combination with more cards › with fewer cards › No Combination.</li>
                        <li><strong>Type</strong> — Symbol Run › Same Value › Same Symbol › Run.</li>
                        <li><strong>Color</strong> — One Color › One Color + Black › Red + Blue.</li>
                        <li><strong>Total</strong> — higher sum of values (Ø = 10). Still equal: split the pot.</li>
                    </ol>
                    <p><strong>One Color</strong> = all Red, all Blue, or all Black. Without a combination, size and type don't count: go straight to Color. A single card counts only its value.</p>

                    <h3 style="color: var(--gold-bright); margin-top: 2rem;">5. End of the Game</h3>
                    <p>After round 5, everyone holding more than their stake has won the difference. The biggest gain takes the table.</p>
                    <p style="text-align: center; margin-top: 3rem; font-size: 0.7rem; opacity: 0.5; letter-spacing: 2px;">DESIGN: SIMON ALLMER</p>
                </div>
            `;
        }
    }

    getOrdinalSuffix(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    }

    toggleMenu() {
        this.els.menuDropdown.classList.toggle('active');
    }

    showRules() {
        this.toggleRules();
    }

    showAllCards() {
        this.els.menuDropdown.classList.remove('active');
        this.els.allCardsGrid.innerHTML = '';
        
        // Generate all 50 cards
        Object.keys(SUITS).forEach(suitKey => {
            const suit = SUITS[suitKey];
            for (let val = 1; val <= 10; val++) {
                let presidentId = null;
                let stateName = null;
                if (this.edition === 'PRESIDENT') {
                    if (suitKey === 'BORDER') {
                        presidentId = PRESIDENTS.BLACK[val - 1] || null;
                    } else if (suitKey === 'WEST_FRONTIER') { // Spades
                        presidentId = PRESIDENTS.BLUE[val - 1] || null;
                    } else if (suitKey === 'INDUST_EAST') { // Clubs
                        presidentId = PRESIDENTS.BLUE[10 + val - 1] || null;
                    } else if (suitKey === 'DEEP_SOUTH') { // Hearts
                        presidentId = PRESIDENTS.RED[val - 1] || null;
                    } else if (suitKey === 'UPPER_SOUTH') { // Diamonds
                        presidentId = PRESIDENTS.RED[10 + val - 1] || null;
                    }
                } else if (this.edition === 'STATE') {
                    if (suitKey === 'INDUST_EAST') {
                        stateName = STATES.ATLANTIC_CORRIDOR[val - 1] || null;
                    } else if (suitKey === 'WEST_FRONTIER') {
                        stateName = STATES.PACIFIC_SUN[val - 1] || null;
                    } else if (suitKey === 'DEEP_SOUTH') {
                        stateName = STATES.SOUTHERN_HEART[val - 1] || null;
                    } else if (suitKey === 'UPPER_SOUTH') {
                        stateName = STATES.GREAT_FRONTIER[val - 1] || null;
                    } else if (suitKey === 'BORDER') {
                        stateName = STATES.WILD_SWINGS[val - 1] || null;
                    }
                }

                const president = presidentId ? presidentsData.find(p => p.id === presidentId) : null;
                const state = stateName ? getStateByName(stateName) : null;
                const card = { suit, val, president: president ? president.name : "?", state: stateName, portraitUrl: president ? president.portraitUrl : null, flagUrl: state ? state.flagUrl : null };
                const div = document.createElement('div');
                div.className = `card suit-${card.suit.id}`;
if (this.edition === 'PRESIDENT' || this.edition === 'STATE') div.classList.add('is-president-edition');
            if (this.edition === 'STATE') div.classList.add('is-state-edition');
            div.style.width = "90px";
            div.style.height = "135px";
            div.style.fontSize = "0.7rem";
            div.style.cursor = "default";
            
            if (this.edition === 'PRESIDENT' || this.edition === 'STATE') {
                    const dispText = this.edition === 'PRESIDENT' ? (card.president || "") : (card.state || "");
                    const imageUrl = this.edition === 'PRESIDENT' ? card.portraitUrl : card.flagUrl;
                    div.innerHTML = `
                        <div class="card-corner ${card.val === 10 ? 'is-cypher' : card.val === 1 ? 'is-one' : ''}">
                            <div class="corner-val">${cardDisplayVal(card.val)}</div>
                            <div class="corner-suit">${card.suit.symbol}</div>
                        </div>
                        <div class="card-center">
                            <div class="card-portrait-container">
                                ${imageUrl ? `<img src="${imageUrl}" class="card-portrait" alt="${dispText}">` : ''}
                            </div>
                            <div class="card-president-name">${dispText}</div>
                        </div>
                        <div class="card-corner bottom ${card.val === 10 ? 'is-cypher' : card.val === 1 ? 'is-one' : ''}">
                            <div class="corner-val">${cardDisplayVal(card.val)}</div>
                            <div class="corner-suit">${card.suit.symbol}</div>
                        </div>
                    `;
                } else {
                    div.style.width = "90px";
                    div.style.height = "124px";
                    div.classList.add('has-design');
                    div.innerHTML = `<img src="${getCardImageUrl(card.suit.id, card.val)}" alt="${card.suit.id} ${card.val}" style="width:100%;height:100%;display:block;object-fit:fill;">`;
                }
                this.els.allCardsGrid.appendChild(div);
            }
        });
        
        this.els.allCardsModal.classList.add('visible');
    }

    hideAllCards() {
        this.els.allCardsModal.classList.remove('visible');
    }

    setMessage(msg) {
        this.els.msgArea.innerHTML = msg;
    }

    showSetup() {
        const gameMenuBtn = document.getElementById('frontier-game-menu-btn');
        if (gameMenuBtn) gameMenuBtn.style.display = 'none';
        this.els.mainHud.style.display = 'none';
        this.els.playerStatusGrid.innerHTML = '';
        this.els.cardsContainer.innerHTML = '';
        this.els.controlsArea.innerHTML = '';

        // Close and clear profile panel if open
        const panel = document.getElementById('president-profile-panel');
        if (panel) {
            panel.classList.remove('visible');
            const panelContent = document.getElementById('profile-content');
            if (panelContent) panelContent.innerHTML = '<div class="profile-placeholder">Select a Card to view Profile</div>';
            
            const svgs = panel.querySelectorAll('.panel-close svg');
            svgs.forEach(svg => svg.style.stroke = 'var(--gold-dim)');
            
            const fab = document.querySelector('.panel-toggle-fab');
            if (fab) fab.style.display = 'none'; // Only show fab when game starts
        }

        this.els.overlayTitle.innerText = "AMERICAN PLAYING CARDS";
        this.els.overlayTitle.style.color = "var(--gold-bright)";
        this.els.overlayDesc.innerHTML = "A New System for the Frontier.";

        const actions = document.getElementById('overlay-actions');
        actions.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.id = "setup-wrapper";
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '20px';
        
        const gameRow = document.createElement('div');
        gameRow.style.display = 'flex';
        gameRow.style.flexDirection = 'column';
        gameRow.style.alignItems = 'center';
        gameRow.style.gap = '10px';
        gameRow.style.marginBottom = '20px';

        const gameLabel = document.createElement('div');
        gameLabel.innerText = "GAME";
        gameLabel.style.fontSize = "0.7rem";
        gameLabel.style.color = "var(--gold-dim)";
        gameLabel.style.letterSpacing = "2px";
        gameRow.appendChild(gameLabel);

        const gameToggle = document.createElement('div');
        gameToggle.className = 'toggle-container';
        gameToggle.style.width = '100%';
        gameToggle.style.maxWidth = '600px';

        const frontierBtn = document.createElement('button');
        frontierBtn.className = `toggle-btn ${this.currentGame === 'FRONTIER' ? 'active' : ''}`;
        frontierBtn.innerText = 'Frontier';

        const quizBtn = document.createElement('button');
        quizBtn.className = `toggle-btn ${this.currentGame === 'STATE_QUIZ' ? 'active' : ''}`;
        quizBtn.innerText = 'State Quiz';

        const presQuizBtn = document.createElement('button');
        presQuizBtn.className = `toggle-btn ${this.currentGame === 'PRESIDENT_QUIZ' ? 'active' : ''}`;
        presQuizBtn.innerText = 'President Quiz';

        frontierBtn.onclick = () => {
            this.currentGame = 'FRONTIER';
            frontierBtn.classList.add('active');
            quizBtn.classList.remove('active');
            presQuizBtn.classList.remove('active');
            editionRow.style.display = 'flex';
            stdBtn.disabled = false;
            presBtn.disabled = false;
            stateBtn.disabled = false;
            stdBtn.style.opacity = '1';
            presBtn.style.opacity = '1';
            stateBtn.style.opacity = '1';
        };

        quizBtn.onclick = () => {
            this.currentGame = 'STATE_QUIZ';
            quizBtn.classList.add('active');
            frontierBtn.classList.remove('active');
            presQuizBtn.classList.remove('active');
            editionRow.style.display = 'flex';
            stateBtn.disabled = false;
            stateBtn.style.opacity = '1';
            this.edition = 'STATE';
            stateBtn.click();
            stdBtn.disabled = true;
            presBtn.disabled = true;
            stdBtn.style.opacity = '0.5';
            presBtn.style.opacity = '0.5';
        };

        presQuizBtn.onclick = () => {
            this.currentGame = 'PRESIDENT_QUIZ';
            presQuizBtn.classList.add('active');
            frontierBtn.classList.remove('active');
            quizBtn.classList.remove('active');
            editionRow.style.display = 'flex';
            presBtn.disabled = false;
            presBtn.style.opacity = '1';
            this.edition = 'PRESIDENT';
            presBtn.click();
            stdBtn.disabled = true;
            stateBtn.disabled = true;
            stdBtn.style.opacity = '0.5';
            stateBtn.style.opacity = '0.5';
        };

        gameToggle.appendChild(frontierBtn);
        gameToggle.appendChild(presQuizBtn);
        gameToggle.appendChild(quizBtn);
        gameRow.appendChild(gameToggle);

        const editionRow = document.createElement('div');
        editionRow.style.display = 'flex';
        editionRow.style.flexDirection = 'column';
        editionRow.style.alignItems = 'center';
        editionRow.style.gap = '10px';
        editionRow.style.marginBottom = '20px';

        const editionLabel = document.createElement('div');
        editionLabel.innerText = "EDITION";
        editionLabel.style.fontSize = "0.7rem";
        editionLabel.style.color = "var(--gold-dim)";
        editionLabel.style.letterSpacing = "2px";
        editionRow.appendChild(editionLabel);

        const editionToggle = document.createElement('div');
        editionToggle.className = 'toggle-container';
        editionToggle.style.width = '100%';
        editionToggle.style.maxWidth = '450px';

        const stdBtn = document.createElement('button');
        stdBtn.className = `toggle-btn ${this.edition === 'STANDARD' ? 'active' : ''}`;
        stdBtn.innerText = 'Standard';
        
        const presBtn = document.createElement('button');
        presBtn.className = `toggle-btn ${this.edition === 'PRESIDENT' ? 'active' : ''}`;
        presBtn.innerText = 'President';
        
        const stateBtn = document.createElement('button');
        stateBtn.className = `toggle-btn ${this.edition === 'STATE' ? 'active' : ''}`;
        stateBtn.innerText = 'State';

        stdBtn.onclick = () => {
            this.edition = 'STANDARD';
            stdBtn.classList.add('active');
            presBtn.classList.remove('active');
            stateBtn.classList.remove('active');
        };

        presBtn.onclick = () => {
            this.edition = 'PRESIDENT';
            presBtn.classList.add('active');
            stdBtn.classList.remove('active');
            stateBtn.classList.remove('active');
        };

        stateBtn.onclick = () => {
            this.edition = 'STATE';
            stateBtn.classList.add('active');
            stdBtn.classList.remove('active');
            presBtn.classList.remove('active');
        };

        editionToggle.appendChild(stdBtn);
        editionToggle.appendChild(presBtn);
        editionToggle.appendChild(stateBtn);
        editionRow.appendChild(editionToggle);

        const countLabel = document.createElement('div');
        countLabel.innerText = "PLAYER COUNT";
        countLabel.style.fontSize = "0.7rem";
        countLabel.style.color = "var(--gold-dim)";
        countLabel.style.letterSpacing = "2px";
        countLabel.style.marginTop = "10px";

        const countRow = document.createElement('div');
        countRow.id = 'count-row';
        countRow.style.display = 'flex';
        countRow.style.gap = '10px';
        countRow.style.flexWrap = 'wrap';
        countRow.style.justifyContent = 'center';
        
        [2, 3, 4, 5, 6].forEach(count => {
            const btn = document.createElement('button');
            btn.className = "primary-btn count-btn";
            btn.style.padding = "10px 20px";
            btn.style.minWidth = "60px";
            btn.innerText = count;
            btn.onclick = () => {
                document.querySelectorAll('.count-btn').forEach(b => b.style.background = 'transparent');
                btn.style.background = 'rgba(255,255,255,0.2)';
                this.preparePlayerNames(count);
            };
            countRow.appendChild(btn);
        });
        
        const namesWrapper = document.createElement('div');
        namesWrapper.id = "names-wrapper";
        namesWrapper.style.width = '100%';
        namesWrapper.style.display = 'flex';
        namesWrapper.style.flexDirection = 'column';
        namesWrapper.style.alignItems = 'center';
        namesWrapper.style.marginTop = '10px';

        const beginBtnWrapper = document.createElement('div');
        beginBtnWrapper.id = "begin-btn-wrapper";
        beginBtnWrapper.style.width = '100%';
        beginBtnWrapper.style.display = 'flex';
        beginBtnWrapper.style.justifyContent = 'center';
        
        const rulesBtn = document.createElement('div');
        rulesBtn.innerText = "RULES";
        rulesBtn.style.color = "var(--gold)";
        rulesBtn.style.letterSpacing = "4px";
        rulesBtn.style.fontSize = "0.9rem";
        rulesBtn.style.cursor = "pointer";
        rulesBtn.style.marginTop = "20px";
        rulesBtn.style.borderBottom = "1px solid rgba(212, 175, 55, 0.3)";
        rulesBtn.style.paddingBottom = "5px";
        rulesBtn.style.transition = "color 0.3s";
        rulesBtn.onmouseover = () => rulesBtn.style.color = "var(--gold-bright)";
        rulesBtn.onmouseout = () => rulesBtn.style.color = "var(--gold)";
        rulesBtn.onclick = () => this.showRules();

        const credit = document.createElement('div');
        credit.innerText = "GAME DESIGN: SIMON ALLMER";
        credit.style.color = "var(--text-color)";
        credit.style.fontSize = "0.6rem";
        credit.style.opacity = "0.4";
        credit.style.letterSpacing = "2px";
        credit.style.marginTop = "30px";
        
        wrapper.appendChild(gameRow);
        wrapper.appendChild(editionRow);
        wrapper.appendChild(countLabel);
        wrapper.appendChild(countRow);
        wrapper.appendChild(namesWrapper);
        wrapper.appendChild(beginBtnWrapper);
        wrapper.appendChild(rulesBtn);
        wrapper.appendChild(credit);
        actions.appendChild(wrapper);

        this.els.overlay.classList.add('visible');
        document.getElementById('overlay-main-btn').style.display = 'none';
        
        // Default to 2 players
        setTimeout(() => {
            if (countRow.children[0]) countRow.children[0].click();
        }, 10);
    }

    preparePlayerNames(count) {
        // No longer change the overlayDesc because the title is static above
        const namesWrapper = document.getElementById('names-wrapper');
        if (!namesWrapper) return;
        namesWrapper.innerHTML = '';
        
        const namesContainer = document.createElement('div');
        namesContainer.style.display = 'flex';
        namesContainer.style.flexDirection = 'column';
        namesContainer.style.gap = '20px';
        namesContainer.style.width = '90%';
        namesContainer.style.maxWidth = '300px';

        const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
        const playerConfigs = [];

        for (let i = 0; i < count; i++) {
            const playerGroup = document.createElement('div');
            playerGroup.style.display = 'flex';
            playerGroup.style.flexDirection = 'column';
            playerGroup.style.gap = '6px';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'frontier-input is-default';
            const defaultName = `Player ${i + 1}`;
            input.value = defaultName;
            input.dataset.isDefault = 'true';
            input.style.borderLeft = `4px solid ${colors[i]}`;
            
            const config = { isAI: false, input: input };
            playerConfigs.push(config);

            input.onfocus = () => {
                if (input.dataset.isDefault === 'true') {
                    setTimeout(() => input.setSelectionRange(0, 0), 0);
                }
            };

            input.onkeydown = (e) => {
                if (input.dataset.isDefault === 'true' && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    input.value = '';
                    input.dataset.isDefault = 'false';
                    input.classList.remove('is-default');
                }
            };

            input.onblur = () => {
                if (input.value.trim() === '') {
                    this.updateAIPresence(playerConfigs);
                }
            };

            playerGroup.appendChild(input);

            // AI Toggle for players 2+
            if (i > 0) {
                const toggle = document.createElement('div');
                toggle.className = 'toggle-container';
                
                const humanBtn = document.createElement('button');
                humanBtn.className = 'toggle-btn active';
                humanBtn.innerText = 'Human';
                
                const aiBtn = document.createElement('button');
                aiBtn.className = 'toggle-btn';
                aiBtn.innerText = 'Computer';
                
                humanBtn.onclick = () => {
                    config.isAI = false;
                    humanBtn.classList.add('active');
                    aiBtn.classList.remove('active');
                    this.updateAIPresence(playerConfigs);
                };
                
                aiBtn.onclick = () => {
                    config.isAI = true;
                    aiBtn.classList.add('active');
                    humanBtn.classList.remove('active');
                    this.updateAIPresence(playerConfigs);
                };
                
                toggle.appendChild(humanBtn);
                toggle.appendChild(aiBtn);
                playerGroup.appendChild(toggle);
            }

            namesContainer.appendChild(playerGroup);
        }

        namesWrapper.appendChild(namesContainer);

        const beginBtnWrapper = document.getElementById('begin-btn-wrapper');
        if (!beginBtnWrapper) return;
        beginBtnWrapper.innerHTML = '';

        const beginBtn = document.createElement('button');
        beginBtn.className = "primary-btn";
        beginBtn.style.marginTop = "20px";
        beginBtn.style.padding = "15px 40px";
        beginBtn.innerText = "BEGIN GAME";
            beginBtn.onclick = () => {
                const finalPlayers = playerConfigs.map(c => ({
                    name: c.input.value.trim(),
                    isAI: c.isAI
                }));
                if (this.currentGame === 'STATE_QUIZ') {
                    this.els.overlay.classList.remove('visible');
                    location.hash = '#state-quiz';
                    stateQuiz.initGame(finalPlayers);
                } else if (this.currentGame === 'PRESIDENT_QUIZ') {
                    this.els.overlay.classList.remove('visible');
                    location.hash = '#president-quiz';
                    presidentQuiz.initGame(finalPlayers);
                } else {
                    this.initGame(count, finalPlayers);
                }
            };
        beginBtnWrapper.appendChild(beginBtn);
    }

    updateAIPresence(configs) {
        let aiCount = 0;
        configs.forEach((c, idx) => {
            const currentVal = c.input.value.trim();
            // A name is "default" if it's empty, "Player X", or "Computer X"
            const isDefault = currentVal === '' || currentVal === `Player ${idx + 1}` || /^Computer \d+$/.test(currentVal);
            
            if (c.isAI) {
                aiCount++;
                if (isDefault) {
                    c.input.value = `Computer ${aiCount}`;
                    c.input.dataset.isDefault = 'false';
                    c.input.classList.remove('is-default');
                }
            } else {
                // If it was an auto-generated Computer name, revert to Player default
                if (/^Computer \d+$/.test(currentVal) || currentVal === '') {
                    c.input.value = `Player ${idx + 1}`;
                    c.input.dataset.isDefault = 'true';
                    c.input.classList.add('is-default');
                }
            }
        });
    }

    initGame(playerCount, customPlayerConfigs) {
        if (playerCount === undefined) {
            playerCount = this.lastPlayerCount || 2;
            customPlayerConfigs = customPlayerConfigs || this.lastPlayerConfigs;
        }
        this.lastPlayerCount = playerCount;
        this.lastPlayerConfigs = customPlayerConfigs;

        const mainBtn = document.getElementById('overlay-main-btn');
        if (mainBtn) mainBtn.style.display = 'block';

        const actions = document.getElementById('overlay-actions');
        if (actions) actions.innerHTML = '';

        this.els.overlay.classList.remove('visible');

        const gameMenuBtn = document.getElementById('frontier-game-menu-btn');
        if (gameMenuBtn) gameMenuBtn.style.display = 'block';

        const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
        const STAKE = 10; // Standard stake: 10 units each

        this.players = [];
        for (let i = 0; i < playerCount; i++) {
            const config = (customPlayerConfigs && customPlayerConfigs[i]) ? customPlayerConfigs[i] : { name: `Player ${i+1}`, isAI: false };
            this.players.push({
                globalId: i + 1,
                name: config.name,
                isAI: config.isAI,
                cash: STAKE,
                stake: STAKE,
                color: { hex: colors[i] },
                hand: [],
                status: 'ACTIVE'
            });
        }

        if (this.players.length < 2) {
            alert("Need at least 2 players to play Frontier!");
            return;
        }

        this.deck = createDeck(this.edition);
        this.discardPile = [];
        this.tableCards = [];
        this.gameHistory = [];
        this.els.mainHud.style.display = 'flex';

        // The first dealer is chosen at random; the deal then passes clockwise.
        this.dealerId = Math.floor(Math.random() * this.players.length);
        this.startRound(1);
    }

    // ── Round flow ────────────────────────────────────────────────────────────

    activeIds() {
        return this.players.map((p, i) => (p.status === 'ACTIVE' ? i : -1)).filter(i => i !== -1);
    }

    // Next ACTIVE seat clockwise from `fromId` (exclusive), optionally restricted to `pool`.
    nextSeat(fromId, pool = null) {
        for (let k = 1; k <= this.players.length; k++) {
            const id = (fromId + k) % this.players.length;
            if (this.players[id].status !== 'ACTIVE') continue;
            if (pool && !pool.includes(id)) continue;
            return id;
        }
        return -1;
    }

    shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    startRound(roundNum) {
        this.currentRoundNum = roundNum;

        // Deal: the dealer lays out the Table Cards first, then tops every hand up to the round's size.
        const handSize = roundNum;
        this.tableCards = this.deck.splice(0, 6 - handSize);
        this.activeIds().forEach(id => {
            const p = this.players[id];
            const need = handSize - p.hand.length;
            if (need > 0) p.hand.push(...this.deck.splice(0, need));
        });

        this.roundActivePlayers = this.activeIds();
        this.pot = 0;
        this.bets = {};
        this.roundBet = 0;
        this.raiseCount = 0;
        this.selections = {};
        this.roundActivePlayers.forEach(id => {
            this.bets[id] = 0;
            this.selections[id] = { own: [], table: [] };
        });
        this.needsToAct = new Set(this.roundActivePlayers);
        // Limit: no bet may exceed what the poorest player at the table held when the round began.
        this.betLimit = Math.min(...this.roundActivePlayers.map(id => this.players[id].cash));

        this.turnKind = 'BET';
        this.activePlayerId = this.nextSeat(this.dealerId); // left of the dealer opens
        this.phase = 'TRANSITION';
        this.renderTransition();
    }

    renderTransition() {
        const player = this.players[this.activePlayerId];
        this.updateHUD();
        this.updatePlayerPods();

        this.els.cardsContainer.innerHTML = '';
        this.els.controlsArea.innerHTML = '';
        this.els.controlsArea.style.display = 'none';
        this.els.historyPanel.style.display = 'none';

        if (player.isAI) {
            if (this.turnKind === 'REFILL') this.executeAIRefill();
            else this.executeAITurn();
            return;
        }

        const toCall = this.roundBet - this.bets[this.activePlayerId];
        this.els.overlayTitle.innerText = `PASS TO ${player.name.toUpperCase()}`;
        this.els.overlayTitle.style.color = player.color.hex || 'var(--gold)';
        if (this.turnKind === 'REFILL') {
            this.els.overlayDesc.innerText = `Refill: discard any of your cards face up before Round ${this.currentRoundNum + 1}.`;
        } else if (this.roundBet === 0) {
            this.els.overlayDesc.innerText = `Round ${this.currentRoundNum}. You open the betting.`;
        } else {
            this.els.overlayDesc.innerText = `Round ${this.currentRoundNum}. Pot $${this.pot} · $${toCall} to call.`;
        }

        const btn = document.getElementById('overlay-main-btn');
        btn.style.display = 'block';
        btn.innerText = "REVEAL CARDS";
        btn.onclick = () => this.startTurn();

        this.els.overlay.classList.add('visible');
        this.setMessage("");
    }

    startTurn() {
        this.els.overlay.classList.remove('visible');
        const sel = this.selections[this.activePlayerId] || { own: [], table: [] };
        this.selectedCardIndices = sel.own;
        this.selectedTableIndices = sel.table;
        if (this.turnKind === 'REFILL') {
            this.phase = 'REFILL';
            this.selectedCardIndices = [];
            this.renderRefill();
            return;
        }
        this.phase = 'PLAYING';
        const toCall = this.roundBet - this.bets[this.activePlayerId];
        this.wager = Math.min(this.betLimit, this.roundBet === 0 ? 1 : this.roundBet + 1);
        if (toCall < 0) this.wager = this.roundBet;
        this.renderPlaying();
    }

    selectedHand(playerId) {
        const sel = this.selections[playerId] || { own: [], table: [] };
        const p = this.players[playerId];
        return [...sel.own.map(i => p.hand[i]), ...sel.table.map(i => this.tableCards[i])];
    }

    // ── Rendering ─────────────────────────────────────────────────────────────

    cardElement(card) {
        const div = document.createElement('div');
        div.className = `card suit-${card.suit.id}`;
        if (this.edition === 'PRESIDENT' || this.edition === 'STATE') {
            div.classList.add('is-president-edition');
            if (this.edition === 'STATE') div.classList.add('is-state-edition');
            const dispText = this.edition === 'PRESIDENT' ? (card.president || "") : (card.state || "");
            const imageUrl = this.edition === 'PRESIDENT' ? (card.portraitUrl || (card.president ? (presidentsData.find(p => p.name === card.president)?.portraitUrl || null) : null)) : (card.flagUrl || null);
            div.innerHTML = `
                <div class="card-corner ${card.val === 10 ? 'is-cypher' : card.val === 1 ? 'is-one' : ''}">
                    <div class="corner-val">${cardDisplayVal(card.val)}</div>
                    <div class="corner-suit">${card.suit.symbol}</div>
                </div>
                <div class="card-center">
                    <div class="card-portrait-container">
                        ${imageUrl ? `<img src="${imageUrl}" class="card-portrait" alt="${dispText}">` : ''}
                    </div>
                    <div class="card-president-name">${dispText}</div>
                </div>
                <div class="card-corner bottom ${card.val === 10 ? 'is-cypher' : card.val === 1 ? 'is-one' : ''}">
                    <div class="corner-val">${cardDisplayVal(card.val)}</div>
                    <div class="corner-suit">${card.suit.symbol}</div>
                </div>
            `;
        } else {
            div.classList.add('has-design');
            div.innerHTML = `<img src="${getCardImageUrl(card.suit.id, card.val)}" alt="${card.suit.id} ${card.val}" style="width:100%;height:100%;display:block;object-fit:fill;">`;
        }
        return div;
    }

    cardRow(label, cards, selected, onToggle, extraClass = '') {
        const row = document.createElement('div');
        row.className = 'frontier-row';
        row.innerHTML = `<div class="frontier-row-label">${label}</div>`;
        const list = document.createElement('div');
        list.className = 'frontier-row-cards';
        if (cards.length === 0) list.innerHTML = '<div class="frontier-row-empty">—</div>';
        cards.forEach((card, idx) => {
            const div = this.cardElement(card);
            if (extraClass) div.classList.add(extraClass);
            if (selected.includes(idx)) div.classList.add('selected');
            if (onToggle) div.onclick = () => onToggle(idx);
            else div.style.cursor = 'default';
            list.appendChild(div);
        });
        row.appendChild(list);
        return row;
    }

    toggleIndex(arr, idx) {
        const at = arr.indexOf(idx);
        if (at === -1) arr.push(idx); else arr.splice(at, 1);
    }

    renderBoard({ handLabel, onToggleOwn, onToggleTable }) {
        const player = this.players[this.activePlayerId];
        this.els.cardsContainer.innerHTML = '';
        if (this.tableCards.length > 0) {
            this.els.cardsContainer.appendChild(
                this.cardRow('TABLE CARDS', this.tableCards, this.selectedTableIndices, onToggleTable, 'table-card'));
        }
        this.els.cardsContainer.appendChild(
            this.cardRow(handLabel, player.hand, this.selectedCardIndices, onToggleOwn));
    }

    renderPlaying() {
        const player = this.players[this.activePlayerId];
        const myBet = this.bets[this.activePlayerId];
        const toCall = this.roundBet - myBet;

        this.updateHUD();
        this.updatePlayerPods();
        this.renderBoard({
            handLabel: 'YOUR CARDS',
            onToggleOwn: (idx) => {
                this.toggleIndex(this.selectedCardIndices, idx);
                if (this.edition === 'PRESIDENT' || this.edition === 'STATE') this.updateProfilePanel();
                this.renderPlaying();
            },
            onToggleTable: (idx) => { this.toggleIndex(this.selectedTableIndices, idx); this.renderPlaying(); }
        });
        this.els.controlsArea.style.display = 'flex';

        const hand = this.selectedHand(this.activePlayerId);
        if (hand.length > 0) {
            const ev = evaluateHand(hand);
            this.setMessage(`<div style="font-size: 1.8rem; font-weight: bold; color: var(--gold-bright);">${ev.tier}</div><div style="font-size: 1rem; opacity: 0.8;">${ev.name}</div>`);
        } else {
            this.setMessage(`Select your hand: any of your cards plus any Table Cards. You can change it on every turn until the showdown.`);
        }

        let controlsHTML = '';
        const canRaise = this.roundBet < this.betLimit;
        if (this.roundBet === 0) {
            controlsHTML += this.wagerStepperHTML(1, this.betLimit);
            controlsHTML += `<button class="action-btn" onclick="frontierGame.betTo(frontierGame.wager)">OPEN $${this.wager}</button>`;
        } else {
            controlsHTML += `<button class="action-btn call-btn" onclick="frontierGame.betTo(${this.roundBet})">${toCall > 0 ? `CALL $${toCall}` : 'STAY'}</button>`;
            if (canRaise) {
                controlsHTML += this.wagerStepperHTML(this.roundBet + 1, this.betLimit);
                controlsHTML += `<button class="action-btn raise-btn" onclick="frontierGame.betTo(frontierGame.wager)">RAISE TO $${this.wager}</button>`;
            }
        }
        const foldFee = myBet === 0 ? 1 : 0;
        controlsHTML += `<button class="danger-btn" onclick="frontierGame.executeFold()">FOLD${foldFee ? ' ($1)' : ''}</button>`;

        if (this.edition === 'PRESIDENT' || this.edition === 'STATE') {
            const panel = document.getElementById('president-profile-panel');
            const isActive = panel && panel.classList.contains('visible');
            const activeStyle = isActive ? 'style="color: var(--gold-bright); border-color: var(--gold-bright); background: rgba(255, 215, 0, 0.1);"' : '';
            controlsHTML += `<button class="action-btn" ${activeStyle} onclick="frontierGame.toggleProfilePanel()">PROFILE</button>`;
        }

        this.els.controlsArea.innerHTML = controlsHTML;
    }

    wagerStepperHTML(min, max) {
        this.wager = Math.max(min, Math.min(max, this.wager));
        return `<div class="wager-stepper">
            <button class="action-btn" ${this.wager <= min ? 'disabled' : ''} onclick="frontierGame.adjustWager(-1, ${min}, ${max})">−</button>
            <span class="wager-value">$${this.wager}</span>
            <button class="action-btn" ${this.wager >= max ? 'disabled' : ''} onclick="frontierGame.adjustWager(1, ${min}, ${max})">+</button>
        </div>`;
    }

    adjustWager(delta, min, max) {
        this.wager = Math.max(min, Math.min(max, this.wager + delta));
        this.renderPlaying();
    }

    // ── Betting ───────────────────────────────────────────────────────────────

    // Bring this player's total bet for the round up to `target` (open, call or raise).
    betTo(target) {
        const id = this.activePlayerId;
        const player = this.players[id];
        target = Math.min(target, this.betLimit);
        const pay = Math.max(0, target - this.bets[id]);
        if (pay > player.cash) return;

        player.cash -= pay;
        this.pot += pay;
        this.bets[id] += pay;

        if (this.bets[id] > this.roundBet) {
            if (this.roundBet > 0) this.raiseCount++;
            this.roundBet = this.bets[id];
            // A new high bet: everyone else still in must answer it.
            this.needsToAct = new Set(this.roundActivePlayers.filter(pid => pid !== id));
        } else {
            this.needsToAct.delete(id);
        }
        this.advanceBetting();
    }

    executeFold() {
        const id = this.activePlayerId;
        // Folding before you've bet costs the minimum.
        if (this.bets[id] === 0) {
            const fee = Math.min(1, this.players[id].cash);
            this.players[id].cash -= fee;
            this.pot += fee;
        }
        this.roundActivePlayers = this.roundActivePlayers.filter(pid => pid !== id);
        this.needsToAct.delete(id);
        this.advanceBetting();
    }

    advanceBetting() {
        if (this.roundActivePlayers.length <= 1 || this.needsToAct.size === 0) {
            this.showdown();
            return;
        }
        this.activePlayerId = this.nextSeat(this.activePlayerId, [...this.needsToAct]);
        this.phase = 'TRANSITION';
        this.renderTransition();
    }

    // ── Showdown ──────────────────────────────────────────────────────────────

    showdown() {
        const inRound = this.roundActivePlayers;
        let winners;
        let plays = [];
        const isDefault = inRound.length <= 1;

        if (isDefault) {
            // Everyone else folded: the last player takes the pot without revealing anything.
            winners = inRound.length === 1 ? inRound : [];
        } else {
            plays = inRound.map(id => {
                const sel = this.selections[id];
                const p = this.players[id];
                return {
                    playerId: id,
                    ownCards: sel.own.map(i => p.hand[i]),
                    tableCards: sel.table.map(i => this.tableCards[i]),
                    cards: this.selectedHand(id),
                    amount: this.bets[id]
                };
            });
            plays.forEach(pl => pl.result = evaluateHand(pl.cards));
            const top = Math.max(...plays.map(pl => pl.result.score));
            // Odd units go to the tied player nearest the dealer's left.
            const seatFromDealer = id => (id - this.dealerId - 1 + this.players.length) % this.players.length;
            winners = plays.filter(pl => pl.result.score === top).map(pl => pl.playerId)
                .sort((a, b) => seatFromDealer(a) - seatFromDealer(b));
            plays.sort((a, b) => b.result.score - a.result.score);

            // Played own cards are discarded; unplayed cards stay in hand.
            plays.forEach(pl => {
                const p = this.players[pl.playerId];
                this.discardPile.push(...pl.ownCards);
                p.hand = p.hand.filter(c => !pl.ownCards.includes(c));
            });
        }

        const finalPot = this.pot;
        if (winners.length > 0) {
            const share = Math.floor(finalPot / winners.length);
            const remainder = finalPot % winners.length;
            winners.forEach((id, idx) => { this.players[id].cash += share + (idx < remainder ? 1 : 0); });
        }
        this.pot = 0;

        // Table Cards go to the discard pile.
        this.discardPile.push(...this.tableCards);
        this.tableCards = [];
        this.selections = {};

        // Anyone left with nothing is out for the rest of the game.
        this.players.forEach(p => {
            if (p.status === 'ACTIVE' && p.cash <= 0) {
                p.status = 'BANKRUPT';
                this.discardPile.push(...p.hand);
                p.hand = [];
            }
        });

        this.gameHistory.push({ roundNum: this.currentRoundNum, winnerIds: winners, isDefault, plays, potWon: finalPot });
        this.phase = 'ROUND_OVER';
        this.renderRoundOver();
    }

    renderRoundOver() {
        this.els.cardsContainer.innerHTML = '';
        this.els.controlsArea.innerHTML = '';
        this.updateHUD();
        this.updatePlayerPods();

        const roundResult = this.gameHistory[this.gameHistory.length - 1];
        const winnerNames = roundResult.winnerIds.map(id => this.players[id].name).join(' & ');
        const gameOver = this.currentRoundNum === 5 || this.activeIds().length <= 1;

        this.setMessage(`${winnerNames} win${roundResult.winnerIds.length === 1 ? 's' : ''} Round ${this.currentRoundNum}! (Pot: $${roundResult.potWon})`);

        const mini = (c, fromTable) => `<div class="card-mini suit-${c.suit.id}${fromTable ? ' from-table' : ''}" title="${fromTable ? 'Table Card' : ''}"><span class="card-val ${c.val === 10 ? 'is-cypher' : ''}" style="color:${c.suit.color}">${cardDisplayVal(c.val)}</span><span class="card-mini-suit-icon" style="color:${c.suit.color}">${c.suit.symbol}</span></div>`;

        this.els.historyContent.innerHTML = '';
        if (roundResult.isDefault) {
            this.els.historyContent.innerHTML = `<div style="text-align:center; padding: 20px;">Everyone else folded — no cards revealed.</div>`;
        } else {
            roundResult.plays.forEach(p => {
                const pObj = this.players[p.playerId];
                const res = p.result;
                const isWinner = roundResult.winnerIds.includes(p.playerId);
                const cardsHtml = p.ownCards.map(c => mini(c, false)).join('') + p.tableCards.map(c => mini(c, true)).join('');
                this.els.historyContent.innerHTML += `
                    <div class="history-item" style="${isWinner ? 'background: rgba(212,175,55,0.1); border-left: 3px solid var(--gold); border-radius: 5px;' : ''}">
                        <div class="history-player" style="color: ${pObj.color.hex}">${pObj.name}</div>
                        <div class="history-play">
                            <div style="text-align: right; line-height: 1.2;">
                                <div style="${res.style}; font-size: 0.95rem; font-weight: bold;">${res.tier}</div>
                                <div style="font-size: 0.7rem; color: #888;">${res.name}</div>
                            </div>
                            <div class="history-cards">${cardsHtml}</div>
                        </div>
                    </div>
                `;
            });
            this.els.historyContent.innerHTML += `<div style="font-size: 0.7rem; color: #777; text-align: center; margin-top: 8px;">Dashed cards are Table Cards.</div>`;
        }
        this.els.historyPanel.style.display = 'block';
        this.els.controlsArea.style.display = 'flex';

        const btnText = gameOver ? "PROCEED TO STANDINGS" : `REFILL & ROUND ${this.currentRoundNum + 1}`;
        this.els.controlsArea.innerHTML = `<button class="primary-btn" onclick="frontierGame.advanceToNextRound()">${btnText}</button>`;
    }

    // ── Refill ────────────────────────────────────────────────────────────────

    advanceToNextRound() {
        if (this.currentRoundNum === 5 || this.activeIds().length <= 1) {
            this.phase = 'GAME_OVER';
            this.renderShowdown();
            return;
        }
        // Clockwise from the dealer's left, each player may discard any number of cards face up.
        this.refillQueue = [];
        let id = this.dealerId;
        for (let k = 0; k < this.activeIds().length; k++) {
            id = this.nextSeat(id);
            this.refillQueue.push(id);
        }
        this.refillLog = [];
        this.roundBet = 0;
        this.turnKind = 'REFILL';
        this.nextRefill();
    }

    nextRefill() {
        if (this.refillQueue.length === 0) {
            this.finishRefill();
            return;
        }
        this.activePlayerId = this.refillQueue.shift();
        if (this.players[this.activePlayerId].hand.length === 0) { this.nextRefill(); return; } // nothing to discard
        this.phase = 'TRANSITION';
        this.renderTransition();
    }

    refillLogHTML() {
        if (this.refillLog.length === 0) return '';
        return this.refillLog.map(entry => {
            const p = this.players[entry.playerId];
            const cards = entry.cards.length === 0 ? 'kept everything'
                : entry.cards.map(c => `<span style="color:${c.suit.color}">${c.val === 10 ? 'Ø' : c.val}<span class="card-mini-suit-icon" style="display:inline-block;width:14px;vertical-align:middle;">${c.suit.symbol}</span></span>`).join(' ');
            return `<div><span style="color:${p.color.hex}">${p.name}</span>: ${cards}</div>`;
        }).join('');
    }

    renderRefill() {
        this.updateHUD();
        this.updatePlayerPods();
        this.selectedTableIndices = [];
        this.renderBoard({
            handLabel: 'YOUR CARDS — SELECT TO DISCARD',
            onToggleOwn: (idx) => { this.toggleIndex(this.selectedCardIndices, idx); this.renderRefill(); },
            onToggleTable: null
        });
        const log = this.refillLogHTML();
        this.setMessage(`<div>Refill before Round ${this.currentRoundNum + 1}: discards are face up.</div>${log ? `<div style="font-size: 0.85rem; opacity: 0.85; margin-top: 6px;">${log}</div>` : ''}`);
        const n = this.selectedCardIndices.length;
        this.els.controlsArea.style.display = 'flex';
        this.els.controlsArea.innerHTML = n > 0
            ? `<button class="action-btn" onclick="frontierGame.executeRefill()">DISCARD ${n}</button>`
            : `<button class="action-btn" onclick="frontierGame.executeRefill()">KEEP ALL</button>`;
    }

    executeRefill(indices = this.selectedCardIndices) {
        const p = this.players[this.activePlayerId];
        const discarded = indices.map(i => p.hand[i]);
        p.hand = p.hand.filter((_, i) => !indices.includes(i));
        this.discardPile.push(...discarded);
        this.refillLog.push({ playerId: this.activePlayerId, cards: discarded });
        this.selectedCardIndices = [];
        this.nextRefill();
    }

    finishRefill() {
        // Shuffle the discard pile into the deck; the deal passes one seat clockwise.
        this.deck = this.shuffle([...this.deck, ...this.discardPile]);
        this.discardPile = [];
        this.dealerId = this.nextSeat(this.dealerId);
        this.turnKind = 'BET';
        this.startRound(this.currentRoundNum + 1);
    }

    // ── Computer players ──────────────────────────────────────────────────────

    // Best hand from own cards + Table Cards. Ties prefer fewer own cards (keep them for later).
    getAISelection(player) {
        const hand = player.hand;
        const all = [...hand.map((c, i) => ({ c, own: i })), ...this.tableCards.map((c, i) => ({ c, table: i }))];
        let best = null, tableBest = null;
        for (let mask = 1; mask < (1 << all.length); mask++) {
            const picked = all.filter((_, i) => mask & (1 << i));
            const ev = evaluateHand(picked.map(x => x.c));
            const own = picked.filter(x => x.own !== undefined).map(x => x.own);
            const table = picked.filter(x => x.table !== undefined).map(x => x.table);
            if (!best || ev.score > best.eval.score || (ev.score === best.eval.score && own.length < best.own.length)) {
                best = { own, table, eval: ev };
            }
            if (own.length === 0 && (!tableBest || ev.score > tableBest.score)) tableBest = ev;
        }
        return { ...best, tableBest };
    }

    getAIConfidence(selection) {
        const ev = selection.eval;
        let confidence;
        if (!ev.isCombo) confidence = 0.1;
        else if (selection.tableBest && ev.score <= selection.tableBest.score) confidence = 0.3; // everyone shares it
        else confidence = ({ 2: 0.4, 3: 0.65, 4: 0.85 }[ev.count] ?? 0.95) + (ev.type - 1) * 0.03;
        return Math.max(0, Math.min(1, confidence + (Math.random() - 0.5) * 0.2)); // a little nerve
    }

    getAIBettingDecision(player, confidence) {
        const id = this.players.indexOf(player);
        const toCall = this.roundBet - this.bets[id];
        const foldCost = this.bets[id] === 0 ? 1 : 0;

        if (this.roundBet === 0) {
            const open = confidence > 0.8 ? 3 : confidence > 0.55 ? 2 : 1;
            return { action: 'BET', target: Math.min(this.betLimit, open) };
        }
        if (confidence > 0.75 && this.roundBet < this.betLimit && this.raiseCount < 4 && Math.random() < 0.6) {
            return { action: 'RAISE', target: Math.min(this.betLimit, this.roundBet + (confidence > 0.9 ? 2 : 1)) };
        }
        if (toCall <= foldCost) return { action: 'CALL', target: this.roundBet };
        if (confidence > 0.5 && (toCall <= 4 || confidence > 0.8)) return { action: 'CALL', target: this.roundBet };
        if (confidence > 0.25 && toCall <= 2) return { action: 'CALL', target: this.roundBet };
        if (toCall <= 1) return { action: 'CALL', target: this.roundBet };
        return { action: 'FOLD' };
    }

    executeAITurn() {
        const id = this.activePlayerId;
        const player = this.players[id];
        this.els.overlayTitle.innerText = `${player.name.toUpperCase()} IS THINKING...`;
        this.els.overlayTitle.style.color = player.color.hex;
        this.els.overlayDesc.innerText = "Reading the Table...";
        this.els.overlay.classList.add('visible');
        document.getElementById('overlay-main-btn').style.display = 'none';

        setTimeout(() => {
            const selection = this.getAISelection(player);
            this.selections[id] = { own: selection.own, table: selection.table };
            const decision = this.getAIBettingDecision(player, this.getAIConfidence(selection));
            const toCall = this.roundBet - this.bets[id];

            let text;
            if (decision.action === 'FOLD') text = `${player.name} folds${this.bets[id] === 0 ? ' ($1)' : ''}.`;
            else if (decision.action === 'BET') text = `${player.name} opens with $${decision.target}.`;
            else if (decision.action === 'RAISE') text = `${player.name} raises to $${decision.target}.`;
            else text = toCall > 0 ? `${player.name} calls $${toCall}.` : `${player.name} stays.`;
            this.els.overlayDesc.innerText = text;

            setTimeout(() => {
                this.els.overlay.classList.remove('visible');
                this.setMessage(`<div style="color: ${player.color.hex}; font-weight: bold;">${text}</div>`);
                if (decision.action === 'FOLD') this.executeFold();
                else this.betTo(decision.target);
            }, 900);
        }, 1100);
    }

    // Discard cards that connect to nothing else in hand (no shared value, Symbol, or neighbour).
    executeAIRefill() {
        const p = this.players[this.activePlayerId];
        const linked = (a, b) => a.val === b.val || a.suit.id === b.suit.id || isRunValues([a.val, b.val]);
        const indices = p.hand
            .map((c, i) => ({ c, i }))
            .filter(({ c, i }) => c.val !== 10 && !p.hand.some((o, j) => j !== i && linked(c, o)) && Math.random() < 0.7)
            .map(x => x.i);
        this.executeRefill(indices);
    }

    // ── End of the game ───────────────────────────────────────────────────────

    renderShowdown() {
        this.els.overlay.classList.remove('visible');
        this.els.cardsContainer.innerHTML = '';
        this.els.controlsArea.innerHTML = '';
        this.els.historyPanel.style.display = 'none';
        this.els.mainHud.style.display = 'none';
        this.els.controlsArea.style.display = 'none';

        // Everyone holding more than their stake has won the difference; the biggest gain takes the table.
        const gain = p => p.cash - p.stake;
        const sortedPlayers = [...this.players].sort((a, b) => gain(b) - gain(a));
        const topGain = gain(sortedPlayers[0]);
        const winners = sortedPlayers.filter(p => gain(p) === topGain);
        const fmt = g => `${g >= 0 ? '+' : '−'}$${Math.abs(g)}`;

        this.setMessage(winners.length > 1
            ? `DRAW! ${winners.map(w => w.name).join(' & ')} tied at ${fmt(topGain)}.`
            : `${winners[0].name.toUpperCase()} TAKES THE TABLE WITH ${fmt(topGain)}!`);

        let html = `
            <div style="background: rgba(0,0,0,0.6); padding: 30px; border-radius: 15px; border: 1px solid var(--gold-dim); width: 80%; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <h2 style="color: var(--gold-bright); font-size: 2.5rem; margin: 0; text-shadow: 0 0 20px rgba(255,215,0,0.5);">FINAL STANDINGS</h2>
                <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; border-top: 1px solid #333; padding-top: 20px;">
        `;
        sortedPlayers.forEach((p, idx) => {
            const isWinner = gain(p) === topGain && gain(p) > 0;
            const isBankrupt = p.status === 'BANKRUPT';
            html += `
                <div style="display: flex; flex-direction: column; align-items: center; ${isWinner ? 'transform: scale(1.1); color: var(--gold-bright);' : (isBankrupt ? 'opacity: 0.3; filter: grayscale(1);' : 'opacity: 0.7;')}">
                    <span style="font-size: 0.8rem; font-family: 'Playfair Display', serif;">#${idx + 1}</span>
                    <strong style="font-size: 1.5rem;">${p.name}</strong>
                    <span style="font-size: 2rem; font-family: 'Cinzel', serif;">$${p.cash}</span>
                    <span style="font-size: 0.8rem; color: ${gain(p) > 0 ? '#10b981' : gain(p) < 0 ? '#f87171' : '#888'};">${fmt(gain(p))}</span>
                    ${isBankrupt ? '<span style="font-size: 0.6rem; color: #f87171;">OUT</span>' : ''}
                </div>
            `;
        });
        html += `
                </div>
                <div style="display: flex; gap: 20px; margin-top: 20px;">
                    <button class="primary-btn" onclick="frontierGame.initGame()">PLAY AGAIN</button>
                    <a href="#games" style="text-decoration: none;"><button class="secondary-btn" style="background: rgba(40, 40, 40, 0.8); border: 1px solid var(--gold-dim); color: var(--gold); padding: 15px 30px; font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 2px; cursor: pointer; border-radius: 4px; transition: all 0.3s;">BACK TO MENU</button></a>
                </div>
            </div>
        `;
        this.els.cardsContainer.innerHTML = html;
        this.els.playerStatusGrid.innerHTML = '';
    }

    updateHUD() {
        document.getElementById('round-display').innerText = this.currentRoundNum;
        document.getElementById('pot-display').innerText = `$${this.pot}`;
        document.getElementById('current-bet-display').innerText = `$${this.roundBet}`;
        document.getElementById('deck-display').innerText = this.deck.length;
        const limit = document.getElementById('limit-display');
        if (limit) limit.innerText = `$${this.betLimit}`;
    }

    updatePlayerPods() {
        this.els.playerStatusGrid.innerHTML = '';
        const betting = this.phase === 'PLAYING' || (this.phase === 'TRANSITION' && this.turnKind === 'BET');
        this.players.forEach((p, idx) => {
            const isBankrupt = p.status === 'BANKRUPT';
            const isActiveTurn = (this.phase === 'PLAYING' || this.phase === 'REFILL') && idx === this.activePlayerId && !isBankrupt;
            const isFolded = betting && !this.roundActivePlayers.includes(idx) && !isBankrupt;

            let actionStr = '';
            if (isBankrupt) actionStr = 'Out';
            else if (isFolded) actionStr = 'Folded';
            else if (betting && this.bets[idx] > 0) actionStr = `Bet $${this.bets[idx]}`;
            else if (isActiveTurn) actionStr = 'Thinking...';

            const div = document.createElement('div');
            div.className = `player-status-pod ${isActiveTurn ? 'active-turn' : ''} ${isFolded || isBankrupt ? 'folded' : ''}`;
            if (isBankrupt) div.style.opacity = "0.3";

            div.innerHTML = `
                <div class="pod-name" style="color: ${p.color.hex}">${p.name}${p.isAI ? '<span class="ai-tag">AI</span>' : ''}${idx === this.dealerId && !isBankrupt ? '<span class="dealer-tag" title="Dealer">D</span>' : ''}</div>
                <div class="pod-cash">$${p.cash}</div>
                <div class="pod-action">${actionStr}</div>
            `;
            this.els.playerStatusGrid.appendChild(div);
        });
    }

    toggleProfilePanel() {
        const panel = document.getElementById('president-profile-panel');
        if (panel) {
            panel.classList.toggle('visible');
            panel.dataset.edition = this.edition;
            
            const isOpen = panel.classList.contains('visible');
            
            // Side panel button - grey when closed, gold when open
            const svgs = panel.querySelectorAll('.panel-close svg');
            svgs.forEach(svg => {
                svg.style.stroke = isOpen ? 'var(--gold-bright)' : 'var(--gold-dim)';
            });
            
            // FAB - always grey, hides when open
            const fab = document.querySelector('.panel-toggle-fab');
            if (fab) {
                fab.style.display = isOpen ? 'none' : 'flex';
            }
        }
        if (this.phase === 'PLAYING') this.renderPlaying();
    }

    updateProfilePanel() {
        const panel = document.getElementById('president-profile-panel');
        if (panel) {
            panel.dataset.edition = this.edition;
        }
        
        const panelContent = document.getElementById('profile-content');
        if (!panelContent) return;

        if (this.edition === 'PRESIDENT') {
            if (this.selectedCardIndices.length === 0) {
                panelContent.innerHTML = '<div class="profile-placeholder">Select a President Card to view Profile</div>';
                return;
            }

            const lastSelectedIdx = this.selectedCardIndices[this.selectedCardIndices.length - 1];
            const player = this.players[this.activePlayerId];
            if (!player || !player.hand[lastSelectedIdx]) return;

            const card = player.hand[lastSelectedIdx];
            const pName = card.president;
            if (!pName) {
                panelContent.innerHTML = '<div class="profile-placeholder">This card does not feature a President.</div>';
                return;
            }

            const p = presidentsData.find(pres => pres.name === pName);
            if (!p) {
                panelContent.innerHTML = `<div class="profile-placeholder">Profile not found for ${pName}</div>`;
                return;
            }

            const partyColorHex = p.partyColor === 'red' ? '#ff4d4d' : p.partyColor === 'blue' ? '#0077ff' : '#fff';
            const portraitUrl = card.portraitUrl || p.portraitUrl;

            panelContent.innerHTML = `
                <div class="profile-header">
                    <div class="profile-portrait-large">
                        <img src="${portraitUrl}" alt="${p.name}">
                    </div>
                    <div class="profile-name">${p.name}</div>
                    <div class="profile-years">${p.years}</div>
                </div>
                <div class="profile-meta-grid">
                    <div class="meta-box">
                        <label>Lifespan</label>
                        <span>${p.lifespan}</span>
                    </div>
                    <div class="meta-box">
                        <label>Political Party</label>
                        <span style="color: ${partyColorHex}">${p.party}</span>
                    </div>
                </div>
                <div class="profile-summary">${p.summary}</div>
                <div class="profile-events">
                    <h4>Notable Events</h4>
                    <ul>
                        ${p.events.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="action-btn" style="border-color: var(--gold); color: var(--gold); padding: 8px 16px; font-size: 0.85rem;" onclick="window.open('index.html#chronicle-view', '_blank')">AMERICAN CHRONICLE</button>
                    <div style="font-size: 0.7rem; color: #888; margin-top: 5px; font-style: italic;">(It will open in new tab)</div>
                </div>
            `;
        } else if (this.edition === 'STATE') {
            if (this.selectedCardIndices.length === 0) {
                panelContent.innerHTML = '<div class="profile-placeholder">Select a State Card to view Info</div>';
                return;
            }

            const lastSelectedIdx = this.selectedCardIndices[this.selectedCardIndices.length - 1];
            const player = this.players[this.activePlayerId];
            if (!player || !player.hand[lastSelectedIdx]) return;

            const card = player.hand[lastSelectedIdx];
            const stateName = card.state;
            if (!stateName) {
                panelContent.innerHTML = '<div class="profile-placeholder">This card does not feature a State.</div>';
                return;
            }

            const state = getStateByName(stateName);
            if (!state) {
                panelContent.innerHTML = `<div class="profile-placeholder">State info not found for ${stateName}</div>`;
                return;
            }

            panelContent.innerHTML = `
                <div class="profile-header">
                    <div class="profile-portrait-large" style="${this.edition === 'STATE' ? 'width:140px;height:90px;border-radius:4px;' : ''}">
                        <img src="${state.flagUrl}" alt="${state.name}">
                    </div>
                    <div class="profile-name">${state.name}</div>
                    <div class="profile-years">${state.nickname}</div>
                </div>
                <div class="profile-meta-grid">
                    <div class="meta-box">
                        <label>Capital</label>
                        <span>${state.capital}</span>
                    </div>
                    <div class="meta-box">
                        <label>Largest City</label>
                        <span>${state.largestCity}</span>
                    </div>
                    <div class="meta-box">
                        <label>Joined Union</label>
                        <span>${state.year}</span>
                    </div>
                    <div class="meta-box">
                        <label>Order</label>
                        <span>${state.order}${this.getOrdinalSuffix(state.order)}</span>
                    </div>
                </div>
                <div class="chronicle-text" style="font-size:0.95rem; line-height:1.7; margin-top:15px; color:#ccc;">
                    <p>${state.summary}</p>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="action-btn" style="border-color: var(--gold); color: var(--gold); padding: 8px 16px; font-size: 0.85rem;" onclick="window.open('index.html#chronicle-view', '_blank')">AMERICAN CHRONICLE</button>
                    <div style="font-size: 0.7rem; color: #888; margin-top: 5px; font-style: italic;">(Opens in new tab)</div>
                </div>
            `;
        }
    }
}

// Init
const frontierGame = new FrontierGame();
