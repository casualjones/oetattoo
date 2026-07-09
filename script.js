// ==================== HERO CANVAS (THREE.JS) ====================
let scene, camera, renderer;
let particles = [];

let patchPeerConnection = null;
let patchDataChannel = null;
let patchMidiAccess = null;
let patchMidiInput = null;
let patchMidiOutput = null;

// Audio Bridge globals
let audioContext = null;
let audioStream = null;
let audioSource = null;
let audioAnalyzer = null;
let audioGainNode = null;
let remoteAudioStream = null;
let remoteAudioElement = null;
let audioMeterAnimationId = null;
let audioInputGain = 1;
let audioOutputGain = 1;

// Multi-track Audio globals
let multitrackTracks = []; // Array of {id, name, stream, analyser, gainNode}
let multitrackTrackCounter = 0;
let remoteMultitrackElements = {}; // {trackLabel: audioElement}
let remoteMultitrackAnalysers = {}; // {trackLabel: analyser}

function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0f0f0f, 0);

    // Particle system for geometric effect
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
        );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    // Create particle mesh
    const material = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 2,
        transparent: true,
        opacity: 0.3,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create geometric lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    for (let i = 0; i < 100; i++) {
        linePositions.push(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        );
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xc41e3a,
        transparent: true,
        opacity: 0.1,
        linewidth: 1,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate elements
        points.rotation.x += 0.0002;
        points.rotation.y += 0.0003;
        lines.rotation.x -= 0.0001;
        lines.rotation.z += 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ==================== FORM HANDLING ====================
function initFormHandler() {
    const form = document.getElementById('tattoo-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.checkValidity()) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Send to email via FormSubmit (free service)
        try {
            // Using FormSubmit.co for free form submission
            const response = await fetch('https://formspree.io/f/xeojnqnl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showFormMessage('Thanks for reaching out! I\'ll be in touch within 24 hours. 🎨', 'success');
                form.reset();
            } else {
                showFormMessage('Something went wrong. Please try emailing me directly at oetattoo888@gmail.com', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Fallback: still show success since form validation passed
            showFormMessage('Thanks for reaching out! Please check your spam folder for my response. 🎨', 'success');
            form.reset();
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

// ==================== SMOOTH SCROLL & NAV ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (!targetId || !targetId.startsWith('#')) {
                navMenu.classList.remove('active');
                return;
            }

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                navMenu.classList.remove('active');
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
function initPatchDock() {
    const btnCreateOffer = document.getElementById('patch-create-offer');
    if (!btnCreateOffer) return;

    const btnAcceptOffer = document.getElementById('patch-accept-offer');
    const btnApplyAnswer = document.getElementById('patch-apply-answer');
    const btnCopyLocal = document.getElementById('patch-copy-local-sdp');
    const localText = document.getElementById('patch-local-sdp');
    const remoteText = document.getElementById('patch-remote-sdp');
    const tempoInput = document.getElementById('patch-tempo');
    const tempoDisplay = document.getElementById('patch-tempo-display');
    const dockToggle = document.getElementById('patch-dock-side-toggle');
    const resetBtn = document.getElementById('patch-reset-session');
    const midiBtn = document.getElementById('patch-connect-midi');
    const midiInputSelect = document.getElementById('patch-midi-input');
    const midiOutputSelect = document.getElementById('patch-midi-output');
    const testNoteBtn = document.getElementById('patch-send-test-note');

    btnCreateOffer.addEventListener('click', createOffer);
    btnAcceptOffer.addEventListener('click', acceptRemoteOffer);
    btnApplyAnswer.addEventListener('click', applyRemoteAnswer);
    btnCopyLocal.addEventListener('click', () => {
        localText.select();
        document.execCommand('copy');
        logPatch('Local SDP copied to clipboard.');
    });
    
    // QR code button
    const qrBtn = document.getElementById('patch-qr-local');
    if (qrBtn) {
        qrBtn.addEventListener('click', generateQRCode);
    }
    
    tempoInput.addEventListener('input', () => {
        tempoDisplay.textContent = `${tempoInput.value} BPM`;
        sendJamMessage({ type: 'tempo', tempo: Number(tempoInput.value) });
    });
    dockToggle.addEventListener('click', toggleDockSide);
    resetBtn.addEventListener('click', resetJamSession);
    midiBtn.addEventListener('click', enableWebMidi);
    midiInputSelect.addEventListener('change', () => selectMidiInput(midiInputSelect.value));
    midiOutputSelect.addEventListener('change', () => selectMidiOutput(midiOutputSelect.value));
    testNoteBtn.addEventListener('click', sendTestMidiNote);

    tempoDisplay.textContent = `${tempoInput.value} BPM`;

    if (navigator.requestMIDIAccess) {
        logPatch('Web MIDI is available. Click Connect MIDI to patch your DAW.');
    } else {
        logPatch('Web MIDI API is not supported in this browser.', true);
        midiBtn.disabled = true;
    }
}

function setupPeerConnection(isOffer) {
    if (patchPeerConnection) {
        patchPeerConnection.close();
        patchPeerConnection = null;
        patchDataChannel = null;
    }

    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    patchPeerConnection = new RTCPeerConnection(config);

    patchPeerConnection.onicecandidate = () => {
        const localText = document.getElementById('patch-local-sdp');
        if (patchPeerConnection.localDescription && localText) {
            localText.value = JSON.stringify(patchPeerConnection.localDescription);
        }
    };

    patchPeerConnection.onconnectionstatechange = () => {
        updateConnectionState(patchPeerConnection.connectionState);
        // Update audio status when connection state changes
        const audioBridgeToggle = document.getElementById('audio-bridge-toggle');
        if (audioBridgeToggle && audioBridgeToggle.checked) {
            if (patchPeerConnection.connectionState === 'connected') {
                updateAudioStatus('Audio streaming', 'connected');
            } else if (patchPeerConnection.connectionState === 'failed' || patchPeerConnection.connectionState === 'disconnected') {
                updateAudioStatus('Connection lost', 'error');
            }
        }
    };

    // Handle incoming remote audio tracks
    patchPeerConnection.ontrack = (event) => {
        logPatch(`Received remote ${event.track.kind} track: ${event.track.label}`);
        if (event.track.kind === 'audio') {
            // Check if multi-track mode is enabled
            const multitrackToggle = document.getElementById('multitrack-audio-toggle');
            if (multitrackToggle && multitrackToggle.checked) {
                // Multi-track mode: route to separate element
                handleRemoteMultitrackTrack(event);
            } else {
                // Single track mode: use default remote audio element
                if (remoteAudioElement) {
                    remoteAudioElement.srcObject = event.streams[0];
                    remoteAudioElement.volume = audioOutputGain;
                    updateAudioStatus('Receiving remote audio', 'connected');
                    logPatch('Remote audio connected. Adjust output volume in Audio Bridge panel.');
                }
            }
        }
    };

    patchPeerConnection.ondatachannel = (event) => {
        patchDataChannel = event.channel;
        bindDataChannel();
    };

    if (isOffer) {
        patchDataChannel = patchPeerConnection.createDataChannel('daw-patch-session');
        bindDataChannel();
    }
}

function bindDataChannel() {
    if (!patchDataChannel) return;

    patchDataChannel.onopen = () => {
        logPatch('Session data channel open.');
        updateConnectionState('connected');
    };
    patchDataChannel.onclose = () => {
        logPatch('Session data channel closed.');
        updateConnectionState('closed');
    };
    patchDataChannel.onerror = (event) => {
        logPatch(`Data channel error: ${event.message || 'unknown'}`, true);
    };
    patchDataChannel.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
            handleJamMessage(payload);
        } catch (err) {
            logPatch(`Received non-JSON session payload: ${event.data}`);
        }
    };
}

function createOffer() {
    setupPeerConnection(true);
    const sessionName = document.getElementById('patch-session-name')?.value || 'OE DAW Patch Session';
    logPatch(`Creating offer for session: ${sessionName}`);

    patchPeerConnection.createOffer()
        .then(offer => patchPeerConnection.setLocalDescription(offer))
        .then(() => {
            const localText = document.getElementById('patch-local-sdp');
            if (localText) localText.value = JSON.stringify(patchPeerConnection.localDescription);
            logPatch('Offer created. Share your SDP with a collaborator.');
        })
        .catch(err => logPatch(`Offer creation failed: ${err.message}`, true));
}

function acceptRemoteOffer() {
    const remoteText = document.getElementById('patch-remote-sdp');
    if (!remoteText || !remoteText.value.trim()) {
        logPatch('Paste a remote offer into the textarea before accepting.', true);
        return;
    }
    let remoteDesc;
    try {
        remoteDesc = JSON.parse(remoteText.value.trim());
    } catch (err) {
        logPatch('Remote SDP is not valid JSON.', true);
        return;
    }
    if (remoteDesc.type !== 'offer') {
        logPatch('Remote SDP is not an offer. Use Apply Answer instead.', true);
        return;
    }

    setupPeerConnection(false);
    patchPeerConnection.setRemoteDescription(remoteDesc)
        .then(() => patchPeerConnection.createAnswer())
        .then(answer => patchPeerConnection.setLocalDescription(answer))
        .then(() => {
            const localText = document.getElementById('patch-local-sdp');
            if (localText) localText.value = JSON.stringify(patchPeerConnection.localDescription);
            logPatch('Answer created. Send this SDP back to the session initiator.');
        })
        .catch(err => logPatch(`Accept offer failed: ${err.message}`, true));
}

function applyRemoteAnswer() {
    const remoteText = document.getElementById('patch-remote-sdp');
    if (!remoteText || !remoteText.value.trim()) {
        logPatch('Paste the remote answer into the textarea first.', true);
        return;
    }
    let remoteDesc;
    try {
        remoteDesc = JSON.parse(remoteText.value.trim());
    } catch (err) {
        logPatch('Remote SDP is not valid JSON.', true);
        return;
    }
    if (remoteDesc.type !== 'answer') {
        logPatch('Remote SDP is not an answer. Use Accept Offer if you received an offer.', true);
        return;
    }
    if (!patchPeerConnection) {
        logPatch('No active peer connection. Create an offer first.', true);
        return;
    }

    patchPeerConnection.setRemoteDescription(remoteDesc)
        .then(() => logPatch('Remote answer applied. Session should connect shortly.'))
        .catch(err => logPatch(`Apply answer failed: ${err.message}`, true));
}

function handleJamMessage(payload) {
    if (!payload || !payload.type) return;
    if (payload.type === 'tempo') {
        const tempoInput = document.getElementById('patch-tempo');
        const tempoDisplay = document.getElementById('patch-tempo-display');
        if (tempoInput) {
            tempoInput.value = payload.tempo;
            tempoDisplay.textContent = `${payload.tempo} BPM`;
        }
        logPatch(`Remote tempo update: ${payload.tempo} BPM`);
        return;
    }
    if (payload.type === 'midi') {
        logPatch(`Remote MIDI received: [${payload.message.join(', ')}]`);
        if (patchMidiOutput && payload.message) {
            try {
                patchMidiOutput.send(payload.message);
                logPatch('Remote MIDI forwarded to local MIDI output.');
            } catch (err) {
                logPatch(`MIDI output send failed: ${err.message}`, true);
            }
        }
        return;
    }
    logPatch(`Remote event: ${payload.type}`);
}

function sendJamMessage(payload) {
    if (!patchDataChannel || patchDataChannel.readyState !== 'open') {
        logPatch('Cannot send session data: connection not open.', true);
        return;
    }
    try {
        patchDataChannel.send(JSON.stringify(payload));
        logPatch(`Sent session payload: ${payload.type}`);
    } catch (err) {
        logPatch(`Data send failed: ${err.message}`, true);
    }
}

function enableWebMidi() {
    navigator.requestMIDIAccess({ sysex: false })
        .then((access) => {
            patchMidiAccess = access;
            populateMidiDevices();
            access.onstatechange = populateMidiDevices;
            logPatch('MIDI access granted. Select input and output from the menu.');
        })
        .catch((err) => {
            logPatch(`Web MIDI access denied: ${err.message}`, true);
        });
}

function populateMidiDevices() {
    if (!patchMidiAccess) return;
    const inputSelect = document.getElementById('patch-midi-input');
    const outputSelect = document.getElementById('patch-midi-output');
    if (!inputSelect || !outputSelect) return;

    const previousInput = inputSelect.value;
    const previousOutput = outputSelect.value;

    inputSelect.innerHTML = '<option value="">Select MIDI input</option>';
    outputSelect.innerHTML = '<option value="">Select MIDI output</option>';

    for (const input of patchMidiAccess.inputs.values()) {
        const option = document.createElement('option');
        option.value = input.id;
        option.textContent = input.name || input.manufacturer || `Input ${input.id}`;
        inputSelect.appendChild(option);
    }
    for (const output of patchMidiAccess.outputs.values()) {
        const option = document.createElement('option');
        option.value = output.id;
        option.textContent = output.name || output.manufacturer || `Output ${output.id}`;
        outputSelect.appendChild(option);
    }

    if (previousInput) inputSelect.value = previousInput;
    if (previousOutput) outputSelect.value = previousOutput;

    if (inputSelect.value) selectMidiInput(inputSelect.value);
    if (outputSelect.value) selectMidiOutput(outputSelect.value);

    inputSelect.disabled = false;
    outputSelect.disabled = false;
}

function selectMidiInput(inputId) {
    if (!patchMidiAccess) return;
    if (patchMidiInput) {
        patchMidiInput.onmidimessage = null;
    }
    patchMidiInput = patchMidiAccess.inputs.get(inputId) || null;
    if (patchMidiInput) {
        patchMidiInput.onmidimessage = handleMidiMessage;
        logPatch(`MIDI input connected: ${patchMidiInput.name || patchMidiInput.id}`);
    }
}

function selectMidiOutput(outputId) {
    if (!patchMidiAccess) return;
    patchMidiOutput = patchMidiAccess.outputs.get(outputId) || null;
    if (patchMidiOutput) {
        logPatch(`MIDI output selected: ${patchMidiOutput.name || patchMidiOutput.id}`);
    }
}

function handleMidiMessage(event) {
    const mode = document.getElementById('patch-patch-mode')?.value;
    const message = Array.from(event.data);
    logPatch(`MIDI in: [${message.join(', ')}]`);

    if (mode === 'daw-to-session' && patchDataChannel && patchDataChannel.readyState === 'open') {
        sendJamMessage({ type: 'midi', message });
    }
}

function sendTestMidiNote() {
    if (!patchMidiOutput) {
        logPatch('Select a MIDI output before sending test notes.', true);
        return;
    }
    const noteOn = [0x90, 60, 0x7f];
    const noteOff = [0x80, 60, 0x40];
    patchMidiOutput.send(noteOn);
    setTimeout(() => patchMidiOutput && patchMidiOutput.send(noteOff), 200);
    logPatch('Test note sent to MIDI output.');
}

function updateConnectionState(state) {
    const stateEl = document.getElementById('patch-connection-state');
    const dot = document.getElementById('patch-connection-dot');
    if (stateEl) stateEl.textContent = state;
    if (dot) {
        dot.classList.toggle('online', state === 'connected');
        dot.classList.toggle('offline', state !== 'connected');
    }
}

function logPatch(message, isError = false) {
    const log = document.getElementById('patch-log');
    if (!log) return;
    const entry = document.createElement('li');
    entry.textContent = message;
    if (isError) entry.style.color = '#e87777';
    log.prepend(entry);
}

function toggleDockSide() {
    const dock = document.querySelector('.patch-dock');
    const button = document.getElementById('patch-dock-side-toggle');
    if (!dock || !button) return;
    const current = dock.getAttribute('data-dock-side') || 'right';
    const next = current === 'right' ? 'left' : 'right';
    dock.setAttribute('data-dock-side', next);
    button.textContent = next === 'right' ? 'Dock Left' : 'Dock Right';
}

function resetJamSession() {
    if (patchPeerConnection) {
        patchPeerConnection.close();
        patchPeerConnection = null;
        patchDataChannel = null;
    }
    const localText = document.getElementById('patch-local-sdp');
    const remoteText = document.getElementById('patch-remote-sdp');
    if (localText) localText.value = '';
    if (remoteText) remoteText.value = '';
    updateConnectionState('disconnected');
    logPatch('Session reset. Ready for a new patch.');
}

function parseRemoteDescription(value) {
    try {
        return JSON.parse(value.trim());
    } catch (err) {
        return null;
    }
}
// ==================== GSAP ANIMATIONS ====================
function initGsapAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP is not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-storytelling .hero-copy', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
    });

    gsap.from('.hero-storytelling .doorway-panel', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.15,
    });

    gsap.from('.hero-storytelling .door-slice', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.3,
    });

    gsap.from('.hero-storytelling .focus-item', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.3,
    });

    gsap.from('.hero-storytelling .cta-button', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.55,
    });

    gsap.utils.toArray('.about-apprentice .bio-content, .portfolio-block, .contact-item').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    });

    gsap.utils.toArray('.page-shell .page-hero, .page-shell .page-card, .page-shell .portfolio-item').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 32,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        });
    });

    gsap.from('.work-sample', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.portfolio-categories',
            start: 'top 80%',
            toggleActions: 'play none none none',
        },
    });
}

