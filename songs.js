// OE Music - Public Demo Collection
let currentSongIndex = -1;
let songsList = [];
let audioPlayer;

// Demo song collection - replace with your actual Google Drive public links
// To get public links: Right-click file in Google Drive > Get shareable link > Set to "Anyone with the link can view"
const DEMO_SONGS = [
    {
        name: "Demo Song 1",
        url: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_1",
        size: "3.2 MB",
        duration: "3:45"
    },
    {
        name: "Demo Song 2",
        url: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2",
        size: "4.1 MB",
        duration: "4:12"
    },
    // Add more songs here
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

    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
}

function loadDemoSongs() {
    // Load demo songs immediately - no authentication required
    songsList = DEMO_SONGS.map(song => ({
        name: song.name,
        webContentLink: song.url,
        size: song.size,
        duration: song.duration
    }));

    displaySongs();

    // Update status to show demo mode
    const authStatus = document.getElementById('authStatus');
    const authText = document.getElementById('authText');
    authText.textContent = 'Demo collection loaded - no login required';
    authStatus.style.background = 'rgba(127, 57, 251, 0.1)';
    authStatus.style.borderColor = '#7f39fb';
}

function displaySongs() {
    const songsListElement = document.getElementById('songsList');

    if (songsList.length === 0) {
        songsListElement.innerHTML = '<div class="empty-message"><p>No demo songs available. Check back later!</p></div>';
        return;
    }

    let html = '<div class="songs-grid">';
    songsList.forEach((song, index) => {
        const fileSize = song.size || 'Unknown';
        const duration = song.duration || 'Unknown';

        html += `
            <div class="song-item ${currentSongIndex === index ? 'playing' : ''}" data-index="${index}">
                <div class="song-info">
                    <h3 class="song-title">${song.name}</h3>
                    <div class="song-meta">
                        <span class="song-size">${fileSize}</span>
                        <span class="song-duration">${duration}</span>
                    </div>
                </div>
                <button class="play-song-btn" onclick="playSong(${index})">▶</button>
            </div>
        `;
    });
    html += '</div>';

    songsListElement.innerHTML = html;

    // Add click listeners to song items
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('play-song-btn')) {
                const index = parseInt(this.dataset.index);
                playSong(index);
            }
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
    document.querySelectorAll('.song-item').forEach(item => item.classList.remove('playing'));
    document.querySelector(`[data-index="${index}"]`).classList.add('playing');

    // Load and play audio
    audioPlayer.src = song.webContentLink;
    audioPlayer.load();
    audioPlayer.play();

    document.getElementById('playPauseBtn').textContent = '⏸';
}

function togglePlayPause() {
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

// Global function for onclick handlers
function playSong(index) {
    if (typeof index === 'number') {
        playSong(index);
    }
}