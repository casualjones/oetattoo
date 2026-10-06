// Image Scaler
function setToolStatus(id, message, type = '') {
    const status = document.getElementById(id);
    if (!status) return;
    status.textContent = message;
    status.dataset.state = type;
}

function previewImage(input, canvasId) {
    const file = input.files[0];
    const canvas = document.getElementById(canvasId);
    if (!file || !canvas) return;
    loadPreparedCanvas(file, input.id.replace('Input', ''), prepared => {
        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / prepared.width);
        canvas.width = Math.max(1, Math.round(prepared.width * scale));
        canvas.height = Math.max(1, Math.round(prepared.height * scale));
        canvas.classList.add('has-preview');
        canvas.getContext('2d').drawImage(prepared, 0, 0, canvas.width, canvas.height);
    });
}

function loadPreparedCanvas(file, prefix, callback) {
    const img = new Image();
    img.onload = function() {
        const zoom = Number(document.getElementById(`${prefix}Zoom`)?.value || 100) / 100;
        const rotation = Number(document.getElementById(`${prefix}Rotation`)?.value || 0);
        const crop = Number(document.getElementById(`${prefix}Crop`)?.value || 1);
        const cropWidth = Math.max(1, Math.round(img.width * crop));
        const cropHeight = Math.max(1, Math.round(img.height * crop));
        const rotated = rotation % 180 !== 0;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round((rotated ? cropHeight : cropWidth) * zoom));
        canvas.height = Math.max(1, Math.round((rotated ? cropWidth : cropHeight) * zoom));
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.drawImage(img, (img.width - cropWidth) / -2 * zoom, (img.height - cropHeight) / -2 * zoom, cropWidth * zoom, cropHeight * zoom);
        URL.revokeObjectURL(img.src);
        callback(canvas);
    };
    img.onerror = function() {
        setToolStatus(`${prefix}Status`, 'This image could not be read by the browser.', 'error');
    };
    img.src = URL.createObjectURL(file);
}

function restoreImageTool(prefix) {
    const input = document.getElementById(`${prefix}Input`);
    if (!input?.files[0]) {
        setToolStatus(`${prefix}Status`, 'Choose an image before restoring it.', 'error');
        return;
    }
    const output = document.getElementById(`${prefix}Canvas`);
    const img = new Image();
    img.onload = function() {
        output.width = img.width;
        output.height = img.height;
        output.classList.add('has-preview');
        output.getContext('2d').drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        setToolStatus(`${prefix}Status`, 'Restored the current reference to the result panel.', 'success');
    };
    img.src = URL.createObjectURL(input.files[0]);
}

function clearImageTool(prefix) {
    const input = document.getElementById(`${prefix}Input`);
    const source = document.getElementById(`${prefix}SourceCanvas`);
    const output = document.getElementById(`${prefix}Canvas`);
    const statusId = `${prefix}Status`;
    if (input) input.value = '';
    [source, output].forEach(canvas => {
        if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
            canvas.classList.remove('has-preview');
        }
    });
    if (prefix === 'grid') document.getElementById('gridScaleInfo').textContent = '';
    if (prefix === 'scaler') document.getElementById('scalerPrintSize').textContent = 'Estimated print size: choose an image.';
    setToolStatus(statusId, 'No image loaded yet.');
}

