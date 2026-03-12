document.addEventListener('DOMContentLoaded', () => {
    // Basic Routing Logic
    const routes = {
        '': 'start-page',
        '#start': 'start-page',
        '#menu': 'main-menu',
        '#comics': 'comics',
        '#journals': 'journals',
        '#library-kissinger': 'library-kissinger',
        '#library-carter': 'library-carter',
        '#films': 'films',
        '#games': 'games',
        '#music': 'music',
        '#review-nuclear': 'review-nuclear',
        '#review-genesis': 'review-genesis',
        '#review-leadership': 'review-leadership',
        '#review-ageofai': 'review-ageofai'
    };

    function navigate() {
        const hash = window.location.hash;
        const targetId = routes[hash] || 'start-page';

        document.querySelectorAll('.view').forEach(view => {
            if (view.id === targetId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });
    }

    // Initial load
    navigate();
    
    // Initialize both portraits (Now in Comics view)
    initPortraitGrid(
        'kissinger-portrait', 
        1924, 
        1973, 
        "A World Destroyed", 
        "Comic Book Part 1/4"
    );
    initPortraitGrid(
        'carter-portrait', 
        1925, 
        1976, 
        "The Blood Beneath the Soil", 
        "Comic Book Part 1/4"
    );
    
    initChronicleGrid();
    initMusicPlayer();
    initLibraries();

    // Listen for hash changes
    window.addEventListener('hashchange', navigate);

    // Escape key navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const hash = window.location.hash;
            if (hash === '' || hash === '#start' || hash === '#start-page') {
                return; // Already at home
            } else if (hash === '#menu') {
                window.location.hash = '#start';
            } else {
                // Any other view goes back to menu
                window.location.hash = '#menu';
            }
        }
    });

    function initPortraitGrid(containerId, startYear, specialYear, specialHeading, specialText) {
        const grid = document.getElementById(containerId);
        if (!grid) return;
        
        // Ensure no duplication on re-init
        grid.querySelectorAll('.grid-piece, .corner-cell').forEach(el => el.remove());

        // We assume startYear corresponds to Piece 0
        function createPiece(col, row, pieceIndex) {
            const div = document.createElement('div');
            div.className = 'grid-piece';
            div.style.gridColumn = col;
            div.style.gridRow = row;
            div.dataset.year = startYear + pieceIndex;
            
            // Show year text faintly on hover? In a real grid, pieces might be too small, but let's add title attribute.
            div.title = div.dataset.year;
            
            div.addEventListener('click', () => showInfo(grid, div.dataset.year, specialYear, specialHeading, specialText));
            grid.appendChild(div);
        }

        function createCorner(col, row, poly1, poly2, year1, year2) {
            const cell = document.createElement('div');
            cell.className = 'corner-cell';
            cell.style.gridColumn = col;
            cell.style.gridRow = row;

            const t1 = document.createElement('div');
            t1.className = 'triangle-piece';
            t1.style.clipPath = poly1;
            t1.dataset.year = year1;
            t1.title = year1;
            t1.addEventListener('click', () => showInfo(grid, year1, specialYear, specialHeading, specialText));

            const t2 = document.createElement('div');
            t2.className = 'triangle-piece';
            t2.style.clipPath = poly2;
            t2.dataset.year = year2;
            t2.title = year2;
            t2.addEventListener('click', () => showInfo(grid, year2, specialYear, specialHeading, specialText));

            cell.appendChild(t1);
            cell.appendChild(t2);
            grid.appendChild(cell);
        }

        // Add a Year Display element that show only on hover
        const yearDisplay = document.createElement('div');
        yearDisplay.className = 'hover-year-display';
        yearDisplay.style.position = 'absolute';
        yearDisplay.style.top = '10px';
        yearDisplay.style.left = '10px';
        yearDisplay.style.background = 'rgba(0,0,0,0.8)';
        yearDisplay.style.color = 'var(--red-accent)';
        yearDisplay.style.padding = '5px 10px';
        yearDisplay.style.fontSize = '1.2rem';
        yearDisplay.style.display = 'none';
        yearDisplay.style.zIndex = '100';
        grid.appendChild(yearDisplay);

        grid.addEventListener('mousemove', (e) => {
            const piece = e.target.closest('.grid-piece, .triangle-piece');
            if (piece && piece.dataset.year) {
                yearDisplay.innerText = piece.dataset.year;
                yearDisplay.style.display = 'block';
            } else {
                yearDisplay.style.display = 'none';
            }
        });

        grid.addEventListener('mouseleave', () => {
            yearDisplay.style.display = 'none';
        });

        // Top-Left corner (Years 99 and 0)
        createCorner(1, 1, 'polygon(0 0, 0 100%, 100% 100%)', 'polygon(0 0, 100% 0, 100% 100%)', startYear + 99, startYear + 0);

        // Top Edge (1..23)
        for (let i = 1; i <= 23; i++) createPiece(i + 1, 1, i);

        // Top-Right corner (Years 24 and 25)
        createCorner(25, 1, 'polygon(0 0, 100% 0, 0 100%)', 'polygon(100% 0, 100% 100%, 0 100%)', startYear + 24, startYear + 25);

        // Right Edge (26..48)
        for (let i = 26; i <= 48; i++) createPiece(25, i - 25 + 1, i);

        // Bottom-Right corner (Years 49 and 50)
        createCorner(25, 25, 'polygon(0 0, 100% 0, 100% 100%)', 'polygon(0 0, 0 100%, 100% 100%)', startYear + 49, startYear + 50);

        // Bottom Edge (51..73)
        for (let i = 51; i <= 73; i++) createPiece(24 - (i - 51), 25, i);

        // Bottom-Left corner (Years 74 and 75)
        createCorner(1, 25, 'polygon(100% 0, 100% 100%, 0 100%)', 'polygon(0 0, 100% 0, 0 100%)', startYear + 74, startYear + 75);

        // Left Edge (76..98)
        for (let i = 76; i <= 98; i++) createPiece(1, 24 - (i - 76), i);
    }
});

