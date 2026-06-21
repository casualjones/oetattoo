# DAW Patch Dock - Remote Collaboration System

Stream MIDI and live audio between your DAW and a collaborator's setup using WebRTC and Web MIDI APIs. No server required—peer-to-peer architecture with manual SDP exchange.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [System Architecture](#system-architecture)
4. [Features](#features)
5. [Browser Support](#browser-support)
6. [Installation](#installation)
7. [Usage Guide](#usage-guide)
8. [DAW Setup Guides](#daw-setup-guides)
9. [Troubleshooting](#troubleshooting)
10. [Technical Details](#technical-details)

---

## 🎯 Overview

**DAW Patch Dock** is a dockable web interface that bridges your DAW with a remote collaborator's setup over the internet:

- **MIDI Routing:** Send/receive MIDI notes, CC, tempo sync
- **Audio Streaming:** Live audio + your mix to/from collaborator
- **Session Management:** QR codes, SDP exchange, connection status
- **Real-time Metering:** Input level visualization and gain control
- **No Infrastructure:** Pure peer-to-peer WebRTC—no servers, no subscriptions

### Perfect For
- Remote music production collaboration
- Live jam sessions across locations
- Band rehearsals with distributed members
- Real-time mentoring and teaching

---

## 🚀 Quick Start (10 minutes)

### Prerequisites
- **Browser:** Chrome, Edge, or Opera (Web MIDI + WebRTC support)
- **DAW:** Ableton, Bitwig, FL Studio, Logic, or any MIDI-capable DAW
- **Virtual MIDI:** Loopback drivers installed (see OS-specific setup below)
- **Internet:** Stable connection (2+ Mbps recommended)

### Step 1: Access the Patch Dock

1. Open your browser (Chrome, Edge, or Opera)
2. Navigate to: `https://your-domain.com/index.html#patch-app`
3. Enter passphrase: `707_trees`
4. Wait for onboarding panel to load

### Step 2: Set Up Virtual MIDI

**macOS:**
- Download [BlackHole](https://existential.audio/blackhole) or use built-in IAC Driver
- See [Ableton Setup](./ABLETON_SETUP.md#macos-setup) or [Bitwig Setup](./BITWIG_SETUP.md#macos-setup)

**Windows:**
- Download [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)
- See [Ableton Setup](./ABLETON_SETUP.md#windows-setup) or [Bitwig Setup](./BITWIG_SETUP.md#windows-setup)

**Linux:**
- ALSA Loopback built-in or [JACK](https://jackaudio.org/)
- See [Ableton Setup](./ABLETON_SETUP.md#linux-setup) or [Bitwig Setup](./BITWIG_SETUP.md#linux-setup)

### Step 3: Enable Audio Bridge (Optional)

1. In patch dock, find **"Audio Bridge"** section
2. Toggle **"Enable Audio Stream"**
3. Grant microphone permission when browser prompts
4. Watch input level meter for confirmation
5. If green bar shows activity → Audio is working

### Step 4: Create a Patch Session

1. Click **"Create Offer"** button
2. Your SDP (Session Description Protocol) generates
3. Choose sharing method:
   - **QR Code:** Show QR on screen for collaborator to scan
   - **Copy SDP:** Paste text to collaborator via Slack/Discord

### Step 5: Connect with Collaborator

1. Receive collaborator's SDP (their "Remote SDP")
2. Paste into the **"Remote SDP"** field
3. Click **"Apply Answer"**
4. Status changes from "Initializing" → "Connected" (2-3 seconds)
5. Activity Log shows connection confirmations

### Step 6: Route MIDI

1. **MIDI Input Selector:** Pick your DAW's virtual MIDI port
2. **Patch Mode:** Choose direction:
   - **DAW → Session:** You send MIDI
   - **Session → DAW:** Receive MIDI
   - **Bidirectional:** Both directions
3. Start playing—MIDI routes in real-time

### Step 7: Sync Tempo

1. Adjust **Tempo slider** (60-180 BPM)
2. DAW should sync automatically
3. Check Activity Log for confirmation

**Done!** You're now collaborating in real-time.

---

## 🏗️ System Architecture

### Peer-to-Peer Model

```
Your Computer                      Collaborator's Computer
┌──────────────┐                   ┌──────────────┐
│  Browser     │                   │  Browser     │
│  ├─ WebRTC   │◄──internet──────►│  ├─ WebRTC   │
│  └─ Web MIDI │      (SDP)        │  └─ Web MIDI │
└────┬─────────┘                   └────┬─────────┘
     │                                    │
     ▼                                    ▼
┌──────────────┐                   ┌──────────────┐
│   Your DAW   │                   │ Their DAW    │
│ (Ableton,    │                   │ (Bitwig,     │
│  Bitwig...)  │                   │  Logic...)   │
└──────────────┘                   └──────────────┘
```

### Data Flow

1. **MIDI:** Local DAW → Virtual MIDI Port → Browser → WebRTC → Remote Browser → Virtual Port → Remote DAW
2. **Audio:** Local Microphone → AudioContext → RTCPeerConnection → Remote AudioContext → Remote Speakers
3. **Tempo:** Slider → Data Channel → Remote Data Channel → Remote DAW Tempo Sync

### Connection Sequence

```
You                                  Them
  │                                   │
  ├──► Click "Create Offer"          │
  │    (RTCPeerConnection created)    │
  │                                   │
  ├──► Generate SDP Offer             │
  │    (send via QR/copy)             │
  │    ──────────────────────────────►│
  │                                   ├──► Receive Offer
  │                                   │    (RTCPeerConnection created)
  │                                   │
  │                                   ├──► Generate SDP Answer
  │                                   │    (send back to you)
  │◄──────────────────────────────────├──
  │    Receive Answer                 │
  │    (setRemoteDescription)         │
  │                                   │
  ├──► ICE Candidates Exchanged (automatic)
  │    ──────────────────────────────►│
  │◄──────────────────────────────────├──
  │    (STUN server helps NAT traversal)
  │                                   │
  ├─────────CONNECTION ESTABLISHED────┤
  │    (WebRTC fully connected)       │
  │    Audio & MIDI streaming begins  │
  │◄──────────────────────────────────►│
```

---

## ✨ Features

### MIDI Patching
- **Multi-directional:** Send MIDI, receive MIDI, or both
- **Real-time Routing:** <50ms latency typical
- **Status Indicators:** Connection state, active notes, incoming CC
- **Test Utilities:** Send test MIDI note for diagnostics

### Audio Bridge
- **Live Input:** Microphone/audio interface capture
- **Frequency Analysis:** Real-time dB level metering
- **Gain Control:** Input gain (0-200%) and output volume (0-200%)
- **Remote Monitoring:** Enable/disable hearing collaborator's audio
- **Echo Cancellation:** Built-in noise suppression

### Session Management
- **QR Code Generation:** One-click SDP sharing
- **Copy/Paste SDP:** Alternative sharing method
- **Connection Status:** Visual indicators and text updates
- **Activity Logging:** Full event history for debugging
- **Dock Positioning:** Move patch dock left/right on screen
- **Session Reset:** Clear and reconnect quickly

### Onboarding & Documentation
- **Interactive Setup Panel:** Requirements checklist
- **Getting Started Guide:** 6-step workflow
- **Quick Reference:** Definitions and shortcuts
- **Responsive Design:** Desktop, tablet, mobile

---

## 🌐 Browser Support

| Browser | Web MIDI | WebRTC Audio | Tested |
|---------|----------|--------------|--------|
| **Chrome** | ✅ | ✅ | Yes (v125+) |
| **Edge** | ✅ | ✅ | Yes (v125+) |
| **Opera** | ✅ | ✅ | Yes (v111+) |
| **Firefox** | ❌ | ✅ | Partial (no MIDI) |
| **Safari** | ❌ | ✅ | macOS 14.1+ (no MIDI) |

**Recommended:** Chrome or Edge for full feature support.

---

## 📦 Installation

### Local Development

```bash
# Clone or download the repository
git clone https://github.com/yourusername/daw-patch-dock.git
cd daw-patch-dock

# Start a local server (Python 3)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Production Deployment

#### GitHub Pages (Free)
1. Push repository to GitHub
2. Settings → Pages → Source: `main` branch
3. Site available at: `https://username.github.io/daw-patch-dock`

#### Custom Domain
1. Purchase domain (e.g., Namecheap, GoDaddy)
2. Update GitHub Pages DNS settings
3. Or use any hosting (Vercel, Netlify, etc.)

#### HTTPS Requirement
- **Local:** Works on `localhost`
- **Remote:** Requires HTTPS (browsers block microphone access on HTTP)
- Use free SSL (Let's Encrypt) on your hosting provider

### File Structure

```
daw-patch-dock/
├── index.html                    # Main page + patch dock UI
├── style.css                     # All styling (2000+ lines)
├── script.js                     # WebRTC, Web MIDI, audio logic
├── ABLETON_SETUP.md              # Ableton Live integration guide
├── BITWIG_SETUP.md               # Bitwig Studio integration guide
├── README.md                     # This file
└── images/
    └── [your-content]
```

---

## 📖 Usage Guide

### Typical Workflow

**Setup Phase (One-time)**
1. Both collaborators: Install virtual MIDI drivers
2. Both: Configure DAW to use virtual MIDI ports
3. Both: Add Patch Dock URL to bookmarks

**Session Phase (Every collab)**
1. One person: Click "Create Offer" in patch dock
2. Share SDP via QR or copy/paste
3. Other person: Paste SDP and click "Apply Answer"
4. Wait for "Connected" status (2-3 seconds)
5. Enable Audio Bridge (optional)
6. Enable MIDI Patching (required)
7. Set Tempo (automatic sync)
8. Start making music!

### Best Practices

**Before Session**
- Test microphone and speakers separately
- Confirm internet connection (run speedtest)
- Close unnecessary applications (frees CPU)
- Use wired Ethernet if available (more stable than WiFi)

**During Session**
- Keep Activity Log visible (watch for errors)
- Start with MIDI only, then add audio
- Adjust gains to avoid clipping (meter should peak yellow)
- Use headphones to prevent feedback
- Take breaks every 30 minutes

**After Session**
- Click "Reset Session" when done
- Export audio recording if capturing
- Close browser tab / quit Patch Dock
- Note any latency or issues for next time

### Troubleshooting Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| MIDI not transmitting | Wrong patch mode | Check "DAW → Session" or "Bidirectional" |
| Audio is silent | Monitor disabled | Toggle "Monitor" switch ON |
| Passphrase rejected | Wrong text | Verify exactly `707_trees` (case-sensitive) |
| High latency (>200ms) | Poor internet | Check ping to collaborator, use Ethernet |
| CPU spike | Too many plugins | Reduce tracks, increase buffer size |
| Browser blocked mic | HTTPS required | Use localhost or HTTPS domain |
| MIDI port missing | Not selected | Refresh page, restart DAW + browser |

---

## 🎛️ DAW Setup Guides

Detailed setup instructions for popular DAWs:

### Ableton Live
→ **[Complete Ableton Setup Guide](./ABLETON_SETUP.md)**

Topics covered:
- Virtual MIDI setup (macOS, Windows, Linux)
- Preferences configuration
- MIDI track creation and routing
- Audio bridge setup with return tracks
- Latency optimization
- Troubleshooting

### Bitwig Studio
→ **[Complete Bitwig Setup Guide](./BITWIG_SETUP.md)**

Topics covered:
- Virtual MIDI setup (BlackHole, loopMIDI, JACK)
- Controller configuration
- MIDI track setup and input monitoring
- Audio I/O and return tracks
- Link sync integration
- Performance optimization

### Other DAWs

**FL Studio:**
- Add instrument to new MIDI track
- Route MIDI input to virtual port
- Output to synth
- Monitor enabled for live playback

**Logic Pro:**
- Create software instrument track
- Set MIDI input to virtual port
- Output to any Logic synth/sampler
- Set monitoring to "ON"

**Reaper:**
- Create MIDI track (Insert → New Track)
- Route input to virtual MIDI port
- Arm track for monitoring
- Select any built-in or VST instrument

**Studio One:**
- Insert MIDI track
- Set input to virtual port
- Select instrument for output
- Enable monitoring

---

## 🔧 Technical Details

### APIs Used

| API | Purpose | Browser Support |
|-----|---------|-----------------|
| **Web MIDI** | MIDI I/O enumeration and messaging | Chrome, Edge, Opera |
| **WebRTC** | Peer-to-peer audio/data channels | All modern browsers |
| **getUserMedia** | Microphone access | All modern browsers |
| **Web Audio API** | Audio context, analysis, metering | All modern browsers |
| **Canvas API** | Frequency meter visualization | All modern browsers |

### Security Considerations

- **Passphrase:** Local validation only (no server)
- **Microphone:** Requires explicit user permission
- **WebRTC:** End-to-end encrypted by default
- **Data:** No third-party servers; peer-to-peer only
- **HTTPS:** Required for production (browser policy)

### Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| MIDI Latency | <50ms typical | Depends on network |
| Audio Latency | 20-120ms total | System buffer + network |
| CPU Usage | 5-15% (idle) | Increases with plugins |
| Memory | 50-100MB | Growing with session time |
| Bandwidth | 1-3 Mbps (audio on) | < 0.5 Mbps (MIDI only) |

### STUN Server

Patch Dock uses Google's free STUN server for NAT traversal:
```
stun:stun.l.google.com:19302
```

No configuration needed—automatic fallback if unavailable.

### Browser Console Logs

Enable for debugging:
1. Press **F12** or **Cmd+Option+J** (macOS)
2. Click **Console** tab
3. Check for error messages and warnings
4. Share console output when reporting bugs

---

## 🐛 Troubleshooting

### Connection Issues

**"Cannot connect to remote peer"**
- Verify both people entered SDP correctly
- Check no typos or extra whitespace
- Try QR code instead of copy/paste
- Both browsers must be Chrome/Edge/Opera
- Internet connection must be stable

**"ICE candidates not connecting"**
- STUN server may be blocked by firewall
- Ask your network admin to unblock:
  - UDP port 19302 (STUN)
  - TCP 443 (backup)
- Try on different WiFi network
- Use cellular hotspot as fallback

### Audio Issues

**"Microphone permission denied"**
- Click site info (lock icon) in address bar
- Reset camera/microphone permissions
- Refresh page and try again
- Try private/incognito mode
- Restart browser

**"Audio level meter not moving"**
- Check microphone is unmuted
- Verify volume is not at 0
- Look in browser settings → Privacy → Microphone
- Try different microphone
- Test microphone in system settings first

**"Echo / Feedback in remote audio"**
- Disable remote audio monitoring (toggle OFF)
- Use headphones instead of speakers
- Move microphone away from speakers
- Reduce input gain in Audio Bridge
- Have collaborator reduce their output level

### MIDI Issues

**"MIDI port not showing in dropdown"**
- Restart both browser and DAW
- Verify virtual MIDI is installed and running
- In DAW preferences, toggle MIDI port off/on
- Refresh browser page
- Check browser console for errors

**"Notes sent but collaborator receives nothing"**
- Verify Patch Mode is "DAW → Session" or "Bidirectional"
- Check MIDI track is "Armed" or "Input Monitor" is ON
- Send test MIDI note with the test button
- Check Activity Log for "MIDI transmitted" messages
- Ask collaborator to check their MIDI input selection

**"Tempo sync not working"**
- Enable "Follow MIDI Clock" in DAW preferences
- Adjust Tempo slider in Patch Dock (should update)
- Check Activity Log for tempo change messages
- Verify connection is stable ("Connected" status)

### Performance Issues

**"CPU usage very high"**
- Reduce number of active tracks/plugins
- Increase buffer size (Preferences → Audio)
- Close other browser tabs
- Disable real-time MIDI visualization
- Reduce screen resolution temporarily

**"Audio crackling/stuttering"**
- Increase buffer size to 512 samples
- Disconnect USB devices not in use
- Close background applications
- Move closer to WiFi router
- Switch to wired Ethernet connection
- Reduce system volume slightly

---

## 📞 Support & Feedback

### Getting Help
1. Check [Troubleshooting](#troubleshooting) section
2. Review DAW-specific setup guides (Ableton/Bitwig)
3. Check browser console for error messages (F12 → Console)
4. Try alternative browser (Chrome vs. Edge)
5. Reset browser permissions and cookies

### Reporting Bugs
Include:
- Browser name and version (e.g., Chrome 125.0)
- Operating system (macOS 14, Windows 11, Ubuntu 22.04)
- Error message from browser console (F12 → Console)
- Steps to reproduce the issue
- Screenshot of Activity Log

### Feature Requests
- Discord: [Your community server]
- GitHub Issues: [Your repo issues]
- Email: [Your contact email]

---

## 📝 License

MIT License - Use freely for personal and commercial projects.

---

## 🙏 Credits

Built with:
- **WebRTC** - Peer-to-peer connectivity
- **Web MIDI API** - DAW hardware integration
- **Web Audio API** - Audio processing and analysis
- **GSAP** - Interface animations
- **Three.js** - 3D visuals (hero section)
- **QRCode.js** - SDP sharing via QR

---

## 📈 Roadmap

Planned features:
- [ ] Telemetry dashboard (latency, bandwidth tracking)
- [ ] Preset management (save/load session configurations)
- [ ] Recording support (automatic session capture)
- [ ] Mobile UI optimization (responsive design)
- [ ] Signaling server option (alternative to manual SDP)
- [ ] FX plugin chaining (VST remote control)
- [ ] Video chat integration
- [ ] Support for more DAWs (Reaper, Cubase, Studio One)

---

**Last Updated:** June 2024  
**Current Version:** 1.0  
**Status:** Production Ready

For latest updates, visit: [your-repository-url](https://github.com/yourusername/daw-patch-dock)
