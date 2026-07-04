class DuelGame {
    constructor() {
        this._setupCount = 2;
        this._setupMode = 'pvp';
        this.players = [];
        this.drawPile = [];
        this.influenceCard = null;
        this.influenceHistory = [];
        this.round = 0;
        this.foughtThisRound = new Set();
        this.currentChallenger = null;
        this.currentDefender = null;
        this.bystander = null;
        this.lastBystander = null;
        this.turnOrder = [];
        this._defenderPot = [];
        this._challengerPot = [];
        this._gamblingPlayer = null;
        this._isFinalDuel = false;
    }

    // ─── Color helpers ───────────────────────────────────────────────

    suitColor(suitId) {
        if (suitId === 'BORDER') return 'black';
        if (suitId === 'WEST_FRONTIER' || suitId === 'INDUST_EAST') return 'blue';
        return 'red';
    }

    cardColor(card) { return this.suitColor(card.suit.id); }

    influenceBonus(card) {
        if (!this.influenceCard) return 0;
        const ic = this.suitColor(this.influenceCard.suit.id);
        const cc = this.cardColor(card);
        if (ic === 'black' && cc === 'black') return 2;
        if (ic !== 'black' && ic === cc) return 1;
        return 0;
    }

    effectivePower(card) {
        if (card.val === 10) return 999; // Cypher beats all
        return card.val + this.influenceBonus(card);
    }

    // ─── Deck ─────────────────────────────────────────────────────────

    buildDeck() {
        const deck = [];
        Object.keys(SUITS).forEach(suitKey => {
            for (let val = 1; val <= 10; val++) {
                deck.push({ suit: SUITS[suitKey], val });
            }
        });
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    // ─── Screen management ────────────────────────────────────────────

    showScreen(name) {
        ['duel-setup','duel-board','duel-challenge','duel-gate',
         'duel-card-select','duel-reveal','duel-gamble','duel-over','duel-rules'
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === `duel-${name}` || (name === 'setup' && id === 'duel-setup')) ? 'flex' : 'none';
        });
        // special: 'setup' maps to 'duel-setup'
        const target = document.getElementById(`duel-${name}`);
        if (target) target.style.display = 'flex';
    }

    // ─── Setup ───────────────────────────────────────────────────────

    showSetup() {
        this.showScreen('setup');
        this.renderSetup();
    }

    renderSetup() {
        const el = document.getElementById('duel-setup');
        el.innerHTML = `
            <div class="dg-setup-box">
                <h1 class="dg-title">DUEL</h1>
                <p class="dg-subtitle">Hidden information. Public deception. Timing.</p>

                <div class="dg-setup-row">
                    <div class="dg-setup-label">PLAYERS</div>
                    <div class="dg-btn-row" id="dg-count-btns">
                        ${[2,3,4,5,6].map(n =>
                            `<button class="dg-pill${n===2?' active':''}" onclick="duelGame.setCount(${n})">${n}</button>`
                        ).join('')}
                    </div>
                </div>

                <div class="dg-setup-row" id="dg-mode-row">
                    <div class="dg-setup-label">MODE</div>
                    <div class="dg-btn-row">
                        <button class="dg-pill active" id="dg-pvp-btn" onclick="duelGame.setMode('pvp')">LOCAL PLAY</button>
                        <button class="dg-pill" id="dg-cpu-btn" onclick="duelGame.setMode('cpu')">VS COMPUTER</button>
                    </div>
                </div>

                <div id="dg-names"></div>

                <button class="dg-start-btn" onclick="duelGame.startGame()">BEGIN DUEL</button>
                <button class="dg-link-btn" onclick="duelGame.showRules()">View Ruleset</button>
                <button class="dg-link-btn" onclick="navigateTo('frontier')">← Back to Arcade Menu</button>
            </div>
        `;
        this.renderNames();
    }

    setCount(n) {
        this._setupCount = n;
        document.querySelectorAll('#dg-count-btns .dg-pill').forEach((b, i) => {
            b.classList.toggle('active', [2,3,4,5,6][i] === n);
        });
        const modeRow = document.getElementById('dg-mode-row');
        if (modeRow) modeRow.style.display = n === 2 ? 'flex' : 'none';
        if (n !== 2) { this._setupMode = 'pvp'; }
        this.renderNames();
    }

    setMode(mode) {
        this._setupMode = mode;
        document.getElementById('dg-pvp-btn')?.classList.toggle('active', mode === 'pvp');
        document.getElementById('dg-cpu-btn')?.classList.toggle('active', mode === 'cpu');
        this.renderNames();
    }

    renderNames() {
        const c = document.getElementById('dg-names');
        if (!c) return;
        const isCpu = this._setupMode === 'cpu';
        let html = '<div class="dg-names-list">';
        for (let i = 0; i < this._setupCount; i++) {
            const isCpuSlot = isCpu && i === 1;
            html += `<input class="dg-name-input" id="dg-name-${i}" type="text"
                placeholder="${isCpuSlot ? 'Computer' : `Player ${i+1}`}"
                value="${isCpuSlot ? 'Computer' : `Player ${i+1}`}"
                ${isCpuSlot ? 'disabled' : ''}>`;
        }
        html += '</div>';
        c.innerHTML = html;
    }

    startGame() {
        const isCpu = this._setupMode === 'cpu';
        this.players = [];
        for (let i = 0; i < this._setupCount; i++) {
            const el = document.getElementById(`dg-name-${i}`);
            const name = el?.value?.trim() || `Player ${i+1}`;
            this.players.push({ name, hand: [], isComputer: isCpu && i === 1, eliminated: false });
        }

        const deck = this.buildDeck();
        this.drawPile = [...deck];
        this.influenceHistory = [];
        this.round = 0;
        this.lastBystander = null;

        this.players.forEach(p => {
            for (let j = 0; j < 5; j++) p.hand.push(this.drawPile.pop());
        });
        this.influenceCard = this.drawPile.pop();

        this.startRound();
    }

    startWithPlayers(playerConfigs) {
        this.players = playerConfigs.map((cfg, i) => ({
            name: cfg.name || `Player ${i + 1}`,
            hand: [],
            isComputer: cfg.isAI || false,
            eliminated: false
        }));
        const deck = this.buildDeck();
        this.drawPile = [...deck];
        this.influenceHistory = [];
        this.round = 0;
        this.lastBystander = null;
        this.players.forEach(p => {
            for (let j = 0; j < 5; j++) p.hand.push(this.drawPile.pop());
        });
        this.influenceCard = this.drawPile.pop();
        this.startRound();
    }

    // ─── Round management ────────────────────────────────────────────

    activePlayers() {
        return this.players.filter(p => !p.eliminated);
    }

    startRound() {
        const active = this.activePlayers();
        if (active.length <= 1) { this.endGame(); return; }

        this.round++;
        this.foughtThisRound = new Set();
        this.bystander = null;

        // Odd count → assign bystander
        if (active.length % 2 !== 0) {
            const candidates = active.filter(p => p !== this.lastBystander);
            const pick = candidates.length > 0 ? candidates : active;
            this.bystander = pick[Math.floor(Math.random() * pick.length)];
            this.lastBystander = this.bystander;
            this.foughtThisRound.add(this.players.indexOf(this.bystander));
        }

        // Shuffle turn order among non-bystander active players
        const pool = active.filter(p => p !== this.bystander);
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        this.turnOrder = pool.map(p => this.players.indexOf(p));

        this.nextTurn();
    }

    nextTurn() {
        // Eliminate players with empty hands
        this.players.forEach(p => {
            if (!p.eliminated && p.hand.length === 0) p.eliminated = true;
        });

        const active = this.activePlayers();
        if (active.length <= 1) { this.endGame(); return; }

        const remaining = this.turnOrder.filter(i =>
            !this.foughtThisRound.has(i) && !this.players[i].eliminated
        );

        if (remaining.length === 0) {
            this.startRound();
            return;
        }

        if (remaining.length === 2) {
            // Last two must fight
            this.currentChallenger = remaining[0];
            this.currentDefender = remaining[1];
            this.beginDuel();
            return;
        }

        // First remaining player picks their target
        this.currentChallenger = remaining[0];
        this.showChallenge();
    }

    // ─── Challenge ───────────────────────────────────────────────────

    showChallenge() {
        this.showScreen('challenge');
        const challenger = this.players[this.currentChallenger];
        const targets = this.activePlayers().filter(p => {
            const i = this.players.indexOf(p);
            return i !== this.currentChallenger && !this.foughtThisRound.has(i);
        });

        const el = document.getElementById('duel-challenge');
        el.innerHTML = `
            <div class="dg-overlay-box">
                ${this.renderMiniBoard()}
                <div class="dg-phase-tag">Round ${this.round} — Challenge</div>
                <div class="dg-big-name">${challenger.name}</div>
                <p class="dg-prompt">Choose your opponent</p>
                <div class="dg-target-list">
                    ${targets.map(p => `
                        <button class="dg-target-btn" onclick="duelGame.selectOpponent(${this.players.indexOf(p)})">
                            <span>${p.name}</span>
                            <span class="dg-card-count">${p.hand.length} cards</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    selectOpponent(defenderIdx) {
        this.currentDefender = defenderIdx;
        this.beginDuel();
    }

    // ─── Duel flow ───────────────────────────────────────────────────

    beginDuel() {
        this._defenderPot = [];
        this._challengerPot = [];
        this._isFinalDuel = this.activePlayers().length === 2;
        this.foughtThisRound.add(this.currentChallenger);
        this.foughtThisRound.add(this.currentDefender);
        this.nextDuelStep();
    }

    nextDuelStep() {
        const defender = this.players[this.currentDefender];
        const challenger = this.players[this.currentChallenger];
        const defenderNeedsPick = this._defenderPot.length === this._challengerPot.length;

        if (defenderNeedsPick) {
            if (defender.isComputer) {
                this._defenderPot.push(this.cpuPickCard(this.currentDefender));
                // Defender done — now handle challenger
                this.nextDuelStep();
            } else {
                this.showGate(defender.name, 'defender');
            }
        } else {
            // Challenger's turn
            if (challenger.isComputer) {
                this._challengerPot.push(this.cpuPickCard(this.currentChallenger));
                this.resolveCurrentCards();
            } else {
                this.showGate(challenger.name, 'challenger');
            }
        }
    }

    showGate(playerName, role) {
        this.showScreen('gate');
        const el = document.getElementById('duel-gate');
        el.innerHTML = `
            <div class="dg-overlay-box">
                ${this.renderInfluenceBar()}
                <p class="dg-prompt" style="margin-bottom:8px;">Pass the device to</p>
                <div class="dg-big-name">${playerName}</div>
                <p class="dg-prompt-sm">${role === 'defender' ? 'You reveal first — choose wisely' : 'Your turn to play a card'}</p>
                <button class="dg-ready-btn" onclick="duelGame.showCardSelect('${role}')">I'M READY</button>
            </div>
        `;
    }

    showCardSelect(role) {
        this.showScreen('card-select');
        const playerIdx = role === 'defender' ? this.currentDefender : this.currentChallenger;
        const player = this.players[playerIdx];
        const el = document.getElementById('duel-card-select');

        el.innerHTML = `
            <div class="dg-card-select-box">
                <div class="dg-phase-tag">${role.toUpperCase()} — ${player.name}</div>
                ${this.renderInfluenceBar()}
                <p class="dg-prompt">Select a card to play</p>
                <div class="dg-hand">
                    ${player.hand.map((card, i) => {
                        const pw = this.effectivePower(card);
                        const col = this.cardColor(card);
                        const bonus = this.influenceBonus(card);
                        const pwLabel = card.val === 10 ? 'CYPHER' : `PWR ${pw}${bonus > 0 ? ` (+${bonus})` : ''}`;
                        return `
                            <div class="dg-hand-card" onclick="duelGame.playCard(${i}, '${role}')">
                                <img src="${getCardImageUrl(card.suit.id, card.val)}" alt="">
                                <div class="dg-pwr dg-col-${col}">${pwLabel}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${this._isFinalDuel ? '<div class="dg-final-notice">FINAL DUEL — All reveals are open</div>' : ''}
            </div>
        `;
    }

    playCard(cardIndex, role) {
        const playerIdx = role === 'defender' ? this.currentDefender : this.currentChallenger;
        const player = this.players[playerIdx];
        const card = player.hand.splice(cardIndex, 1)[0];

        if (role === 'defender') {
            this._defenderPot.push(card);
            if (this.players[this.currentChallenger].isComputer) {
                this._challengerPot.push(this.cpuPickCard(this.currentChallenger));
                this.resolveCurrentCards();
            } else {
                this.showGate(this.players[this.currentChallenger].name, 'challenger');
            }
        } else {
            this._challengerPot.push(card);
            this.resolveCurrentCards();
        }
    }

    resolveCurrentCards() {
        const dCard = this._defenderPot[this._defenderPot.length - 1];
        const cCard = this._challengerPot[this._challengerPot.length - 1];
        const dPow = this.effectivePower(dCard);
        const cPow = this.effectivePower(cCard);
        const isTie = dPow === cPow;

        this.showScreen('reveal');
        const el = document.getElementById('duel-reveal');
        const defender = this.players[this.currentDefender];
        const challenger = this.players[this.currentChallenger];
        const isOvertime = this._defenderPot.length > 1;

        if (isTie) {
            el.innerHTML = `
                <div class="dg-reveal-box">
                    <div class="dg-phase-tag">${isOvertime ? 'OVERTIME STANDOFF' : 'STANDOFF'}</div>
                    <div class="dg-reveal-row">
                        ${this.cardRevealEl(dCard, defender.name, dPow, 'tie')}
                        <div class="dg-vs">TIE</div>
                        ${this.cardRevealEl(cCard, challenger.name, cPow, 'tie')}
                    </div>
                    <p class="dg-prompt-sm">Both select another card for Overtime</p>
                    <button class="dg-ready-btn" onclick="duelGame.triggerOvertime()">OVERTIME</button>
                </div>
            `;
        } else {
            const defWins = dPow > cPow;
            const winnerIdx = defWins ? this.currentDefender : this.currentChallenger;
            const loserIdx  = defWins ? this.currentChallenger : this.currentDefender;
            const winnerPot = defWins ? this._defenderPot : this._challengerPot;
            const loserPot  = defWins ? this._challengerPot : this._defenderPot;
            const winnerCard = defWins ? dCard : cCard;
            const loserCard  = defWins ? cCard : dCard;

            // Resolve influence: loser's last card → influence, rest of loser pot → history, old influence → history
            if (this.influenceCard) this.influenceHistory.push(this.influenceCard);
            loserPot.slice(0, -1).forEach(c => this.influenceHistory.push(c)); // all but last
            this.influenceCard = loserCard; // loser's last card becomes influence

            // Winner keeps all their pot cards
            winnerPot.forEach(c => this.players[winnerIdx].hand.push(c));

            const winner = this.players[winnerIdx];
            const loser  = this.players[loserIdx];

            const canGamble = this.drawPile.length > 0 && loser.hand.length > 0 && !loser.isComputer;

            el.innerHTML = `
                <div class="dg-reveal-box">
                    <div class="dg-phase-tag">${winner.name} WON</div>
                    <div class="dg-reveal-row">
                        ${this.cardRevealEl(dCard, defender.name, dPow, defWins ? 'win' : 'lose')}
                        <div class="dg-vs">VS</div>
                        ${this.cardRevealEl(cCard, challenger.name, cPow, defWins ? 'lose' : 'win')}
                    </div>
                    <div class="dg-new-influence">
                        <span class="dg-label-sm">NEW INFLUENCE</span>
                        <img src="${getCardImageUrl(this.influenceCard.suit.id, this.influenceCard.val)}"
                             class="dg-influence-thumb">
                        <span class="dg-col-${this.suitColor(this.influenceCard.suit.id)}">${this.influenceBonusLabel()}</span>
                    </div>
                    ${canGamble ? `
                        <div class="dg-gamble-prompt">
                            <p class="dg-prompt-sm">${loser.name} — take the Gamble?</p>
                            <p class="dg-prompt-xs">Reveal one card from hand → draw one card</p>
                            <div class="dg-btn-row" style="justify-content:center;margin-top:12px;">
                                <button class="dg-ready-btn" onclick="duelGame.showGamble(${loserIdx})">GAMBLE</button>
                                <button class="dg-skip-btn" onclick="duelGame.afterDuel()">PASS</button>
                            </div>
                        </div>
                    ` : `<button class="dg-ready-btn" style="margin-top:20px;" onclick="duelGame.afterDuel()">CONTINUE</button>`}
                </div>
            `;
        }
    }

    triggerOvertime() {
        // Both need to pick again — reuse nextDuelStep which handles pot length parity
        this.nextDuelStep();
    }

    afterDuel() {
        this.players.forEach(p => {
            if (!p.eliminated && p.hand.length === 0) p.eliminated = true;
        });
        const active = this.activePlayers();
        if (active.length <= 1) { this.endGame(); return; }
        this.showBoard();
        setTimeout(() => this.nextTurn(), 100);
    }

    // ─── Loser's Gamble ──────────────────────────────────────────────

    showGamble(loserIdx) {
        this._gamblingPlayer = loserIdx;
        this.showScreen('gamble');
        const loser = this.players[loserIdx];
        const el = document.getElementById('duel-gamble');
        el.innerHTML = `
            <div class="dg-card-select-box">
                <div class="dg-phase-tag">LOSER'S GAMBLE — ${loser.name}</div>
                <p class="dg-prompt">Reveal one card publicly, then draw one</p>
                <div class="dg-hand">
                    ${loser.hand.map((card, i) => `
                        <div class="dg-hand-card" onclick="duelGame.executeGamble(${i})">
                            <img src="${getCardImageUrl(card.suit.id, card.val)}" alt="">
                            <div class="dg-pwr dg-col-${this.cardColor(card)}">REVEAL</div>
                        </div>
                    `).join('')}
                </div>
                <button class="dg-skip-btn" style="margin-top:16px;" onclick="duelGame.afterDuel()">CANCEL GAMBLE</button>
            </div>
        `;
    }

    executeGamble(cardIndex) {
        const loser = this.players[this._gamblingPlayer];
        const card = loser.hand.splice(cardIndex, 1)[0];
        this.influenceHistory.push(card);
        const drawn = this.drawPile.pop();
        if (drawn) loser.hand.push(drawn);
        this.afterDuel();
    }

    // ─── Board view ──────────────────────────────────────────────────

    showBoard() {
        this.showScreen('board');
        const el = document.getElementById('duel-board');
        el.innerHTML = `
            <div class="dg-board">
                <div class="dg-board-hud">
                    <span class="dg-label-sm">ROUND ${this.round}</span>
                    <div class="dg-board-center-row">
                        <div class="dg-board-influence-wrap">
                            <div class="dg-label-sm">INFLUENCE</div>
                            ${this.influenceCard
                                ? `<img src="${getCardImageUrl(this.influenceCard.suit.id, this.influenceCard.val)}" class="dg-influence-img">`
                                : ''}
                            <div class="dg-col-${this.influenceCard ? this.suitColor(this.influenceCard.suit.id) : 'black'} dg-bonus-label">
                                ${this.influenceBonusLabel()}
                            </div>
                        </div>
                        <div class="dg-board-draw-wrap">
                            <div class="dg-label-sm">DRAW PILE</div>
                            <div class="dg-draw-count">${this.drawPile.length}</div>
                        </div>
                    </div>
                </div>

                <div class="dg-player-chips">
                    ${this.players.map((p, i) => `
                        <div class="dg-chip ${p.eliminated ? 'out' : ''} ${this.foughtThisRound.has(i) ? 'fought' : ''}">
                            <div class="dg-chip-name">${p.name}${p.isComputer ? ' (CPU)' : ''}</div>
                            <div class="dg-chip-cards">${p.eliminated ? 'OUT' : p.hand.length + ' cards'}</div>
                            ${this.bystander === p ? '<div class="dg-bystander">Bystander</div>' : ''}
                        </div>
                    `).join('')}
                </div>

                ${this.influenceHistory.length > 0 ? `
                    <div class="dg-history-wrap">
                        <div class="dg-label-sm">INFLUENCE HISTORY</div>
                        <div class="dg-history-row">
                            ${this.influenceHistory.map(c =>
                                `<img src="${getCardImageUrl(c.suit.id, c.val)}" class="dg-hist-card">`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ─── Game Over ───────────────────────────────────────────────────

    endGame() {
        const winner = this.activePlayers()[0];
        this.showScreen('over');
        const el = document.getElementById('duel-over');
        el.innerHTML = `
            <div class="dg-overlay-box">
                <div class="dg-phase-tag">DUEL OVER</div>
                <div class="dg-winner-name">${winner ? winner.name : '—'}</div>
                <p class="dg-subtitle">IS THE LAST STANDING</p>
                <button class="dg-start-btn" onclick="duelGame.showSetup()">PLAY AGAIN</button>
                <button class="dg-link-btn" onclick="navigateTo('frontier')">← Back to Menu</button>
            </div>
        `;
    }

    // ─── Rules ───────────────────────────────────────────────────────

    showRules() {
        this.showScreen('rules');
        const el = document.getElementById('duel-rules');
        el.innerHTML = `
            <div class="dg-rules-box">
                <button class="dg-link-btn" style="margin-bottom:20px;" onclick="navigateTo('frontier'); frontierGame.currentGame='DUEL'; frontierGame.showSetup();">← Back to Setup</button>
                <h1 class="dg-title">DUEL</h1>
                <p class="dg-subtitle">A game of hidden information, public deception, and timing</p>
                <div class="dg-rules-body">
                    <h3>OBJECTIVE</h3>
                    <p>Be the last player with cards in hand.</p>

                    <h3>SETUP</h3>
                    <p>Shuffle the full 50-card deck. Deal <strong>5 cards</strong> to each player. Place the remaining cards face-down as the Draw Pile. Turn the top card face-up — this is the first Influence Card.</p>

                    <h3>CARD POWER</h3>
                    <p>Every card's Power equals its number. Higher Power wins a duel.</p>
                    <p>The <strong>Cypher (10)</strong> has the highest Power — it beats any numbered card.</p>

                    <h3>THE INFLUENCE CARD</h3>
                    <p>One card always sits face-up at the center. Its color modifies Power:</p>
                    <ul>
                        <li><span class="dg-col-red">Red card</span> → +1 to all Red cards played</li>
                        <li><span class="dg-col-blue">Blue card</span> → +1 to all Blue cards played</li>
                        <li><span class="dg-col-black">Black card</span> → +2 to all Black cards played</li>
                    </ul>
                    <p>When a duel resolves, the loser's card replaces the Influence Card. The displaced card moves to the Influence History.</p>

                    <h3>ROUND STRUCTURE</h3>
                    <p>A round ends when every player has fought exactly once. With an <strong>odd number of players</strong>, one player per round is the Bystander — they observe but don't fight. The Bystander role rotates.</p>

                    <h3>ISSUING A CHALLENGE</h3>
                    <p>On your turn, choose any player who hasn't fought this round. They cannot refuse. When only two players haven't fought, they must face each other.</p>

                    <h3>RESOLVING A DUEL</h3>
                    <ol>
                        <li>Both players secretly select one card.</li>
                        <li>The <strong>Defender</strong> reveals first.</li>
                        <li>The <strong>Challenger</strong> reveals.</li>
                        <li>Apply Influence bonus. Higher Power wins.</li>
                        <li>Loser's card → new Influence Card. Winner keeps their card.</li>
                    </ol>

                    <h3>STANDOFF &amp; OVERTIME</h3>
                    <p>If final Powers tie, it's a Standoff. Both immediately select a second card. The winner of Overtime wins the entire duel. The loser loses <strong>both</strong> cards. Overtime can chain.</p>

                    <h3>THE LOSER'S GAMBLE</h3>
                    <p>After losing, the loser may Gamble: reveal one card from their hand publicly (it goes to the Influence History), then draw one card from the Draw Pile. Optional. Only available while the Draw Pile has cards.</p>

                    <h3>ELIMINATION</h3>
                    <p>A player with no cards is eliminated from the game.</p>

                    <h3>THE FINAL DUEL</h3>
                    <p>When two players remain, all reveals are <strong>open</strong> — no private selection. The survivor wins.</p>
                </div>
            </div>
        `;
    }

    // ─── Render helpers ──────────────────────────────────────────────

    cardRevealEl(card, playerName, power, result) {
        const col = this.cardColor(card);
        const pwLabel = card.val === 10 ? 'CYPHER' : `PWR ${power}`;
        return `
            <div class="dg-reveal-card ${result}">
                <div class="dg-reveal-name">${playerName}</div>
                <img src="${getCardImageUrl(card.suit.id, card.val)}" class="dg-reveal-img">
                <div class="dg-pwr dg-col-${col}">${pwLabel}</div>
                ${result === 'win' ? '<div class="dg-badge win">WIN</div>' :
                  result === 'lose' ? '<div class="dg-badge lose">LOSE</div>' : ''}
            </div>
        `;
    }

    influenceBonusLabel() {
        if (!this.influenceCard) return '';
        const col = this.suitColor(this.influenceCard.suit.id);
        if (col === 'black') return '+2 to Black';
        return `+1 to ${col.charAt(0).toUpperCase() + col.slice(1)}`;
    }

    renderInfluenceBar() {
        if (!this.influenceCard) return '';
        const c = this.influenceCard;
        const col = this.suitColor(c.suit.id);
        return `
            <div class="dg-influence-bar">
                <img src="${getCardImageUrl(c.suit.id, c.val)}" style="width:36px;height:50px;object-fit:fill;border-radius:4px;">
                <span class="dg-col-${col} dg-prompt-sm">${this.influenceBonusLabel()} this duel</span>
            </div>
        `;
    }

    renderMiniBoard() {
        const active = this.activePlayers();
        return `
            <div class="dg-mini-board">
                ${active.map(p => `
                    <div class="dg-mini-chip">
                        <span>${p.name}</span>
                        <span class="dg-card-count">${p.hand.length}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ─── Computer AI ─────────────────────────────────────────────────

    cpuPickCard(playerIdx) {
        const cpu = this.players[playerIdx];
        if (cpu.hand.length === 0) return null;

        // Play a mid-range card with slight randomness
        const sorted = [...cpu.hand].sort((a, b) => this.effectivePower(a) - this.effectivePower(b));
        const mid = Math.floor(sorted.length / 2);
        const spread = Math.floor(Math.random() * 3) - 1;
        const pick = sorted[Math.max(0, Math.min(sorted.length - 1, mid + spread))];
        cpu.hand.splice(cpu.hand.indexOf(pick), 1);
        return pick;
    }
}

const duelGame = new DuelGame();