function scaleImage() {
    const input = document.getElementById('scalerInput');
    const scale = document.getElementById('scale').value / 100;
    const canvas = document.getElementById('scalerCanvas');
    const ctx = canvas.getContext('2d');
    const file = input.files[0];
    if (!file) {
        setToolStatus('scalerStatus', 'Choose an image before scaling.', 'error');
        return;
    }
    loadPreparedCanvas(file, 'scaler', prepared => {
        canvas.width = Math.max(1, Math.round(prepared.width * scale));
        canvas.height = Math.max(1, Math.round(prepared.height * scale));
        canvas.classList.add('has-preview');
        ctx.drawImage(prepared, 0, 0, canvas.width, canvas.height);
        document.getElementById('scalerPrintSize').textContent = `Estimated print size at 96 PPI: ${(canvas.width / 96).toFixed(2)} × ${(canvas.height / 96).toFixed(2)} in`;
        setToolStatus('scalerStatus', `${file.name} · ${prepared.width} × ${prepared.height}px → ${canvas.width} × ${canvas.height}px`, 'success');
    });
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
    if (!file) {
        setToolStatus('gridStatus', 'Choose an image before adding a grid.', 'error');
        return;
    }
    if (file) {
        loadPreparedCanvas(file, 'grid', img => {
            const squareSize = Math.max(img.width, img.height);
            canvas.width = squareSize;
            canvas.height = squareSize;
            canvas.classList.add('has-preview');
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
                let message = `Transfer medium: ${transferWidth}${unitLabel} x ${transferHeight}${unitLabel}. `;
                message += `Scale: ${gridSize}px grid = ${gridUnitsX}${unitLabel} x ${gridUnitsY}${unitLabel}. `;
                if (Math.abs(unitsPerPixelX - unitsPerPixelY) / Math.max(unitsPerPixelX, unitsPerPixelY) > 0.05) {
                    message += 'Aspect ratio differs from medium; use the smaller dimension to preserve proportions.';
                }
                scaleInfo.textContent = message;
            } else {
                scaleInfo.textContent = '';
            }
            setToolStatus('gridStatus', `${file.name} · ${img.width} × ${img.height}px reference ready.`, 'success');
        });
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
    if (!file) {
        setToolStatus('stencilStatus', 'Choose an image before detecting edges.', 'error');
        return;
    }
    if (file) {
        loadPreparedCanvas(file, 'stencil', img => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.classList.add('has-preview');
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
            setToolStatus('stencilStatus', `${file.name} · ${method} edges at threshold ${edgeThreshold}.`, 'success');
        });
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
    if (!canvas || !canvas.width || !canvas.height) {
        const statusId = canvasId === 'scalerCanvas' ? 'scalerStatus' : canvasId === 'gridCanvas' ? 'gridStatus' : 'stencilStatus';
        setToolStatus(statusId, 'Create a preview before downloading.', 'error');
        return;
    }
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

const TOOL_SETTINGS_KEY = 'oe-tattoo-tool-settings';
const PRESETS_KEY = 'oe-tattoo-tool-presets';
const settingIds = ['scale', 'gridSize', 'transferWidth', 'transferHeight', 'transferUnit', 'edgeMethod', 'edgeThreshold', 'scalerZoom', 'scalerRotation', 'scalerCrop', 'gridZoom', 'gridRotation', 'gridCrop', 'stencilZoom', 'stencilRotation', 'stencilCrop'];

function collectToolSettings() {
    return Object.fromEntries(settingIds.map(id => [id, document.getElementById(id)?.value]).filter(([, value]) => value !== undefined));
}

function applyToolSettings(settings) {
    Object.entries(settings || {}).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field && value !== undefined) field.value = value;
        if (id.endsWith('Zoom')) updateZoomLabel(id);
    });
    updateGridConversions();
}

function updateZoomLabel(id) {
    const output = document.getElementById(`${id}Value`);
    const input = document.getElementById(id);
    if (output && input) output.textContent = `${input.value}%`;
}

function saveSettingsPreset() {
    const name = document.getElementById('presetName').value.trim();
    if (!name) {
        document.getElementById('presetStatus').textContent = 'Enter a preset name first.';
        return;
    }
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}');
    presets[name] = collectToolSettings();
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    populatePresetList(name);
    document.getElementById('presetStatus').textContent = `Saved “${name}” on this device.`;
}

function populatePresetList(selected = '') {
    const select = document.getElementById('presetList');
    if (!select) return;
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}');
    select.innerHTML = '<option value="">Choose a saved preset</option>';
    Object.keys(presets).sort().forEach(name => select.add(new Option(name, name, name === selected, name === selected)));
}

function loadSettingsPreset() {
    const name = document.getElementById('presetList').value;
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}');
    if (!name || !presets[name]) return;
    applyToolSettings(presets[name]);
    document.getElementById('presetStatus').textContent = `Loaded “${name}”.`;
}

function deleteSettingsPreset() {
    const select = document.getElementById('presetList');
    const name = select.value;
    if (!name) return;
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}');
    delete presets[name];
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    populatePresetList();
    document.getElementById('presetStatus').textContent = `Deleted “${name}”.`;
}

