// OE Music - Personal Google Drive Collection
let googleAuth;
let currentSongIndex = -1;
let songsList = [];
let audioPlayer;

// Google Drive API configuration
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // You'll need to set this up
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // You'll need to set this up
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly'; // Read-only access
const ALLOWED_EMAIL = 'oetattoo888@gmail.com'; // Only allow OE's account

document.addEventListener('DOMContentLoaded', function() {
    audioPlayer = document.getElementById('audioPlayer');
    initializeGoogleAuth();
    setupEventListeners();
    updateAuthStatus();
});

function initializeGoogleAuth() {
    // Initialize Google API client
    gapi.load('client:auth2', function() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function() {
            googleAuth = gapi.auth2.getAuthInstance();
            googleAuth.isSignedIn.listen(updateAuthStatus);
            updateAuthStatus();
        });
    });
}

function setupEventListeners() {
    // Button event listeners
    document.getElementById('signinBtn').addEventListener('click', signIn);
    document.getElementById('refreshBtn').addEventListener('click', loadSongs);

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

function signIn() {
    googleAuth.signIn().then(function() {
        console.log('Signed in successfully');
        loadSongs();
    });
}

function signOut() {
    googleAuth.signOut();
}

function updateAuthStatus() {
    const authStatus = document.getElementById('authStatus');
    const authText = document.getElementById('authText');
    const signinBtn = document.getElementById('signinBtn');

    if (googleAuth && googleAuth.isSignedIn.get()) {
        const userEmail = googleAuth.currentUser.get().getBasicProfile().getEmail();

        if (userEmail === ALLOWED_EMAIL) {
            authText.textContent = `Welcome back, OE! Access granted.`;
            signinBtn.style.display = 'none';
            loadSongs();
        } else {
            authText.textContent = `Access denied. This collection is private to OE.`;
            signinBtn.textContent = 'Sign In as OE';
            signinBtn.style.display = 'inline-block';
            document.getElementById('songsList').innerHTML = '<div class="error-message"><p>This music collection is private and only accessible to the owner.</p></div>';
        }
    } else {
        authText.textContent = 'Sign in to access OE\'s music collection';
        signinBtn.style.display = 'inline-block';
        document.getElementById('songsList').innerHTML = '<div class="loading-message"><p>Sign in with Google to access OE\'s curated music collection</p></div>';
    }
}

function loadSongs() {
    if (!googleAuth || !googleAuth.isSignedIn.get()) {
        return;
    }

    const userEmail = googleAuth.currentUser.get().getBasicProfile().getEmail();
    if (userEmail !== ALLOWED_EMAIL) {
        return; // Don't load songs for unauthorized users
    }

    const songsListElement = document.getElementById('songsList');
    songsListElement.innerHTML = '<div class="loading-message"><p>Loading OE\'s music collection...</p></div>';

    // Search for audio files in OE's Google Drive
    gapi.client.drive.files.list({
        'q': "mimeType contains 'audio/'",
        'fields': 'files(id, name, size, modifiedTime, webContentLink)',
        'orderBy': 'name asc' // Alphabetical order for curated collection
    }).then(function(response) {
        songsList = response.result.files;
        displaySongs();
    }).catch(function(error) {
        console.error('Error loading songs:', error);
        songsListElement.innerHTML = '<div class="error-message"><p>Unable to load music collection. Please try again later.</p></div>';
    });
}

function displaySongs() {
    const songsListElement = document.getElementById('songsList');

    if (songsList.length === 0) {
        songsListElement.innerHTML = '<div class="empty-message"><p>OE\'s music collection is being curated. Check back soon for new tracks!</p></div>';
        return;
    }

    let html = '<div class="songs-grid">';
    songsList.forEach((song, index) => {
        const fileSize = formatFileSize(song.size);
        const modifiedDate = new Date(song.modifiedTime).toLocaleDateString();

        html += `
            <div class="song-item ${currentSongIndex === index ? 'playing' : ''}" data-index="${index}">
                <div class="song-info">
                    <h3 class="song-title">${song.name}</h3>
                    <div class="song-meta">
                        <span class="song-size">${fileSize}</span>
                        <span class="song-date">${modifiedDate}</span>
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

function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Global function for onclick handlers
function playSong(index) {
    if (typeof index === 'number') {
        playSong(index);
    }
}