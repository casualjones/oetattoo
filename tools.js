// Image Scaler
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

// Grider
function addGrid() {
    const input = document.getElementById('gridInput');
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const transferWidth = parseFloat(document.getElementById('transferWidth').value);
    const transferHeight = parseFloat(document.getElementById('transferHeight').value);
    const transferUnit = document.getElementById('transferUnit').value;
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const scaleInfo = document.getElementById('gridScaleInfo');
    const file = input.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            const squareSize = Math.max(img.width, img.height);
            canvas.width = squareSize;
            canvas.height = squareSize;
            ctx.clearRect(0, 0, squareSize, squareSize);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, squareSize, squareSize);

            const offsetX = (squareSize - img.width) / 2;
            const offsetY = (squareSize - img.height) / 2;
            ctx.drawImage(img, offsetX, offsetY);

            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            for (let x = 0; x <= squareSize; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, squareSize);
                ctx.stroke();
            }
            for (let y = 0; y <= squareSize; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(squareSize, y);
                ctx.stroke();
            }

            ctx.globalAlpha = 1.0;
            ctx.fillStyle = '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let col = 0;
            for (let x = gridSize; x < squareSize; x += gridSize) {
                const label = String.fromCharCode(65 + col);
                ctx.fillText(label, x, 15);
                col++;
            }

            let row = 0;
            for (let y = gridSize; y < squareSize; y += gridSize) {
                const label = (row + 1).toString();
                ctx.fillText(label, 15, y);
                row++;
            }

            if (transferWidth > 0 && transferHeight > 0) {
                const unitLabel = transferUnit === 'cm' ? 'cm' : 'in';
                const unitsPerPixelX = transferWidth / img.width;
                const unitsPerPixelY = transferHeight / img.height;
                const gridUnitsX = (gridSize * unitsPerPixelX).toFixed(2);
                const gridUnitsY = (gridSize * unitsPerPixelY).toFixed(2);
                let message = `Transfer medium: ${transferWidth}${unitLabel} × ${transferHeight}${unitLabel}. `;
                message += `Scale: ${gridSize}px grid = ${gridUnitsX}${unitLabel} × ${gridUnitsY}${unitLabel}. `;
                if (Math.abs(unitsPerPixelX - unitsPerPixelY) / Math.max(unitsPerPixelX, unitsPerPixelY) > 0.05) {
                    message += 'Aspect ratio differs from medium; use the smaller dimension to preserve proportions.';
                }
                scaleInfo.textContent = message;
            } else {
                scaleInfo.textContent = '';
            }
        };
        img.src = URL.createObjectURL(file);
    }
}

// Stencil Maker - Edge Detection
function makeStencil() {
    const input = document.getElementById('stencilInput');
    const method = document.getElementById('edgeMethod').value;
    const edgeThreshold = parseInt(document.getElementById('edgeThreshold').value);
    const canvas = document.getElementById('stencilCanvas');
    const ctx = canvas.getContext('2d');
    const file = input.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Create grayscale array
            const gray = new Uint8Array(canvas.width * canvas.height);
            for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                gray[j] = (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            
            // Define kernels
            let sobelX, sobelY;
            if (method === 'sobel') {
                sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
                sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
            } else if (method === 'prewitt') {
                sobelX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
                sobelY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
            } else if (method === 'laplacian') {
                // For Laplacian, use single kernel
                sobelX = [0, 1, 0, 1, -4, 1, 0, 1, 0];
                sobelY = null; // Not used
            } else if (method === 'roberts') {
                // Simple Roberts approximation
                sobelX = [0, 0, 1, 0, 0, 0, -1, 0, 0];
                sobelY = [0, 1, 0, -1, 0, 0, 0, 0, 0];
            }
            
            // Apply edge detection
            const edges = new Uint8Array(canvas.width * canvas.height);
            
            for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                    let gx = 0, gy = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = (y + ky) * canvas.width + (x + kx);
                            const kidx = (ky + 1) * 3 + (kx + 1);
                            gx += gray[idx] * sobelX[kidx];
                            if (sobelY) gy += gray[idx] * sobelY[kidx];
                        }
                    }
                    let magnitude;
                    if (method === 'laplacian') {
                        magnitude = Math.abs(gx); // Laplacian is second derivative
                    } else {
                        magnitude = Math.sqrt(gx * gx + gy * gy);
                    }
                    edges[y * canvas.width + x] = magnitude;
                }
            }
            
            // Apply threshold and set pixels
            for (let i = 0; i < data.length; i += 4) {
                const idx = Math.floor(i / 4);
                const color = edges[idx] > edgeThreshold ? 0 : 255; // Black edges on white background
                data[i] = color;     // Red
                data[i + 1] = color; // Green
                data[i + 2] = color; // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
        };
        img.src = URL.createObjectURL(file);
    }
}

