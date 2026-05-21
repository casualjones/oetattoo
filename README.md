# OETATTOO - Your Geometric Tattoo Portfolio Site

A beautiful, modern portfolio site built with **HTML/CSS/JavaScript** + **Three.js** WebGL effects.
Zero dependencies, zero vendor lock-in, deploy directly to GitHub Pages.

---

## 📁 What You Have

```
oetattoo/
├── index.html              # Main site (all pages)
├── style.css               # All styling (Sondaven aesthetic)
├── script.js               # JavaScript, forms, animations
├── portfolio-data.js       # Your tattoo portfolio (edit this!)
├── images/
│   └── portfolio/          # Add your tattoo photos here
├── .gitignore
└── README.md
```

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Add Your Portfolio Images

1. Create folder: `images/portfolio/`
2. Add your tattoo photos as: `tattoo-01.jpg`, `tattoo-02.jpg`, etc.
3. Recommended: 600x600px minimum, under 300KB each
4. Use consistent, professional photos

### Step 2: Update Portfolio Data

Edit `portfolio-data.js`:

```javascript
const portfolioData = [
    {
        title: "Your Tattoo Name",
        image: "images/portfolio/tattoo-01.jpg",
        size: "Small/Medium",
        placement: "Left Forearm",
        date: "December 2024"
    },
    // Add more entries...
];
```

### Step 3: Test Locally

```bash
# Start a local server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Step 4: Deploy to GitHub Pages

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial site commit"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oetattoo.git
git push -u origin main

# Enable GitHub Pages in repository settings:
# Settings > Pages > Source: main branch > Save
```

Your site will be live at: `https://YOUR_USERNAME.github.io/oetattoo`

---

## 🎨 Customization

### Change Colors

Edit the `:root` section in `style.css`:

```css
:root {
    --bg-primary: #0f0f0f;        /* Background */
    --text-primary: #f5f5f0;      /* Text */
    --accent-red: #c41e3a;        /* Buttons/Accents */
    --accent-gold: #d4af37;       /* Highlights */
    /* ... more colors */
}
```

### Change Copy

Edit `index.html` to update:
- Hero headline & subtitle
- About section text
- Free tattoos details
- Contact info

### Update Personal Info

In `index.html`, update:
- Email: `oetattoo888@gmail.com`
- Instagram: `@tattoo.oe`
- Location: `Humboldt County, CA`
- Form submission endpoint (see Forms section)

---

## 📝 Forms

The form submits to **Formspree.io** (free service).

To set it up:

1. Go to https://formspree.io
2. Sign up (free)
3. Create a new form, get your endpoint
4. Update in `script.js`:
   ```javascript
   fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

Or use another service:
- **Netlify Forms** (free with Netlify hosting)
- **Basin** (https://usebasin.com)
- **Getform** (https://getform.io)

---

## 🌐 Connect Custom Domain

To use `www.oetattoo.com`:

1. In GitHub > Settings > Pages
2. Add custom domain: `oetattoo.com`
3. Update DNS at your domain registrar:
   ```
   CNAME: yourusername.github.io
   ```
4. GitHub will provide exact DNS records

---

## 🎯 Features

✅ **Sondaven Aesthetic**
- Dark, minimal design
- Poetic copy
- High-quality image focus
- Generous whitespace

✅ **Three.js WebGL**
- Geometric particle background on hero
- Smooth animations
- No external libraries needed (Three.js via CDN)

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Touch-friendly forms

✅ **Smooth Animations**
- Scroll-triggered fade-ins
- Hover effects on portfolio
- Parallax hero background

✅ **SEO Optimized**
- Meta tags
- Alt text support
- Clean semantic HTML

---

## 📊 What's Included

| Feature | Status |
|---------|--------|
| Hero with WebGL | ✅ |
| About section | ✅ |
| Portfolio grid | ✅ |
| Free tattoos form | ✅ |
| Contact section | ✅ |
| Mobile responsive | ✅ |
| Dark mode | ✅ |
| Animations | ✅ |
| Form handling | ✅ |

---

## 🛠 Advanced Customization

### Add More Sections

Copy a section in `index.html` and customize:

```html
<section class="section" id="new-section">
    <div class="container">
        <div class="section-header">
            <span class="section-overline">Label</span>
            <h2>Section Title</h2>
        </div>
        <!-- Your content here -->
    </div>
</section>
```

### Modify Three.js Effects

Edit `script.js` in `initHeroCanvas()` to change:
- Particle colors & size
- Animation speed
- Line effects
- Geometric shapes

### Change Fonts

Update Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;700&display=swap" rel="stylesheet">
```

Then update CSS:
```css
--font-serif: 'Your Font', serif;
```

---

## 📱 Mobile Optimization

Site is fully responsive:
- ✅ Mobile hamburger menu
- ✅ Touch-friendly forms
- ✅ Readable on all devices
- ✅ Fast load times (static site)

---

## 🚨 Troubleshooting

**Images not showing?**
- Check file paths in `portfolio-data.js`
- Make sure files are in `images/portfolio/`
- Check browser console for errors

**Form not submitting?**
- Check Formspree endpoint in `script.js`
- Test in browser console (check for CORS errors)
- Alternative: use Netlify Forms

**Site looks broken locally?**
- Make sure you're using a local server (not file://)
- Use: `python3 -m http.server 8000`
- NOT: Opening index.html directly

**Animations not smooth?**
- This is Three.js - needs WebGL support
- Works on all modern browsers
- Check GPU acceleration is enabled

---

## 📚 File Guide

| File | Purpose |
|------|---------|
| `index.html` | All HTML structure & forms |
| `style.css` | All styling & animations |
| `script.js` | JavaScript, Three.js, form handling |
| `portfolio-data.js` | Your tattoo portfolio (main thing to edit!) |

---

## 🎓 Learning Resources

Want to customize further?

- **HTML**: https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS**: https://developer.mozilla.org/en-US/docs/Web/CSS
- **JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Three.js**: https://threejs.org/docs/

---

## 💡 Tips

1. **Keep it simple** - Your tattoo work should be the star, not complicated design
2. **Update portfolio regularly** - Add new work as you complete pieces
3. **Use high-quality photos** - Good lighting + sharp focus = better portfolio
4. **Test on mobile** - Always check how it looks on phone
5. **Back up your work** - Push to GitHub regularly
6. **Monitor forms** - Check spam folder for submissions

---

## 🎯 Next Steps

1. ✅ Add your 15-20 tattoo photos
2. ✅ Update `portfolio-data.js` with your pieces
3. ✅ Test locally (`python3 -m http.server 8000`)
4. ✅ Push to GitHub
5. ✅ Enable GitHub Pages
6. ✅ Connect custom domain (optional)
7. ✅ Share on Instagram!

---

## 📞 Support

If you get stuck:
1. Check the troubleshooting section above
2. Check browser console for errors (F12)
3. Review the code comments
4. Test in different browser

---

**Built with ❤️ for your tattoo journey. Good luck! 🎨**
