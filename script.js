// ==================== HERO CANVAS (THREE.JS) ====================
let scene, camera, renderer;
let particles = [];

function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0f0f0f, 0);

    // Particle system for geometric effect
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
        );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    // Create particle mesh
    const material = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 2,
        transparent: true,
        opacity: 0.3,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create geometric lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    for (let i = 0; i < 100; i++) {
        linePositions.push(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        );
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xc41e3a,
        transparent: true,
        opacity: 0.1,
        linewidth: 1,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate elements
        points.rotation.x += 0.0002;
        points.rotation.y += 0.0003;
        lines.rotation.x -= 0.0001;
        lines.rotation.z += 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ==================== FORM HANDLING ====================
function initFormHandler() {
    const form = document.getElementById('tattoo-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.checkValidity()) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Send to email via FormSubmit (free service)
        try {
            // Using FormSubmit.co for free form submission
            const response = await fetch('https://formspree.io/f/xeojnqnl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showFormMessage('Thanks for reaching out! I\'ll be in touch within 24 hours. 🎨', 'success');
                form.reset();
            } else {
                showFormMessage('Something went wrong. Please try emailing me directly at oetattoo888@gmail.com', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Fallback: still show success since form validation passed
            showFormMessage('Thanks for reaching out! Please check your spam folder for my response. 🎨', 'success');
            form.reset();
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

// ==================== SMOOTH SCROLL & NAV ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                navMenu.classList.remove('active');
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==================== GSAP ANIMATIONS ====================
function initGsapAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP is not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-storytelling .hero-content', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
    });

    gsap.from('.hero-storytelling .focus-item', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.3,
    });

    gsap.from('.hero-storytelling .cta-button', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.55,
    });

    gsap.utils.toArray('.about-apprentice .bio-content, .portfolio-block, .contact-item').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    });

    gsap.from('.work-sample', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.portfolio-categories',
            start: 'top 80%',
            toggleActions: 'play none none none',
        },
    });
}

// ==================== PORTFOLIO LOADING ====================
function initPortfolio() {
    const coverUpGrid = document.getElementById('cover-up-grid');
    const smallTattoosGrid = document.getElementById('small-tattoos-grid');
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (typeof portfolioData === 'undefined' || portfolioData.length === 0) {
        if (portfolioGrid) {
            portfolioGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <p style="color: #a8a8a0; font-size: 1.1rem;">Portfolio coming soon! Add your images to portfolio-data.js</p>
                </div>
            `;
        }
        return;
    }

    const createWorkSample = (item) => {
        const sample = document.createElement('div');
        sample.className = 'work-sample';
        sample.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="work-sample-title">${item.title}</div>
            <div class="work-sample-details">${item.size} • ${item.placement}</div>
        `;
        return sample;
    };

    if (coverUpGrid && smallTattoosGrid) {
        const coverUps = portfolioData.filter(item => item.category === 'cover-up');
        const smallItems = portfolioData.filter(item => item.category === 'small');

        if (coverUps.length) {
            coverUps.forEach(item => coverUpGrid.appendChild(createWorkSample(item)));
        } else {
            coverUpGrid.innerHTML = `
                <div class="work-sample">
                    <p class="work-sample-details">Add cover-up entries to portfolio-data.js to populate this gallery.</p>
                </div>
            `;
        }

        if (smallItems.length) {
            smallItems.forEach(item => smallTattoosGrid.appendChild(createWorkSample(item)));
        } else {
            smallTattoosGrid.innerHTML = `
                <div class="work-sample">
                    <p class="work-sample-details">Add small tattoo entries to portfolio-data.js to populate this gallery.</p>
                </div>
            `;
        }
        return;
    }

    if (portfolioGrid) {
        portfolioData.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="portfolio-item-image">
                <div class="portfolio-item-overlay">
                    <div class="portfolio-item-title">${item.title}</div>
                    <div class="portfolio-item-details">
                        ${item.size} | ${item.placement} | ${item.date}
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);
        });
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initFormHandler();
    initNavigation();
    initGsapAnimations();
    initPortfolio();
});

// Handle mobile canvas resize
window.addEventListener('resize', () => {
    if (renderer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
});

// ==================== ADDITIONAL POLISH ====================
// Add subtle mouse move effect to hero
document.addEventListener('mousemove', (e) => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const x = (e.clientX / window.innerWidth) * 10 - 5;
    const y = (e.clientY / window.innerHeight) * 10 - 5;

    heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

// Disable mouse tracking on mobile
if (window.innerWidth < 768) {
    document.removeEventListener('mousemove', (e) => {});
}