// Moved showInfo function inside here, or define it with arguments:
// Updated showInfo to blur image and show center text
function showInfo(grid, year, specialYear, specialHeading, specialText) {
    const img = grid.querySelector('.main-portrait-img');
    const illustrationInfo = grid.querySelector('.comic-illustration-info');
    const yearLabel = grid.querySelector('.comic-year-label');
    const textInfo = grid.querySelector('.comic-text-info');
    
    // Legacy support for the bottom overlay if it's still there
    const title = grid.querySelector('.year-title');
    const info = grid.querySelector('.year-info');
    const overlay = grid.querySelector('.info-overlay');
    
    if (!img || !illustrationInfo) return;

    let heading = `Year ${year}`;
    let text = "Illustration coming soon.";

    if (year == specialYear || year === String(specialYear)) {
        heading = specialHeading;
        text = specialText;
    }

    // Central Illustration Overlay Logic
    yearLabel.innerText = heading;
    textInfo.innerText = text;
    
    img.classList.add('blurred');
    illustrationInfo.classList.add('show');

    // Bottom Overlay Logic (if element exists)
    if (title && info && overlay) {
        title.innerText = heading;
        info.innerText = text;
        overlay.classList.add('show');
    }
    
    // Reset after 6 seconds to give time to read
    setTimeout(() => {
        img.classList.remove('blurred');
        illustrationInfo.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }, 6000);
}

function initChronicleGrid() {
    const grid = document.getElementById('chronicle-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    for (let i = 0; i < 250; i++) {
        let year = 1776 + i;
        const div = document.createElement('div');
        div.className = 'chronicle-year';
        div.innerText = year;
        div.title = `Year ${year}`;
        
        let isWar = false;
        let isPres = false;
        
        // Major US Wars
        if ((year >= 1776 && year <= 1783) || // Rev War
            (year >= 1812 && year <= 1815) || // 1812
            (year >= 1846 && year <= 1848) || // Mexican-American
            (year >= 1861 && year <= 1865) || // Civil War
            (year >= 1898 && year <= 1898) || // Spanish-American
            (year >= 1917 && year <= 1918) || // WWI
            (year >= 1941 && year <= 1945) || // WWII
            (year >= 1950 && year <= 1953) || // Korean
            (year >= 1965 && year <= 1973) || // Vietnam
            (year >= 1990 && year <= 1991) || // Gulf
            (year >= 2001 && year <= 2021)    // War on Terror
        ) {
            div.classList.add('symbol-war');
            isWar = true;
        }
        
        // Elections / President Switch (every 4 years from 1789)
        if (year >= 1789 && (year - 1789) % 4 === 0) {
            div.classList.add('symbol-president');
            isPres = true;
        }
        
        div.addEventListener('click', () => {
            document.querySelectorAll('.chronicle-year').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            
            const title = document.getElementById('chronicle-year-title');
            const info = document.getElementById('chronicle-year-info');
            
            title.innerText = `Year ${year}`;
            let details = "Information coming soon.";
            
            let extras = [];
            if (isWar) extras.push("<br><strong>Conflict:</strong> The nation is engaged in war.");
            if (isPres) extras.push("<br><strong>Politics:</strong> Presidential Election / Transition.");
            
            if (extras.length > 0) {
                details += "<br>" + extras.join("");
            }
            
            info.innerHTML = details;
        });
        
        grid.appendChild(div);
    }
}