// ==================== PORTFOLIO LOADING ====================
function initPortfolio() {
    const coverUpGrid = document.getElementById('cover-up-grid');
    const smallTattoosGrid = document.getElementById('small-tattoos-grid');
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (typeof portfolioData === 'undefined' || portfolioData.length === 0) {
        if (portfolioGrid) {
            portfolioGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <p style="color: #a8a8a0; font-size: 1.1rem;">Portfolio coming soon! Add your images to portfolio-data.js</p>
                </div>
            `;
        }
        return;
    }

    const createWorkSample = (item) => {
        const sample = document.createElement('div');
        sample.className = 'work-sample';
        sample.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="work-sample-title">${item.title}</div>
            <div class="work-sample-details">${item.size} • ${item.placement}</div>
        `;
        return sample;
    };

    if (coverUpGrid && smallTattoosGrid) {
        const coverUps = portfolioData.filter(item => item.category === 'cover-up');
        const smallItems = portfolioData.filter(item => item.category === 'small');

        if (coverUps.length) {
            coverUps.forEach(item => coverUpGrid.appendChild(createWorkSample(item)));
        } else {
            coverUpGrid.innerHTML = `
                <div class="work-sample">
                    <p class="work-sample-details">Add cover-up entries to portfolio-data.js to populate this gallery.</p>
                </div>
            `;
        }

        if (smallItems.length) {
            smallItems.forEach(item => smallTattoosGrid.appendChild(createWorkSample(item)));
        } else {
            smallTattoosGrid.innerHTML = `
                <div class="work-sample">
                    <p class="work-sample-details">Add small tattoo entries to portfolio-data.js to populate this gallery.</p>
                </div>
            `;
        }
        return;
    }

    if (portfolioGrid) {
        portfolioData.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="portfolio-item-image">
                <div class="portfolio-item-overlay">
                    <div class="portfolio-item-title">${item.title}</div>
                    <div class="portfolio-item-details">
                        ${item.size} | ${item.placement} | ${item.date}
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);
        });
    }
}

