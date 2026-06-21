# Bitwig Studio + DAW Patch Dock Setup Guide

Complete reference for routing MIDI and audio between Bitwig Studio and the DAW Patch Dock interface.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Virtual MIDI Setup](#virtual-midi-setup)
3. [Bitwig Configuration](#bitwig-configuration)
4. [Audio Bridge Setup](#audio-bridge-setup)
5. [Patch Dock Connection](#patch-dock-connection)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Software
- **Bitwig Studio** 4.3+ (Standard, Professional, or Studio+ edition)
- **Browser** with Web MIDI support (Chrome, Edge, or Opera recommended)
- **macOS 10.15+**, **Windows 10+**, or **Linux** (Ubuntu 20.04+ with ALSA/JACK)

### Hardware
- Stable internet connection (for SDP exchange)
- Microphone or audio interface (for audio bridge)
- Recommended: 8GB RAM minimum for real-time audio streaming

---

## Virtual MIDI Setup

Virtual MIDI bridges Bitwig Studio and the browser-based patch dock.

### macOS Setup

#### Using BlackHole (Recommended for Bitwig)
1. Download **BlackHole** from [existential.audio/blackhole](https://existential.audio/blackhole)
2. Install and restart your Mac
3. BlackHole virtual MIDI ports are automatically available in Bitwig

#### Using IAC Driver (Built-in)
1. Open **Audio MIDI Setup** (Applications → Utilities)
2. Click **Window → Show MIDI Studio** (or press Cmd+2)
3. Double-click **IAC Driver**
4. Check **"Device is online"**
5. Add ports by clicking **+** button
6. Common names: "DAW Patch In", "DAW Patch Out"
7. Close and save

### Windows Setup

#### Using loopMIDI
1. Download **loopMIDI** from [tobias-erichsen.de/software/loopmidi.html](https://www.tobias-erichsen.de/software/loopmidi.html)
2. Run the installer and restart Windows
3. Open **loopMIDI** application
4. Click **+** to add a new port
5. Name it "Bitwig Patch In" or "DAW Patch Session"
6. Keep loopMIDI running while using Bitwig and patch dock

#### Alternative: VB-Audio Virtual Cable (Professional)
1. Download **VB-Audio Virtual Cable** from [vb-audio.com](https://vb-audio.com/Cable/)
2. Install and restart
3. More stable for professional use than loopMIDI
4. Appears as "CABLE Output" in Bitwig MIDI settings

### Linux Setup (JACK Recommended)

#### Using JACK2 with ALSA Sequencer
1. Install JACK:
   ```bash
   sudo apt install jackd2 jack-tools a2jmidid
   ```

2. Install QjackCtl (GUI):
   ```bash
   sudo apt install qjackctl
   ```

3. Start JACK via QjackCtl or terminal:
   ```bash
   jackd -d alsa -d hw:0
   ```

4. Enable ALSA-to-JACK bridge:
   ```bash
   a2jmidid -e &
   ```

5. Virtual ports appear in Bitwig's MIDI settings

---

## Bitwig Configuration

### Enabling MIDI Ports

1. **Open Bitwig Preferences**
   - macOS: Bitwig Studio → Preferences (Cmd+,)
   - Windows: File → Preferences (Ctrl+,)
   - Linux: File → Preferences (Ctrl+,)

2. **Navigate to MIDI I/O Connections**
   - Left sidebar → "Controllers"

3. **Add Virtual MIDI Port**
   - Click **"+"** button to add a new MIDI controller
   - Select your virtual MIDI port from the list:
     - macOS examples: "IAC Driver", "BlackHole MIDI 1"
     - Windows examples: "loopMIDI Port", "CABLE Output"
     - Linux examples: "ALSA MIDI Through"

4. **Configure Input/Output**
   - In the controller list, you'll see your port with options:
     - **MIDI In:** Enable checkbox to receive MIDI from port
     - **MIDI Out:** Enable checkbox to send MIDI to port
     - Both should be enabled for bidirectional communication

5. **Set as Control Surface (Optional)**
   - If you want Bitwig to map the port as a control surface
   - Select the port and click **"Control Surface"**
   - This enables parameter feedback

### Creating a MIDI Track for Patch Dock Input

1. **Add New MIDI Track**
   - Right-click in Track Rack → **"Add Track"** → "MIDI Track"
   - Or press Ctrl+Shift+T (Windows) / Cmd+Shift+T (macOS)

2. **Configure MIDI Input**
   - Click **Input Routing** button on track header
   - Under "MIDI Hardware" section
   - Select your virtual MIDI port (e.g., "DAW Patch In", "loopMIDI Port")
   - Channel: "All" to receive on all 16 channels

3. **Configure MIDI Output**
   - Click **Output Routing** button on track header
   - Select an instrument:
     - Built-in: **"Polysynth"**, **"Wavetable"**, **"Electric"**
     - Plugin: Any VST/AU synth
     - Hardware: External MIDI device (if available)

4. **Test Reception**
   - Click **Input Monitor** (eye icon) to monitor incoming MIDI
   - MIDI notes should trigger the selected instrument
   - Watch the activity indicator light up on incoming messages

### Example MIDI Track Configuration

```
Track Type: MIDI
Track Name: "Patch Dock Input"
MIDI Input: Your virtual port (e.g., "loopMIDI Port")
MIDI Channel: All
MIDI Output: Polysynth (or your chosen instrument)
Input Monitor: Enabled (eye icon ON)
Volume: -6dB (adjust as needed)
```

### Setting Up a Return Track for Audio Bridge

1. **Create FX Return Track**
   - Right-click in Track Rack → **"Add FX Track"**
   - Label: "Remote Mix" or "Collaborator"

2. **Audio Input Routing**
   - If receiving audio from patch dock via system audio:
     - Use Mac/Windows system audio capture
     - Or configure audio interface input dedicated to remote mix

3. **Audio Output Routing**
   - Set to **"Master"** for monitoring
   - Add **Limiter** device to prevent clipping

4. **Volume Automation**
   - Enable automation recording for return track
   - Draw automation envelope to control remote mix level over time

---

## Audio Bridge Setup

### Configuring Bitwig for Audio I/O

1. **Preferences → Audio Tab**
   - Audio Engine Driver: Select your audio interface
   - Buffer Size: 256 samples (for latency optimization)
   - Sample Rate: 48000 Hz (recommended for network audio)

2. **Audio I/O Setup**
   - Input: Assign microphone to Bitwig input
   - Output: Main speakers or monitor outputs
   - Latency Compensation: Enabled (automatic)

### Creating Audio Send Busses

1. **Set Up Send Tracks for Patch Dock**
   - Create **FX Return Tracks:**
     - "Remote Collab Audio" (incoming from collaborator)
     - "Send Out" (your audio going to patch dock)

2. **Route Your Audio Out**
   - On any audio track, locate **"Sends"** section
   - Drag audio to "Send Out" track
   - This audio feeds into patch dock's audio bridge

3. **Monitor Remote Audio**
   - The "Remote Collab Audio" return track receives your collaborator's mix
   - Adjust fader to blend with your local mix
   - Add EQ or compression to shape the remote audio

### Audio Routing Diagram

```
Your Microphone Input
        ↓
    AudioContext
        ↓
    RTCPeerConnection (patch dock)
        ↓
    Collaborator's Browser ←→ Their DAW
        ↓
    RTCPeerConnection (patch dock)
        ↓
    Your System Audio Input
        ↓
"Remote Mix" Return Track in Bitwig
        ↓
    Your Speakers/Monitors
```

---

## Patch Dock Connection

### Complete Connection Workflow

1. **Access Patch Dock**
   - Open browser (Chrome, Edge, or Opera)
   - Navigate to your patch dock website
   - Login with passphrase: `707_trees`

2. **Enable Audio Bridge**
   - Scroll to **"Audio Bridge"** section in patch dock
   - Toggle **"Enable Audio Stream"** switch
   - Click **"Allow"** on browser microphone permission prompt
   - Input level meter should show activity

3. **Create Patch Session**
   - Click **"Create Offer"** button
   - Your SDP (Session Description Protocol) generates
   - Share via **QR Code** (show on screen) or **Copy SDP** (paste to collaborator)

4. **Connect with Collaborator**
   - Wait for collaborator's SDP answer
   - Paste into **"Remote SDP"** field
   - Click **"Apply Answer"**
   - Wait 2-3 seconds for WebRTC handshake
   - Status should change to "Connected"

5. **Configure MIDI Patching**
   - In **"MIDI Patch Panel"**:
     - **MIDI Input:** Select your Bitwig virtual MIDI port
     - **Patch Mode:** Choose direction:
       - **"DAW → Session":** Bitwig MIDI sent to collaborator
       - **"Session → DAW":** Receive collaborator MIDI in Bitwig
       - **"Bidirectional":** Both directions (use with caution)
     - Click **"Connect MIDI"** button

6. **Sync Tempo**
   - Adjust **Tempo slider** (60-180 BPM) in patch dock
   - Enable **Tempo Follower** in Bitwig:
     - Preferences → Sync/Link → Follow MIDI Clock
   - Both DAWs stay synchronized automatically

### MIDI Patch Modes

| Mode | Direction | Best For |
|------|-----------|----------|
| **DAW → Session** | Bitwig → Collaborator | You control the rhythm |
| **Session → DAW** | Collaborator → Bitwig | They control the rhythm |
| **Bidirectional** | Both ways simultaneously | Full collaboration (potential feedback loops) |

---

## Advanced Bitwig Features

### Using Bitwig's Link Sync

1. **Enable Link in Preferences**
   - Preferences → Sync/Link → **"Enable Link"** toggle
   - Bitwig connects to Ableton Link network

2. **Link with Patch Dock**
   - If collaborator also uses Link, both DAWs auto-sync
   - Tempo and timing sync across the network
   - More reliable than manual MIDI clock

3. **Combine with Patch Dock MIDI**
   - Use Link for tempo sync
   - Use patch dock for MIDI note data
   - Provides redundancy and flexibility

### Drum Machine Workflow

1. **Load Bitwig Drum Machine** device
2. Route patch dock MIDI to Drum Machine track
3. Set **Patch Mode** to "DAW → Session"
4. Your drum patterns send to collaborator in real-time
5. Listen back via Audio Bridge

### Synth Parameter Automation

1. Create a MIDI track with macro controls
2. Map synth parameters to macros
3. Record MIDI CC data to patch dock
4. Collaborator receives parameter changes

### Recording Patch Sessions

1. Create an **Audio Track** labeled "Session Recording"
2. Route Master output to this track
3. Toggle **Input Monitor** (eye icon) ON
4. Press **Record** on Master track
5. Start your patch session
6. Session records to disk automatically
7. Export audio after session ends

---

## Troubleshooting

### "Virtual MIDI Port Not Appearing in Bitwig"

**Problem:** Created port but Bitwig doesn't detect it  
**Solutions:**
1. Restart Bitwig completely
2. In Preferences → Controllers: Click refresh button
3. On Windows: Restart loopMIDI application
4. Check Windows Device Manager for MIDI driver conflicts
5. On Mac: Verify IAC Driver is "online" in Audio MIDI Setup

### "No Audio from Collaborator"

**Problem:** Patch session connected but can't hear remote audio  
**Solutions:**
1. Check **"Monitor"** toggle enabled in Audio Bridge panel
2. Verify microphone permission in browser settings
3. Check Bitwig's input monitoring is enabled
4. In "Remote Mix" return track: Fader should be up (not -∞)
5. Test locally first: Speak into mic, watch level meter in patch dock

### "MIDI Not Transmitting from Bitwig"

**Problem:** Pressing keys but collaborator receives nothing  
**Solutions:**
1. Verify **Patch Mode** is "DAW → Session" or "Bidirectional"
2. In Bitwig: Click track's Input Monitor icon (eye) to activate
3. In Preferences → Controllers: Verify your virtual port has "MIDI In" enabled
4. Test with **"Send Test MIDI Note"** button in patch dock
5. Check browser console (F12) for JavaScript errors

### "Latency Issues / Audio Stuttering"

**Problem:** Bitwig performance is slow or audio breaks up  
**Solutions:**
1. Increase buffer size: Preferences → Audio → 512 samples
2. Disable audio bridge temporarily to isolate the issue
3. Close unnecessary plugins/tracks
4. Check CPU meter in Bitwig (should be <80%)
5. Monitor network latency: Use ping utility
6. Use wired Ethernet instead of WiFi
7. Disable WiFi on non-essential devices

### "Passphrase Login Fails"

**Problem:** Patch dock login page rejects entry  
**Solutions:**
1. Clear browser cache: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. Try private/incognito window
3. Verify exact passphrase: `707_trees` (case-sensitive)
4. Check browser console (F12 → Console) for errors
5. Try a different browser (Chrome, Edge, Opera)

### "MIDI CC Automation Glitchy"

**Problem:** CC messages cause pops, clicks, or note dropouts  
**Solutions:**
1. Reduce MIDI CC transmission rate in patch dock
2. Increase buffer size for more stable processing
3. Use MIDI learn instead of direct CC routing
4. Smooth CC changes with Bitwig's smoothing device
5. Test individual CC parameters to isolate problematic ones

---

## Performance Optimization Tips

### CPU Usage
- Use **Wavetable** (CPU-efficient synth) instead of complex plugins
- Freeze tracks when not actively editing
- Disable real-time MIDI visualization
- Close other browser tabs while using patch dock

### Network Latency
- Ethernet connection preferred over WiFi
- Target: <50ms latency for real-time feel
- Check ping to collaborator: `ping [their-ip]`
- Avoid peak internet usage times

### Audio Quality
- Set sample rate to 48000 Hz
- Use 24-bit audio for higher fidelity
- Limit buffer size to 256 samples
- Position microphone 6-12 inches from mouth

---

## Bitwig-Specific Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd+,** / **Ctrl+,** | Open Preferences |
| **Cmd+Shift+T** / **Ctrl+Shift+T** | Add MIDI Track |
| **Cmd+M** / **Ctrl+M** | Add Return Track |
| **Tab** | Show/Hide Track Rack |
| **F1** | Open Help |

---

## Related Documentation

- [DAW Patch Dock README](./README.md)
- [Ableton Live Setup Guide](./ABLETON_SETUP.md)
- [Browser Audio Requirements](./AUDIO_BRIDGE_REQUIREMENTS.md)

---

**Last Updated:** June 2024  
**Tested With:** Bitwig Studio 5.0+, Chrome 125+, macOS 13+/Windows 11+  
**Feedback:** Report issues in GitHub Issues or contact support
