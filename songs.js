// OE Music - Public Demo Collection
let currentSongIndex = -1;
let songsList = [];
let audioPlayer;

// Demo song collection - replace with your actual Google Drive public links
// To get public links: Right-click file in Google Drive > Get shareable link > Set to "Anyone with the link can view"
const DEMO_SONGS = [
    {
        name: '411vol1.wav',
        id: '1Xx7SeisHdwG_tMGoPAUuLFioGMm06cwl',
        size: 491924,
        duration: 'Preview'
    },
    {
        name: 'SIPHERHEAD 2026-07-28 1253 105.6bmp.wav',
        id: '1Eq_lmRX3bDJhF4eyn5dCctAv5QyYlW_N',
        size: 19243806,
        duration: 'Preview'
    },
    {
        name: 'SIPHERHEAD 2026-07-28 1255 1.wav',
        id: '1Z1SvcQu6ArEz0X9PzVHBgmxzD45aU6X1',
        size: 38487444,
        duration: 'Preview'
    },
    {
        name: 'SIPHERHEAD 2026-07-28 1255.wav',
        id: '14nJvbwrVlcHFtrXb2ALjiU56Yjt5sWJ0',
        size: 38487444,
        duration: 'Preview'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    audioPlayer = document.getElementById('audioPlayer');
    setupEventListeners();
    loadDemoSongs();
});

function setupEventListeners() {
    // Player controls
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('prevBtn').addEventListener('click', playPrevious);
    document.getElementById('nextBtn').addEventListener('click', playNext);
    document.getElementById('volumeSlider').addEventListener('input', updateVolume);
    document.getElementById('progressTrack').addEventListener('click', seekTrack);

    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
}

function loadDemoSongs() {
    // Load demo songs immediately - no authentication required
    songsList = DEMO_SONGS.map(song => ({
        name: song.name,
        webContentLink: buildDriveStreamUrl(song.id),
        size: song.size,
        duration: song.duration
    }));

    displaySongs();
}

function displaySongs() {
    const songsListElement = document.getElementById('songsList');

    if (songsList.length === 0) {
        songsListElement.innerHTML = `
            <div class="track-empty">
                <p>No tracks yet. Add public file links in songs.js to populate this release.</p>
            </div>
        `;
        return;
    }

    let html = '';
    songsList.forEach((song, index) => {
        const fileSize = formatFileSize(song.size);
        const duration = song.duration || 'Unknown';
        const trackNumber = String(index + 1).padStart(2, '0');

        html += `
            <button class="track-row ${currentSongIndex === index ? 'playing' : ''}" data-index="${index}" type="button" aria-label="Play ${song.name}">
                <span class="track-index">${trackNumber}</span>
                <span class="track-name">${song.name}</span>
                <span class="track-duration">${duration}</span>
                <span class="track-size">${fileSize}</span>
            </button>
        `;
    });

    songsListElement.innerHTML = html;

    // Add click listeners to song items
    document.querySelectorAll('.track-row').forEach(item => {
        item.addEventListener('click', function(e) {
            const index = parseInt(this.dataset.index);
            playSong(index);
        });
    });
}

function playSong(index) {
    if (index < 0 || index >= songsList.length) return;

    currentSongIndex = index;
    const song = songsList[index];

    // Update UI
    document.getElementById('currentSong').textContent = song.name;
    document.getElementById('progressContainer').style.display = 'block';

    // Update playing class
    document.querySelectorAll('.track-row').forEach(item => item.classList.remove('playing'));
    document.querySelector(`[data-index="${index}"]`).classList.add('playing');

    // Load and play audio
    audioPlayer.src = song.webContentLink;
    audioPlayer.load();
    audioPlayer.play().catch(() => {
        document.getElementById('currentSong').textContent = `${song.name} (open link if browser blocks autoplay)`;
    });

    document.getElementById('playPauseBtn').textContent = '⏸';
}

function togglePlayPause() {
    if (!songsList.length) return;

    if (currentSongIndex === -1) {
        playSong(0);
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById('playPauseBtn').textContent = '⏸';
    } else {
        audioPlayer.pause();
        document.getElementById('playPauseBtn').textContent = '▶';
    }
}

function playPrevious() {
    if (songsList.length === 0) return;
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songsList.length - 1;
    playSong(newIndex);
}

function playNext() {
    if (songsList.length === 0) return;
    const newIndex = currentSongIndex < songsList.length - 1 ? currentSongIndex + 1 : 0;
    playSong(newIndex);
}

function updateVolume() {
    audioPlayer.volume = this.value;
}

function seekTrack(event) {
    if (!audioPlayer.duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    audioPlayer.currentTime = ratio * audioPlayer.duration;
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentTimeElement = document.getElementById('currentTime');

    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    }
}

function updateTotalTime() {
    document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(sizeInBytes) {
    if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) return 'Unknown';

    if (sizeInBytes >= 1024 * 1024) {
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.round(sizeInBytes / 1024)} KB`;
}

function buildDriveStreamUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

if (window.gsap) {
    window.addEventListener('load', () => {
        gsap.from('.album-panel, .track-panel, .player-panel', {
            opacity: 0,
            y: 18,
            duration: 0.55,
            ease: 'power2.out',
            stagger: 0.09
        });
    });
}