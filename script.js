// ==================== FORM HANDLING ====================
function initFormHandler() {
    const form = document.getElementById('tattoo-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('https://formspree.io/f/xrpzlnzo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                showFormMessage("Thanks for reaching out! I'll be in touch within 24 hours. 🎨", 'success');
                form.reset();
            } else {
                showFormMessage('Something went wrong. Please try emailing me directly at oetattoo888@gmail.com', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Thanks for reaching out! Please check your spam folder for my response. 🎨', 'success');
            form.reset();
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;
        setTimeout(() => formMessage.classList.remove('show'), 5000);
    }
}

// ==================== SMOOTH SCROLL & NAV ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!navMenu) return;

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (!targetId || !targetId.startsWith('#')) {
                navMenu.classList.remove('active');
                return;
            }

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                navMenu.classList.remove('active');
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// ==================== PORTFOLIO LOADING ====================
async function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (!portfolioGrid) return;

    const normalizeItem = (item, fallbackTitle = 'Portfolio piece') => {
        if (!item || !item.image) return null;

        const image = String(item.image).replace(/\\/g, '/');
        const title = item.title || fallbackTitle;

        if (!image.startsWith('images/portfolio/')) {
            return null;
        }

        return {
            ...item,
            image,
            title,
            size: item.size || 'Medium',
            placement: item.placement || 'Portfolio',
            date: item.date || '2026',
        };
    };

    const renderGallery = (items) => {
        portfolioGrid.innerHTML = '';

        items.forEach((item) => {
            const portfolioItem = document.createElement('article');
            portfolioItem.className = 'portfolio-item';

            const image = document.createElement('img');
            image.className = 'portfolio-item-image';
            image.src = item.image;
            image.alt = item.title;
            image.loading = 'lazy';
            image.addEventListener('error', () => {
                portfolioItem.classList.add('portfolio-item-missing');
                image.remove();
                portfolioItem.insertAdjacentHTML(
                    'afterbegin',
                    '<div class="portfolio-item-fallback">Image unavailable</div>'
                );
            });

            const overlay = document.createElement('div');
            overlay.className = 'portfolio-item-overlay';
            overlay.innerHTML = `
                <div class="portfolio-item-title"></div>
                <div class="portfolio-item-details"></div>
            `;
            overlay.querySelector('.portfolio-item-title').textContent = item.title;
            overlay.querySelector('.portfolio-item-details').textContent = [item.size, item.placement, item.date]
                .filter(Boolean)
                .join(' | ');

            portfolioItem.append(image, overlay);
            portfolioGrid.appendChild(portfolioItem);
        });
    };

    let items = [];

    if (typeof portfolioData !== 'undefined' && Array.isArray(portfolioData)) {
        items = portfolioData.map((item) => normalizeItem(item, 'Portfolio piece')).filter(Boolean);
    }

    try {
        const response = await fetch('images/portfolio/manifest.json', { cache: 'no-store' });
        if (response.ok) {
            const files = await response.json();
            const manifestItems = files
                .filter((file) => /\.(jpe?g|png|gif|webp|bmp|avif)$/i.test(file))
                .map((file) => ({
                    title:
                        file.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() ||
                        'Portfolio piece',
                    image: `images/portfolio/${encodeURI(file)}`,
                    size: 'Medium',
                    placement: 'Portfolio',
                    date: '2026',
                }));

            const normalizeKey = (imagePath) => {
                try {
                    return decodeURIComponent(String(imagePath)).replace(/\\/g, '/').toLowerCase();
                } catch {
                    return String(imagePath).replace(/\\/g, '/').toLowerCase();
                }
            };
            const seen = new Set();
            items = [...items, ...manifestItems].filter((item) => {
                const key = normalizeKey(item.image);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }
    } catch (error) {
        console.warn('Portfolio manifest unavailable, using fallback data.', error);
    }

    if (!items.length) {
        portfolioGrid.innerHTML =
            '<p class="page-note">Add images to images/portfolio/ to populate the gallery.</p>';
        return;
    }

    renderGallery(items);
}

// ==================== GSAP SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.page-shell .page-hero, .page-shell .page-card, .page-shell .portfolio-item').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 32,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        });
    });
}

// ==================== GOATCOUNTER ====================
const OE_GC_CODE = 'oetattoo';
const OE_VISIT_OFFSET = 707; // display baseline

function initGoatCounter() {
    if (!document.querySelector('script[data-goatcounter]')) {
        const s = document.createElement('script');
        s.async = true;
        s.src = '//gc.zgo.at/count.js';
        s.dataset.goatcounter = `https://${OE_GC_CODE}.goatcounter.com/count`;
        document.head.appendChild(s);
    }

    if (document.getElementById('oe-corner-stat')) return;

    const el = document.createElement('div');
    el.id = 'oe-corner-stat';
    el.className = 'oe-corner-stat';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = 'Humboldt · …';

    if (!document.getElementById('oe-corner-stat-style')) {
        const style = document.createElement('style');
        style.id = 'oe-corner-stat-style';
        style.textContent = `
.oe-corner-stat {
  position: fixed;
  bottom: 0.85rem;
  left: 0.85rem;
  z-index: 40;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(156, 147, 112, 0.75);
  pointer-events: none;
  user-select: none;
  font-family: Inter, system-ui, sans-serif;
}
@media (max-width: 640px) {
  .oe-corner-stat {
    bottom: 0.6rem;
    left: 0.6rem;
    font-size: 0.6rem;
  }
}`;
        document.head.appendChild(style);
    }

    document.body.appendChild(el);

    fetch(`https://${OE_GC_CODE}.goatcounter.com/counter/TOTAL.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
            const raw = String(data.count || '0').replace(/[^0-9]/g, '');
            const n = parseInt(raw, 10) || 0;
            const total = OE_VISIT_OFFSET + n;
            el.textContent = `Humboldt · ${total.toLocaleString()} visits`;
        })
        .catch(() => {
            el.textContent = `Humboldt · ${OE_VISIT_OFFSET.toLocaleString()}+ visits`;
        });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFormHandler();
    initPortfolio();
    initScrollAnimations();
    initGoatCounter();
});