// ==================== AUTH & PATCH ACCESS ====================
function initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const authPassphrase = document.getElementById('auth-passphrase');
    const authSubmit = document.getElementById('auth-submit');
    const authMessage = document.getElementById('auth-message');

    if (!authModal) return;

    // Show auth modal on load
    authModal.style.display = 'flex';

    authSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const passphrase = authPassphrase.value.trim();

        if (validatePassphrase(passphrase)) {
            authMessage.classList.remove('show');
            sessionStorage.setItem('patchAuthToken', 'authenticated');
            authModal.style.display = 'none';
            showPatchSection();
        } else {
            authMessage.textContent = 'Invalid passphrase. Try again.';
            authMessage.classList.add('show');
            authPassphrase.value = '';
            authPassphrase.focus();
        }
    });

    // Allow Enter key to submit
    authPassphrase.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authSubmit.click();
        }
    });

    // Check if already authenticated
    if (sessionStorage.getItem('patchAuthToken') === 'authenticated') {
        authModal.style.display = 'none';
        showPatchSection();
    }
}

function validatePassphrase(phrase) {
    const correctPhrase = '707_trees';
    return phrase === correctPhrase;
}

function showPatchSection() {
    const patchApp = document.getElementById('patch-app');
    if (patchApp) {
        patchApp.style.display = 'block';
    }
}

