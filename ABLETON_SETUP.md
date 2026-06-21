# Ableton Live + DAW Patch Dock Setup Guide

A complete reference for routing MIDI and audio between Ableton Live and the DAW Patch Dock interface.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Virtual MIDI Setup](#virtual-midi-setup)
3. [Ableton Configuration](#ableton-configuration)
4. [Audio Bridge Setup](#audio-bridge-setup)
5. [Patch Dock Connection](#patch-dock-connection)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Software
- **Ableton Live** 11+ (Standard or Suite edition)
- **Browser** with Web MIDI support (Chrome, Edge, or Opera recommended)
- **macOS 10.15+**, **Windows 10+**, or **Linux** (Ubuntu 20.04+)

### Hardware
- Stable internet connection (for SDP exchange)
- Microphone or audio interface (for audio bridge)
- Recommended: 8GB RAM minimum for real-time audio streaming

---

## Virtual MIDI Setup

Virtual MIDI is required to bridge Ableton and the browser-based patch dock.

### macOS Setup

#### Option 1: Using IAC Driver (Built-in)
1. Open **Audio MIDI Setup** (Applications → Utilities)
2. Click **Window → Show MIDI Studio** (or press Cmd+2)
3. Double-click **IAC Driver**
4. Check **"Device is online"** if not already enabled
5. Click the **+** button to add ports (if needed)
6. Common port names: "DAW Patch Aux 1", "DAW Patch Aux 2"
7. Close and save

#### Option 2: Using BlackHole (Recommended)
1. Download **BlackHole** from [existential.audio/blackhole](https://existential.audio/blackhole)
2. Install and restart your Mac
3. Open **Audio MIDI Setup**
4. BlackHole virtual ports appear automatically in MIDI Studio
5. No additional configuration needed

### Windows Setup

#### Using loopMIDI
1. Download **loopMIDI** from [tobias-erichsen.de/wp-content/uploads/2021/06/loopMIDISetup_v1.30.zip](https://www.tobias-erichsen.de/software/loopmidi.html)
2. Run installer and restart
3. Launch **loopMIDI** after restart
4. Click **+** button to add a new virtual port
5. Name it "DAW Patch Session" or similar
6. Keep loopMIDI running while using patch dock

### Linux Setup

#### Using ALSA Loopback (Built-in)
1. ALSA loopback is typically pre-installed
2. Verify with terminal:
   ```bash
   aconnect -l
   ```
3. Look for "MIDI Through Port"
4. If not available, load module:
   ```bash
   sudo modprobe snd_seq_loopback
   ```

---

## Ableton Configuration

### Enabling MIDI Input from Virtual Port

1. **Open Ableton Live Preferences**
   - macOS: Ableton → Preferences (Cmd+,)
   - Windows: Options → Preferences (Ctrl+,)

2. **Navigate to MIDI/Sync Tab**
   - Left sidebar → MIDI Sync

3. **Input Port Configuration**
   - Under "MIDI Ports", locate your virtual MIDI port
   - (macOS IAC Example: "IAC Driver - DAW Patch Aux 1")
   - (Windows loopMIDI Example: "loopMIDI Port")
   - Click the **Input** checkbox for that port (set to "On")

4. **Output Port Configuration**
   - Same port: Set **Output** checkbox to "On"
   - This allows bidirectional communication

5. **Control Surface (Optional)**
   - If you want Ableton's interface to receive MIDI feedback:
   - Add the virtual port as a Control Surface
   - This enables two-way sync of clips, parameters, etc.

### Creating a MIDI Track for Incoming Patch Data

1. **Create a new MIDI Track** (Cmd+Shift+T / Ctrl+Shift+T)
2. **Set MIDI Input**
   - Click the MIDI input dropdown
   - Select your virtual MIDI port
   - Channel: "All" (to receive on all channels)
3. **Set MIDI Output** (Optional)
   - Select a synth, sampler, or external instrument
   - This routes received MIDI to sound generation
4. **Arm for Recording** (Optional)
   - Red record button on track header
   - Incoming MIDI will be recorded to Ableton's timeline
5. **Enable Track Monitoring**
   - Set **Monitor** to "In" to hear the instrument in real-time

### Example Track Setup

**Track Type:** MIDI  
**Input:** Virtual Port (e.g., "DAW Patch Aux 1")  
**Output:** Instrument (e.g., "Wavetable" synth)  
**Channel:** All  
**Monitoring:** In  
**Volume:** Adjust as needed  

---

## Audio Bridge Setup

### Configuring Ableton for Audio I/O

1. **Preferences → Audio Tab**
   - Audio Device: Select your interface or built-in audio
   - Sample Rate: 44100 Hz or 48000 Hz (48kHz recommended for streaming)
   - Buffer Size: 256 samples (balance between latency and CPU)

2. **Set Up Return Tracks for Remote Audio**
   - Go to **Master track** → Right side panel
   - Create return tracks:
     1. **Return A:** "Remote Collaborator" (for incoming audio from patch dock)
     2. **Return B:** "Local Send" (for sending your mix out)

3. **Audio Routing for Collaborator Mix**
   - Create a new **Audio Track** for monitoring remote audio
   - Label: "Collaborator Mix"
   - Input: Assign to your interface's input (or use Mac/Windows system audio capture)
   - Output: Assign to a return track
   - This allows you to mix the remote audio with your local tracks

### Sending Your Mix to Patch Dock

1. **Create a Send Track**
   - Right-click Master track → **Add Return Track**
   - Label: "Send to Patch"

2. **Route Tracks to Send**
   - On any MIDI/Audio track, locate **Send A** knob
   - Increase to send that track's audio to the return track

3. **Monitor the Send Output**
   - Place a **limiter** on the return track to prevent clipping
   - Adjust return track's fader to control send level
   - This audio feeds into the patch dock's audio bridge

---

## Patch Dock Connection

### Step-by-Step Connection Process

1. **Open DAW Patch Dock in Browser**
   - Navigate to [your-website]/index.html in Chrome/Edge
   - Enter passphrase: `707_trees`

2. **Enable Audio Bridge** (in patch dock)
   - Toggle "Enable Audio Stream"
   - Grant microphone permission when prompted
   - Input should show a live level meter

3. **Create a Patch Session**
   - Click **"Create Offer"**
   - Share your SDP with collaborator (QR code or copy/paste)

4. **Receive Collaborator's SDP**
   - Ask collaborator to share their "Remote SDP"
   - Paste into **"Remote SDP"** field in patch dock
   - Click **"Apply Answer"**
   - Connection status should show "Connected"

5. **Configure MIDI Patching**
   - In patch dock, under **"MIDI Patch Panel"**:
     - **MIDI Input:** Select your Ableton virtual port
     - **Patch Mode:** Choose:
       - "DAW → Session": Send Ableton MIDI out to collaborator
       - "Session → DAW": Receive collaborator MIDI into Ableton
       - "Bidirectional": Both directions simultaneously

6. **Sync Tempo**
   - Adjust **Tempo slider** in patch dock (60-180 BPM)
   - Ableton's tempo syncs automatically when connected
   - Monitor Activity Log for sync confirmations

### MIDI Patch Modes Explained

| Mode | Direction | Use Case |
|------|-----------|----------|
| **DAW → Session** | Ableton sends MIDI to collaborator | Ableton is the controller |
| **Session → DAW** | Collaborator sends MIDI to Ableton | Ableton is the receiver |
| **Bidirectional** | Both directions simultaneously | Full collaboration (may cause feedback) |

---

## Audio Latency Optimization

### Reducing Latency in Ableton

1. **Lower Buffer Size**
   - Preferences → Audio → Buffer Size: 128 or 64 samples
   - Tradeoff: Lower = less latency but higher CPU usage

2. **Disable Unnecessary Plugins**
   - Each VST adds latency
   - Use simpler instruments for real-time patching

3. **Audio Bridge Settings**
   - In patch dock: Adjust "Input Gain" (not volume)
   - Monitor Input Level meter for peak levels
   - Avoid clipping (meter should stay green/yellow)

4. **Network Optimization**
   - Use 5GHz WiFi or Ethernet for stable connection
   - Ping should be <50ms for real-time feel
   - Test with: `ping [collaborator-ip]`

### Typical Latency Expectations
- Local system latency: 10-20ms (buffer-dependent)
- Network latency: 20-100ms (depends on internet)
- **Total:** 30-120ms (acceptable for most music workflows)

---

## Troubleshooting

### "MIDI Port Not Appearing in Patch Dock"

**Problem:** Virtual MIDI port created but not showing in browser interface  
**Solutions:**
1. Refresh browser page (F5)
2. Restart Ableton
3. In Ableton Preferences → MIDI/Sync: Toggle Input "On" then "Off" then back "On"
4. Check browser console (F12 → Console) for errors

### "Audio Not Streaming / Silent Remote Audio"

**Problem:** Enable Audio Bridge works but no sound from collaborator  
**Solutions:**
1. Check **"Monitor"** toggle in Audio Bridge panel (should be enabled)
2. Verify microphone permission in browser settings
3. Check browser console for permission errors
4. Test local audio: Enable audio bridge, speak into mic, watch level meter
5. Restart patch session and reconnect

### "MIDI Messages Not Received"

**Problem:** Sending MIDI but collaborator doesn't receive it  
**Solutions:**
1. Check **Patch Mode** is set to "DAW → Session" or "Bidirectional"
2. In Ableton: Create MIDI notes on the track to send
3. Verify the virtual MIDI port is selected in patch dock ("MIDI Input" dropdown)
4. Check Activity Log in patch dock for MIDI event confirmations
5. Test with "Send Test MIDI Note" button in patch dock

### "High CPU Usage / Audio Crackles"

**Problem:** Ableton running slowly or audio stuttering  
**Solutions:**
1. Increase buffer size: Preferences → Audio → 512 samples
2. Disable audio bridge temporarily
3. Disable unnecessary return tracks
4. Reduce number of active MIDI/audio tracks
5. Close other browser tabs
6. Check Activity Monitor (macOS) or Task Manager (Windows) for CPU hogs

### "Passphrase Login Not Working"

**Problem:** Patch dock login repeatedly fails  
**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Try incognito/private browsing mode
3. Verify passphrase is exactly: `707_trees` (case-sensitive)
4. Check browser console (F12) for JavaScript errors

---

## Advanced Tips

### Creating Stems for Collaboration

1. **Individual Channels:** Create separate return tracks for each instrument
2. **Stem Export:** Before session, freeze MIDI to audio for cleaner collaboration
3. **Color Coding:** Use track colors to identify which stems come from patch dock

### Automating MIDI Send Levels

1. Create MIDI CC automation on virtual port sends
2. Example: Map Ableton's macro controls to patch send levels
3. Allows dynamic control of what's sent to collaborator

### Recording Patch Sessions

1. Create a dedicated **Audio Track** labeled "Session Recording"
2. Route master output to this track
3. Hit record (red button) at session start
4. Export after session ends for archive

### Setting Cue Points for Sync

1. Use Ableton's **Locators** (marker points)
2. Share locator numbers with collaborator via Activity Log comments
3. Both engineers jump to same locator for synchronized playback

---

## Related Documentation

- [DAW Patch Dock README](./README.md)
- [Bitwig Studio Setup Guide](./BITWIG_SETUP.md)
- [Browser Audio Requirements](./AUDIO_BRIDGE_REQUIREMENTS.md)

---

**Last Updated:** June 2024  
**Tested With:** Ableton Live 12, Chrome 125+, macOS 13+/Windows 11+  
**Feedback:** Report issues in GitHub Issues or contact support
