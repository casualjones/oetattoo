# OE Tattoo Website - Complete Development Guide

## Overview
This document provides a comprehensive guide to the OE Tattoo website development process, including all commands used, code explanations, and instructions for maintaining and extending the website.

## Git Commands Used

### Basic Git Workflow
```bash
# Check repository status
git status

# Add files to staging area
git add <filename>
git add .  # Add all files

# Commit changes
git commit -m "Descriptive commit message"

# Push to remote repository
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create and switch to new branch
git checkout -b <branch-name>

# Switch between branches
git checkout <branch-name>

# Merge branches
git merge <branch-name>
```

### Specific Commands Used in This Project
```bash
# Check status before committing media converter changes
git status

# Add modified files for media converter tool
git add style.css tools.html tools.js

# Commit the media converter changes
git commit -m "Add Media to Audio Converter tool

- Added FFmpeg.wasm integration for client-side video to audio conversion
- Supports MKV, AVI, MP4, MOV, FLV, WMV, WebM input formats
- Outputs MP3 (with adjustable bitrate) or WAV formats
- Added progress bar and status indicators
- Updated instructions and styling for the new tool"

# Push changes to remote repository
git push
```

## Website Structure

### File Organization
```
tattoo_website/
├── index.html          # Main homepage
├── portfolio.html      # Portfolio/gallery page
├── flash.html          # Flash tattoo designs
├── events.html         # Events calendar
├── events.js           # Events functionality
├── tools.html          # Tools page (main development focus)
├── tools.js            # Tools JavaScript functionality
├── script.js           # General site JavaScript
├── style.css           # Main stylesheet
├── contact.html        # Contact information
├── contact_prices_nfo  # Contact pricing info
├── CNAME               # GitHub Pages custom domain
├── agentlm.md          # AI agent configuration
├── generate_events_json.py  # Python script for events data
├── events-data.json    # Events data
├── banners/            # Banner images
├── flash/              # Flash design images
└── coasters/           # Business card designs
```

## Tools Page Development

### Overview
The tools page (`tools.html`) contains multiple web-based utilities for tattoo artists, including image processing tools and a media converter.

### Tools Implemented

#### 1. Image Scaler
**Purpose**: Resize tattoo designs to desired dimensions
**Technology**: HTML5 Canvas API
**Code Location**: `tools.js` - `scaleImage()` function

```javascript
function scaleImage() {
    const input = document.getElementById('scalerInput');
    const scale = document.getElementById('scale').value / 100;
    const canvas = document.getElementById('scalerCanvas');
    const ctx = canvas.getContext('2d');
    const file = input.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = URL.createObjectURL(file);
    }
}
```

#### 2. Grider Tool
**Purpose**: Add reference grids with alphanumeric coordinates for precise tracing
**Features**:
- Customizable grid size
- Transfer medium dimensions for scale reference
- Alphanumeric coordinate system
**Code Location**: `tools.js` - `addGrid()` function

#### 3. Stencil Maker
**Purpose**: Create contour outlines for stencils using edge detection
**Algorithms**: Sobel, Prewitt, Roberts, Laplacian edge detection
**Code Location**: `tools.js` - `makeStencil()` function

#### 4. Numerology App
**Purpose**: Generate creative inspiration based on numerology
**Features**:
- Life Path Number calculation
- Destiny Number calculation
- Personalized meanings for tattoo design inspiration
**Code Location**: `tools.js` - `calculateNumerology()` function

#### 5. Media to Audio Converter (Latest Addition)
**Purpose**: Convert video files to audio formats
**Technology**: FFmpeg.wasm (client-side video processing)
**Supported Formats**:
- Input: MKV, AVI, MP4, MOV, FLV, WMV, WebM
- Output: MP3 (128-320 kbps), WAV (lossless)
**Code Location**: `tools.js` - `convertMediaToAudio()`, `initFFmpeg()` functions

## Technical Implementation Details

### FFmpeg.wasm Integration
The media converter uses FFmpeg compiled to WebAssembly for client-side video processing:

```javascript
// FFmpeg initialization
async function initFFmpeg() {
    try {
        const { FFmpeg } = FFmpeg;
        ffmpeg = new FFmpeg.FFmpeg();

        ffmpeg.on("log", ({ type, message }) => {
            if (type === "error" && !message.includes("deprecated")) {
                console.error("FFmpeg:", message);
            }
        });

        await ffmpeg.load({
            coreURL: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm"
        });

        ffmpegReady = true;
    } catch (error) {
        updateConverterStatus('Error: Failed to load FFmpeg library.', 'error');
    }
}
```