function reduceNumber(value) {
    while (value > 9 && value !== 11 && value !== 22 && value !== 33) {
        value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
    }
    return value;
}

function calculateAlphabetNumber(char) {
    const code = char.toUpperCase().charCodeAt(0);
    if (code < 65 || code > 90) return 0;
    const num = ((code - 65) % 9) + 1;
    return num;
}

function calculateNumerology() {
    const birthDate = document.getElementById('birthDate').value;
    const fullName = document.getElementById('fullName').value.trim();
    const output = document.getElementById('numerologyOutput');

    if (!birthDate || !fullName) {
        output.innerHTML = '<p class="error-text">Please enter both your birth date and full name.</p>';
        return;
    }

    const digits = birthDate.replace(/-/g, '').split('').map(Number);
    const lifePath = reduceNumber(digits.reduce((sum, num) => sum + num, 0));

    const nameTotal = fullName
        .split('')
        .map(calculateAlphabetNumber)
        .reduce((sum, num) => sum + num, 0);
    const destinyNumber = reduceNumber(nameTotal);

    output.innerHTML = `
        <div class="numerology-card">
            <h4>Numerology Results</h4>
            <p><strong>Life Path Number:</strong> ${lifePath}</p>
            <p><strong>Destiny Number:</strong> ${destinyNumber}</p>
            <p><strong>Meaning:</strong> ${numerologyMeaning(lifePath)}</p>
            <p class="note">Use these numbers as inspiration when choosing tattoo themes, symbols, and creative energy.</p>
        </div>
    `;
}

function numerologyMeaning(number) {
    const meanings = {
        1: 'Leadership, new beginnings, bold choices, and independent energy.',
        2: 'Harmony, sensitivity, balance, and partnership energy.',
        3: 'Creativity, expression, optimism, and artistic inspiration.',
        4: 'Stability, structure, discipline, and craftsmanship.',
        5: 'Freedom, change, adventure, and a bold sense of movement.',
        6: 'Responsibility, care, family, and soulful beauty.',
        7: 'Intuition, reflection, mystery, and spiritual insight.',
        8: 'Strength, abundance, ambition, and powerful transformation.',
        9: 'Compassion, completion, legacy, and soulful endings.',
        11: 'Visionary energy, inspiration, and spiritual leadership.',
        22: 'Master builder energy, practical dreams, and large-scale impact.',
        33: 'Master teacher energy, unconditional love, and creative service.'
    };
    return meanings[number] || 'A blend of creative energy and personal purpose.';
}

function resetNumerology() {
    document.getElementById('birthDate').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('numerologyOutput').innerHTML = '';
}

