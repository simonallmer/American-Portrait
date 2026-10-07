class StateQuizGame {
    constructor() {
        this.players = [];
        this.currentRound = 0;
        this.totalRounds = 5;
        this.pot = 0;
        this.targetState = null;
        this.deck = [];
        this.guesses = []; // [{playerId, code, dist}]
        this.activePlayerIndex = 0;
        this.gameWins = {}; // playerId -> winCount
        this.phase = 'WAITING'; // WAITING, GUESSING, REVEAL, ROUND_OVER, GAME_OVER

        this.adj = {
            "AL": ["FL", "GA", "MS", "TN"],
            "AK": [],
            "AZ": ["CA", "CO", "NV", "NM", "UT"],
            "AR": ["LA", "MS", "MO", "OK", "TN", "TX"],
            "CA": ["AZ", "NV", "OR"],
            "CO": ["AZ", "KS", "NE", "NM", "OK", "UT", "WY"],
            "CT": ["MA", "NY", "RI"],
            "DE": ["MD", "NJ", "PA"],
            "FL": ["AL", "GA"],
            "GA": ["AL", "FL", "NC", "SC", "TN"],
            "HI": [],
            "ID": ["MT", "NV", "OR", "UT", "WA", "WY"],
            "IL": ["IA", "IN", "KY", "MO", "WI"],
            "IN": ["IL", "KY", "MI", "OH"],
            "IA": ["IL", "MN", "MO", "NE", "SD", "WI"],
            "KS": ["CO", "MO", "NE", "OK"],
            "KY": ["IL", "IN", "MO", "OH", "TN", "VA", "WV"],
            "LA": ["AR", "MS", "TX"],
            "ME": ["NH"],
            "MD": ["DE", "PA", "VA", "WV"],
            "MA": ["CT", "NH", "NY", "RI", "VT"],
            "MI": ["IN", "OH", "WI"],
            "MN": ["IA", "ND", "SD", "WI"],
            "MS": ["AL", "AR", "LA", "TN"],
            "MO": ["AR", "IL", "IA", "KS", "KY", "NE", "OK", "TN"],
            "MT": ["ID", "ND", "SD", "WY"],
            "NE": ["CO", "IA", "KS", "MO", "SD", "WY"],
            "NV": ["AZ", "CA", "ID", "OR", "UT"],
            "NH": ["MA", "ME", "VT"],
            "NJ": ["DE", "NY", "PA"],
            "NM": ["AZ", "CO", "OK", "TX", "UT"],
            "NY": ["CT", "MA", "NJ", "PA", "VT"],
            "NC": ["GA", "SC", "TN", "VA"],
            "ND": ["MN", "MT", "SD"],
            "OH": ["IN", "KY", "MI", "PA", "WV"],
            "OK": ["AR", "CO", "KS", "MO", "NM", "TX"],
            "OR": ["CA", "ID", "NV", "WA"],
            "PA": ["DE", "MD", "NJ", "NY", "OH", "WV"],
            "RI": ["CT", "MA"],
            "SC": ["GA", "NC"],
            "SD": ["IA", "MN", "MT", "NE", "ND", "WY"],
            "TN": ["AL", "AR", "GA", "KY", "MO", "MS", "NC", "VA"],
            "TX": ["AR", "LA", "NM", "OK"],
            "UT": ["AZ", "CO", "ID", "NV", "WY"],
            "VT": ["MA", "NH", "NY"],
            "VA": ["KY", "MD", "NC", "TN", "WV"],
            "WA": ["ID", "OR"],
            "WV": ["KY", "MD", "OH", "PA", "VA"],
            "WI": ["IL", "IA", "MI", "MN"],
            "WY": ["CO", "ID", "MT", "NE", "SD", "UT"]
        };

        this.stateToCode = {
            "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
            "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
            "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
            "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
            "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
            "montana": "MT", "nebraska": "NE", "nevada": "NV", "new-hampshire": "NH", "new-jersey": "NJ",
            "new-mexico": "NM", "new-york": "NY", "north-carolina": "NC", "north-dakota": "ND", "ohio": "OH",
            "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA", "rhode-island": "RI", "south-carolina": "SC",
            "south-dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
            "virginia": "VA", "washington": "WA", "west-virginia": "WV", "wisconsin": "WI", "wyoming": "WY"
        };

        // Lookup that tolerates "New York", "new-york", "new_york", "NEW  YORK".
        // The deck stores display names ("New York") while the table above is
        // keyed by slug, so a naive match silently failed on every two-word
        // state and stalled the round.
        this.normToCode = {};
        Object.entries(this.stateToCode).forEach(([slug, code]) => {
            this.normToCode[this.normalizeName(slug)] = code;
        });

        this.codeToStateId = Object.fromEntries(Object.entries(this.stateToCode).map(([k, v]) => [v, k]));

        // Approximate geographic centre of each state, used to rank guesses when
        // the adjacency graph can't reach the target (Alaska and Hawaii).
        this.stateCenters = {
            AL: [32.8, -86.8], AK: [63.6, -152.4], AZ: [34.2, -111.6], AR: [34.9, -92.4],
            CA: [37.2, -119.5], CO: [39.0, -105.5], CT: [41.6, -72.7], DE: [39.0, -75.5],
            FL: [28.6, -82.4], GA: [32.6, -83.4], HI: [20.3, -156.4], ID: [44.4, -114.6],
            IL: [40.0, -89.2], IN: [39.9, -86.3], IA: [42.1, -93.5], KS: [38.5, -98.4],
            KY: [37.5, -85.3], LA: [31.1, -92.0], ME: [45.4, -69.2], MD: [39.0, -76.8],
            MA: [42.3, -71.8], MI: [44.3, -85.4], MN: [46.3, -94.3], MS: [32.7, -89.7],
            MO: [38.4, -92.5], MT: [47.0, -109.6], NE: [41.5, -99.8], NV: [39.3, -116.6],
            NH: [43.7, -71.6], NJ: [40.2, -74.7], NM: [34.4, -106.1], NY: [42.9, -75.5],
            NC: [35.5, -79.4], ND: [47.4, -100.5], OH: [40.3, -82.8], OK: [35.6, -97.5],
            OR: [43.9, -120.6], PA: [40.9, -77.8], RI: [41.7, -71.6], SC: [33.9, -80.9],
            SD: [44.4, -100.2], TN: [35.9, -86.4], TX: [31.5, -99.3], UT: [39.3, -111.7],
            VT: [44.1, -72.7], VA: [37.5, -78.9], WA: [47.4, -120.4], WV: [38.6, -80.6],
            WI: [44.6, -89.7], WY: [43.0, -107.6]
        };

        // Viewport transform applied to the whole map: translate(x, y) scale(k).
        this.view = { k: 1, x: 0, y: 0 };
        this.minZoom = 1;
        this.maxZoom = 8;
        // City markers are sized in CSS pixels, not map units, so they stay
        // legible at every zoom level and on every screen. TIER_DENSITY is the
        // CSS-pixels-per-map-unit at which each tier of city earns its place.
        this.LABEL_PX_MAX = 11;
        this.LABEL_PX_MIN = 6.5;
        this.FONT_UNITS = 10; // must match the font-size in .city-label
        this.TIER_DENSITY = { 1: 0, 2: 0.55, 3: 1.4 };
        this.stateEls = {};   // code -> <path>
        this.pinAnchors = {}; // code -> [x, y] in map coordinates
        this.pendingGuess = null;

        // Touch devices select-then-confirm so a pan can't fire off a guess.
        this.touchMode = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

        this.els = {
            round: document.getElementById('quiz-round'),
            pot: document.getElementById('quiz-pot'),
            target: document.getElementById('quiz-target-state'),
            mapWrapper: document.getElementById('map-svg-wrapper'),
            playerName: document.getElementById('quiz-current-player-name'),
            cardDisplay: document.getElementById('quiz-card-display'),
            overlay: document.getElementById('quiz-overlay'),
            overlayTitle: document.getElementById('quiz-overlay-title'),
            overlayDesc: document.getElementById('quiz-overlay-desc'),
            overlayContent: document.getElementById('quiz-overlay-content'),
            overlayBtn: document.getElementById('quiz-overlay-btn')
        };

        this.els.overlayBtn.onclick = () => this.handleOverlayClick();
        this.loadMap();
        this.buildMapControls();
    }

    normalizeName(name) {
        return String(name || '').toLowerCase().replace(/[^a-z]/g, '');
    }

    codeForStateName(name) {
        return this.normToCode[this.normalizeName(name)] || null;
    }

    get targetCode() {
        return this.targetState ? this.codeForStateName(this.targetState.state) : null;
    }

    // ---------------------------------------------------------------- map ---

    loadMap() {
        try {
            // US_MAP_SVG is provided by us_map_data.js
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(US_MAP_SVG, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            // Set viewBox for proper scaling
            if (!svgElement.getAttribute('viewBox')) {
                svgElement.setAttribute('viewBox', '0 0 959 593');
            }
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svgElement.setAttribute('id', 'quiz-map-svg');
            // Remove browser tooltips (title tags)
            svgElement.querySelectorAll('title').forEach(t => t.remove());

            // Everything the player sees lives inside one <g>, so pan and zoom
            // is a single transform on a single node.
            const viewport = document.createElementNS("http://www.w3.org/2000/svg", "g");
            viewport.setAttribute('id', 'quiz-map-viewport');
            while (svgElement.firstChild) viewport.appendChild(svgElement.firstChild);
            svgElement.appendChild(viewport);

            // Add classes and interaction to state paths
            const states = viewport.querySelectorAll('path, circle');
            states.forEach(state => {
                const classList = state.getAttribute('class')?.split(' ') || [];
                // Check if any class matches a state code in our adjacency list
                const code = classList.find(c => this.adj[c.toUpperCase()])?.toUpperCase();

                if (code) {
                    this.stateEls[code] = state;
                    state.style.cursor = 'pointer';
                    state.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.paintState(state, 'idle');

                    state.onmouseenter = () => {
                        if (this.phase === 'GUESSING' && !this.touchMode) this.paintState(state, 'hover');
                    };
                    state.onmouseleave = () => {
                        if (this.phase === 'GUESSING' && this.pendingGuess !== code) this.paintState(state, 'idle');
                    };
                    state.onclick = () => {
                        if (this.touchMode) return; // handled by the tap recogniser
                        this.commitGuess(code);
                    };
                } else {
                    // Non-interactive elements (borders, separators) should not block clicks
                    state.style.pointerEvents = 'none';
                }
            });

            this.cityLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.cityLayer.setAttribute('id', 'quiz-city-layer');
            this.cityLayer.style.pointerEvents = 'none';
            viewport.appendChild(this.cityLayer);

            this.pinLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.pinLayer.setAttribute('id', 'quiz-pin-layer');
            this.pinLayer.style.pointerEvents = 'none';
            viewport.appendChild(this.pinLayer);

            this.els.mapWrapper.innerHTML = '';
            this.els.mapWrapper.appendChild(svgElement);
            this.mapSvg = svgElement;
            this.viewport = viewport;

            this.buildCities();
            this.applyView();
            this.bindGestures();
        } catch (err) {
            console.error("Failed to parse US Map SVG:", err);
        }
    }

    paintState(el, mode, color) {
        if (mode === 'idle') {
            el.style.fill = 'rgba(40, 40, 45, 0.8)';
            el.style.stroke = 'rgba(212, 175, 55, 0.3)';
            el.style.strokeWidth = '0.5';
            el.style.filter = 'none';
        } else if (mode === 'hover') {
            el.style.fill = 'rgba(212, 175, 55, 0.4)';
            el.style.filter = 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))';
        } else if (mode === 'selected') {
            el.style.fill = color;
            el.style.stroke = '#fff';
            el.style.strokeWidth = '1.5';
            el.style.filter = `drop-shadow(0 0 10px ${color})`;
        } else if (mode === 'target') {
            el.style.fill = 'rgba(16, 185, 129, 0.6)';
            el.style.stroke = '#10b981';
            el.style.strokeWidth = '2';
            el.style.filter = 'none';
        }
    }

    // -------------------------------------------------------------- cities ---

    buildCities() {
        if (typeof US_CITIES === 'undefined') return;

        // Rank 0 is the state's headline city. It gets first refusal on a label
        // slot, so no state is ever left completely unnamed.
        const seen = {};
        const ranks = new Map();
        [...US_CITIES].sort((a, b) => a.t - b.t).forEach(c => {
            ranks.set(c, seen[c.s] ? 1 : 0);
            seen[c.s] = true;
        });

        this.cityMarkers = US_CITIES.map(c => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', 'city-marker');
            g.setAttribute('transform', `translate(${c.x},${c.y})`);
            g.style.display = 'none'; // revealed by the first successful layout

            // Inner group carries the counter-scale, so markers keep a constant
            // on-screen size however far the map is zoomed in.
            const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");

            let dot;
            if (c.c) {
                dot = document.createElementNS("http://www.w3.org/2000/svg", "path");
                dot.setAttribute('d', this.starPath(3.4));
                dot.setAttribute('class', 'city-dot is-capital');
            } else {
                dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute('r', c.t === 1 ? '2.4' : '1.9');
                dot.setAttribute('class', 'city-dot');
            }
            inner.appendChild(dot);

            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute('class', 'city-label' + (c.t === 1 ? ' is-major' : ''));
            label.textContent = c.n;
            inner.appendChild(label);

            g.appendChild(inner);
            this.cityLayer.appendChild(g);
            return { data: c, g, inner, label, rank: ranks.get(c), gap: c.c ? 6 : 5 };
        });

        // The map is hidden while the setup screen is up, so its size isn't
        // known until the quiz is actually on screen.
        if (window.ResizeObserver) {
            new ResizeObserver(() => this.scheduleCityLayout()).observe(this.els.mapWrapper);
        } else {
            window.addEventListener('resize', () => this.scheduleCityLayout());
        }
        this.layoutCities();
    }

    starPath(r) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const rad = (i % 2 === 0) ? r : r * 0.45;
            const a = (Math.PI / 5) * i - Math.PI / 2;
            pts.push(`${(Math.cos(a) * rad).toFixed(2)},${(Math.sin(a) * rad).toFixed(2)}`);
        }
        return 'M' + pts.join('L') + 'Z';
    }

    // Counter-scale every marker and hide labels that would collide. Cheap
    // enough to run when a zoom settles rather than on every pinch frame.
    layoutCities() {
        if (!this.cityMarkers || !this.mapSvg) return;
        const rect = this.mapSvg.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            // Still hidden behind the setup screen — markers stay off until we
            // can measure the map and work out which of them fit.
            this.scheduleCityLayout();
            return;
        }

        // CSS pixels per map unit, after the SVG's own fit and our zoom.
        const fit = Math.min(rect.width / 959, rect.height / 593);
        const density = fit * this.view.k;

        // Labels track the drawn size of the map up to a ceiling: full size on a
        // desktop, small on a phone at fit-to-screen, growing back to full as
        // the player zooms in.
        const labelPx = Math.max(this.LABEL_PX_MIN, Math.min(this.LABEL_PX_MAX, 3 + 7.5 * density));
        const s = labelPx / (this.FONT_UNITS * density);

        this.cityMarkers.forEach(m => {
            m.inner.setAttribute('transform', `scale(${s.toFixed(4)})`);
            m.g.style.display = density >= this.TIER_DENSITY[m.data.t] ? '' : 'none';
        });

        const visible = this.cityMarkers.filter(m => m.g.style.display !== 'none');
        const h = labelPx * 1.35; // glyphs plus the dark halo stroke
        // Nothing may hang off the edge of the map graphic.
        const bounds = [0, 0, 959 * density, 593 * density];
        const overlaps = (a, b) => !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);

        // Dots are reserved first, so a label never sits on top of another city.
        const placed = visible.map(m => {
            const x = m.data.x * density, y = m.data.y * density;
            return [x - 3, y - 3, x + 3, y + 3];
        });

        // Greedy declutter in screen space. Headline cities claim a slot first,
        // and each one works through eight placements before giving up.
        const units = this.FONT_UNITS / labelPx; // CSS px -> label units
        const area = this.stateAreas();
        visible
            // Headline city first, then the landmark cities everyone knows, and
            // within a tier the smallest states go first: they have the least
            // room around them, while a big state can find a slot elsewhere.
            .sort((a, b) => a.rank - b.rank
                || a.data.t - b.data.t
                || (area[a.data.s] || 0) - (area[b.data.s] || 0)
                || a.data.n.length - b.data.n.length)
            .forEach(m => {
                const x = m.data.x * density, y = m.data.y * density;
                const w = m.data.n.length * labelPx * 0.55 + 8;
                const g = m.gap, v = m.gap + h / 2;
                const slots = [
                    { dx: g, dy: 0, anchor: 'start' },
                    { dx: -g, dy: 0, anchor: 'end' },
                    { dx: 0, dy: -v, anchor: 'middle' },
                    { dx: 0, dy: v, anchor: 'middle' },
                    { dx: g * 0.7, dy: -v, anchor: 'start' },
                    { dx: -g * 0.7, dy: -v, anchor: 'end' },
                    { dx: g * 0.7, dy: v, anchor: 'start' },
                    { dx: -g * 0.7, dy: v, anchor: 'end' }
                ];
                const slot = slots.find(sl => {
                    const left = sl.anchor === 'start' ? x + sl.dx
                        : sl.anchor === 'end' ? x + sl.dx - w
                            : x + sl.dx - w / 2;
                    sl.box = [left, y + sl.dy - h / 2, left + w, y + sl.dy + h / 2];
                    if (sl.box[0] < bounds[0] || sl.box[1] < bounds[1] ||
                        sl.box[2] > bounds[2] || sl.box[3] > bounds[3]) return false;
                    return !placed.some(p => overlaps(sl.box, p));
                });

                if (!slot) {
                    m.label.style.display = 'none';
                    return;
                }
                m.label.style.display = '';
                m.label.setAttribute('x', (slot.dx * units).toFixed(2));
                m.label.setAttribute('y', (slot.dy * units).toFixed(2));
                // Inline style, not the presentation attribute: a stylesheet
                // rule would outrank the attribute and pin every label right.
                m.label.style.textAnchor = slot.anchor;
                placed.push(slot.box);
            });
    }

    stateAreas() {
        if (!this._stateAreas) {
            this._stateAreas = {};
            Object.entries(this.stateEls).forEach(([code, el]) => {
                const b = el.getBBox();
                this._stateAreas[code] = b.width * b.height;
            });
        }
        return this._stateAreas;
    }

    // --------------------------------------------------------- pan and zoom ---

    applyView() {
        const { k, x, y } = this.view;
        this.viewport.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${k.toFixed(4)})`);
        if (this.zoomOutBtn) {
            this.zoomOutBtn.disabled = k <= this.minZoom + 0.01;
            this.zoomInBtn.disabled = k >= this.maxZoom - 0.01;
        }
    }

    clampView() {
        const W = 959, H = 593, k = this.view.k;
        this.view.x = Math.min(0, Math.max(W * (1 - k), this.view.x));
        this.view.y = Math.min(0, Math.max(H * (1 - k), this.view.y));
    }

    // Convert a client point into the SVG's own user units (before the viewport
    // transform), so zoom can pivot on whatever the finger is holding.
    clientToMap(clientX, clientY) {
        const ctm = this.mapSvg.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };
        const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
        return { x: p.x, y: p.y };
    }

    zoomAt(nextK, clientX, clientY) {
        const k = Math.min(this.maxZoom, Math.max(this.minZoom, nextK));
        const p = this.clientToMap(clientX, clientY);
        const cx = (p.x - this.view.x) / this.view.k;
        const cy = (p.y - this.view.y) / this.view.k;
        this.view.x = p.x - cx * k;
        this.view.y = p.y - cy * k;
        this.view.k = k;
        this.clampView();
        this.applyView();
        this.scheduleCityLayout();
    }

    panBy(dxClient, dyClient) {
        const a = this.clientToMap(0, 0);
        const b = this.clientToMap(dxClient, dyClient);
        this.view.x += b.x - a.x;
        this.view.y += b.y - a.y;
        this.clampView();
        this.applyView();
    }

    resetView() {
        this.view = { k: 1, x: 0, y: 0 };
        this.applyView();
        this.scheduleCityLayout();
    }

    scheduleCityLayout() {
        clearTimeout(this._cityTimer);
        this._cityTimer = setTimeout(() => this.layoutCities(), 120);
    }

    bindGestures() {
        const svg = this.mapSvg;
        let mode = null, startX = 0, startY = 0, lastX = 0, lastY = 0;
        let startDist = 0, startK = 1, lastTapAt = 0;

        const spread = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        const mid = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });

        svg.addEventListener('touchstart', (e) => {
            this.touchMode = true;
            if (e.touches.length === 1) {
                mode = 'tap';
                startX = lastX = e.touches[0].clientX;
                startY = lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                mode = 'pinch';
                startDist = spread(e.touches);
                startK = this.view.k;
                e.preventDefault();
            }
        }, { passive: false });

        svg.addEventListener('touchmove', (e) => {
            if (mode === 'pinch' && e.touches.length === 2) {
                e.preventDefault();
                const d = spread(e.touches);
                if (startDist > 0) {
                    const m = mid(e.touches);
                    this.zoomAt(startK * (d / startDist), m.x, m.y);
                }
                return;
            }
            if (e.touches.length !== 1) return;
            const t = e.touches[0];
            if (mode === 'tap' && Math.hypot(t.clientX - startX, t.clientY - startY) > 8) mode = 'pan';
            if (mode === 'pan') {
                e.preventDefault();
                this.panBy(t.clientX - lastX, t.clientY - lastY);
                lastX = t.clientX;
                lastY = t.clientY;
            }
        }, { passive: false });

        svg.addEventListener('touchend', () => {
            if (mode === 'tap') {
                const now = Date.now();
                if (now - lastTapAt < 300) {
                    this.zoomAt(this.view.k > 1.05 ? 1 : 2.6, startX, startY);
                    lastTapAt = 0;
                } else {
                    lastTapAt = now;
                    this.handleTapAt(startX, startY);
                }
            }
            mode = null;
        });

        svg.addEventListener('touchcancel', () => { mode = null; });
    }

    handleTapAt(clientX, clientY) {
        if (!this.currentPlayer()) return;
        const el = document.elementFromPoint(clientX, clientY);
        if (!el) return;
        const classList = el.getAttribute('class')?.split(' ') || [];
        const code = classList.find(c => this.adj[c.toUpperCase()])?.toUpperCase();
        if (!code) return;
        this.selectState(code);
    }

    // The confirm button never names the state, so tapping around can't be used
    // to fish for the answer.
    selectState(code) {
        const player = this.currentPlayer();
        if (!player || !this.stateEls[code]) return;
        if (this.pendingGuess && this.stateEls[this.pendingGuess]) {
            this.paintState(this.stateEls[this.pendingGuess], 'idle');
        }
        this.pendingGuess = code;
        this.paintState(this.stateEls[code], 'selected', player.color);
        this.confirmBar.style.display = 'flex';
        this.confirmBtn.style.background = player.color;
    }

    clearSelection() {
        if (this.pendingGuess && this.stateEls[this.pendingGuess]) {
            this.paintState(this.stateEls[this.pendingGuess], 'idle');
        }
        this.pendingGuess = null;
        if (this.confirmBar) this.confirmBar.style.display = 'none';
    }

    buildMapControls() {
        const container = document.getElementById('quiz-map-container');
        if (!container) return;

        const zoom = document.createElement('div');
        zoom.id = 'quiz-zoom-controls';
        zoom.innerHTML = `
            <button type="button" data-act="in" aria-label="Zoom in">+</button>
            <button type="button" data-act="out" aria-label="Zoom out">&minus;</button>
            <button type="button" data-act="reset" aria-label="Reset view">&#9678;</button>
        `;
        zoom.onclick = (e) => {
            const act = e.target.getAttribute && e.target.getAttribute('data-act');
            if (!act) return;
            const r = this.els.mapWrapper.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            if (act === 'in') this.zoomAt(this.view.k * 1.6, cx, cy);
            else if (act === 'out') this.zoomAt(this.view.k / 1.6, cx, cy);
            else this.resetView();
        };
        container.appendChild(zoom);
        this.zoomInBtn = zoom.querySelector('[data-act="in"]');
        this.zoomOutBtn = zoom.querySelector('[data-act="out"]');

        const bar = document.createElement('div');
        bar.id = 'quiz-confirm-bar';
        bar.style.display = 'none';
        bar.innerHTML = `
            <button type="button" id="quiz-cancel-btn" aria-label="Clear selection">&times;</button>
            <button type="button" id="quiz-confirm-btn">CONFIRM GUESS</button>
        `;
        // Sibling of the card, not a child of the map: the map container makes
        // its own stacking context, which would bury the bar behind the card.
        (container.parentElement || container).appendChild(bar);
        this.confirmBar = bar;
        this.confirmBtn = bar.querySelector('#quiz-confirm-btn');
        this.confirmBtn.onclick = () => {
            const code = this.pendingGuess;
            if (!code) return;
            this.clearSelection();
            this.commitGuess(code);
        };
        bar.querySelector('#quiz-cancel-btn').onclick = () => this.clearSelection();
    }

    // ---------------------------------------------------------------- game ---

    initGame(players) {
        this.players = players.map((p, idx) => ({
            ...p,
            id: idx,
            cash: 0, // Starting session earnings at 0
            wins: 0,
            color: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'][idx] || '#fff'
        }));
        this.currentRound = 0;
        this.gameWins = {};
        this.players.forEach(p => this.gameWins[p.id] = 0);

        this.deck = createDeck('STATE');
        // Shuffle deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }

        this.resetView();
        this.startRound();
    }

    startRound() {
        this.currentRound++;
        if (this.currentRound > this.totalRounds) {
            this.endGame();
            return;
        }

        // Skip any card that doesn't resolve to a state on the map instead of
        // stalling the round on it.
        do {
            this.targetState = this.deck.pop();
        } while (this.targetState && !this.codeForStateName(this.targetState.state));

        if (!this.targetState) {
            this.currentRound = this.totalRounds;
            this.endGame();
            return;
        }

        this.pot = this.players.length * 2;
        this.players.forEach(p => p.cash -= 2);

        this.guesses = [];
        this.activePlayerIndex = 0;
        this.phase = 'GUESSING';
        this.inputLocked = false;
        this.clearSelection();

        this.updateHUD();
        // Only show transition for the first player of the round
        this.showTurnTransition(true);
    }

    updateHUD() {
        this.els.round.innerText = `${this.currentRound} / ${this.totalRounds}`;
        this.els.pot.innerText = `$${this.pot}`;
        this.els.target.innerText = this.targetState.state;
        this.els.playerName.innerText = this.players[this.activePlayerIndex].name;
        this.els.playerName.style.color = this.players[this.activePlayerIndex].color;

        // Update Card Display
        this.els.cardDisplay.innerHTML = `
            <div class="card is-state-edition suit-${this.targetState.suit.id}" style="width: 120px; height: 180px; transform: rotate(-5deg); box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 2px solid var(--gold-bright);">
                <div class="card-corner">
                    <div class="corner-val">${this.targetState.val}</div>
                    <div class="corner-suit">${this.targetState.suit.symbol}</div>
                </div>
                <div class="card-center">
                    <div class="card-portrait-container">
                        <img src="${this.targetState.flagUrl}" class="card-portrait" alt="${this.targetState.state}">
                    </div>
                    <div class="card-president-name">${this.targetState.state}</div>
                </div>
            </div>
        `;
    }

    showTurnTransition(isFirst = false) {
        this.els.overlayTitle.innerText = isFirst ? "ROUND " + this.currentRound : this.players[this.activePlayerIndex].name;
        this.els.overlayTitle.style.color = this.players[this.activePlayerIndex].color;
        this.els.overlayDesc.innerText = isFirst ? "PREPARE TO GUESS" : "IT'S YOUR TURN";
        const how = this.touchMode
            ? "Pinch to zoom, drag to move. Tap a state, then hit Confirm. Your pin hides after 2s."
            : "Find it on the map. Your pin hides after 2s.";
        this.els.overlayContent.innerHTML = `
            <div style="text-align: center; color: #ccc; margin-top: 20px;">
                Target: <span style="color: var(--gold-bright); font-weight: bold; font-size: 1.5rem;">${this.targetState.state}</span><br>
                <p style="margin-top: 10px;">${how}</p>
            </div>
        `;
        this.els.overlayBtn.innerText = "START GUESSING";
        this.els.overlay.classList.add('visible');
    }

    handleOverlayClick() {
        this.els.overlay.classList.remove('visible');
        if (this.phase === 'ROUND_OVER') {
            this.startRound();
        } else if (this.phase === 'GAME_OVER') {
            location.hash = '#games';
        }
    }

    currentPlayer() {
        return this.phase === 'GUESSING' && !this.inputLocked
            ? this.players[this.activePlayerIndex] || null
            : null;
    }

    commitGuess(code) {
        const player = this.currentPlayer();
        if (!player) return;

        const dist = this.getDistance(code, this.targetCode);
        this.guesses.push({ playerId: player.id, code: code, dist: dist });

        // Drop a temporary pin
        this.dropPin(code, player.color, true);

        // The pin stays up for two seconds. Input is locked for that whole
        // window, so a second tap can't land on a player who isn't up yet.
        this.inputLocked = true;
        this.activePlayerIndex++;

        if (this.activePlayerIndex < this.players.length) {
            const next = this.players[this.activePlayerIndex];
            setTimeout(() => {
                this.clearTemporaryPins();
                this.els.playerName.innerText = next.name;
                this.els.playerName.style.color = next.color;
                this.inputLocked = false;
                // No overlay here, just update the name and let the next person click
            }, 2000);
        } else {
            this.phase = 'REVEAL';
            setTimeout(() => {
                this.clearTemporaryPins();
                this.resolveRound();
            }, 2000);
        }
    }

    // A bounding-box centre lands offshore for states like Michigan, so fall
    // back to a city inside the state when that happens.
    getPinAnchor(code) {
        if (this.pinAnchors[code]) return this.pinAnchors[code];
        const path = this.stateEls[code];
        if (!path) return null;
        const bbox = path.getBBox();
        let anchor = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
        try {
            if (path.isPointInFill && !path.isPointInFill(new DOMPoint(anchor[0], anchor[1]))) {
                const city = (typeof US_CITIES !== 'undefined') &&
                    US_CITIES.filter(c => c.s === code).sort((a, b) => a.t - b.t)[0];
                if (city) anchor = [city.x, city.y];
            }
        } catch (e) { /* isPointInFill missing on some engines; the bbox will do */ }
        this.pinAnchors[code] = anchor;
        return anchor;
    }

    dropPin(code, color, temporary = false) {
        const anchor = this.getPinAnchor(code);
        if (!anchor) return;

        const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pin.setAttribute("cx", anchor[0]);
        pin.setAttribute("cy", anchor[1]);
        pin.setAttribute("r", (5 / this.view.k).toFixed(2));
        pin.setAttribute("fill", color);
        pin.setAttribute("stroke", "#fff");
        pin.setAttribute("stroke-width", (1.5 / this.view.k).toFixed(2));
        pin.style.filter = `drop-shadow(0 0 5px ${color})`;
        if (temporary) pin.classList.add('temp-pin');
        else pin.classList.add('final-pin');

        this.pinLayer.appendChild(pin);

        // Animation
        pin.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1.5)', opacity: 1 },
            { transform: 'scale(1)', opacity: 1 }
        ], { duration: 300, easing: 'ease-out' });
    }

    clearTemporaryPins() {
        this.pinLayer.querySelectorAll('.temp-pin').forEach(p => p.remove());
    }

    resolveRound() {
        this.phase = 'REVEAL';
        this.clearSelection();

        // Show all guesses
        this.guesses.forEach(g => {
            const p = this.players.find(pl => pl.id === g.playerId);
            this.dropPin(g.code, p.color);
        });

        // Highlight target state
        const targetEl = this.stateEls[this.targetCode];
        if (targetEl) this.paintState(targetEl, 'target');

        // Calculate winners
        const minDist = Math.min(...this.guesses.map(g => g.dist));
        const winners = this.guesses.filter(g => g.dist === minDist);

        const winAmount = Math.floor(this.pot / winners.length);
        const remainder = this.pot % winners.length;

        let winnerText = "";
        winners.forEach((w, idx) => {
            const p = this.players.find(pl => pl.id === w.playerId);
            p.cash += winAmount + (idx < remainder ? 1 : 0);
            p.wins++;
            this.gameWins[p.id]++;
            winnerText += `<span style="color: ${p.color}; font-weight: bold;">${p.name}</span>${idx < winners.length - 1 ? ', ' : ''}`;
        });

        this.phase = 'ROUND_OVER';

        setTimeout(() => {
            this.els.overlayTitle.innerText = winners.length > 1 ? "SPLIT POT!" : "WINNER!";
            this.els.overlayTitle.style.color = winners.length === 1 ? this.players.find(p => p.id === winners[0].playerId).color : "var(--gold-bright)";
            this.els.overlayDesc.innerText = minDist === 0 ? "Perfect Guess!" : `Closest Guess (${this.describeDistance(minDist)})`;

            let html = `<div style="text-align: center; margin-top: 20px;">`;
            html += `<p style="font-size: 1.2rem; color: #fff;">${winnerText} won $${winAmount}${remainder > 0 ? '+' : ''}</p>`;
            html += `<div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 20px;">`;
            this.players.forEach(p => {
                html += `<div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: ${p.color};">
                    <span>${p.name}</span>
                    <span>${this.money(p.cash)} (${this.gameWins[p.id]} Wins)</span>
                </div>`;
            });
            html += `</div></div>`;

            this.els.overlayContent.innerHTML = html;
            this.els.overlayBtn.innerText = this.currentRound < this.totalRounds ? "NEXT ROUND" : "SEE FINAL RESULTS";
            this.els.overlay.classList.add('visible');

            // Reset map colors after delay
            setTimeout(() => {
                Object.values(this.stateEls).forEach(el => this.paintState(el, 'idle'));
                this.pinLayer.querySelectorAll('.final-pin').forEach(p => p.remove());
            }, 3000);
        }, 1500);
    }

    endGame() {
        this.phase = 'GAME_OVER';
        this.clearSelection();
        const sorted = [...this.players].sort((a, b) => this.gameWins[b.id] - this.gameWins[a.id]);
        const overallWinner = sorted[0];

        this.els.overlayTitle.innerText = "GAME OVER";
        this.els.overlayTitle.style.color = "var(--gold-bright)";
        this.els.overlayDesc.innerText = `${overallWinner.name} is the Master of Geography!`;

        let html = `<div style="text-align: center; margin-top: 20px;">`;
        html += `<div style="font-size: 1.5rem; color: ${overallWinner.color}; margin-bottom: 30px; font-weight: bold;">VICTORY</div>`;
        sorted.forEach((p, idx) => {
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 1.1rem; color: ${p.color}; opacity: ${idx === 0 ? 1 : 0.7}">
                <span>${idx + 1}. ${p.name}</span>
                <span>${this.gameWins[p.id]} Wins (${this.money(p.cash)})</span>
            </div>`;
        });
        html += `</div>`;

        this.els.overlayContent.innerHTML = html;
        this.els.overlayBtn.innerText = "BACK TO GAMES";
        this.els.overlay.classList.add('visible');
    }

    // Players ante down from zero, so a running total is often negative:
    // the sign belongs in front of the dollar sign, not after it.
    money(amount) {
        return (amount < 0 ? '-$' : '$') + Math.abs(amount);
    }

    describeDistance(dist) {
        return dist >= 50 ? 'nearest across open water' : `Dist: ${dist}`;
    }

    getDistance(startCode, endCode) {
        if (!startCode || !endCode) return 99;
        if (startCode === endCode) return 0;

        // BFS for shortest path
        const queue = [[startCode, 0]];
        const visited = new Set([startCode]);

        while (queue.length > 0) {
            const [curr, d] = queue.shift();
            if (curr === endCode) return d;

            const neighbors = this.adj[curr] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([neighbor, d + 1]);
                }
            }
        }

        // Alaska and Hawaii border nothing, so no hop count exists. Rank those
        // rounds by real-world distance instead of tying every player at 99.
        const a = this.stateCenters[startCode], b = this.stateCenters[endCode];
        if (!a || !b) return 99;
        return 50 + Math.round(this.haversineKm(a, b) / 500);
    }

    haversineKm([lat1, lon1], [lat2, lon2]) {
        const R = 6371, rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
        const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }
}

// Global instance
window.stateQuiz = new StateQuizGame();
