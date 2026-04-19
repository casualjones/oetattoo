# OE Music Setup Guide

## Personal Music Collection Setup

This is a **personal music collection** for OE Tattoo, not a user-upload system. Only OE (oetattoo888@gmail.com) can access and manage the music collection.

## Google Drive Integration Setup

To enable the OE Music functionality, you need to set up Google Drive API credentials. Follow these steps:

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Drive API
   - Google Picker API

### 2. Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen if prompted
4. Set application type to "Web application"
5. Add authorized origins:
   - `https://www.oetattoo.com`
   - `https://oetattoo.github.io` (if using GitHub Pages)
6. Add authorized redirect URIs:
   - `https://www.oetattoo.com`
   - `https://oetattoo.github.io`

### 3. Get Your API Keys
1. Create an API Key (for public access)
2. Note down your Client ID and API Key

### 4. Update the Code
In `songs.js`, replace these placeholders:
```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Client ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual API Key
```

### 5. Google Drive Folder Setup
1. Create a folder in Google Drive called "OE Tattoo Songs"
2. Share it with your email (oetattoo888@gmail.com) if needed
3. The app will automatically find audio files in your Drive

### 6. Testing
1. Upload some audio files to Google Drive
2. Visit the Song Library page
3. Sign in with Google
4. Your songs should appear and be playable

## Features
- ✅ **Personal Collection**: Only accessible to OE (oetattoo888@gmail.com)
- ✅ Browse and play songs from OE's Google Drive
- ✅ Audio player with progress bar and volume control
- ✅ Responsive design for mobile devices
- ✅ Curated music for tattoo sessions

## Security Notes
- Only OE's Google account (oetattoo888@gmail.com) can access the collection
- No public uploads allowed - this is a personal music library
- OAuth 2.0 ensures secure access to OE's Drive files

## Troubleshooting
- If songs don't load, check that the APIs are enabled
- Make sure your domain is added to authorized origins
- Clear browser cache if authentication issues occur