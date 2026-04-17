function ensureToolsAuth() {
    const allowed = localStorage.getItem('toolsAccess') === 'true';
    if (!allowed) {
        window.location.href = 'login.html';
    }
}

function logoutTools() {
    localStorage.removeItem('toolsAccess');
    window.location.href = 'login.html';
}

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
    ensureToolsAuth();
    updateGridConversions();
    document.getElementById('gridSize').addEventListener('input', updateGridConversions);
});