// Download function
function downloadCanvas(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Update grid size conversions
function updateGridConversions() {
    const pixels = parseInt(document.getElementById('gridSize').value);
    const inches = (pixels / 96).toFixed(2);
    const cm = (pixels / 96 * 2.54).toFixed(2);
    document.getElementById('gridSizeDisplay').textContent = pixels + 'px';
    document.getElementById('gridInches').textContent = inches + 'in';
    document.getElementById('gridCm').textContent = cm + 'cm';
}

// Initialize conversions on load
document.addEventListener('DOMContentLoaded', function() {
    updateGridConversions();
    document.getElementById('gridSize').addEventListener('input', updateGridConversions);
    initFFmpeg();
});

// Media to Audio Converter - FFmpeg Integration
let ffmpegReady = false;
let ffmpeg = null;

async function initFFmpeg() {
    const statusText = document.getElementById('ffmpegStatusText');
    const loader = document.getElementById('ffmpegLoader');

    try {
        statusText.textContent = 'Loading FFmpeg library...';
        loader.style.display = 'inline-block';

        // Check if FFmpeg is available
        if (typeof FFmpeg === 'undefined') {
            throw new Error('FFmpeg library not found. Please check your internet connection.');
        }

        const { FFmpeg, fetchFile } = FFmpeg;
        ffmpeg = new FFmpeg();

        ffmpeg.on("log", ({ type, message }) => {
            if (type === "error" && !message.includes("deprecated")) {
                console.error("FFmpeg:", message);
            }
        });

        statusText.textContent = 'Initializing FFmpeg core...';

        // Try loading with different core URLs if the first fails
        const coreUrls = [
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js",
            "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js"
        ];

        let loaded = false;
        for (const coreUrl of coreUrls) {
            try {
                await ffmpeg.load({
                    coreURL: coreUrl
                });
                loaded = true;
                break;
            } catch (e) {
                console.warn(`Failed to load from ${coreUrl}:`, e);
                continue;
            }
        }

        if (!loaded) {
            throw new Error('All FFmpeg core URLs failed to load');
        }

        ffmpegReady = true;
        statusText.textContent = '✓ FFmpeg ready for conversion';
        loader.style.display = 'none';
        console.log('FFmpeg loaded successfully');

    } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        statusText.textContent = '❌ FFmpeg failed to load';
        loader.style.display = 'none';
        updateConverterStatus('Error: Failed to load FFmpeg library. Please refresh the page or check your internet connection.', 'error');
    }
}

async function convertMediaToAudio() {
    const fileInput = document.getElementById('mediaInput');
    const outputFormat = document.getElementById('outputFormat').value;
    const audioBitrate = document.getElementById('audioBitrate').value;
    const statusDiv = document.getElementById('converterStatus');
    const progressDiv = document.getElementById('converterProgress');
    const progressBar = document.getElementById('converterProgressBar');

    if (!fileInput.files.length) {
        updateConverterStatus('Please select a media file first.', 'error');
        return;
    }

    if (!ffmpegReady) {
        updateConverterStatus('FFmpeg is still loading. Please wait...', 'info');
        return;
    }

    const file = fileInput.files[0];
    const outputFileName = `audio_${Date.now()}.${outputFormat}`;

    try {
        updateConverterStatus(`Processing: ${file.name}...`, 'info');
        progressDiv.style.display = 'block';
        progressBar.style.width = '0%';

        // Write file to FFmpeg filesystem
        const { fetchFile } = FFmpeg;
        await ffmpeg.writeFile(file.name, await fetchFile(file));
        updateConverterStatus(`Loaded file. Converting to ${outputFormat.toUpperCase()}...`, 'info');
        progressBar.style.width = '25%';

        // Prepare FFmpeg command
        let command;
        if (outputFormat === 'mp3') {
            command = ['-i', file.name, '-q:a', '0', '-b:a', audioBitrate, '-y', outputFileName];
        } else { // wav
            command = ['-i', file.name, '-y', outputFileName];
        }

        // Run FFmpeg
        await ffmpeg.exec(command);
        progressBar.style.width = '75%';

        // Read the output file
        const data = await ffmpeg.readFile(outputFileName);
        progressBar.style.width = '90%';

        // Clean up
        await ffmpeg.deleteFile(file.name);
        await ffmpeg.deleteFile(outputFileName);

        // Create blob and download
        const blob = new Blob([data], { type: `audio/${outputFormat}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        progressBar.style.width = '100%';
        updateConverterStatus(`✓ Conversion complete! Downloaded: ${outputFileName}`, 'success');
        setTimeout(() => {
            progressDiv.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('Conversion error:', error);
        updateConverterStatus(`Error during conversion: ${error.message}`, 'error');
        progressDiv.style.display = 'none';

        // Clean up on error
        try {
            await ffmpeg.deleteFile(file.name);
        } catch (e) {}
    }
}

function updateConverterStatus(message, type = 'info') {
    const statusDiv = document.getElementById('converterStatus');
    statusDiv.textContent = message;
    statusDiv.className = `converter-status ${type}`;
}

function resetMediaConverter() {
    document.getElementById('mediaInput').value = '';
    document.getElementById('converterStatus').textContent = '';
    document.getElementById('converterStatus').className = 'converter-status';
    document.getElementById('converterProgress').style.display = 'none';
    document.getElementById('converterProgressBar').style.width = '0%';
}