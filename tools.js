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
    const gridSize = document.getElementById('gridSize').value;
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const file = input.files[0];
    if (file) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        };
        img.src = URL.createObjectURL(file);
    }
}

// Stencil Maker
function makeStencil() {
    const input = document.getElementById('stencilInput');
    const threshold = document.getElementById('threshold').value;
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
            for (let i = 0; i < data.length; i += 4) {
                const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const color = gray > threshold ? 255 : 0;
                data[i] = color;     // Red
                data[i + 1] = color; // Green
                data[i + 2] = color; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
        };
        img.src = URL.createObjectURL(file);
    }
}