// Initialize conversions on load
document.addEventListener('DOMContentLoaded', function() {
    updateGridConversions();
    applyToolSettings(JSON.parse(localStorage.getItem(TOOL_SETTINGS_KEY) || '{}'));
    populatePresetList();
    settingIds.forEach(id => {
        const field = document.getElementById(id);
        field?.addEventListener('input', () => {
            localStorage.setItem(TOOL_SETTINGS_KEY, JSON.stringify(collectToolSettings()));
            if (id.endsWith('Zoom')) updateZoomLabel(id);
            const prefix = id.startsWith('scaler') ? 'scaler' : id.startsWith('grid') ? 'grid' : id.startsWith('stencil') ? 'stencil' : '';
            const input = prefix && document.getElementById(`${prefix}Input`);
            if (input?.files[0]) previewImage(input, `${prefix}SourceCanvas`);
        });
        field?.addEventListener('change', () => localStorage.setItem(TOOL_SETTINGS_KEY, JSON.stringify(collectToolSettings())));
    });
    document.getElementById('gridSize').addEventListener('input', updateGridConversions);
    [
        ['scalerInput', 'scalerStatus'],
        ['gridInput', 'gridStatus'],
        ['stencilInput', 'stencilStatus']
    ].forEach(([inputId, statusId]) => {
        const input = document.getElementById(inputId);
        if (input) input.addEventListener('change', () => {
            const file = input.files[0];
            setToolStatus(statusId, file ? `${file.name} selected. Choose the tool action to create a preview.` : 'No image loaded yet.');
            previewImage(input, `${inputId.replace('Input', '')}SourceCanvas`);
        });
    });
    document.querySelectorAll('[data-drop-input]').forEach(zone => {
        const input = document.getElementById(zone.dataset.dropInput);
        ['dragenter', 'dragover'].forEach(type => zone.addEventListener(type, event => {
            event.preventDefault();
            zone.classList.add('is-dragging');
        }));
        ['dragleave', 'drop'].forEach(type => zone.addEventListener(type, event => {
            event.preventDefault();
            zone.classList.remove('is-dragging');
        }));
        zone.addEventListener('drop', event => {
            const file = event.dataTransfer.files[0];
            if (!file || !file.type.startsWith('image/')) return;
            const transfer = new DataTransfer();
            transfer.items.add(file);
            input.files = transfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
});

// Web Audio API for media conversion
let audioContext = null;

async function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Convert AudioBuffer to WAV blob
function audioBufferToWav(buffer, opt) {
    opt = opt || {};

    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = opt.float32 ? 4 : 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
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

    const file = fileInput.files[0];
    // Generate output filename based on input filename
    const inputNameWithoutExt = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const outputFileName = `${inputNameWithoutExt}_audio.${outputFormat}`;

    try {
        updateConverterStatus(`Processing: ${file.name}...`, 'info');
        progressDiv.style.display = 'block';
        progressBar.style.width = '0%';

        // Initialize AudioContext if needed
        const context = await initAudioContext();
        progressBar.style.width = '10%';

        // Decode audio data
        updateConverterStatus('Decoding audio data...', 'info');
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
        progressBar.style.width = '50%';

        if (outputFormat === 'wav') {
            // Convert to WAV
            updateConverterStatus('Converting to WAV...', 'info');
            const wavBlob = audioBufferToWav(audioBuffer);
            progressBar.style.width = '80%';

            // Download
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            progressBar.style.width = '100%';
            updateConverterStatus(`Conversion complete! Downloaded: ${outputFileName}`, 'success');

        } else if (outputFormat === 'mp3') {
            // MP3 conversion requires additional library, show limitation
            updateConverterStatus('MP3 conversion requires additional encoding library. Please use WAV format or external tools.', 'error');
            progressDiv.style.display = 'none';
            return;
        }

        setTimeout(() => {
            progressDiv.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('Conversion error:', error);
        updateConverterStatus(`Error during conversion: ${error.message}`, 'error');
        progressDiv.style.display = 'none';
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

// Initialize format selector behavior
document.addEventListener('DOMContentLoaded', function() {
    const outputFormat = document.getElementById('outputFormat');
    const bitrateLabel = document.getElementById('audioBitrate').previousElementSibling;
    const bitrateSelect = document.getElementById('audioBitrate');

    function updateFormatUI() {
        if (outputFormat.value === 'mp3') {
            bitrateLabel.style.display = 'inline';
            bitrateSelect.style.display = 'inline';
        } else {
            bitrateLabel.style.display = 'none';
            bitrateSelect.style.display = 'none';
        }
    }

    outputFormat.addEventListener('change', updateFormatUI);
    updateFormatUI(); // Initial state
});