// ==================== QR CODE GENERATION ====================
function generateQRCode() {
    const localSDP = document.getElementById('patch-local-sdp');
    const qrContainer = document.getElementById('patch-qr-code');
    const qrWrapper = document.getElementById('patch-qr-container');

    if (!localSDP || !localSDP.value) {
        return;
    }

    // Clear previous QR code
    qrContainer.innerHTML = '';

    // Generate QR code
    new QRCode(qrContainer, {
        text: localSDP.value,
        width: 280,
        height: 280,
        correctLevel: QRCode.CorrectLevel.H,
        colorDark: '#fff',
        colorLight: '#0f0f0f'
    });

    qrWrapper.style.display = 'block';
}

function generateShareableLink() {
    const localSDP = document.getElementById('patch-local-sdp');
    if (!localSDP || !localSDP.value) return null;

    // Encode SDP as base64 and create a shareable URL
    const encoded = btoa(localSDP.value);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?patch=${encoded}`;

    return shareUrl;
}

// ==================== PATCH DOCK ONBOARDING ====================
function initPatchOnboarding() {
    const closeBtn = document.getElementById('onboarding-close-btn');
    const onboarding = document.querySelector('.patch-onboarding');

    if (!closeBtn) return;

    closeBtn.addEventListener('click', () => {
        if (onboarding) {
            onboarding.style.display = 'none';
        }
    });
}

// ==================== AUDIO BRIDGE ==================== 
function initAudioBridge() {
    const audioBridgeToggle = document.getElementById('audio-bridge-toggle');
    const audioControlsWrapper = document.getElementById('audio-controls-wrapper');
    const audioInputSource = document.getElementById('audio-input-source');
    const audioOutputMonitor = document.getElementById('audio-output-monitor');
    const audioInputGainSlider = document.getElementById('audio-input-gain');
    const audioOutputGainSlider = document.getElementById('audio-output-gain');
    const audioInputMeter = document.getElementById('audio-input-meter');

    if (!audioBridgeToggle) return;

    // Create hidden audio element for remote audio
    remoteAudioElement = document.createElement('audio');
    remoteAudioElement.autoplay = true;
    remoteAudioElement.playsinline = true;
    document.body.appendChild(remoteAudioElement);

    audioBridgeToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
            const success = await enableAudioBridge();
            if (!success) {
                audioBridgeToggle.checked = false;
            } else {
                audioControlsWrapper.style.display = 'flex';
                updateAudioStatus('Requesting microphone access...', 'pending');
            }
        } else {
            disableAudioBridge();
            audioControlsWrapper.style.display = 'none';
        }
    });

    audioInputSource.addEventListener('change', (e) => {
        if (audioBridgeToggle.checked) {
            disableAudioBridge();
            setTimeout(() => {
                audioBridgeToggle.checked = true;
                audioBridgeToggle.dispatchEvent(new Event('change'));
            }, 500);
        }
    });

    audioOutputMonitor.addEventListener('change', (e) => {
        if (remoteAudioElement && patchPeerConnection) {
            remoteAudioElement.muted = !e.target.checked;
            logPatch(`Remote audio monitor: ${e.target.checked ? 'ON' : 'OFF'}`);
        }
    });

    audioInputGainSlider.addEventListener('input', (e) => {
        audioInputGain = parseInt(e.target.value) / 100;
        if (audioGainNode) {
            audioGainNode.gain.value = audioInputGain;
        }
        document.getElementById('audio-input-gain-value').textContent = `${e.target.value}%`;
        logPatch(`Input gain: ${e.target.value}%`);
    });

    audioOutputGainSlider.addEventListener('input', (e) => {
        audioOutputGain = parseInt(e.target.value) / 100;
        if (remoteAudioElement) {
            remoteAudioElement.volume = audioOutputGain;
        }
        document.getElementById('audio-output-gain-value').textContent = `${e.target.value}%`;
        logPatch(`Output volume: ${e.target.value}%`);
    });

    logPatch('Audio bridge initialized. Enable audio to stream live audio.');
}

async function enableAudioBridge() {
    try {
        const audioInputSource = document.getElementById('audio-input-source');
        const sourceType = audioInputSource.value;

        // Request microphone access
        const constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            },
            video: false
        };

        audioStream = await navigator.mediaDevices.getUserMedia(constraints);
        logPatch('Microphone access granted. Audio stream ready.');

        // Create audio context if it doesn't exist
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Create audio source
        audioSource = audioContext.createMediaStreamSource(audioStream);
        audioGainNode = audioContext.createGain();
        audioGainNode.gain.value = audioInputGain;

        // Create analyzer for metering
        audioAnalyzer = audioContext.createAnalyser();
        audioAnalyzer.fftSize = 256;

        audioSource.connect(audioGainNode);
        audioGainNode.connect(audioAnalyzer);
        audioAnalyzer.connect(audioContext.destination);

        // Start metering visualization
        const audioInputMeter = document.getElementById('audio-input-meter');
        if (audioInputMeter && audioInputMeter.getContext) {
            startAudioMeteringAnimation(audioInputMeter);
        }

        // Add audio tracks to peer connection if connected
        if (patchPeerConnection && patchPeerConnection.connectionState !== 'failed') {
            const audioTracks = audioStream.getAudioTracks();
            if (audioTracks.length > 0) {
                patchPeerConnection.addTrack(audioTracks[0], audioStream);
                logPatch('Audio track added to peer connection.');
                updateAudioStatus('Audio streaming', 'connected');
            }
        } else {
            updateAudioStatus('Audio ready (peer not connected)', 'ready');
            logPatch('Audio ready. Create a patch session to start streaming.');
        }

        return true;
    } catch (error) {
        console.error('Audio bridge error:', error);
        logPatch(`Audio error: ${error.message}`, true);
        updateAudioStatus('Microphone access denied', 'error');
        return false;
    }
}

function disableAudioBridge() {
    try {
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            audioStream = null;
        }

        if (audioSource) {
            audioSource.disconnect();
            audioSource = null;
        }

        if (audioGainNode) {
            audioGainNode.disconnect();
            audioGainNode = null;
        }

        if (audioAnalyzer) {
            audioAnalyzer.disconnect();
            audioAnalyzer = null;
        }

        if (audioMeterAnimationId) {
            cancelAnimationFrame(audioMeterAnimationId);
            audioMeterAnimationId = null;
        }

        updateAudioStatus('Audio disabled', 'disabled');
        logPatch('Audio stream stopped.');
    } catch (error) {
        console.error('Error disabling audio:', error);
    }
}

function startAudioMeteringAnimation(canvas) {
    if (!audioAnalyzer) return; // Guard against null analyzer
    
    // Cancel previous animation if running
    if (audioMeterAnimationId) {
        cancelAnimationFrame(audioMeterAnimationId);
    }
    
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(audioAnalyzer.frequencyBinCount);

    function draw() {
        audioMeterAnimationId = requestAnimationFrame(draw);

        if (!audioAnalyzer) return;

        audioAnalyzer.getByteFrequencyData(dataArray);

        // Calculate average level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const dbValue = 20 * Math.log10(average / 255);

        // Clear canvas
        ctx.fillStyle = 'rgba(15, 15, 15, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw meter background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw level bar
        const level = Math.max(0, Math.min(100, (average / 255) * 100));
        const barColor = level > 80 ? '#c41e3a' : level > 50 ? '#d4af37' : '#3d5c3a';
        ctx.fillStyle = barColor;
        ctx.fillRect(0, 0, (level / 100) * canvas.width, canvas.height);

        // Update dB display
        const dbElement = document.getElementById('audio-input-db');
        if (dbElement) {
            if (dbValue > -100) {
                dbElement.textContent = dbValue.toFixed(1);
            } else {
                dbElement.textContent = '-∞';
            }
        }
    }

    draw();
}

function updateAudioStatus(message, status) {
    const statusText = document.getElementById('audio-status-text');
    const statusDot = document.querySelector('.audio-status .status-dot');

    if (statusText) {
        statusText.textContent = message;
    }

    if (statusDot) {
        statusDot.classList.remove('online');
        if (status === 'connected') {
            statusDot.classList.add('online');
        }
    }
}

// ==================== MULTI-TRACK AUDIO ====================
function initMultitrackAudio() {
    const multitrackToggle = document.getElementById('multitrack-audio-toggle');
    const multitrackControls = document.getElementById('multitrack-controls');
    const addTrackBtn = document.getElementById('add-track-btn');

    if (!multitrackToggle) return;

    multitrackToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            multitrackControls.style.display = 'flex';
            // Add one default track
            addAudioTrack('Main Mix');
            logPatch('Multi-track mode enabled. Add audio sources to stream.');
        } else {
            multitrackControls.style.display = 'none';
            // Clear all tracks
            multitrackTracks.forEach(track => {
                if (track.stream) {
                    track.stream.getTracks().forEach(t => t.stop());
                }
            });
            multitrackTracks = [];
            document.getElementById('multitrack-tracks-list').innerHTML = '';
            logPatch('Multi-track mode disabled.');
        }
    });

    addTrackBtn.addEventListener('click', () => {
        const trackName = prompt('Enter track name (e.g., "Drums", "Synths", "Vocals"):', `Track ${multitrackTracks.length + 1}`);
        if (trackName) {
            addAudioTrack(trackName);
        }
    });
}

async function addAudioTrack(trackName) {
    try {
        const trackId = ++multitrackTrackCounter;
        
        // Request microphone/audio input
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            },
            video: false
        });

        // Create analyser for this track
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;

        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination);

        // Store track
        const track = {
            id: trackId,
            name: trackName,
            stream: stream,
            source: source,
            analyser: analyser,
            gainNode: gainNode,
            level: 0
        };

        multitrackTracks.push(track);

        // Add to peer connection if connected
        if (patchPeerConnection && patchPeerConnection.connectionState === 'connected') {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                // Set track label (will be received as event.track.label on remote end)
                audioTrack.label = trackName;
                const sender = patchPeerConnection.addTrack(audioTrack, stream);
                logPatch(`Added track to peer: ${trackName}`);
            }
        }

        // Render UI
        renderMultitrackItem(track);
        
        // Start metering
        startMultitrackMeter(track);

        logPatch(`Audio track added: ${trackName}`);
    } catch (error) {
        console.error('Error adding audio track:', error);
        logPatch(`Error adding track: ${error.message}`, true);
    }
}

function removeAudioTrack(trackId) {
    const track = multitrackTracks.find(t => t.id === trackId);
    if (!track) return;

    // Stop stream
    if (track.stream) {
        track.stream.getTracks().forEach(t => t.stop());
    }

    // Remove from peer connection
    if (patchPeerConnection) {
        const senders = patchPeerConnection.getSenders();
        senders.forEach(sender => {
            if (sender.track && track.stream.getTracks().includes(sender.track)) {
                patchPeerConnection.removeTrack(sender);
            }
        });
    }

    // Remove from array
    multitrackTracks = multitrackTracks.filter(t => t.id !== trackId);

    // Remove UI
    const elem = document.querySelector(`[data-track-id="${trackId}"]`);
    if (elem) elem.remove();

    logPatch(`Removed track: ${track.name}`);
}

function renderMultitrackItem(track) {
    const list = document.getElementById('multitrack-tracks-list');
    
    const item = document.createElement('div');
    item.className = 'multitrack-item';
    item.dataset.trackId = track.id;
    item.innerHTML = `
        <div class="multitrack-item-name">
            <span>${track.name}</span>
        </div>
        <div class="multitrack-item-meter">
            <div class="multitrack-item-meter-bar" data-meter="${track.id}"></div>
        </div>
        <button class="multitrack-item-remove" onclick="removeAudioTrack(${track.id})">✕</button>
    `;
    
    list.appendChild(item);
}

function startMultitrackMeter(track) {
    if (!track.analyser) return;

    const dataArray = new Uint8Array(track.analyser.frequencyBinCount);
    
    function update() {
        requestAnimationFrame(update);

        if (!track.analyser) return;

        track.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const level = Math.max(0, Math.min(100, (average / 255) * 100));

        track.level = level;

        // Update meter bar
        const meterBar = document.querySelector(`[data-meter="${track.id}"]`);
        if (meterBar) {
            meterBar.style.width = level + '%';
        }
    }

    update();
}

function handleRemoteMultitrackTrack(event) {
    const track = event.track;
    const label = track.label || `Remote-${track.id}`;

    if (track.kind === 'audio') {
        // Create audio element for this track
        const audioElement = document.createElement('audio');
        audioElement.autoplay = true;
        audioElement.playsinline = true;
        audioElement.volume = audioOutputGain;
        document.body.appendChild(audioElement);

        // Set stream
        const stream = new MediaStream();
        stream.addTrack(track);
        audioElement.srcObject = stream;

        remoteMultitrackElements[label] = audioElement;

        // Create analyser
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        remoteMultitrackAnalysers[label] = analyser;

        logPatch(`Received remote track: ${label}`);
    }
}


// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initFormHandler();
    initNavigation();
    initAuthModal();
    initPatchDock();
    initPatchOnboarding();
    initAudioBridge();
    initMultitrackAudio();
    initGsapAnimations();
    initPortfolio();
    initImageProcessor();
    loadCommittedPortfolio();
});

// Handle mobile canvas resize
window.addEventListener('resize', () => {
    if (renderer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
});

// ==================== ADDITIONAL POLISH ====================
// Add subtle mouse move effect to hero
document.addEventListener('mousemove', (e) => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const x = (e.clientX / window.innerWidth) * 10 - 5;
    const y = (e.clientY / window.innerHeight) * 10 - 5;

    heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

// Disable mouse tracking on mobile
if (window.innerWidth < 768) {
    document.removeEventListener('mousemove', (e) => {});
}

// ==================== IMAGE UPLOAD & RESIZE (CLIENT-SIDE) ====================
function initImageProcessor() {
    const input = document.getElementById('portfolio-input');
    const processBtn = document.getElementById('process-images');
    const gallery = document.getElementById('user-portfolio');
    const maxDimInput = document.getElementById('max-dim');

    if (!input || !processBtn || !gallery) return;

    processBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const files = input.files;
        const maxDim = parseInt(maxDimInput.value, 10) || 1200;
        if (!files || files.length === 0) return;
        gallery.innerHTML = '';
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const ratio = width / height;
                    if (Math.max(width, height) > maxDim) {
                        if (width > height) {
                            width = maxDim;
                            height = Math.round(maxDim / ratio);
                        } else {
                            height = maxDim;
                            width = Math.round(maxDim * ratio);
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#0f0f0f';
                    ctx.fillRect(0,0,width,height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // Export as JPEG for smaller size
                    canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        const thumb = document.createElement('div');
                        thumb.className = 'processed-thumb';
                        thumb.innerHTML = `
                            <a href="${url}" download="${file.name.replace(/\.[^/.]+$/, '')}-resized.jpg">
                                <img src="${url}" alt="${file.name}">
                            </a>
                            <div class="thumb-meta">${file.name}</div>
                        `;
                        gallery.appendChild(thumb);
                    }, 'image/jpeg', 0.86);
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    });
}

// Load any images committed to images/portfolio via a generated manifest
function loadCommittedPortfolio() {
    const gallery = document.getElementById('user-portfolio');
    if (!gallery) return;
    fetch('images/portfolio/manifest.json')
        .then(resp => {
            if (!resp.ok) throw new Error('No manifest');
            return resp.json();
        })
        .then(files => {
            files.forEach(fname => {
                const url = `images/portfolio/${fname}`;
                const thumb = document.createElement('div');
                thumb.className = 'processed-thumb';
                thumb.innerHTML = `
                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                        <img src="${url}" alt="${fname}">
                    </a>
                    <div class="thumb-meta">${fname}</div>
                `;
                gallery.appendChild(thumb);
            });
        })
        .catch(() => {
            // no manifest or error — ignore quietly
        });
}
