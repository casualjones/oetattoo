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
    const PROTECTIVE_NUMBERS = {
        1: { force: 'Sun', symbol: 'Solar Cross', glyph: 'solar-cross', note: 'Centering, balance, and banishing shadows.' },
        2: { force: 'Moon', symbol: 'Hamsa', glyph: 'hamsa', note: 'A hand of blessing and protection from the Evil Eye.' },
        3: { force: 'Jupiter', symbol: 'Pentacle', glyph: 'pentacle', note: 'Five elements held in balance inside an infinite circle.' },
        4: { force: 'Rahu', symbol: 'Triquetra', glyph: 'triquetra', note: 'An unbroken knot used as a Celtic shield.' },
        5: { force: 'Mercury', symbol: 'Eye of Horus', glyph: 'eye', note: 'A watchful amulet associated with divine protection and renewal.' },
        6: { force: 'Venus', symbol: 'Hexagram of Solomon', glyph: 'hexagram', note: 'Interlocking opposites: as above, so below.' },
        7: { force: 'Ketu / Neptune', symbol: 'Bindrune', glyph: 'bindrune', note: 'A custom joining of rune shapes whose meaning is chosen with intention.' },
        8: { force: 'Saturn', symbol: 'Crossed Spears', glyph: 'spears', note: 'A direct boundary: do not pass.' },
        9: { force: 'Mars', symbol: 'Mars Sign', glyph: 'mars', note: 'Warrior energy for assertive protection and banishing.' }
    };
    const SYMBOL_LIBRARY = [
        { kind: 'pentacle', name: 'Pentacle', summary: 'Balance of body, elements, and spirit.', read: 'Start at the top point, then follow the continuous star: the circle gathers the five forces into one field.' },
        { kind: 'solar-cross', name: 'Solar Cross', summary: 'Centering, sun-force, and the four directions.', read: 'Use the center as your still point; the four arms extend attention outward without losing the middle.' },
        { kind: 'mars', name: 'Mars Sign', summary: 'Assertive, martial protection and banishing.', read: 'The circle holds your energy while the rising arrow gives it a clear direction and boundary.' },
        { kind: 'hamsa', name: 'Hamsa', summary: 'Open-hand blessing and watchfulness.', read: 'Read the open palm as “stop” and the central eye as awareness: protection through presence, not fear.' },
        { kind: 'eye', name: 'Eye of Horus', summary: 'A protective eye associated with renewal.', read: 'The outer almond is a field of attention; the pupil marks what you choose to see clearly.' },
        { kind: 'triquetra', name: 'Triquetra', summary: 'An unbroken knot or Celtic shield.', read: 'Trace the three looping arms: there is no loose end, so the image suggests continuity and return.' },
        { kind: 'algiz', name: 'Algiz', summary: 'A rune commonly used as a protection motif.', read: 'The upright stem is a spine; the raised branches resemble alert arms or antlers meeting the world.' },
        { kind: 'bindrune', name: 'Protection bindrune', summary: 'A personal sigil made by joining rune forms.', read: 'Read the shared vertical stem first, then the crossing branches as combined intentions rather than separate letters.' },
        { kind: 'hexagram', name: 'Hexagram', summary: 'Interlocking forces held in balance.', read: 'The upward and downward triangles meet in the center: action and receptivity are held together.' },
        { kind: 'spears', name: 'Crossed Spears', summary: 'A simple psychic boundary: do not pass.', read: 'The crossing point is the decision point; the spearheads turn the simple X into an active guard.' }
    ];
    const SYMBOL_READINGS = Object.fromEntries(SYMBOL_LIBRARY.map((item) => [item.kind, item.read]));
    const BIRTH_MONTHS = {
        1: { name: 'January', motif: 'Guardian Knot', stone: 'Garnet', note: 'Grounding defense against negative intentions.' },
        2: { name: 'February', motif: 'Birth-month talisman', stone: 'Amethyst', note: 'Spiritual security and mental clarity.' },
        3: { name: 'March', motif: 'Birth-month talisman', stone: 'Aquamarine', note: 'Calm, clarity, and steady protection.' },
        4: { name: 'April', motif: 'Sun Sigil', stone: 'Diamond', note: 'Clarity, resilience, and bright defensive energy.' },
        5: { name: 'May', motif: 'Birth-month talisman', stone: 'Emerald', note: 'Heart-centered renewal and protection.' },
        6: { name: 'June', motif: 'Birth-month talisman', stone: 'Pearl', note: 'Soft boundaries and emotional steadiness.' },
        7: { name: 'July', motif: 'Birth-month talisman', stone: 'Ruby', note: 'Vitality, courage, and protective heat.' },
        8: { name: 'August', motif: 'Birth-month talisman', stone: 'Peridot', note: 'Renewal and clearing of heavy energy.' },
        9: { name: 'September', motif: 'Birth-month talisman', stone: 'Sapphire', note: 'Guards against envy and external harm.' },
        10: { name: 'October', motif: 'Moon Eye', stone: 'Opal', note: 'Intuition, reflection, and personal boundaries.' },
        11: { name: 'November', motif: 'Birth-month talisman', stone: 'Topaz', note: 'Warmth, confidence, and clear intention.' },
        12: { name: 'December', motif: 'Birth-month talisman', stone: 'Turquoise', note: 'Traveling protection and honest expression.' }
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
    const ASPECT_MEANINGS = {
        Conjunction: 'Two forces blend and intensify each other.',
        Sextile: 'Two forces cooperate when you choose to use the opening.',
        Square: 'Two forces create friction that asks for practice and integration.',
        Trine: 'Two forces flow easily and may feel natural or familiar.',
        Opposition: 'Two forces pull across an axis and ask for balance.'
    };
    const HOUSE_MEANINGS = [
        'Self, body, appearance, first impression',
        'Money, possessions, values, self-worth',
        'Communication, siblings, learning, local life',
        'Home, family, roots, private foundation',
        'Creativity, pleasure, romance, children, play',
        'Work, health, routines, service, daily craft',
        'Partnerships, contracts, mirrors, committed others',
        'Intimacy, shared resources, grief, transformation',
        'Belief, higher study, travel, meaning, pilgrimage',
        'Career, public role, reputation, direction',
        'Friends, community, networks, future hopes',
        'Rest, dreams, solitude, endings, the unseen'
    ];
    const PLANET_MEANINGS = {
        Sun: 'Identity, vitality, purpose, and the part of you that wants to be seen.',
        Moon: 'Emotional needs, instinct, memory, and the conditions that feel like home.',
        Mercury: 'Thinking, speaking, learning, naming, and making connections.',
        Venus: 'Attraction, pleasure, taste, affection, and what you value.',
        Mars: 'Drive, anger, courage, boundaries, desire, and how you act.',
        Jupiter: 'Growth, faith, generosity, opportunity, and the search for meaning.',
        Saturn: 'Limits, responsibility, patience, fear, mastery, and earned authority.',
        Uranus: 'Breakthrough, disruption, independence, and refusal of stale rules.',
        Neptune: 'Imagination, longing, spirituality, permeability, and uncertainty.',
        Pluto: 'Power, compulsion, deep change, endings, and regeneration.',
        'N. Node': 'A symbolic direction of growth: qualities that become more important with practice.'
    };
    const ELEMENT_MEANINGS = {
        Fire: 'action, courage, expression',
        Earth: 'practicality, steadiness, embodiment',
        Air: 'thought, language, connection',
        Water: 'feeling, intuition, imagination'
    };
    const MODALITY_MEANINGS = {
        Cardinal: 'starting and initiating',
        Fixed: 'stabilizing and sustaining',
        Mutable: 'adapting and translating'
    };
    const DOMAIN_RHYTHMS = {
        love: {
            title: 'Love & connection',
            signal: 'Venus, Moon, and the partnership axis',
            definition: 'This domain describes how affection, emotional safety, reciprocity, and committed connection may become visible in the chart.',
            meaning: 'Venus speaks to attraction and values; the Moon speaks to needs and attachment; the partnership axis adds the mirror of one-to-one relationship.',
            rhythm: 'Move between honest expression and attentive listening. Let closeness grow through repeatable care rather than intensity alone.',
            question: 'What would make connection feel safer, clearer, and more mutual this week?'
        },
        business: {
            title: 'Business & resources',
            signal: 'Saturn, Jupiter, Mercury, and the public axis',
            definition: 'This domain describes how growth, planning, communication, responsibility, money, and public direction can be worked with.',
            meaning: 'Jupiter shows expansion and opportunity; Saturn shows structure and limits; Mercury shows decisions and exchange; the public axis adds vocation and reputation.',
            rhythm: 'Pair expansion with structure: name the opportunity, define the next deliverable, and give the plan a date and boundary.',
            question: 'What is the smallest concrete offer, decision, or system that would make momentum visible?'
        },
        creativity: {
            title: 'Creativity & craft',
            signal: 'Sun, Mercury, Venus, and the fifth-house themes',
            definition: 'This domain describes the conditions that help an idea become an expressive, repeatable practice rather than a passing impulse.',
            meaning: 'The Sun supplies vitality and authorship; Mercury gives language and technique; Venus gives taste and pleasure; the fifth house adds play and making.',
            rhythm: 'Protect a regular practice. Inspiration may open the door, but repetition is what gives the idea a body and a finished form.',
            question: 'What wants to be made before it is judged, optimized, or explained?'
        },
        restoration: {
            title: 'Restoration & inner life',
            signal: 'Moon, Neptune, Saturn, and the twelfth-house themes',
            definition: 'This domain describes recovery, solitude, dream life, boundaries, and the unseen work that keeps the rest of life sustainable.',
            meaning: 'The Moon tracks replenishment and belonging; Neptune adds permeability and imagination; Saturn gives rest a container; the twelfth house marks retreat and release.',
            rhythm: 'Treat recovery as part of the work. Alternate exposure and retreat so sensitivity becomes information instead of overload.',
            question: 'What kind of quiet actually restores you: sleep, solitude, nature, movement, prayer, or making something?'
        }
    };
    const CHART_DATA_STATUS = {
        engine: 'Astronomy Engine 2.1.19',
        zodiac: '12 tropical signs',
        houses: '12 whole-sign houses when birth time and place are available',
        bodies: 'Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and mean lunar node',
        limits: 'Interpretive text is authored locally; it is not a live ephemeris, medical tool, or prediction engine.'
    };
    const HUMAN_DESIGN_TYPES = [
        { name: 'Generator', strategy: 'Respond', signature: 'Satisfaction', notSelf: 'Frustration', purpose: 'Use sustainable life-force by responding to what is genuinely present instead of forcing a beginning from the mind.' },
        { name: 'Manifesting Generator', strategy: 'Respond, then inform', signature: 'Satisfaction', notSelf: 'Frustration (with anger when blocked)', purpose: 'Respond quickly, test through action, and let an efficient multi-step path emerge; informing helps others follow your movement.' },
        { name: 'Projector', strategy: 'Wait for recognition and the right invitation', signature: 'Success', notSelf: 'Bitterness', purpose: 'Guide, focus, and recognize systems or people without trying to sustain the constant work-force expected of a Generator.' },
        { name: 'Manifestor', strategy: 'Inform before initiating', signature: 'Peace', notSelf: 'Anger', purpose: 'Initiate and set change in motion while reducing resistance through clear, timely communication.' },
        { name: 'Reflector', strategy: 'Wait through a lunar cycle for major decisions', signature: 'Surprise', notSelf: 'Disappointment', purpose: 'Reflect the health and quality of the surrounding community; environment and timing are especially important.' }
    ];
    const HUMAN_DESIGN_LINES = [
        { line: '1 — Investigator', purpose: 'Build a secure foundation through research, detail, and a subject you can understand deeply.' },
        { line: '2 — Hermit', purpose: 'Develop natural gifts privately, then allow the right recognition or invitation to draw them outward.' },
        { line: '3 — Experimenter', purpose: 'Learn through direct trial, error, repair, and embodied experience rather than borrowed certainty.' },
        { line: '4 — Opportunist', purpose: 'Create influence through trusted relationships, community, and opportunities that arrive through your network.' },
        { line: '5 — Heretic / Universalizer', purpose: 'Offer practical solutions that others can project onto; clarify expectations and boundaries before accepting the role.' },
        { line: '6 — Role Model', purpose: 'Move through observation and lived perspective toward a mature example that others can see and learn from.' }
    ];
    const HD_DATA_VERSION = 'rave-mandala-64-gates-v1';
    const HD_GATE_ORDER = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];
    const HD_GATE_WIDTH = 360 / 64;
    const HD_GATE_START = 302; // Gate 41 begins at 2° Aquarius in the tropical wheel.
    const HD_CHANNELS = [
        [1, 8, 'Inspiration'], [2, 14, 'The Beat'], [3, 60, 'Mutation'], [4, 63, 'Logic'],
        [5, 15, 'Rhythm'], [6, 59, 'Mating'], [7, 31, 'The Alpha'], [9, 52, 'Concentration'],
        [10, 20, 'Awakening'], [10, 34, 'Exploration'], [10, 57, 'Perfected Form'], [11, 56, 'Curiosity'],
        [12, 22, 'Openness'], [13, 33, 'The Prodigal'], [16, 48, 'The Wavelength'], [17, 62, 'Acceptance'],
        [18, 58, 'Judgment'], [19, 49, 'Synthesis'], [20, 34, 'Charisma'], [20, 57, 'The Brain Wave'],
        [21, 45, 'Money'], [23, 43, 'Structuring'], [24, 61, 'Awareness'], [25, 51, 'Initiation'],
        [26, 44, 'Surrender'], [27, 50, 'Preservation'], [28, 38, 'The Struggle'], [29, 46, 'Discovery'],
        [30, 41, 'Recognition'], [32, 54, 'Transformation'], [35, 36, 'Transitoriness'], [37, 40, 'Community'],
        [39, 55, 'Emoting'], [42, 53, 'Maturation'], [47, 64, 'Abstraction'], [48, 57, 'The Design of Depth']
    ];
    const HD_CENTERS = {
        head: 'Head', ajna: 'Ajna', throat: 'Throat', g: 'G / Identity', heart: 'Heart / Ego',
        spleen: 'Spleen', solar: 'Solar Plexus', sacral: 'Sacral', root: 'Root'
    };
    const HD_GATE_CENTERS = {
        1: 'g', 2: 'g', 7: 'g', 10: 'g', 13: 'g', 15: 'g', 25: 'g', 46: 'g',
        8: 'throat', 12: 'throat', 16: 'throat', 20: 'throat', 23: 'throat', 31: 'throat', 33: 'throat', 35: 'throat', 45: 'throat',
        4: 'ajna', 11: 'ajna', 17: 'ajna', 24: 'ajna', 43: 'ajna', 47: 'ajna', 61: 'head',
        21: 'heart', 26: 'heart', 40: 'heart', 51: 'heart',
        18: 'spleen', 28: 'spleen', 32: 'spleen', 44: 'spleen', 48: 'spleen', 50: 'spleen', 57: 'spleen',
        6: 'solar', 22: 'solar', 30: 'solar', 36: 'solar', 37: 'solar', 49: 'solar', 55: 'solar',
        3: 'sacral', 5: 'sacral', 9: 'sacral', 14: 'sacral', 27: 'sacral', 29: 'sacral', 34: 'sacral', 42: 'sacral', 59: 'sacral',
        19: 'root', 38: 'root', 39: 'root', 41: 'root', 52: 'root', 53: 'root', 54: 'root', 58: 'root', 60: 'root', 62: 'throat', 63: 'head', 64: 'head'
    };
    // The index is the three lines read bottom-to-top as binary: yin = 0, yang = 1.
    const TRIGRAMS = [
        { name: 'Earth', quality: 'receptive, yielding, nourishing' }, // 000
        { name: 'Mountain', quality: 'stillness, boundaries, stopping' }, // 001
        { name: 'Water', quality: 'depth, danger, movement through difficulty' }, // 010
        { name: 'Wind', quality: 'gentle influence, penetration, gradual change' }, // 011
        { name: 'Thunder', quality: 'shock, awakening, decisive movement' }, // 100
        { name: 'Fire', quality: 'clarity, visibility, attention' }, // 101
        { name: 'Lake', quality: 'joy, exchange, openness' }, // 110
        { name: 'Heaven', quality: 'creative force, strength, initiative' } // 111
    ];
    const HEXAGRAM_MATRIX = [
        [[1, 'The Creative'], [10, 'Treading'], [13, 'Fellowship'], [25, 'Innocence'], [44, 'Coming to Meet'], [6, 'Conflict'], [33, 'Retreat'], [12, 'Standstill']],
        [[43, 'Breakthrough'], [58, 'The Joyous'], [49, 'Revolution'], [17, 'Following'], [28, 'Great Excess'], [47, 'Oppression'], [31, 'Influence'], [45, 'Gathering Together']],
        [[14, 'Great Possession'], [38, 'Opposition'], [30, 'The Clinging'], [21, 'Biting Through'], [50, 'The Cauldron'], [64, 'Before Completion'], [56, 'The Wanderer'], [35, 'Progress']],
        [[34, 'Great Power'], [54, 'The Marrying Maiden'], [55, 'Abundance'], [51, 'The Arousing'], [32, 'Duration'], [40, 'Deliverance'], [62, 'Preponderance of the Small'], [16, 'Enthusiasm']],
        [[9, 'The Taming Power of the Small'], [61, 'Inner Truth'], [37, 'The Family'], [42, 'Increase'], [57, 'The Gentle'], [59, 'Dispersion'], [53, 'Development'], [20, 'Contemplation']],
        [[5, 'Waiting'], [60, 'Limitation'], [63, 'After Completion'], [3, 'Difficulty at the Beginning'], [48, 'The Well'], [29, 'The Abysmal'], [39, 'Obstruction'], [8, 'Holding Together']],
        [[26, 'The Taming Power of the Great'], [41, 'Decrease'], [22, 'Grace'], [27, 'Nourishment'], [18, 'Work on What Has Been Spoiled'], [4, 'Youthful Folly'], [52, 'Keeping Still'], [23, 'Splitting Apart']],
        [[11, 'Peace'], [19, 'Approach'], [36, 'Darkening of the Light'], [24, 'Return'], [46, 'Pushing Upward'], [7, 'The Army'], [15, 'Modesty'], [2, 'The Receptive']]
    ];
    const HEXAGRAM_NAMES = Array(64);
    const HEXAGRAM_NUMBERS = Array(64);
    const TRIGRAM_ORDER = [7, 6, 5, 4, 3, 2, 1, 0]; // Heaven, Lake, Fire, Thunder, Wind, Water, Mountain, Earth
    HEXAGRAM_MATRIX.forEach((row, upperPosition) => row.forEach((entry, lowerPosition) => {
        const index = TRIGRAM_ORDER[upperPosition] * 8 + TRIGRAM_ORDER[lowerPosition];
        HEXAGRAM_NUMBERS[index] = entry[0];
        HEXAGRAM_NAMES[index] = entry[1];
    }));
    const ICHING_PROMPTS = [
        'What can you begin without forcing the whole path to be visible?',
        'Where would receptivity be stronger than control today?',
        'What first step would make a difficult beginning less tangled?',
        'What are you ready to learn without pretending to already know?',
        'What is worth waiting for, and how can you prepare while waiting?',
        'Where are you arguing with a situation that needs a clearer boundary?',
        'What responsibility is yours to carry, and what is not yours?',
        'What relationship or practice helps you belong without disappearing?',
        'What small discipline can contain your energy without shrinking it?',
        'Where can you move carefully and still remain honest?',
        'What would balance look like in one ordinary action?',
        'What is paused because it needs rest, not more pressure?',
        'Who could you meet with openness instead of performance?',
        'What resource or gift are you underestimating?',
        'Where could humility make your strength more usable?',
        'What deserves celebration before the next task begins?',
        'What useful guidance is already present in the situation?',
        'What old pattern is asking to be repaired rather than blamed?',
        'What small approach would make a larger change possible?',
        'What are you seeing clearly, and what are you projecting?',
        'What truth needs to be named directly?',
        'What beauty could help you move through a difficult truth?',
        'What needs to be released so the remaining structure can hold?',
        'What return would restore you to your own center?',
        'Where can innocence help you respond without naivety?',
        'What strength needs patient containment?',
        'What does your body or routine ask to be nourished?',
        'Where is excess asking for simplification?',
        'What depth can you cross one careful step at a time?',
        'What needs your full attention rather than scattered effort?',
        'What influence is present even though it is quiet?',
        'What commitment can become a steady rhythm?'
    ];
    const ICHING_ACTIONS = [
        'Make the smallest honest beginning: one message, one sketch, one appointment, or one cleared surface.',
        'Leave one part of the day unfilled so information can arrive before you decide.',
        'Name the difficulty precisely, then choose the next safe step instead of solving everything at once.',
        'Ask one sincere question and let yourself be a beginner in the answer.',
        'Prepare the materials, boundary, or conversation that will make waiting purposeful.',
        'Choose a clean boundary and communicate it without adding a second argument.',
        'Carry only the responsibility that is actually yours; ask for help with the rest.',
        'Create a small exchange: listen, share credit, or let someone meet you without performance.',
        'Repeat one stabilizing practice for ten minutes rather than making a dramatic reset.',
        'Move through the challenge in stages and pause to check what has changed.',
        'Match effort with recovery today; balance is something you practice, not a mood you wait for.',
        'Protect the pause. Let rest, sleep, or silence become part of the solution.',
        'Notice the person or resource already near you before searching farther away.',
        'Use what you have in reach and make one practical improvement to it.',
        'Mark a small win before converting it into another obligation.',
        'Write down the signal, then ground it in a calendar entry or physical action.'
    ];
    const ICHING_EXAMPLES = [
        'In ordinary life, this can look like sending the first email, making the first sketch, or taking one honest step before you feel completely ready.',
        'This may look like listening before fixing, accepting help, or giving a situation room to reveal what it needs.',
        'A difficult beginning might be a new job, a hard conversation, or a project with too many unknowns; choose the next small action.',
        'You may be learning a new skill, asking for feedback, or noticing where certainty is keeping curiosity away.',
        'Waiting can be active: gather information, rest your nervous system, prepare the materials, and do not confuse delay with failure.',
        'A useful boundary might be a clear no, a time limit, or deciding which argument you are no longer required to win.',
        'You could be carrying a family task, team responsibility, or emotional role that needs to be named before it can be shared.',
        'Belonging does not require performing a version of yourself; notice which relationships let you arrive as you are.',
        'A small routine—water, sleep, cleanup, practice, or one finished task—can hold more power than a dramatic reset.',
        'Move carefully in a text message, purchase, commitment, or conversation where speed could create avoidable confusion.',
        'Balance may be as simple as matching effort with rest, speaking and listening, or giving and receiving.',
        'A pause may be your body asking for recovery, not proof that your purpose has disappeared.',
        'Try replacing a polished performance with one sincere question; connection often starts there.',
        'Look at the tool, friendship, skill, or opportunity already within reach before searching for a completely new answer.',
        'Humility can be practical: ask for directions, credit another person, or admit what you still need to learn.',
        'Mark a small win before immediately turning it into the next obligation.',
        'The advice you need may already be present in a repeated detail, a trusted person, or the part of the situation you keep avoiding.',
        'Repair can mean apologizing, updating a boundary, cleaning up a process, or changing a pattern one repetition at a time.',
        'Instead of solving the entire year, choose the next conversation, appointment, or experiment.',
        'Separate what you directly observed from the story your fear added afterward.',
        'Say the true sentence kindly and plainly; ambiguity is not always compassion.',
        'Beauty can be a lamp: music, art, nature, or a familiar ritual can help you stay present while something difficult moves through.',
        'Release an outdated plan, object, role, or expectation that is taking more energy than it returns.',
        'Returning to sleep, food, movement, prayer, art, or a trusted place may restore your center.',
        'Curiosity can interrupt defensiveness; ask what else might be true before deciding what something means.',
        'Containment may be a budget, a calendar, a boundary, or a promise to revisit the question tomorrow.',
        'Nourishment is concrete: eat, hydrate, rest, repair the workspace, or ask what your body has been saying.',
        'Simplify the list, the room, the explanation, or the commitment until the essential thing can breathe.',
        'Cross difficulty in stages: name the risk, find support, take the next safe step, then reassess.',
        'Give one task your full attention instead of giving ten tasks a fragment of you.',
        'Quiet influence may be consistency, tone, example, or the way you make space for someone else.',
        'A rhythm becomes trustworthy when it is small enough to repeat on an ordinary day.'
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
    function universalYear(year) {
        return reduceNumber(year, true);
    }
    function meaningTitle(n) {
        return MEANINGS[n] ? MEANINGS[n].title : String(n);
    }
    function meaningBody(n) {
        return MEANINGS[n] ? MEANINGS[n].body : '';
    }
    function calendarNumberData(number) {
        const palette = COLORS[number] || COLORS[reduceNumber(number, false)] || [];
        const meaning = MEANINGS[number] || MEANINGS[reduceNumber(number, false)];
        const body = meaning ? meaning.body.split(' Shadow:')[0] : 'A day to notice your own rhythm.';
        return { colors: palette, title: meaning ? meaning.title.replace(/^\d+\s+—\s*/, '') : 'Personal rhythm', body };
    }
    function stackBlend(uy, py, pm, pd) {
        const bits = [];
        if (uy === 1 && py === 9) bits.push('The world is in a start year while your personal year is closing. Finish well so the next 1 year has a clear floor.');
        else if (uy === 9 && py === 1) bits.push('Collective endings, personal beginning — plant while others wrap. Don\'t wait for the crowd.');
        else if (uy === py) bits.push('Universal and personal year match (' + uy + '). Your chapter and the culture are on the same beat.');
        else bits.push('Universal ' + uy + ' is the weather. Personal year ' + py + ' is your chapter inside it.');

        if (py === 9 && pm === 1) bits.push('A 1 month inside a 9 year often starts something that completes a larger loop.');
        else if (py === 1 && pm === 9) bits.push('A finishing month inside a pioneer year: close a loop so the new cycle can actually begin.');
        else if (pm === py) bits.push('This month restates the year\'s number — lean into ' + meaningTitle(pm) + '.');
        else bits.push('Month ' + pm + ' is the weather inside year ' + py + '.');

        const dayHint = {
            1: 'Today favors a first move, a clean start, one decisive mark.',
            2: 'Today favors pairing, listening, and fine adjustments.',
            3: 'Today favors saying it, drawing it, showing it — voice and play.',
            4: 'Today favors craft, structure, and showing up for the work.',
            5: 'Today favors motion, a change of scene, or a flexible plan.',
            6: 'Today favors care, beauty, and tending what you already hold.',
            7: 'Today favors study, solitude, and following the quiet signal.',
            8: 'Today favors material decisions, boundaries, and power used cleanly.',
            9: 'Today favors release, completion, and a generous ending.',
            11: 'Today is high-signal — write it down, then ground.',
            22: 'Today is for laying a brick on a long plan, not a sprint.',
            33: 'Today is service through presence. Rest after you give.'
        };
        bits.push(dayHint[pd] || ('Today carries ' + meaningTitle(pd) + '.'));
        return bits.join(' ');
    }
    const DAILY_MISSIONS = {
        1: 'Choose one beginning and give it a visible first step.',
        2: 'Strengthen one relationship by listening without rushing to solve.',
        3: 'Make or say something honestly; let expression be useful before it is perfect.',
        4: 'Complete one small piece of structure that your future self can rely on.',
        5: 'Change one setting, route, or assumption to make room for fresh information.',
        6: 'Tend something living: your body, your home, a relationship, or a creative practice.',
        7: 'Create quiet long enough to notice the signal underneath the noise.',
        8: 'Make one clean decision about time, money, power, or a boundary.',
        9: 'Finish, release, or forgive one small thing that is already complete.',
        11: 'Capture the high-signal idea, then ground it in one practical action.',
        22: 'Lay one durable brick in a plan that deserves patience.',
        33: 'Offer care without abandoning your own limits; rest after giving.'
    };
    function numberSupport(number) {
        const key = CRYSTALS[number] ? number : reduceNumber(number, false);
        return {
            colors: (COLORS[key] || []).map((color) => color.name).join(', ') || 'Choose a grounding color',
            crystal: CRYSTALS[key] ? CRYSTALS[key].stones : 'Choose a stone that supports your intention'
        };
    }
    function renderDailyMission(number) {
        const support = numberSupport(number);
        const mission = DAILY_MISSIONS[number] || DAILY_MISSIONS[reduceNumber(number, false)];
        return '<div class="mission-block"><h5>Daily mission · ' + escapeHtml(meaningTitle(number)) + '</h5><p><strong>Do:</strong> ' + escapeHtml(mission) + '</p><p><strong>Color support:</strong> ' + escapeHtml(support.colors) + '</p><p><strong>Crystal support:</strong> ' + escapeHtml(support.crystal) + '</p></div>';
    }
    function renderStation(isoDate, y, m, d) {
        const el = document.getElementById('n-station');
        if (!el) return;
        if (!isoDate || !d) {
            el.innerHTML = '<h4>Explanation station</h4><p class="page-note">Tap a calendar day. Sequence is universal year · personal year · personal month · personal day.</p>';
            return;
        }
        const uy = universalYear(y);
        const py = personalYear(isoDate, y);
        const pm = personalMonth(isoDate, y, m);
        const pd = personalDay(isoDate, y, m, d);
        const seq = uy + '–' + py + '–' + pm + '–' + pd;
        const dateLabel = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const layers = [
            { lbl: 'Universal year ' + y, n: uy, note: 'Climate for everyone. Calendar year reduced.' },
            { lbl: 'Personal year', n: py, note: 'Your chapter this year (birth month + day + year).' },
            { lbl: 'Personal month', n: pm, note: 'This month\'s weather inside the year (personal year + month).' },
            { lbl: 'Personal day ' + dateLabel, n: pd, note: 'Today\'s move (personal month + day).' }
        ].map((L) => {
            return '<div class="station-layer"><div class="lbl">' + L.lbl + ' · ' + L.n + '</div><h5>' + escapeHtml(meaningTitle(L.n)) + '</h5><p>' + escapeHtml(meaningBody(L.n)) + ' ' + escapeHtml(L.note) + '</p></div>';
        }).join('');
        el.innerHTML = '<h4>Explanation station</h4><p class="page-note">Read outside in: world → year → month → day.</p><div class="station-seq" aria-label="Number sequence">' + seq + '</div><div class="station-layers">' + layers + '</div><p class="station-blend">' + escapeHtml(stackBlend(uy, py, pm, pd)) + '</p>' + renderDailyMission(pd);
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
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function parseIsoDate(isoDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
        const [year, month, day] = isoDate.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? { year, month, day } : null;
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
        if (!res.ok) throw new Error('Place search returned ' + res.status + '.');
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
        let bigThree = '<div class="core-trio"><div class="core-trio-item"><strong>Sun · identity</strong><span>' + fmtPos(sun.lon) + '</span></div><div class="core-trio-item"><strong>Moon · inner weather</strong><span>' + fmtPos(moon.lon) + '</span></div><div class="core-trio-item"><strong>Rising · first impression</strong><span>' + (rising ? fmtPos(chart.asc) : 'needs birth time + place') + '</span></div></div>';
        if (chart.mc != null) bigThree += '<p style="margin-top:0.7rem;"><strong>Midheaven:</strong> ' + fmtPos(chart.mc) + ' · public direction and reputation</p>';
        bigThree += '<p><strong>Life Path:</strong> ' + lp + '</p>';
        bigThree += '<p class="page-note" style="margin-top:0.6rem;">' + escapeHtml(chart.localNote);
        if (chart.place) bigThree += ' · ' + escapeHtml([chart.place.name, chart.place.admin1, chart.place.country].filter(Boolean).join(', '));
        bigThree += '</p>';
        const rows = chart.planets.filter((p) => !['ASC', 'MC'].includes(p.key)).map((p) =>
            '<tr><td>' + p.glyph + ' ' + p.key + (p.rx ? ' <span class="rx">Rx</span>' : '') + '</td><td>' + fmtPos(p.lon) + '</td><td>' + (p.house != null ? '<span title="' + escapeHtml(HOUSE_MEANINGS[p.house - 1]) + '">' + p.house + '</span>' : '—') + '</td><td title="' + escapeHtml(ELEMENT_MEANINGS[p.pos.element] + '; ' + MODALITY_MEANINGS[p.pos.modality]) + '">' + p.pos.element + ' / ' + p.pos.modality + '</td></tr>'
        ).join('');
        const table = '<table class="natal-table"><thead><tr><th>Body</th><th>Sign</th><th>House</th><th>Tone</th></tr></thead><tbody>' + rows + '</tbody></table>';
        const aspectHtml = chart.aspects.length
            ? '<ul class="aspect-list">' + chart.aspects.map((a) => '<li><strong>' + escapeHtml(a.a) + ' ' + escapeHtml(a.name.toLowerCase()) + ' ' + escapeHtml(a.b) + '</strong> <span>(' + a.orb.toFixed(1) + '°)</span> — ' + escapeHtml(ASPECT_MEANINGS[a.name]) + '</li>').join('') + '</ul>'
            : '<p class="page-note">No major aspects in orb.</p>';
        const wheel = drawWheel(chart.planets.filter((p) => !['ASC', 'MC'].includes(p.key)), chart.asc != null ? chart.asc : sun.lon);
        const counted = chart.planets.filter((p) => !['ASC', 'MC', 'N. Node'].includes(p.key));
        const elementCounts = counted.reduce((acc, p) => { acc[p.pos.element] = (acc[p.pos.element] || 0) + 1; return acc; }, {});
        const modalityCounts = counted.reduce((acc, p) => { acc[p.pos.modality] = (acc[p.pos.modality] || 0) + 1; return acc; }, {});
        const dominantElement = Object.keys(elementCounts).sort((a, b) => elementCounts[b] - elementCounts[a])[0];
        const dominantModality = Object.keys(modalityCounts).sort((a, b) => modalityCounts[b] - modalityCounts[a])[0];
        const chartSummary = '<div class="chart-summary"><h4>Plain-language synthesis</h4><p>Your Sun describes the center of your identity, your Moon describes your emotional weather, and your Rising sign describes the way you enter a room. Across the chart, <strong>' + dominantElement + '</strong> is the loudest element (' + elementCounts[dominantElement] + ' placements): ' + ELEMENT_MEANINGS[dominantElement] + '. <strong>' + dominantModality + '</strong> is the loudest rhythm: ' + MODALITY_MEANINGS[dominantModality] + '.</p><details class="data-notes"><summary>What this calculation includes</summary><p><strong>Computed layer:</strong> ' + escapeHtml(CHART_DATA_STATUS.engine) + ' calculates the astronomical positions for the selected date, time, and place.</p><p><strong>Coverage:</strong> ' + escapeHtml(CHART_DATA_STATUS.zodiac) + '; ' + escapeHtml(CHART_DATA_STATUS.houses) + '; ' + escapeHtml(CHART_DATA_STATUS.bodies) + '.</p><p><strong>Interpretive layer:</strong> ' + escapeHtml(CHART_DATA_STATUS.limits) + '</p><p><strong>Future-proofing:</strong> the calculation is extensible because signs, houses, bodies, and meanings are separate tables. Adding a body or interpretation should extend those tables rather than rewrite the renderer. Results can still change if the astronomy library, time-zone data, geocoder, or house system changes, so the engine version and input location should remain part of any saved reading.</p></details></div>';
        const domainRhythms = renderDomainRhythms(chart, lp, dominantElement, dominantModality);
        const guide = '<div class="natal-guide">' +
            '<div><h5>How to read this</h5><p><strong>Planet = what.</strong> A planet describes the part of life or inner function being expressed. <strong>Sign = how.</strong> The zodiac sign gives it a style, tone, and element. <strong>House = where.</strong> The house points to the life area where that planet shows up. Read a placement as planet + sign + house, not as a prediction by itself.</p></div>' +
            '<div><h5>What “Tone” means</h5><p>Tone combines <strong>element</strong> and <strong>modality</strong>. Fire is expressive and initiating; Earth is practical and steady; Air is mental and connective; Water is emotional and intuitive. Cardinal starts, Fixed sustains, and Mutable adapts. For example, “Water / Fixed” suggests a feeling-led style that holds its ground. This is descriptive shorthand, not a score.</p></div>' +
            '<div><h5>What “House” means</h5><p>Houses begin at the Ascendant, or Rising sign. This chart uses whole-sign houses: the entire sign rising at the eastern horizon becomes House 1, the next sign becomes House 2, and so on. Without an accurate birth time and place, houses, Rising, and Midheaven are intentionally left unavailable.</p><ul class="house-key">' + HOUSE_MEANINGS.map((meaning, i) => '<li><strong>' + (i + 1) + '.</strong> ' + meaning + '</li>').join('') + '</ul></div>' +
            '<div><h5>Planets, Rx, and aspects</h5><ul>' + chart.planets.filter((p) => PLANET_MEANINGS[p.key]).map((p) => '<li><strong>' + escapeHtml(p.key) + ':</strong> ' + PLANET_MEANINGS[p.key] + (p.rx ? ' <strong>Rx</strong> means its motion appears retrograde from Earth, often read as a more inward or reflective expression.' : '') + '</li>').join('') + '</ul><p><strong>Aspects</strong> are angular relationships between chart points. Conjunction blends; sextile opens an opportunity; square creates friction that demands work; trine flows easily; opposition creates a polarity to balance. The number in parentheses is the orb, or distance from the exact angle—the smaller it is, the tighter the aspect.</p></div>' +
            '</div>';
        natal.innerHTML = '<h4>Natal chart</h4>' + bigThree + chartSummary + domainRhythms + '<div class="natal-layout" style="margin-top:1rem;"><div>' + wheel + '</div><div>' + table + '<h4 style="margin-top:1.1rem;">Major aspects</h4>' + aspectHtml + '<p class="page-note" style="margin-top:0.8rem;">Whole-sign houses. Positions from Astronomy Engine (tropical). Mean lunar node. Studio-grade sketch — not a Swiss-ephemeris studio print.</p></div></div>' + guide;
    }
    function renderHumanDesignGuide() {
        const target = document.getElementById('human-design-guide');
        if (!target) return;
        const typeCards = HUMAN_DESIGN_TYPES.map((type) => '<article class="hd-card"><h4>' + escapeHtml(type.name) + '</h4><p><strong>Strategy:</strong> ' + escapeHtml(type.strategy) + '</p><p><strong>Signature:</strong> ' + escapeHtml(type.signature) + '</p><p><strong>Not-self theme:</strong> ' + escapeHtml(type.notSelf) + '</p><p><strong>Purpose in this system:</strong> ' + escapeHtml(type.purpose) + '</p></article>').join('');
        const lineCards = HUMAN_DESIGN_LINES.map((line) => '<article class="hd-line-card"><h4>' + escapeHtml(line.line) + '</h4><p>' + escapeHtml(line.purpose) + '</p></article>').join('');
        target.innerHTML = '<p class="page-note">Human Design is now calculated separately from the tropical natal chart. A designation such as <strong>6/4 Generator</strong> combines a Type (Generator) with a two-line Profile (6/4). The first profile line is commonly described as the conscious/personality side; the second as the unconscious/design side. The labels below are study definitions, not scientific or medical classifications.</p><h4 class="hd-subhead">Types: energy and interaction strategy</h4><div class="hd-grid">' + typeCards + '</div><h4 class="hd-subhead">Profile lines: learning and relationship pattern</h4><div class="hd-grid hd-lines">' + lineCards + '</div><div class="hd-note"><strong>What “6/4 Generator” means:</strong> the Generator layer describes a responsive, sustainable work-force strategy; the 6/4 layer adds a role-model arc shaped by observation and a relationship-based network. The Type answers “how do I engage energy?” and the Profile answers “how do I learn, mature, and move through relationships?”</div><details class="data-notes"><summary>Calculation scope and reproducibility</summary><p>The calculator maps birth-moment and design-date planetary positions to the 64-gate wheel, combines conscious and design activations, finds complete channels, derives defined centers, then applies the center hierarchy for Authority, Type, and Profile.</p><p>The lookup is versioned as ' + HD_DATA_VERSION + '. Exact chart parity with other Human Design software may differ if its ephemeris, node choice, gate boundary convention, or 88-day design interval differs. Save the selected place, timezone, input time, engine version, and lookup version with any reading you want to reproduce.</p></details>';
    }
    function humanDesignGate(lon) {
        const offset = (norm360(lon) - HD_GATE_START + 360) % 360;
        const index = Math.min(63, Math.floor(offset / HD_GATE_WIDTH));
        const within = offset - index * HD_GATE_WIDTH;
        return { gate: HD_GATE_ORDER[index], line: Math.min(6, Math.floor(within / (HD_GATE_WIDTH / 6)) + 1) };
    }
    function humanDesignActivations(utcDate) {
        const time = Astronomy.MakeTime(utcDate);
        const points = BODIES.map((body) => ({ body: body.key, lon: geoLon(body.body, time) }));
        points.push({ body: 'N. Node', lon: meanNorthNode(utcDate) });
        const activations = points.map((point) => ({ ...point, ...humanDesignGate(point.lon) }));
        return activations;
    }
    function humanDesignChart(chart) {
        if (!chart || chart.error || !chart.utcDate) return { error: 'Enter a valid birth date before calculating Human Design.' };
        if (!chart.hasTime || !chart.hasPlace) return { error: 'Human Design requires an exact local birth time and a selected birthplace with timezone.' };
        const conscious = humanDesignActivations(chart.utcDate);
        const designDate = new Date(chart.utcDate.getTime() - 88 * 86400000);
        const design = humanDesignActivations(designDate);
        const all = conscious.concat(design.map((activation) => ({ ...activation, design: true })));
        const gates = new Set(all.map((activation) => activation.gate));
        const channels = HD_CHANNELS.filter((channel) => gates.has(channel[0]) && gates.has(channel[1]));
        const defined = new Set();
        channels.forEach((channel) => { defined.add(HD_GATE_CENTERS[channel[0]]); defined.add(HD_GATE_CENTERS[channel[1]]); });
        const has = (center) => defined.has(center);
        const motorCenters = ['sacral', 'heart', 'solar', 'root'];
        const throatMotor = channels.some((channel) => channel.includes(20) && motorCenters.includes(HD_GATE_CENTERS[channel[0]]) || channel.includes(20) && motorCenters.includes(HD_GATE_CENTERS[channel[1]]));
        const type = has('sacral')
            ? (throatMotor ? 'Manifesting Generator' : 'Generator')
            : (throatMotor ? 'Manifestor' : (defined.size ? 'Projector' : 'Reflector'));
        const authority = has('solar') ? 'Emotional / Solar Plexus' : has('sacral') ? 'Sacral' : has('spleen') ? 'Splenic' : has('heart') ? 'Ego' : has('g') && has('throat') ? 'Self-projected' : defined.size ? 'Mental / Environmental' : 'Lunar';
        const profile = (conscious.find((activation) => activation.body === 'Sun') || conscious[0]).line + '/' + (design.find((activation) => activation.body === 'Sun') || design[0]).line;
        return { conscious, design, gates, channels, defined, type, authority, profile, designDate };
    }
    function renderHumanDesign(chart) {
        const target = document.getElementById('human-design-result');
        if (!target) return;
        const result = humanDesignChart(chart);
        if (result.error) { target.innerHTML = '<p class="page-note">' + escapeHtml(result.error) + '</p>'; return; }
        const typeInfo = HUMAN_DESIGN_TYPES.find((type) => type.name === result.type);
        const defined = Object.keys(HD_CENTERS).map((key) => '<span class="hd-center ' + (result.defined.has(key) ? 'defined' : '') + '">' + HD_CENTERS[key] + ' · ' + (result.defined.has(key) ? 'defined' : 'open') + '</span>').join('');
        const channelList = result.channels.length ? result.channels.map((channel) => '<li>' + channel[0] + '–' + channel[1] + ' · ' + escapeHtml(channel[2]) + '</li>').join('') : '<li>No complete channels in this calculation.</li>';
        const gates = result.conscious.map((activation) => activation.body + ' ' + activation.gate + '.' + activation.line).join(' · ');
        const designGates = result.design.map((activation) => activation.body + ' ' + activation.gate + '.' + activation.line).join(' · ');
        target.innerHTML = '<div class="hd-result-head"><h4>' + escapeHtml(result.profile + ' ' + result.type) + '</h4><p><strong>Authority:</strong> ' + escapeHtml(result.authority) + ' · <strong>Strategy:</strong> ' + escapeHtml(typeInfo ? typeInfo.strategy : '') + '</p><p><strong>Signature:</strong> ' + escapeHtml(typeInfo ? typeInfo.signature : '') + ' · <strong>Not-self:</strong> ' + escapeHtml(typeInfo ? typeInfo.notSelf : '') + '</p></div><p class="page-note">This bodygraph uses the birth-moment activations and a design snapshot ' + escapeHtml(result.designDate.toISOString()) + ' (88 days before birth). It is a Human Design calculation, separate from the tropical natal chart.</p><h4 class="hd-subhead">Centers</h4><div class="hd-centers">' + defined + '</div><h4 class="hd-subhead">Defined channels</h4><ul class="hd-channels">' + channelList + '</ul><details class="data-notes"><summary>Activation details and version</summary><p><strong>Personality / conscious:</strong> ' + escapeHtml(gates) + '</p><p><strong>Design / unconscious:</strong> ' + escapeHtml(designGates) + '</p><p><strong>Lookup version:</strong> ' + HD_DATA_VERSION + '. Gate wheel starts at 2° Aquarius and divides the zodiac into 64 equal 5°37′30″ segments.</p><p>This is a transparent study implementation. Exact chart parity with commercial Human Design software may differ if its ephemeris, node choice, gate boundary convention, or 88-day design interval differs.</p></details>';
    }
    function renderDomainRhythms(chart, lifePath, dominantElement, dominantModality) {
        const currentYear = new Date().getFullYear();
        const personal = chart.utcDate ? personalYear(document.getElementById('n-birth').value, currentYear) : lifePath;
        const hasHouses = chart.asc != null;
        const placement = (keys) => chart.planets.filter((p) => keys.includes(p.key)).map((p) => p.pos.sign + (p.house ? ' · H' + p.house : '')).join(', ') || 'not available';
        const data = [
            { key: 'love', placement: placement(['Venus', 'Moon']), extra: hasHouses ? ' Partnership houses are included.' : ' Add birth time and place for house context.' },
            { key: 'business', placement: placement(['Jupiter', 'Saturn', 'Mercury', 'MC']), extra: hasHouses ? ' Midheaven and houses add public-direction context.' : ' Date and time are enough for planetary style; houses need birthplace.' },
            { key: 'creativity', placement: placement(['Sun', 'Mercury', 'Venus']), extra: ' Life Path ' + lifePath + ' adds a numerology thread.' },
            { key: 'restoration', placement: placement(['Moon', 'Neptune', 'Saturn']), extra: ' Personal year ' + personal + ' sets the current chapter.' }
        ];
        return '<section class="chart-summary"><h4>Profile rhythms</h4><p>These are areas to work with, not predictions. They combine the chart’s planetary signatures with your Life Path, dominant ' + dominantElement + ' element, and ' + dominantModality + ' rhythm.</p><div class="rhythm-grid">' + data.map((item) => {
            const domain = DOMAIN_RHYTHMS[item.key];
            const support = numberSupport(lifePath);
            return '<article class="rhythm-card"><h4>' + domain.title + '</h4><p><strong>Definition:</strong> ' + escapeHtml(domain.definition) + '</p><p><strong>Chart signals:</strong> ' + escapeHtml(domain.signal) + '</p><p><strong>Meaning:</strong> ' + escapeHtml(domain.meaning) + '</p><p><strong>In this profile:</strong> ' + escapeHtml(item.placement) + '.' + escapeHtml(item.extra) + '</p><p><strong>Practice:</strong> ' + escapeHtml(domain.rhythm) + '</p><p><strong>Question:</strong> ' + escapeHtml(domain.question) + '</p><p class="rhythm-support"><strong>Profile supports:</strong> ' + escapeHtml(support.colors) + ' · ' + escapeHtml(support.crystal) + '</p></article>';
        }).join('') + '</div></section>';
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
    function symbolSvg(kind, values, seed) {
        if (kind && kind !== 'generated') {
            const shapes = {
                pentacle: '<polygon points="100,24 118,78 176,78 129,112 147,168 100,135 53,168 71,112 24,78 82,78"></polygon><circle class="symbol-ring" cx="100" cy="100" r="76"></circle>',
                'solar-cross': '<circle class="symbol-ring" cx="100" cy="100" r="74"></circle><path d="M100 25V175M25 100H175"></path>',
                mars: '<circle class="symbol-ring" cx="83" cy="117" r="42"></circle><path d="M112 88L166 34M130 34H166V70"></path>',
                hamsa: '<path d="M67 166C53 151 49 126 52 96V48C52 39 65 39 65 49V88V29C65 19 79 19 79 29V86V22C79 12 93 12 93 23V88V30C93 20 107 20 107 31V91C117 72 139 74 139 88C139 102 126 108 121 121C116 135 125 153 133 166Z"></path><circle class="symbol-dot" cx="91" cy="111" r="9"></circle>',
                eye: '<path d="M28 100C60 58 140 58 172 100C140 142 60 142 28 100Z"></path><circle class="symbol-ring" cx="100" cy="100" r="22"></circle><circle class="symbol-dot" cx="100" cy="100" r="7"></circle>',
                triquetra: '<path d="M100 30C77 30 68 58 82 75C52 61 28 79 38 105C47 128 77 125 89 105C76 135 95 157 119 148C141 140 136 109 115 99C145 110 165 91 155 67C146 45 117 52 108 72C119 43 109 30 100 30Z"></path><circle class="symbol-ring" cx="100" cy="100" r="76"></circle>',
                algiz: '<path d="M100 174V42M100 76L58 38M100 76L142 38"></path>',
                bindrune: '<path d="M100 25V175M53 55L147 145M147 55L53 145M68 100H132"></path>',
                hexagram: '<polygon points="100,22 168,140 32,140"></polygon><polygon points="32,60 168,60 100,178"></polygon>',
                spears: '<path d="M35 35L165 165M165 35L35 165"></path><path d="M35 35L48 38M35 35L38 48M165 35L152 38M165 35L162 48"></path>'
            };
            if (!shapes[kind]) return '<div class="symbol-art" role="img" aria-label="Protective symbol unavailable"></div>';
            const guide = SYMBOL_LIBRARY.find((item) => item.kind === kind);
            const title = guide ? guide.name : kind;
            return '<svg class="symbol-art" viewBox="0 0 200 200" role="img" aria-label="' + escapeHtml(title) + ' protective symbol"><title>' + escapeHtml(title) + '</title><path class="symbol-frame" d="M18 100a82 82 0 1 0 164 0a82 82 0 1 0-164 0"></path>' + shapes[kind] + '</svg>';
        }
        const points = values.length ? values : [seed, seed + 3, seed + 6];
        const coords = points.map((value, index) => {
            const angle = (value * 40 + index * 37) * Math.PI / 180;
            const radius = 28 + ((value + index) % 4) * 9;
            return { x: 100 + Math.cos(angle) * radius, y: 100 + Math.sin(angle) * radius };
        });
        const path = coords.map((point, index) => (index ? 'L' : 'M') + point.x.toFixed(1) + ' ' + point.y.toFixed(1)).join(' ');
        const dots = coords.map((point) => '<circle cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="3"></circle>').join('');
        return '<svg class="symbol-art" viewBox="0 0 200 200" role="img" aria-label="Generated protective sigil"><title>Generated protective sigil</title><circle class="symbol-ring" cx="100" cy="100" r="76"></circle><path class="symbol-axis" d="M100 16V184M16 100H184"></path><path d="' + path + '"></path>' + dots.replace(/<circle /g, '<circle class="symbol-dot" ') + '</svg>';
    }
    function nameBindrune(values) {
        const unique = [...new Set(values)];
        const branches = unique.slice(0, 5).map((value, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const y = 48 + (index * 22);
            const length = 24 + (value % 4) * 9;
            return '<path d="M100 ' + y + 'L' + (100 + side * length) + ' ' + (y - 14) + '"></path>';
        }).join('');
        return '<svg class="symbol-art" viewBox="0 0 200 200" role="img" aria-label="Name bindrune"><title>Name bindrune</title><circle class="symbol-ring" cx="100" cy="100" r="76"></circle><path class="symbol-axis" d="M100 18V182"></path><path d="M100 22V178"></path>' + branches + '<path d="M72 100H128"></path></svg>';
    }
    function renderProtectiveSymbols(isoDate, name, birthday, lifePath, destiny) {
        const target = document.getElementById('protective-symbols');
        if (!target) return;
        if (!isoDate) {
            target.innerHTML = '<div class="result-block"><p class="page-note">Enter a birth date above, then Calculate all to reveal your combination.</p></div>';
            return;
        }
        const parsed = parseIsoDate(isoDate);
        if (!parsed) {
            target.innerHTML = '<div class="result-block"><p class="error-text">That birth date is not valid. Please choose a real calendar date.</p></div>';
            return;
        }
        const month = BIRTH_MONTHS[parsed.month];
        const number = PROTECTIVE_NUMBERS[birthday] || PROTECTIVE_NUMBERS[reduceNumber(birthday, false)] || PROTECTIVE_NUMBERS[reduceNumber(lifePath, false)];
        const nameValues = name ? name.toUpperCase().replace(/[^A-Z]/g, '').split('').map(letterValue) : [];
        const path = nameValues.length ? nameValues.join(' · ') : 'Add a full name to generate a custom path';
        const nameSummary = name
            ? '<strong>' + escapeHtml(name) + '</strong> becomes a continuous numeric path (' + path + ') for a Rose Cross-style sigil.'
            : 'Your name layer is waiting. Add a full name to generate a unique numeric path for a Rose Cross-style sigil.';
        const nameArt = nameBindrune(nameValues.length ? nameValues : [birthday, parsed.month]);
        const monthKind = month.motif === 'Sun Sigil' ? 'solar-cross' : month.motif === 'Moon Eye' ? 'eye' : 'pentacle';
        target.innerHTML =
            '<div class="symbol-result"><h3>Birthdate shield · ' + birthday + '</h3>' + symbolSvg(number.glyph) + '<p><strong>' + escapeHtml(number.symbol) + '</strong> · ' + escapeHtml(number.force) + '</p><p>' + escapeHtml(number.note) + ' This uses your single-digit birthday number' + (birthday !== lifePath ? ' and sits alongside Life Path ' + lifePath : '') + '.</p><p class="symbol-reading"><strong>Read it:</strong> ' + escapeHtml(SYMBOL_READINGS[number.glyph] || 'Notice the main shape, its center, and the direction of its lines.') + '</p></div>' +
            '<div class="symbol-result"><h3>Birth-month amulet · ' + escapeHtml(month.name) + '</h3>' + symbolSvg(monthKind) + '<p><strong>' + escapeHtml(month.motif) + '</strong> · ' + escapeHtml(month.stone) + '</p><p>' + escapeHtml(month.note) + ' Treat the stone as a physical reminder of the protection you want to practice.</p><p class="symbol-reading"><strong>Read it:</strong> ' + escapeHtml(SYMBOL_READINGS[monthKind]) + '</p></div>' +
            '<div class="symbol-result"><h3>Name sigil · ' + (destiny != null ? 'Expression ' + destiny : 'custom') + '</h3>' + nameArt + '<p>' + nameSummary + '</p><p class="symbol-path" aria-label="Name numeric path">' + escapeHtml(path) + '</p><p>The Witch\'s Knot can frame the finished mark as a binding boundary around your name and birthdate.</p><p class="symbol-reading"><strong>Read it:</strong> Follow the central stem first, then notice which branches repeat or reach farther. The pattern is a personal mnemonic, not a fixed translation.</p></div>';
    }
    function renderSymbolLibrary() {
        const target = document.getElementById('symbol-library');
        if (!target) return;
        target.innerHTML = SYMBOL_LIBRARY.map((item) => '<article class="symbol-reference">' + symbolSvg(item.kind) + '<div><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.summary) + '</p><p class="symbol-reading"><strong>Look for:</strong> ' + escapeHtml(item.read) + '</p><div class="symbol-tags"><span class="symbol-tag">' + (item.kind === 'algiz' || item.kind === 'bindrune' ? 'rune family' : 'protective glyph') + '</span></div></div></article>').join('');
    }
    function renderCalendar(isoDate, selectDay) {
        const monthInput = document.getElementById('n-month');
        const cal = document.getElementById('cycle-cal');
        const yearLine = document.getElementById('n-year-line');
        if (!isoDate) {
            cal.innerHTML = '<p class="page-note">Set a birth date and calculate to build the cycle grid.</p>';
            yearLine.innerHTML = '';
            renderStation(null);
            renderAstroRhythm(null);
            renderIChing(null);
            return;
        }
        const parsed = parseIsoDate(isoDate);
        if (!parsed) {
            cal.innerHTML = '<p class="error-text">Choose a valid birth date before building the calendar.</p>';
            yearLine.innerHTML = '';
            renderStation(null);
            renderAstroRhythm(null);
            renderIChing(null);
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
        const uy = universalYear(y);
        const py = personalYear(isoDate, y);
        const pm = personalMonth(isoDate, y, m);
        yearLine.innerHTML = '<h4>Universal year ' + y + ': <span style="color:var(--gold)">' + uy + '</span> · Personal year: <span style="color:var(--gold)">' + py + '</span> · Personal month: <span style="color:var(--gold)">' + pm + '</span></h4><p style="margin:0.35rem 0 0;color:var(--muted);font-size:0.85rem">' + (MEANINGS[py] ? MEANINGS[py].body : '') + '</p>';
        const first = new Date(y, m - 1, 1);
        const startPad = first.getDay();
        const daysInMonth = new Date(y, m, 0).getDate();
        const today = new Date();
        const todayHere = today.getFullYear() === y && today.getMonth() + 1 === m;
        let picked = selectDay || (todayHere ? today.getDate() : 1);
        if (picked > daysInMonth) picked = daysInMonth;
        const heads = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => '<div class="cycle-day-head">' + d + '</div>').join('');
        let cells = '';
        for (let i = 0; i < startPad; i++) cells += '<div class="cycle-day outside" aria-hidden="true"></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const pn = personalDay(isoDate, y, m, d);
            const dayData = calendarNumberData(pn);
            const colorNames = dayData.colors.map((color) => color.name).join(' · ');
            const colorDots = dayData.colors.map((color) => '<span class="cycle-color" style="background:' + escapeHtml(color.hex) + '" aria-hidden="true"></span>').join('');
            const isToday = todayHere && today.getDate() === d;
            const isSel = d === picked;
            cells += '<button type="button" class="cycle-day' + (isToday ? ' today' : '') + (isSel ? ' selected' : '') + '" data-day="' + d + '" aria-pressed="' + (isSel ? 'true' : 'false') + '" aria-label="' + escapeHtml('Day ' + d + ', personal day ' + pn + ', ' + dayData.title + '. Colors: ' + colorNames) + '" title="' + escapeHtml(dayData.title + ' · ' + colorNames) + '"><span class="cycle-day-top"><span class="n">Day ' + d + '</span><span class="pn">' + pn + '</span></span><span class="cycle-meaning">' + escapeHtml(dayData.title) + '</span><span class="cycle-colors" aria-label="Colors: ' + escapeHtml(colorNames) + '">' + colorDots + '</span><span class="cycle-color-names">' + escapeHtml(colorNames) + '</span><span class="cycle-hint">' + escapeHtml(dayData.body) + '</span></button>';
        }
        cal.innerHTML = heads + cells;
        cal.querySelectorAll('button.cycle-day').forEach((btn) => {
            btn.addEventListener('click', () => renderCalendar(isoDate, +btn.dataset.day));
        });
        renderStation(isoDate, y, m, picked);
        renderAstroRhythm(isoDate, y);
        renderIChing(isoDate, y, m, picked);
    }
    function renderIChing(isoDate, year, month, day) {
        const target = document.getElementById('iching-result');
        if (!target) return;
        if (!isoDate || !year || !month || !day) {
            target.innerHTML = '<p class="page-note">Choose a calendar day after calculating your birth date.</p>';
            return;
        }
        const name = document.getElementById('n-name').value.trim();
        const nameSeed = name.split('').reduce((sum, ch) => sum + letterValue(ch), 0);
        const digits = (isoDate.replace(/\D/g, '') + year + month + day).split('').reduce((sum, digit) => sum + Number(digit), 0);
        const seed = digits + nameSeed + personalDay(isoDate, year, month, day);
        const lines = Array.from({ length: 6 }, (_, index) => ((seed + index * 7 + nameSeed) % 2));
        const changing = lines.map((line, index) => ((seed + index * 11 + nameSeed) % 5 === 0));
        const lowerIndex = lines.slice(0, 3).reduce((sum, line, index) => sum + line * (2 ** index), 0);
        const upperIndex = lines.slice(3).reduce((sum, line, index) => sum + line * (2 ** index), 0);
        const hexIndex = upperIndex * 8 + lowerIndex;
        const hexName = HEXAGRAM_NAMES[hexIndex] || 'A changing pattern';
        const hexNumber = HEXAGRAM_NUMBERS[hexIndex] || 0;
        const changedLines = lines.map((line, index) => changing[index] ? 1 - line : line);
        const changedLower = changedLines.slice(0, 3).reduce((sum, line, index) => sum + line * (2 ** index), 0);
        const changedUpper = changedLines.slice(3).reduce((sum, line, index) => sum + line * (2 ** index), 0);
        const changedIndex = changedUpper * 8 + changedLower;
        const changedName = HEXAGRAM_NAMES[changedIndex] || 'A new pattern';
        const changedNumber = HEXAGRAM_NUMBERS[changedIndex] || 0;
        const lineHtml = lines.slice().reverse().map((line, reversedIndex) => {
            const index = 5 - reversedIndex;
            const position = index + 1;
            const positionName = ['bottom / beginning', 'inner / response', 'threshold', 'outer / action', 'visible result', 'top / completion'][index];
            return '<div class="iching-line ' + (line ? 'solid' : 'broken') + (changing[index] ? ' changing' : '') + '" title="Line ' + position + ': ' + positionName + '">' + '<span class="line-number">' + position + '</span>' + (changing[index] ? '<em>change</em>' : '') + '</div>';
        }).join('');
        const lower = TRIGRAMS[lowerIndex];
        const upper = TRIGRAMS[upperIndex];
        const changingText = changing.some(Boolean)
            ? 'Changing lines mark where the image is moving today; read them as invitations to respond, not guarantees.'
            : 'No changing lines were selected, so let the primary image describe the quality to practice today.';
        const changingCount = changing.filter(Boolean).length;
        const pattern = lines.map((line) => line ? 'yang' : 'yin').join(' · ');
        const changedPattern = changedLines.map((line) => line ? 'yang' : 'yin').join(' · ');
        const method = 'The six lines are a deterministic study pattern, not a traditional coin or yarrow-cast simulation. It combines the birth date, selected date, personal day, and name values so the same inputs return the same image. The graphic is read from the bottom upward: solid is yang (1), broken is yin (0), and the first three lines form the lower trigram while the last three form the upper trigram. ' + (changingCount ? changingCount + ' line' + (changingCount === 1 ? ' is' : 's are') + ' marked for movement.' : 'No lines are marked for movement today.');
        const primaryQuestion = ICHING_PROMPTS[hexIndex % ICHING_PROMPTS.length];
        const secondQuestion = ICHING_PROMPTS[(hexIndex + 8) % ICHING_PROMPTS.length];
        const thirdQuestion = ICHING_PROMPTS[(hexIndex + 16) % ICHING_PROMPTS.length];
        const synthesis = lower.name + ' below meets ' + upper.name + ' above: begin with ' + lower.quality.split(',')[0] + ', then let that quality shape how you meet ' + upper.quality.split(',')[0] + '.';
        const action = ICHING_ACTIONS[hexIndex % ICHING_ACTIONS.length];
        const changedSummary = changing.some(Boolean)
            ? 'The moving line' + (changingCount === 1 ? '' : 's') + ' show where today’s pattern is not static. Read the primary hexagram as the situation, then the changed hexagram as the direction created by responding.'
            : 'With no moving lines, stay with the primary image. The practice is depth and consistency rather than chasing a second answer.';
        target.innerHTML = '<div class="iching-result"><div><div class="iching-lines" aria-label="Six-line hexagram">' + lineHtml + '</div><p class="page-note" style="margin-top:0.8rem;text-align:center;">Lines are read bottom to top. Solid = yang / outward action · broken = yin / receptive space · light line = changing.</p><p class="page-note" style="text-align:center;">Line 1 begins the situation; line 6 shows how it reaches the wider view.</p><div class="iching-reading"><strong>Line pattern</strong><span>' + escapeHtml(pattern) + '</span><small>Changing lines flip in the transformed figure.</small><span>' + escapeHtml(changedPattern) + '</span></div></div><div class="iching-copy"><h4>Hexagram ' + hexNumber + ' · ' + escapeHtml(hexName) + '</h4><div class="iching-trigrams"><div class="iching-trigram"><strong>Below · ' + escapeHtml(lower.name) + '</strong><span>' + escapeHtml(lower.quality) + '</span></div><div class="iching-trigram"><strong>Above · ' + escapeHtml(upper.name) + '</strong><span>' + escapeHtml(upper.quality) + '</span></div></div><p class="iching-synthesis"><strong>Today’s pattern:</strong> ' + escapeHtml(synthesis) + '</p><p>' + escapeHtml(changingText) + '</p>' + (changing.some(Boolean) ? '<p><strong>With change:</strong> Hexagram ' + changedNumber + ' · ' + escapeHtml(changedName) + '</p><p>' + escapeHtml(changedSummary) + '</p>' : '<p>' + escapeHtml(changedSummary) + '</p>') + '<p class="iching-action"><strong>Try this:</strong> ' + escapeHtml(action) + '</p><p class="iching-prompt"><strong>Reflection:</strong> ' + escapeHtml(primaryQuestion) + '</p><p class="iching-example"><strong>In real life:</strong> ' + escapeHtml(ICHING_EXAMPLES[hexIndex % ICHING_EXAMPLES.length]) + '</p><h5 style="margin:0.8rem 0 0;color:var(--gold);">Questions to carry</h5><ul class="iching-questions"><li>' + escapeHtml(primaryQuestion) + '</li><li>' + escapeHtml(secondQuestion) + '</li><li>' + escapeHtml(thirdQuestion) + '</li></ul><p class="iching-method"><strong>Method:</strong> ' + escapeHtml(method) + '</p><div class="trigram-row"><span class="trigram-chip">Personal day ' + personalDay(isoDate, year, month, day) + '</span><span class="trigram-chip">' + (name ? 'Name pattern included' : 'Date pattern only') + '</span></div></div></div>';
    }
    function renderAstroRhythm(isoDate, year) {
        const target = document.getElementById('astro-rhythm');
        if (!target) return;
        if (!isoDate || !year) {
            target.innerHTML = '<p class="page-note">Calculate a birth date to compare your personal year with the universal cycle.</p>';
            return;
        }
        const universal = universalYear(year);
        const personal = personalYear(isoDate, year);
        const gates = [
            { date: year + '-03-20', name: 'March equinox', sign: 'Aries', note: 'Balance point: equal day and night, then a turn toward outward growth.' },
            { date: year + '-06-21', name: 'June solstice', sign: 'Cancer', note: 'Peak light: visibility, nourishment, and the question of what you want to sustain.' },
            { date: year + '-09-22', name: 'September equinox', sign: 'Libra', note: 'Balance point: equal day and night, then a turn toward gathering and release.' },
            { date: year + '-12-21', name: 'December solstice', sign: 'Capricorn', note: 'Deep reset: least light, long structure, and the seed of the next return.' }
        ];
        const gateHtml = gates.map((gate) => '<div class="astro-turn"><strong>' + gate.name + '</strong><span>' + gate.date + ' · Sun enters ' + gate.sign + '</span><span>' + gate.note + '</span></div>').join('');
        const blend = universal === personal
            ? 'Your personal year matches the universal year (' + universal + '). The outer rhythm and your inner chapter are speaking in the same number; notice where that alignment feels supportive and where it asks for more responsibility.'
            : 'The universal year is ' + universal + ' (' + meaningTitle(universal) + '), while your personal year is ' + personal + ' (' + meaningTitle(personal) + '). The world is the weather; your personal year is how you move through it. Neither number cancels the other.';
        target.innerHTML = '<div class="result-block"><h4>Universal ' + year + ' · ' + universal + ' · ' + escapeHtml(meaningTitle(universal)) + '</h4><p class="astro-balance">' + escapeHtml(blend) + '</p></div><div class="astro-turns">' + gateHtml + '</div><p class="astro-balance"><strong>How to use the gates:</strong> near an equinox, ask what needs rebalancing; near a solstice, ask what is peaking, quieting, or ready to change direction. Then compare that answer with your personal month and day in the calendar above.</p>';
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
        if (!parseIsoDate(iso)) {
            core.classList.remove('nums-hidden');
            core.innerHTML = '<p class="error-text">Please choose a real calendar date.</p>';
            return;
        }
        const lp = lifePathFromDate(iso);
        const bd = birthdayNumber(iso);
        const destiny = name ? nameNumber(name) : null;
        const py = personalYear(iso, new Date().getFullYear());
        core.classList.remove('nums-hidden');
        core.innerHTML = '<h4>Core profile</h4><p><strong>Life Path:</strong> ' + lp + ' — ' + (MEANINGS[lp] ? MEANINGS[lp].title : '') + '</p><p><strong>Birthday number:</strong> ' + bd + '</p>' + (destiny != null ? '<p><strong>Destiny / Expression:</strong> ' + destiny + '</p>' : '<p><strong>Destiny:</strong> add a name to compute</p>') + '<p><strong>Personal year ' + new Date().getFullYear() + ':</strong> ' + py + '</p><p style="margin-top:0.75rem;color:var(--muted);font-size:0.9rem">' + (MEANINGS[lp] ? MEANINGS[lp].body : '') + '</p>';
        renderProtectiveSymbols(iso, name, bd, lp, destiny);
        natal.innerHTML = '<p class="page-note">Casting chart…</p>';
        try {
            const natalChart = computeNatal(iso, time, selectedPlace);
            renderNatal(natalChart, lp);
            renderHumanDesign(natalChart);
        }
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
                try {
                    renderPlaceSuggest(await searchPlaces(q));
                } catch (err) {
                    list.classList.add('nums-hidden');
                    document.getElementById('n-place-meta').textContent = 'Place search unavailable. You can still calculate without a birthplace.';
                    console.warn('Place search failed:', err);
                }
            }, 350);
        });
        document.addEventListener('click', (e) => { if (!e.target.closest('.place-wrap')) list.classList.add('nums-hidden'); });
    }
    function initRoom() {
        renderMeanings(); renderColors(); renderCrystals(); renderSymbolLibrary(); renderHumanDesignGuide(); initPlaceSearch();
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