### Canvas-Based Image Processing
All image tools use HTML5 Canvas API for client-side processing:

```javascript
// Canvas setup and image drawing
const canvas = document.getElementById('canvasId');
const ctx = canvas.getContext('2d');

// Load and process image
const img = new Image();
img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // Apply processing...
};
img.src = URL.createObjectURL(file);
```

### CSS Styling Architecture
The website uses a dark theme with gradient backgrounds and tool-specific color coding:

```css
/* Tool-specific styling */
.tool:nth-child(1) { border-color: #ff4757; background: rgba(255, 71, 87, 0.1); }
.tool:nth-child(2) { border-color: #47ff57; background: rgba(71, 255, 87, 0.1); }
.tool:nth-child(3) { border-color: #4757ff; background: rgba(71, 87, 255, 0.1); }
.tool:nth-child(4) { border-color: #ffb347; background: rgba(255, 179, 71, 0.12); }
.tool:nth-child(5) { border-color: #7f39fb; background: rgba(127, 57, 251, 0.1); }
```

## Development Workflow

### Adding New Tools
1. Add HTML structure in `tools.html`
2. Implement JavaScript functionality in `tools.js`
3. Add CSS styling in `style.css`
4. Update instructions section
5. Test functionality
6. Commit and push changes

### File Size Considerations
- Images should be under 5MB for best performance
- FFmpeg.wasm library loads ~20MB initially
- Use progressive loading for large assets

## Deployment

### GitHub Pages
The website is deployed using GitHub Pages with a custom domain:
- Repository: `https://github.com/casualjones/oetattoo.git`
- Custom domain configured via `CNAME` file
- Automatic deployment on push to master branch

### Local Development
```bash
# Clone repository
git clone https://github.com/casualjones/oetattoo.git

# Navigate to directory
cd tattoo_website

# Open in browser (or use local server)
# For live reload during development, consider:
# python -m http.server 8000
# Then visit http://localhost:8000
```

## Maintenance Commands

### Regular Maintenance
```bash
# Check for updates
git pull

# View recent changes
git log --oneline -10

# Check repository health
git fsck

# Clean untracked files
git clean -fd
```

### Backup and Recovery
```bash
# Create backup branch
git checkout -b backup-$(date +%Y%m%d)

# List all branches
git branch -a

# Restore from backup
git checkout backup-20260419
```

## Code Quality Guidelines

### JavaScript Best Practices
- Use `const` and `let` instead of `var`
- Implement proper error handling
- Use async/await for asynchronous operations
- Add comments for complex algorithms
- Test functionality across different browsers

### CSS Organization
- Use semantic class names
- Implement responsive design with media queries
- Maintain consistent color scheme
- Use CSS custom properties for theme variables

### HTML Structure
- Use semantic HTML5 elements
- Maintain accessibility standards
- Include proper meta tags
- Ensure mobile responsiveness

## Troubleshooting

### Common Issues

#### FFmpeg Loading Issues
- Check internet connection for CDN resources
- Verify FFmpeg.wasm version compatibility
- Clear browser cache if loading fails

#### Canvas Processing Errors
- Ensure images are under 5MB
- Check browser support for Canvas API
- Verify file format compatibility

#### Git Issues
```bash
# If push fails due to conflicts
git pull --rebase
git push

# Reset to last commit if needed
git reset --hard HEAD~1

# Force push (use carefully)
git push --force
```

## Future Enhancements

### Potential Additions
1. **Advanced Image Filters**: Blur, sharpen, color adjustments
2. **Batch Processing**: Process multiple files simultaneously
3. **Cloud Storage Integration**: Save/load designs from cloud
4. **Collaborative Tools**: Share designs with clients
5. **Mobile App**: Native mobile version of tools

### Performance Optimizations
1. **Web Workers**: Move heavy processing to background threads
2. **Service Workers**: Enable offline functionality
3. **Progressive Web App**: Installable web application
4. **Lazy Loading**: Load tools on demand

## Contact and Support

For questions about this website or development process:
- Repository: https://github.com/casualjones/oetattoo
- Issues: Create GitHub issues for bugs/features
- Documentation: This document serves as the primary reference

---

*Document generated on April 19, 2026*
*OE Tattoo Website Development Guide v1.0*