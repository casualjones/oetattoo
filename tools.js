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
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const file = input.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Draw grid with 60% opacity
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            // Add alphanumeric labels
            ctx.globalAlpha = 1.0; // Reset alpha for text
            ctx.fillStyle = '#000000';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // X-axis labels (A, B, C...)
            let col = 0;
            for (let x = gridSize; x < canvas.width; x += gridSize) {
                const label = String.fromCharCode(65 + col); // A, B, C...
                ctx.fillText(label, x, 15);
                col++;
            }
            
            // Y-axis labels (1, 2, 3...)
            let row = 0;
            for (let y = gridSize; y < canvas.height; y += gridSize) {
                const label = (row + 1).toString();
                ctx.fillText(label, 15, y);
                row++;
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

// Download function
function downloadCanvas(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

const photopeaOrigin = 'https://www.photopea.com';
let photopeaReady = false;
let photopeaFileDataUrl = '';
let photopeaFileName = '';
let photopeaLoadTimeoutId = null;

function setPhotopeaStatus(message, isError = false) {
    const status = document.getElementById('photopeaStatus');
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? '#ff6b6b' : '#d2d2d2';
}

function startPhotopeaLoadTimer() {
    clearPhotopeaLoadTimer();
    photopeaReady = false;
    setPhotopeaStatus('Loading Photopea editor... please wait.', false);
    photopeaLoadTimeoutId = window.setTimeout(() => {
        if (!photopeaReady) {
            setPhotopeaStatus('Photopea did not respond. Refresh the page or try another browser.', true);
        }
    }, 20000);
}

function clearPhotopeaLoadTimer() {
    if (photopeaLoadTimeoutId !== null) {
        window.clearTimeout(photopeaLoadTimeoutId);
        photopeaLoadTimeoutId = null;
    }
}

function handlePhotopeaFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        setPhotopeaStatus('No file selected.', true);
        document.getElementById('launchPhotopeaButton').disabled = true;
        return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        setPhotopeaStatus('Unsupported file type. Use JPG or PNG.', true);
        document.getElementById('launchPhotopeaButton').disabled = true;
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        setPhotopeaStatus('File too large. Limit 10MB.', true);
        document.getElementById('launchPhotopeaButton').disabled = true;
        return;
    }
    photopeaFileName = file.name || 'sketch.png';
    const reader = new FileReader();
    reader.onload = function() {
        photopeaFileDataUrl = reader.result;
        setPhotopeaStatus('Ready to send image to Photopea. Click Open in Photopea.');
        document.getElementById('launchPhotopeaButton').disabled = false;
    };
    reader.onerror = function() {
        setPhotopeaStatus('Unable to read file.', true);
        document.getElementById('launchPhotopeaButton').disabled = true;
    };
    reader.readAsDataURL(file);
}

function startPhotopea() {
    if (!photopeaFileDataUrl) {
        setPhotopeaStatus('Choose an image first.', true);
        return;
    }
    const frame = document.getElementById('photopeaFrame');
    if (!frame || !frame.contentWindow) {
        setPhotopeaStatus('Photopea iframe not available.', true);
        return;
    }
    if (!photopeaReady) {
        setPhotopeaStatus('Waiting for Photopea to load. Please try again in a moment.');
    }
    const openMessage = {
        type: 'open',
        files: [{ name: photopeaFileName, data: photopeaFileDataUrl }]
    };
    frame.contentWindow.postMessage(openMessage, photopeaOrigin);
    setPhotopeaStatus('Image sent to Photopea. Applying automation script shortly...');
    document.getElementById('downloadPhotopeaButton').disabled = false;
    setTimeout(applyPhotopeaAutomation, 1500);
}

function applyPhotopeaAutomation() {
    const frame = document.getElementById('photopeaFrame');
    if (!frame || !frame.contentWindow) {
        setPhotopeaStatus('Photopea iframe not available.', true);
        return;
    }
    if (!photopeaReady) {
        setPhotopeaStatus('Photopea still loading. Waiting to apply automation...');
        setTimeout(applyPhotopeaAutomation, 1000);
        return;
    }
    const mode = document.getElementById('photopeaMode')?.value || 'stencil';
    const script = getPhotopeaScript(mode);
    const scriptMessage = {
        type: 'script',
        script: script
    };
    frame.contentWindow.postMessage(scriptMessage, photopeaOrigin);
    setPhotopeaStatus('Automation script sent to Photopea. You can download the result when ready.');
}

function getPhotopeaScript(mode) {
    return `
var doc = app.activeDocument;
doc.activeLayer = doc.layers[0];
try {
    doc.activeLayer.desaturate();
} catch (e) {}
try {
    doc.activeLayer.applyGaussianBlur(1.5);
} catch (e) {}
if ("${mode}" === "stencil") {
    try {
        doc.activeLayer.applyThreshold(140);
    } catch (e) {}
} else {
    try {
        doc.activeLayer.applyFindEdges();
    } catch (e) {}
    try {
        doc.activeLayer.applyThreshold(120);
    } catch (e) {}
}
try {
    doc.flatten();
} catch (e) {}
`;
}

function downloadPhotopeaResult() {
    const frame = document.getElementById('photopeaFrame');
    if (!frame || !frame.contentWindow) {
        setPhotopeaStatus('Photopea iframe not available.', true);
        return;
    }
    const exportMessage = {
        type: 'export',
        format: 'png',
        quality: 1.0
    };
    frame.contentWindow.postMessage(exportMessage, photopeaOrigin);
    setPhotopeaStatus('Requested export from Photopea. Wait for the download prompt.');
}

window.addEventListener('message', function(event) {
    if (event.origin !== photopeaOrigin) return;
    if (event.data === 'ready' || (event.data && event.data.type === 'ready')) {
        photopeaReady = true;
        clearPhotopeaLoadTimer();
        setPhotopeaStatus('Photopea loaded. Choose an image and click Open in Photopea.');
        return;
    }
    if (event.data && event.data.type === 'export' && typeof event.data.data === 'string') {
        const link = document.createElement('a');
        link.href = event.data.data;
        link.download = 'photopea-stencil.png';
        link.click();
        setPhotopeaStatus('Download started. Check your browser downloads.');
        return;
    }
    if (event.data && event.data.error) {
        setPhotopeaStatus('Photopea error: ' + event.data.error, true);
    }
});

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
    const photopeaInput = document.getElementById('photopeaInput');
    if (photopeaInput) {
        photopeaInput.addEventListener('change', handlePhotopeaFileSelect);
    }
    const photopeaFrame = document.getElementById('photopeaFrame');
    if (photopeaFrame) {
        photopeaFrame.addEventListener('load', startPhotopeaLoadTimer);
    }
});