/**
 * #ₛ — OE Tattoo numerology study room
 * Soft password gate (sessionStorage). Keyword checked client-side only.
 */
(function () {
    const GATE_KEY = 'oe_nums_unlocked';
    const PASSWORD = 'tomatopizza';

    const MEANINGS = {
        1: {
            title: '1 — Pioneer',
            body: 'Leadership, independence, ignition. Good for bold linework, single motifs, beginnings, and marks that stand alone. Shadow: impatience or isolation.'
        },
        2: {
            title: '2 — Mirror',
            body: 'Partnership, sensitivity, diplomacy. Suits pairs, balance, fine detail, and cooperative energy. Shadow: indecision or over-accommodation.'
        },
        3: {
            title: '3 — Voice',
            body: 'Expression, play, art. Strong for script, florals, music glyphs, and anything that wants to speak. Shadow: scatter or surface-only charm.'
        },
        4: {
            title: '4 — Foundation',
            body: 'Structure, craft, discipline. Aligns with geometry, architecture, grids, and long-wear designs. Shadow: rigidity or fear of change.'
        },
        5: {
            title: '5 — Motion',
            body: 'Freedom, travel, change. Good for animals in motion, maps, waves, and adaptive placements. Shadow: restlessness or unfinished work.'
        },
        6: {
            title: '6 — Hearth',
            body: 'Care, beauty, responsibility. Family marks, botanical care, protective symbols. Shadow: martyrdom or control dressed as care.'
        },
        7: {
            title: '7 — Depth',
            body: 'Study, intuition, mystery. Occult glyphs, solitary animals, night imagery, research-driven pieces. Shadow: withdrawal or over-analysis.'
        },
        8: {
            title: '8 — Power',
            body: 'Ambition, material mastery, cycles of rise. Infinity forms, strong contrast, status pieces. Shadow: force without wisdom.'
        },
        9: {
            title: '9 — Completion',
            body: 'Compassion, endings that seed legacy. Global symbols, memorial work, release imagery. Shadow: clinging to what is finished.'
        },
        11: {
            title: '11 — Vision (Master)',
            body: 'Inspiration channel, nervous brilliance, spiritual leadership. Lightning, stars, twin forms. Needs grounding (pair with 2 or 4 themes).'
        },
        22: {
            title: '22 — Builder (Master)',
            body: 'Large-scale dreams made practical. Architecture of the self, legacy projects, systems. Needs patience and real-world craft.'
        },
        33: {
            title: '33 — Teacher (Master)',
            body: 'Service through love and example. Healing marks, teaching symbols, community art. Heavy vibration — rest matters.'
        }
    };

    const COLORS = {
        1: [{ hex: '#e8e8e8', name: 'White' }, { hex: '#c41e3a', name: 'Red' }, { hex: '#1a1a1a', name: 'Black' }],
        2: [{ hex: '#c0c0c0', name: 'Silver' }, { hex: '#9bb7d4', name: 'Soft blue' }, { hex: '#e8d5e0', name: 'Pearl' }],
        3: [{ hex: '#f4c430', name: 'Yellow' }, { hex: '#ff6b35', name: 'Coral' }, { hex: '#c5b358', name: 'Gold' }],
        4: [{ hex: '#4a5d23', name: 'Forest' }, { hex: '#8b7355', name: 'Earth' }, { hex: '#5c4033', name: 'Umber' }],
        5: [{ hex: '#2e8b57', name: 'Sea green' }, { hex: '#5f9ea0', name: 'Cadet' }, { hex: '#ff7f50', name: 'Motion' }],
        6: [{ hex: '#b76e79', name: 'Rose' }, { hex: '#e8c4c4', name: 'Blush' }, { hex: '#6b4c7a', name: 'Violet' }],
        7: [{ hex: '#4b0082', name: 'Indigo' }, { hex: '#2f4f4f', name: 'Slate' }, { hex: '#c0b283', name: 'Fog gold' }],
        8: [{ hex: '#0a0a0a', name: 'Black' }, { hex: '#d4af37', name: 'Gold' }, { hex: '#1c2526', name: 'Charcoal' }],
        9: [{ hex: '#800020', name: 'Burgundy' }, { hex: '#f5f5dc', name: 'Cream' }, { hex: '#4a1942', name: 'Plum' }],
        11: [{ hex: '#b0e0e6', name: 'Ice' }, { hex: '#e6e6fa', name: 'Lavender' }, { hex: '#fff8dc', name: 'Light' }],
        22: [{ hex: '#36454f', name: 'Charcoal' }, { hex: '#cd7f32', name: 'Bronze' }, { hex: '#2c3e50', name: 'Steel' }],
        33: [{ hex: '#98d8c8', name: 'Mint' }, { hex: '#f8b4d9', name: 'Pink' }, { hex: '#fffdd0', name: 'Cream' }]
    };

    const CRYSTALS = {
        1: { stones: 'Ruby, Garnet, Red Jasper', note: 'Courage, ignition, clear will.' },
        2: { stones: 'Moonstone, Pearl, Blue Lace Agate', note: 'Receptivity, calm partnership.' },
        3: { stones: 'Citrine, Carnelian, Tiger\'s Eye', note: 'Voice, play, creative heat.' },
        4: { stones: 'Hematite, Smoky Quartz, Jade', note: 'Structure, patience, body trust.' },
        5: { stones: 'Turquoise, Amazonite, Aquamarine', note: 'Freedom, travel, flexible nerve.' },
        6: { stones: 'Rose Quartz, Rhodonite, Emerald', note: 'Care, beauty, loyal heart.' },
        7: { stones: 'Amethyst, Labradorite, Clear Quartz', note: 'Insight, solitude, clean signal.' },
        8: { stones: 'Pyrite, Black Tourmaline, Onyx', note: 'Boundaries, resource power.' },
        9: { stones: 'Lapis Lazuli, Bloodstone, Sugilite', note: 'Compassion, release, wide view.' },
        11: { stones: 'Selenite, Celestite, Phenacite', note: 'High signal — ground after use.' },
        22: { stones: 'Obsidian, Petrified Wood, Malachite', note: 'Build slow; protect the plan.' },
        33: { stones: 'Kunzite, Green Aventurine, Danburite', note: 'Service with softness, not drain.' }
    };

    const SUN_SIGNS = [
        { name: 'Capricorn', start: [12, 22], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    function reduceNumber(n, keepMasters = true) {
        n = Math.abs(parseInt(n, 10) || 0);
        while (n > 9) {
            if (keepMasters && (n === 11 || n === 22 || n === 33)) return n;
            n = String(n).split('').reduce((s, d) => s + parseInt(d, 10), 0);
        }
        return n;
    }

    function letterValue(ch) {
        const c = ch.toUpperCase();
        if (c < 'A' || c > 'Z') return 0;
        return ((c.charCodeAt(0) - 65) % 9) + 1;
    }

    function nameNumber(name) {
        const total = name.split('').reduce((s, ch) => s + letterValue(ch), 0);
        return reduceNumber(total, true);
    }

    function lifePathFromDate(isoDate) {
        const digits = isoDate.replace(/\D/g, '').split('').map(Number);
        return reduceNumber(digits.reduce((a, b) => a + b, 0), true);
    }

    function birthdayNumber(isoDate) {
        const day = parseInt(isoDate.split('-')[2], 10);
        return reduceNumber(day, true);
    }

    function personalYear(isoDate, year) {
        const [, m, d] = isoDate.split('-').map(Number);
        return reduceNumber(m + d + year, true);
    }

    function personalMonth(isoDate, year, month) {
        return reduceNumber(personalYear(isoDate, year) + month, true);
    }

    function personalDay(isoDate, year, month, day) {
        return reduceNumber(personalMonth(isoDate, year, month) + day, true);
    }

    function sunSign(isoDate) {
        const [, mm, dd] = isoDate.split('-').map(Number);
        for (const s of SUN_SIGNS) {
            const [sm, sd] = s.start;
            const [em, ed] = s.end;
            if (sm > em) {
                if ((mm === sm && dd >= sd) || (mm === em && dd <= ed) || mm > sm || mm < em) return s.name;
            } else if ((mm === sm && dd >= sd) || (mm === em && dd <= ed) || (mm > sm && mm < em)) {
                return s.name;
            }
        }
        return '—';
    }

    function unlock() {
        sessionStorage.setItem(GATE_KEY, '1');
        document.getElementById('nums-gate').classList.add('nums-hidden');
        document.getElementById('nums-content').classList.remove('nums-hidden');
        initRoom();
    }

    function lock() {
        sessionStorage.removeItem(GATE_KEY);
        document.getElementById('nums-content').classList.add('nums-hidden');
        document.getElementById('nums-gate').classList.remove('nums-hidden');
        const input = document.getElementById('gate-input');
        if (input) {
            input.value = '';
            input.focus();
        }
    }

    function initGate() {
        const form = document.getElementById('gate-form');
        const err = document.getElementById('gate-error');
        if (sessionStorage.getItem(GATE_KEY) === '1') {
            unlock();
            return;
        }
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = (document.getElementById('gate-input').value || '').trim().toLowerCase();
            if (val === PASSWORD) {
                err.textContent = '';
                unlock();
            } else {
                err.textContent = 'Not that key.';
            }
        });
    }

    function renderMeanings() {
        const grid = document.getElementById('meaning-grid');
        grid.innerHTML = Object.keys(MEANINGS)
            .map((k) => {
                const m = MEANINGS[k];
                return `<article class="page-card nums-card"><h3>${m.title}</h3><p>${m.body}</p></article>`;
            })
            .join('');
    }

    function renderColors() {
        const root = document.getElementById('color-chart');
        root.innerHTML = Object.keys(COLORS)
            .map((k) => {
                const swatches = COLORS[k]
                    .map(
                        (c) =>
                            `<div class="swatch-wrap"><div class="swatch" style="background:${c.hex}" title="${c.name}"><span>${c.name}</span></div></div>`
                    )
                    .join('');
                const title = MEANINGS[k] ? MEANINGS[k].title.split('—')[0].trim() : k;
                return `<div style="margin-bottom:1.75rem"><strong style="display:block;margin-bottom:0.55rem;color:var(--text)">${title}</strong><div class="swatch-row">${swatches}</div></div>`;
            })
            .join('');
    }

    function renderCrystals() {
        const root = document.getElementById('crystal-guide');
        root.innerHTML = Object.keys(CRYSTALS)
            .map((k) => {
                const c = CRYSTALS[k];
                const title = MEANINGS[k] ? MEANINGS[k].title : k;
                return `<div class="crystal-item"><h4>${title}</h4><p><strong>${c.stones}</strong> — ${c.note}</p></div>`;
            })
            .join('');
    }

    function renderCalendar(isoDate) {
        const monthInput = document.getElementById('n-month');
        const cal = document.getElementById('cycle-cal');
        const yearLine = document.getElementById('n-year-line');

        if (!isoDate) {
            cal.innerHTML = '<p class="page-note">Set a birth date and calculate to build the cycle grid.</p>';
            yearLine.innerHTML = '';
            return;
        }

        let y;
        let m;
        if (monthInput.value) {
            [y, m] = monthInput.value.split('-').map(Number);
        } else {
            const now = new Date();
            y = now.getFullYear();
            m = now.getMonth() + 1;
            monthInput.value = `${y}-${String(m).padStart(2, '0')}`;
        }

        const py = personalYear(isoDate, y);
        const pm = personalMonth(isoDate, y, m);
        yearLine.innerHTML = `<h4>Personal year ${y}: <span style="color:var(--gold)">${py}</span> · Personal month: <span style="color:var(--gold)">${pm}</span></h4>
            <p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.85rem">${MEANINGS[py] ? MEANINGS[py].body : ''}</p>`;

        const first = new Date(y, m - 1, 1);
        const startPad = first.getDay();
        const daysInMonth = new Date(y, m, 0).getDate();
        const today = new Date();

        const heads = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map((d) => `<div class="cycle-day-head">${d}</div>`)
            .join('');

        let cells = '';
        for (let i = 0; i < startPad; i++) {
            cells += '<div class="cycle-day outside"></div>';
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const pn = personalDay(isoDate, y, m, d);
            const isToday =
                today.getFullYear() === y && today.getMonth() + 1 === m && today.getDate() === d;
            cells += `<div class="cycle-day${isToday ? ' today' : ''}" title="Personal day ${pn}">
                <span class="n">${d}</span>
                <span class="pn">${pn}</span>
            </div>`;
        }

        cal.innerHTML = heads + cells;
    }

    function calculateAll() {
        const iso = document.getElementById('n-birth').value;
        const name = document.getElementById('n-name').value.trim();
        const time = document.getElementById('n-time').value;
        const core = document.getElementById('n-core-results');
        const natal = document.getElementById('n-natal');

        if (!iso) {
            core.classList.remove('nums-hidden');
            core.innerHTML = '<p class="error-text">Birth date is required.</p>';
            return;
        }

        const lp = lifePathFromDate(iso);
        const bd = birthdayNumber(iso);
        const destiny = name ? nameNumber(name) : null;
        const sign = sunSign(iso);
        const now = new Date();
        const py = personalYear(iso, now.getFullYear());

        core.classList.remove('nums-hidden');
        core.innerHTML = `
            <h4>Core profile</h4>
            <p><strong>Life Path:</strong> ${lp} — ${MEANINGS[lp] ? MEANINGS[lp].title : ''}</p>
            <p><strong>Birthday number:</strong> ${bd}</p>
            ${destiny != null ? `<p><strong>Destiny / Expression:</strong> ${destiny}</p>` : '<p><strong>Destiny:</strong> add a name to compute</p>'}
            <p><strong>Personal year ${now.getFullYear()}:</strong> ${py}</p>
            <p style="margin-top:0.75rem;color:var(--muted);font-size:0.9rem">${MEANINGS[lp] ? MEANINGS[lp].body : ''}</p>
        `;

        natal.innerHTML = `
            <h4>Natal sketch</h4>
            <p><strong>Sun sign:</strong> ${sign}</p>
            <p><strong>Birth time:</strong> ${time || 'not given (rising / houses need time + place)'}</p>
            <p><strong>Life Path:</strong> ${lp} · <strong>Birthday:</strong> ${bd}</p>
            <p style="margin-top:0.65rem;color:var(--muted);font-size:0.9rem">
                Use Sun + Life Path as the main theme pair for tattoo concepts.
                For a full chart (Moon, Rising, aspects), export birth data to a dedicated ephemeris tool later.
            </p>
        `;

        renderCalendar(iso);
    }

    function initRoom() {
        renderMeanings();
        renderColors();
        renderCrystals();

        const lockBtn = document.getElementById('nums-lock');
        if (lockBtn) lockBtn.onclick = lock;

        const calc = document.getElementById('n-calc');
        if (calc) calc.onclick = calculateAll;

        const month = document.getElementById('n-month');
        if (month) {
            const now = new Date();
            if (!month.value) {
                month.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }
            month.addEventListener('change', () => {
                const iso = document.getElementById('n-birth').value;
                if (iso) renderCalendar(iso);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', initGate);
})();
