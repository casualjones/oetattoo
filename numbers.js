/**
 * #ₛ — OE Tattoo numerology + natal study room
 * Soft password gate (sessionStorage). Keyword checked client-side only.
 */
(function () {
    const GATE_KEY = 'oe_nums_unlocked';
    const PASSWORD = 'rosequartz';

    const MEANINGS = {
        1: { title: '1 — Pioneer', body: 'Leadership, independence, ignition. Good for bold linework, single motifs, beginnings, and marks that stand alone. Shadow: impatience or isolation.' },
        2: { title: '2 — Mirror', body: 'Partnership, sensitivity, diplomacy. Suits pairs, balance, fine detail, and cooperative energy. Shadow: indecision or over-accommodation.' },
        3: { title: '3 — Voice', body: 'Expression, play, art. Strong for script, florals, music glyphs, and anything that wants to speak. Shadow: scatter or surface-only charm.' },
        4: { title: '4 — Foundation', body: 'Structure, craft, discipline. Aligns with geometry, architecture, grids, and long-wear designs. Shadow: rigidity or fear of change.' },
        5: { title: '5 — Motion', body: 'Freedom, travel, change. Good for animals in motion, maps, waves, and adaptive placements. Shadow: restlessness or unfinished work.' },
        6: { title: '6 — Hearth', body: 'Care, beauty, responsibility. Family marks, botanical care, protective symbols. Shadow: martyrdom or control dressed as care.' },
        7: { title: '7 — Depth', body: 'Study, intuition, mystery. Occult glyphs, solitary animals, night imagery, research-driven pieces. Shadow: withdrawal or over-analysis.' },
        8: { title: '8 — Power', body: 'Ambition, material mastery, cycles of rise. Infinity forms, strong contrast, status pieces. Shadow: force without wisdom.' },
        9: { title: '9 — Completion', body: 'Compassion, endings that seed legacy. Global symbols, memorial work, release imagery. Shadow: clinging to what is finished.' },
        11: { title: '11 — Vision (Master)', body: 'Inspiration channel, nervous brilliance, spiritual leadership. Lightning, stars, twin forms. Needs grounding (pair with 2 or 4 themes).' },
        22: { title: '22 — Builder (Master)', body: 'Large-scale dreams made practical. Architecture of the self, legacy projects, systems. Needs patience and real-world craft.' },
        33: { title: '33 — Teacher (Master)', body: 'Service through love and example. Healing marks, teaching symbols, community art. Heavy vibration — rest matters.' }
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

    const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'];
    const MODALITIES = ['Cardinal', 'Fixed', 'Mutable'];
    const BODIES = [
        { key: 'Sun', body: 'Sun', glyph: '☉' },
        { key: 'Moon', body: 'Moon', glyph: '☽' },
        { key: 'Mercury', body: 'Mercury', glyph: '☿' },
        { key: 'Venus', body: 'Venus', glyph: '♀' },
        { key: 'Mars', body: 'Mars', glyph: '♂' },
        { key: 'Jupiter', body: 'Jupiter', glyph: '♃' },
        { key: 'Saturn', body: 'Saturn', glyph: '♄' },
        { key: 'Uranus', body: 'Uranus', glyph: '♅' },
        { key: 'Neptune', body: 'Neptune', glyph: '♆' },
        { key: 'Pluto', body: 'Pluto', glyph: '♇' }
    ];
    const ASPECTS = [
        { name: 'Conjunction', angle: 0, orb: 8 },
        { name: 'Sextile', angle: 60, orb: 5 },
        { name: 'Square', angle: 90, orb: 6 },
        { name: 'Trine', angle: 120, orb: 6 },
        { name: 'Opposition', angle: 180, orb: 8 }
    ];

    let selectedPlace = null;
    let placeTimer = null;

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
        return reduceNumber(name.split('').reduce((s, ch) => s + letterValue(ch), 0), true);
    }
    function lifePathFromDate(isoDate) {
        const digits = isoDate.replace(/\D/g, '').split('').map(Number);
        return reduceNumber(digits.reduce((a, b) => a + b, 0), true);
    }
    function birthdayNumber(isoDate) {
        return reduceNumber(parseInt(isoDate.split('-')[2], 10), true);
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
    function norm360(x) { x %= 360; return x < 0 ? x + 360 : x; }
    function lonToSign(lon) {
        lon = norm360(lon);
        const i = Math.floor(lon / 30);
        const deg = lon - i * 30;
        return { sign: SIGNS[i], index: i, deg, glyph: SIGN_GLYPH[i], element: ELEMENTS[i % 4], modality: MODALITIES[i % 3], lon };
    }
    function fmtPos(lon) {
        const s = lonToSign(lon);
        const d = Math.floor(s.deg);
        const m = Math.floor((s.deg - d) * 60);
        return s.glyph + ' ' + s.sign + ' ' + d + '°' + String(m).padStart(2, '0') + "'";
    }
    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function zonedTimeToUtc(y, mo, d, hh, mm, timeZone) {
        const utcGuess = Date.UTC(y, mo - 1, d, hh, mm, 0);
        if (!timeZone) return new Date(utcGuess);
        const dtf = new Intl.DateTimeFormat('en-US', {
            timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
        });
        const partsAsUtcMs = (date) => {
            const p = {};
            for (const { type, value } of dtf.formatToParts(date)) p[type] = value;
            const hour = p.hour === '24' ? 0 : +p.hour;
            return Date.UTC(+p.year, +p.month - 1, +p.day, hour, +p.minute, +p.second);
        };
        const offset = partsAsUtcMs(new Date(utcGuess)) - utcGuess;
        return new Date(utcGuess - offset);
    }
    function meanNorthNode(date) {
        const jd = date.getTime() / 86400000 + 2440587.5;
        const T = (jd - 2451545.0) / 36525.0;
        return norm360(125.0445479 - 1934.136261 * T + 0.0020754 * T * T);
    }
    // Geocentric tropical ecliptic longitude (degrees).
    // Astronomy.EclipticLongitude is heliocentric and throws for the Sun.
    function geoLon(bodyName, time) {
        if (bodyName === 'Sun') {
            return norm360(Astronomy.SunPosition(time).elon);
        }
        if (bodyName === 'Moon') {
            return norm360(Astronomy.EclipticGeoMoon(time).lon);
        }
        const vec = Astronomy.GeoVector(bodyName, time, true);
        return norm360(Astronomy.Ecliptic(vec).elon);
    }
    function isRetrograde(bodyName, time) {
        if (bodyName === 'Sun' || bodyName === 'Moon') return false;
        const lon1 = geoLon(bodyName, time);
        const later = Astronomy.MakeTime(new Date(time.date.getTime() + 86400000));
        const lon2 = geoLon(bodyName, later);
        let d = lon2 - lon1;
        while (d > 180) d -= 360;
        while (d < -180) d += 360;
        return d < 0;
    }
    function ramcAndAngles(time, latDeg, lonDeg) {
        const gmstHours = Astronomy.SiderealTime(time);
        const ramcDeg = norm360((gmstHours + lonDeg / 15) * 15);
        const ramc = ramcDeg * Math.PI / 180;
        const ob = Astronomy.e_tilt(time).tobl * Math.PI / 180;
        const lat = latDeg * Math.PI / 180;
        const mc = norm360(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(ob)) * 180 / Math.PI);
        const y = Math.cos(ramc);
        const x = -(Math.sin(ramc) * Math.cos(ob) + Math.tan(lat) * Math.sin(ob));
        const asc = norm360(Math.atan2(y, x) * 180 / Math.PI);
        return { ramcDeg, mc, asc };
    }
    function wholeSignHouse(planetLon, ascLon) {
        const pSign = Math.floor(norm360(planetLon) / 30);
        const aSign = Math.floor(norm360(ascLon) / 30);
        return ((pSign - aSign + 12) % 12) + 1;
    }
    function findAspects(points) {
        const found = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                let d = Math.abs(points[i].lon - points[j].lon);
                if (d > 180) d = 360 - d;
                for (const asp of ASPECTS) {
                    const delta = Math.abs(d - asp.angle);
                    if (delta <= asp.orb) {
                        found.push({ a: points[i].key, b: points[j].key, name: asp.name, orb: delta });
                        break;
                    }
                }
            }
        }
        found.sort((x, y) => x.orb - y.orb);
        return found.slice(0, 18);
    }
    function drawWheel(points, ascLon) {
        const size = 420, cx = 210, cy = 210, rOut = 198, rIn = 118, rHouse = 148;
        const aSign = Math.floor(norm360(ascLon) / 30);
        let svg = '<svg class="natal-wheel" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Natal wheel">';
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="#0b0b0b" stroke="rgba(209,171,91,0.45)" stroke-width="1.2"/>';
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rHouse + '" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>';
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rIn + '" fill="#090909" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>';
        for (let i = 0; i < 12; i++) {
            const signIndex = (aSign + i) % 12;
            const ang1 = (-90 + i * 30) * Math.PI / 180;
            const angM = (-90 + i * 30 + 15) * Math.PI / 180;
            svg += '<line x1="' + (cx + rIn * Math.cos(ang1)) + '" y1="' + (cy + rIn * Math.sin(ang1)) + '" x2="' + (cx + rOut * Math.cos(ang1)) + '" y2="' + (cy + rOut * Math.sin(ang1)) + '" stroke="rgba(255,255,255,0.16)"/>';
            const tx = cx + ((rHouse + rOut) / 2) * Math.cos(angM);
            const ty = cy + ((rHouse + rOut) / 2) * Math.sin(angM);
            svg += '<text x="' + tx + '" y="' + ty + '" text-anchor="middle" dominant-baseline="middle" fill="#d1ab5b" font-size="13">' + SIGN_GLYPH[signIndex] + '</text>';
            const hx = cx + ((rIn + rHouse) / 2) * Math.cos(angM);
            const hy = cy + ((rIn + rHouse) / 2) * Math.sin(angM);
            svg += '<text x="' + hx + '" y="' + hy + '" text-anchor="middle" dominant-baseline="middle" fill="#b2aba0" font-size="9">' + (i + 1) + '</text>';
        }
        points.forEach((p, idx) => {
            const houseFromAsc = (norm360(p.lon) / 30 - aSign + 12) % 12;
            const degInSign = norm360(p.lon) % 30;
            const ang = (-90 + houseFromAsc * 30 + degInSign) * Math.PI / 180;
            const rr = rIn - 18 - (idx % 3) * 10;
            svg += '<text x="' + (cx + rr * Math.cos(ang)) + '" y="' + (cy + rr * Math.sin(ang)) + '" text-anchor="middle" dominant-baseline="middle" fill="#f4f0e8" font-size="12">' + p.glyph + '</text>';
        });
        return svg + '</svg>';
    }
    async function searchPlaces(q) {
        const url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(q) + '&count=6&language=en&format=json';
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
    }
    function renderPlaceSuggest(results) {
        const list = document.getElementById('n-place-suggest');
        if (!results.length) { list.classList.add('nums-hidden'); list.innerHTML = ''; return; }
        list.innerHTML = results.map((r, i) => {
            const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
            return '<li><button type="button" data-i="' + i + '">' + escapeHtml(label) + '</button></li>';
        }).join('');
        list.classList.remove('nums-hidden');
        list.querySelectorAll('button').forEach((btn) => {
            btn.addEventListener('click', () => {
                const r = results[+btn.dataset.i];
                selectedPlace = r;
                document.getElementById('n-place').value = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
                document.getElementById('n-place-meta').textContent = r.latitude.toFixed(3) + '°, ' + r.longitude.toFixed(3) + '° · ' + (r.timezone || 'timezone unknown');
                list.classList.add('nums-hidden');
                list.innerHTML = '';
            });
        });
    }
    function computeNatal(isoDate, timeStr, place) {
        if (typeof Astronomy === 'undefined') return { error: 'Ephemeris library did not load. Check the connection and retry.' };
        const [y, mo, d] = isoDate.split('-').map(Number);
        let hh = 12, mm = 0, hasTime = false;
        if (timeStr) { const parts = timeStr.split(':').map(Number); hh = parts[0]; mm = parts[1] || 0; hasTime = true; }
        const tz = place && place.timezone ? place.timezone : null;
        const utcDate = zonedTimeToUtc(y, mo, d, hh, mm, tz);
        const time = Astronomy.MakeTime(utcDate);
        const planets = BODIES.map((b) => ({
            key: b.key, glyph: b.glyph, lon: geoLon(b.body, time), rx: isRetrograde(b.body, time)
        }));
        planets.push({ key: 'N. Node', glyph: '☊', lon: meanNorthNode(utcDate), rx: false });
        let asc = null, mc = null;
        if (hasTime && place) {
            const angles = ramcAndAngles(time, place.latitude, place.longitude);
            asc = angles.asc; mc = angles.mc;
            planets.push({ key: 'ASC', glyph: 'Asc', lon: asc, rx: false });
            planets.push({ key: 'MC', glyph: 'MC', lon: mc, rx: false });
        }
        const withHouse = planets.map((p) => ({
            ...p, house: asc != null ? wholeSignHouse(p.lon, asc) : null, pos: lonToSign(p.lon)
        }));
        const aspects = findAspects(withHouse.filter((p) => p.key === 'ASC' || !['ASC', 'MC'].includes(p.key)));
        return {
            utcDate,
            localNote: tz ? (isoDate + ' ' + (hasTime ? timeStr : '12:00') + ' ' + tz) : (isoDate + ' ' + (hasTime ? timeStr : '12:00') + ' (no timezone — treated as UTC)'),
            place, hasTime, hasPlace: !!place, asc, mc, planets: withHouse, aspects
        };
    }
    function renderNatal(chart, lp) {
        const natal = document.getElementById('n-natal');
        if (chart.error) { natal.innerHTML = '<p class="error-text">' + escapeHtml(chart.error) + '</p>'; return; }
        const sun = chart.planets.find((p) => p.key === 'Sun');
        const moon = chart.planets.find((p) => p.key === 'Moon');
        const rising = chart.asc != null ? lonToSign(chart.asc) : null;
        let bigThree = '<p><strong>Sun:</strong> ' + fmtPos(sun.lon) + '</p>';
        bigThree += '<p><strong>Moon:</strong> ' + fmtPos(moon.lon) + '</p>';
        bigThree += '<p><strong>Rising:</strong> ' + (rising ? fmtPos(chart.asc) : 'needs birth time + place') + '</p>';
        if (chart.mc != null) bigThree += '<p><strong>Midheaven:</strong> ' + fmtPos(chart.mc) + '</p>';
        bigThree += '<p><strong>Life Path:</strong> ' + lp + '</p>';
        bigThree += '<p class="page-note" style="margin-top:0.6rem;">' + escapeHtml(chart.localNote);
        if (chart.place) bigThree += ' · ' + escapeHtml([chart.place.name, chart.place.admin1, chart.place.country].filter(Boolean).join(', '));
        bigThree += '</p>';
        const rows = chart.planets.filter((p) => !['ASC', 'MC'].includes(p.key)).map((p) =>
            '<tr><td>' + p.glyph + ' ' + p.key + (p.rx ? ' <span class="rx">Rx</span>' : '') + '</td><td>' + fmtPos(p.lon) + '</td><td>' + (p.house != null ? p.house : '—') + '</td><td>' + p.pos.element + ' / ' + p.pos.modality + '</td></tr>'
        ).join('');
        const table = '<table class="natal-table"><thead><tr><th>Body</th><th>Sign</th><th>House</th><th>Tone</th></tr></thead><tbody>' + rows + '</tbody></table>';
        const aspectHtml = chart.aspects.length
            ? '<ul class="aspect-list">' + chart.aspects.map((a) => '<li>' + escapeHtml(a.a) + ' ' + escapeHtml(a.name.toLowerCase()) + ' ' + escapeHtml(a.b) + ' <span>(' + a.orb.toFixed(1) + '°)</span></li>').join('') + '</ul>'
            : '<p class="page-note">No major aspects in orb.</p>';
        const wheel = drawWheel(chart.planets.filter((p) => !['ASC', 'MC'].includes(p.key)), chart.asc != null ? chart.asc : sun.lon);
        natal.innerHTML = '<h4>Natal chart</h4>' + bigThree + '<div class="natal-layout" style="margin-top:1rem;"><div>' + wheel + '</div><div>' + table + '<h4 style="margin-top:1.1rem;">Major aspects</h4>' + aspectHtml + '<p class="page-note" style="margin-top:0.8rem;">Whole-sign houses. Positions from Astronomy Engine (tropical). Mean lunar node. Studio-grade sketch — not a Swiss-ephemeris studio print.</p></div></div>';
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
        if (input) { input.value = ''; input.focus(); }
    }
    function initGate() {
        const form = document.getElementById('gate-form');
        const err = document.getElementById('gate-error');
        if (sessionStorage.getItem(GATE_KEY) === '1') { unlock(); return; }
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = (document.getElementById('gate-input').value || '').trim().toLowerCase();
            if (val === PASSWORD) { err.textContent = ''; unlock(); }
            else err.textContent = 'Not that key.';
        });
    }
    function renderMeanings() {
        document.getElementById('meaning-grid').innerHTML = Object.keys(MEANINGS).map((k) => {
            const m = MEANINGS[k];
            return '<article class="page-card nums-card"><h3>' + m.title + '</h3><p>' + m.body + '</p></article>';
        }).join('');
    }
    function renderColors() {
        document.getElementById('color-chart').innerHTML = Object.keys(COLORS).map((k) => {
            const swatches = COLORS[k].map((c) => '<div class="swatch-wrap"><div class="swatch" style="background:' + c.hex + '" title="' + c.name + '"><span>' + c.name + '</span></div></div>').join('');
            const title = MEANINGS[k] ? MEANINGS[k].title.split('—')[0].trim() : k;
            return '<div style="margin-bottom:1.75rem"><strong style="display:block;margin-bottom:0.55rem;color:var(--text)">' + title + '</strong><div class="swatch-row">' + swatches + '</div></div>';
        }).join('');
    }
    function renderCrystals() {
        document.getElementById('crystal-guide').innerHTML = Object.keys(CRYSTALS).map((k) => {
            const c = CRYSTALS[k];
            const title = MEANINGS[k] ? MEANINGS[k].title : k;
            return '<div class="crystal-item"><h4>' + title + '</h4><p><strong>' + c.stones + '</strong> — ' + c.note + '</p></div>';
        }).join('');
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
        let y, m;
        if (monthInput.value) {
            [y, m] = monthInput.value.split('-').map(Number);
        } else {
            const now = new Date();
            y = now.getFullYear();
            m = now.getMonth() + 1;
            monthInput.value = y + '-' + String(m).padStart(2, '0');
        }
        const py = personalYear(isoDate, y);
        const pm = personalMonth(isoDate, y, m);
        yearLine.innerHTML = '<h4>Personal year ' + y + ': <span style="color:var(--gold)">' + py + '</span> · Personal month: <span style="color:var(--gold)">' + pm + '</span></h4><p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.85rem">' + (MEANINGS[py] ? MEANINGS[py].body : '') + '</p>';
        const first = new Date(y, m - 1, 1);
        const startPad = first.getDay();
        const daysInMonth = new Date(y, m, 0).getDate();
        const today = new Date();
        const heads = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => '<div class="cycle-day-head">' + d + '</div>').join('');
        let cells = '';
        for (let i = 0; i < startPad; i++) cells += '<div class="cycle-day outside"></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const pn = personalDay(isoDate, y, m, d);
            const isToday = today.getFullYear() === y && today.getMonth() + 1 === m && today.getDate() === d;
            cells += '<div class="cycle-day' + (isToday ? ' today' : '') + '" title="Personal day ' + pn + '"><span class="n">' + d + '</span><span class="pn">' + pn + '</span></div>';
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
        const py = personalYear(iso, new Date().getFullYear());
        core.classList.remove('nums-hidden');
        core.innerHTML = '<h4>Core profile</h4><p><strong>Life Path:</strong> ' + lp + ' — ' + (MEANINGS[lp] ? MEANINGS[lp].title : '') + '</p><p><strong>Birthday number:</strong> ' + bd + '</p>' + (destiny != null ? '<p><strong>Destiny / Expression:</strong> ' + destiny + '</p>' : '<p><strong>Destiny:</strong> add a name to compute</p>') + '<p><strong>Personal year ' + new Date().getFullYear() + ':</strong> ' + py + '</p><p style="margin-top:0.75rem;color:var(--muted);font-size:0.9rem">' + (MEANINGS[lp] ? MEANINGS[lp].body : '') + '</p>';
        natal.innerHTML = '<p class="page-note">Casting chart…</p>';
        try { renderNatal(computeNatal(iso, time, selectedPlace), lp); }
        catch (err) { natal.innerHTML = '<p class="error-text">Could not cast the chart. ' + escapeHtml(err.message || String(err)) + '</p>'; }
        renderCalendar(iso);
    }
    function initPlaceSearch() {
        const input = document.getElementById('n-place');
        const list = document.getElementById('n-place-suggest');
        input.addEventListener('input', () => {
            selectedPlace = null;
            document.getElementById('n-place-meta').textContent = '';
            const q = input.value.trim();
            clearTimeout(placeTimer);
            if (q.length < 2) { list.classList.add('nums-hidden'); list.innerHTML = ''; return; }
            placeTimer = setTimeout(async () => {
                try { renderPlaceSuggest(await searchPlaces(q)); }
                catch { list.classList.add('nums-hidden'); }
            }, 350);
        });
        document.addEventListener('click', (e) => { if (!e.target.closest('.place-wrap')) list.classList.add('nums-hidden'); });
    }
    function initRoom() {
        renderMeanings(); renderColors(); renderCrystals(); initPlaceSearch();
        const lockBtn = document.getElementById('nums-lock');
        if (lockBtn) lockBtn.onclick = lock;
        const calc = document.getElementById('n-calc');
        if (calc) calc.onclick = calculateAll;
        const month = document.getElementById('n-month');
        if (month) {
            const now = new Date();
            if (!month.value) month.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
            month.addEventListener('change', () => {
                const iso = document.getElementById('n-birth').value;
                if (iso) renderCalendar(iso);
            });
        }
    }
    document.addEventListener('DOMContentLoaded', initGate);
})();