function initMusicPlayer() {
    const container = document.getElementById('audio-player-container');
    if (!container) return;
    
    const tracks = [
        { file: 'Allmer Music American Portrait A World Destroyed.mp3', title: 'A World Destroyed' },
        { file: 'AllmerMusic Kissinger The Pentarchy .mp3', title: 'The Pentarchy' },
        { file: 'AllmerMusicAmericanPortraitTheLivingAndTheDead.mp3', title: 'The Living And The Dead' },
        { file: 'AllmerMusicCulturalRevolution.mp3', title: 'Cultural Revolution' },
        { file: 'AllmerMusicDesertFire.mp3', title: 'Desert Fire' },
        { file: 'AllmerMusicLandoftheFree.mp3', title: 'Land of the Free' }
    ];

    tracks.forEach(track => {
        const wrap = document.createElement('div');
        wrap.className = 'audio-track-card';
        
        const title = document.createElement('h3');
        title.innerText = track.title;
        title.className = 'audio-title';
        
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = `American Portrait Music/${track.file}`;
        audio.className = 'custom-audio';

        // Styling the audio elements natively across all modern browsers implicitly via standard controls,
        // but we encapsulate in dark themed borders
        
        wrap.appendChild(title);
        wrap.appendChild(audio);
        container.appendChild(wrap);
    });
}

function initLibraries() {
    const kissingerBooks = [
        { year: 2024, title: 'Genesis: Artificial Intelligence, Hope, and the Human Spirit', reviewed: true, reviewId: 'review-genesis' },
        { year: 2022, title: 'Leadership: Six Studies in World Strategy', reviewed: true, reviewId: 'review-leadership' },
        { year: 2021, title: 'The Age of AI: And Our Human Future', reviewed: true, reviewId: 'review-ageofai' },
        { year: 2014, title: 'World Order' },
        { year: 2011, title: 'On China' },
        { year: 2003, title: 'Crisis: The Anatomy of Two Major Foreign Policy Crises' },
        { year: 2003, title: 'Ending the Vietnam War' },
        { year: 2001, title: 'Does America Need a Foreign Policy?' },
        { year: 1999, title: 'Years of Renewal' },
        { year: 1994, title: 'Diplomacy' },
        { year: 1982, title: 'Years of Upheaval' },
        { year: 1979, title: 'White House Years' },
        { year: 1969, title: 'American Foreign Policy, Three Essays' },
        { year: 1965, title: 'The Troubled Partnership' },
        { year: 1961, title: 'The Necessity for Choice' },
        { year: 1957, title: 'Nuclear Weapons and Foreign Policy', reviewed: true, reviewId: 'review-nuclear' },
        { year: 1957, title: 'A World Restored' },
        { year: 1950, title: 'The Meaning of History' }
    ];

    const carterBooks = [
        { year: 2018, title: 'Faith: A Journey for All' },
        { year: 2015, title: 'A Full Life: Reflections at Ninety' },
        { year: 2014, title: 'A Call to Action' },
        { year: 2011, title: 'Through the Year with Jimmy Carter' },
        { year: 2010, title: 'White House Diary' },
        { year: 2009, title: 'We Can Have Peace in the Holy Land' },
        { year: 2008, title: 'A Remarkable Mother' },
        { year: 2007, title: 'Beyond the White House' },
        { year: 2006, title: 'Palestine: Peace Not Apartheid' },
        { year: 2006, title: 'Faith & Freedom' },
        { year: 2005, title: 'Our Endangered Values' },
        { year: 2004, title: 'Sharing Good Times' },
        { year: 2003, title: "The Hornet's Nest" },
        { year: 2001, title: 'Christmas in Plains: Memories' },
        { year: 2001, title: 'An Hour Before Daylight' },
        { year: 1998, title: 'The Virtues of Aging' },
        { year: 1997, title: 'Sources of Strength' },
        { year: 1996, title: 'Living Faith' },
        { year: 1995, title: 'Always a Reckoning' },
        { year: 1994, title: 'An Outdoor Journal' },
        { year: 1993, title: 'Talking Peace' },
        { year: 1992, title: 'Turning Point' },
        { year: 1987, title: 'Everything to Gain' },
        { year: 1985, title: 'The Blood of Abraham' },
        { year: 1984, title: 'Negotiation' },
        { year: 1982, title: 'Keeping Faith: Memoirs of a President' },
        { year: 1977, title: 'A Government as Good as Its People' },
        { year: 1975, title: 'Why Not the Best?' }
    ];

    renderBooks('kissinger-books', kissingerBooks, 'kissinger');
    renderBooks('carter-books', carterBooks, 'carter');

    function renderBooks(containerId, books, authorTag) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        books.forEach(book => {
            const wrap = document.createElement('div');
            wrap.className = 'book-cover';
            wrap.dataset.author = authorTag;
            
            if (book.reviewed) {
                const badge = document.createElement('div');
                badge.className = 'review-badge';
                badge.innerText = 'REVIEWED';
                wrap.appendChild(badge);
                
                wrap.addEventListener('click', () => {
                   window.location.hash = '#' + book.reviewId;
                });
            }

            const year = document.createElement('div');
            year.className = 'book-year';
            year.innerText = book.year;

            const title = document.createElement('div');
            title.className = 'book-title';
            title.innerText = book.title;

            wrap.appendChild(year);
            wrap.appendChild(title);
            container.appendChild(wrap);
        });
    }
}
