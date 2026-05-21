# OETATTOO - Quick Start Guide

## ✅ What's Done

I've built you a **complete, production-ready website** with:

✅ **Beautiful Design** - Sondaven aesthetic (dark, minimal, poetic)
✅ **Hero Section** - Three.js WebGL geometric animations
✅ **About Section** - Your story & approach
✅ **Portfolio Grid** - Showcase your work (hover effects)
✅ **Free Tattoos Form** - Sign-ups with validation
✅ **Contact Section** - Email, Instagram, location
✅ **Mobile Responsive** - Works on all devices
✅ **Smooth Animations** - Scroll effects, transitions
✅ **100% Static** - No backend needed, just HTML/CSS/JS

---

## 📋 Your Next Steps (30 minutes)

### Step 1: Create Portfolio Folder
```bash
mkdir -p images/portfolio
```

### Step 2: Add Your Tattoo Photos

1. Gather your **15-20 best geometric tattoo photos**
2. Resize to 1000x1000px (or larger)
3. Compress to under 300KB each
4. Save as: `images/portfolio/tattoo-01.jpg`, `tattoo-02.jpg`, etc.

### Step 3: Update Portfolio Data

Edit `portfolio-data.js` - replace the example entries with YOUR tattoos:

```javascript
const portfolioData = [
    {
        title: "Geometric Triangle",          // Your tattoo name
        image: "images/portfolio/tattoo-01.jpg",  // File path
        size: "Small",                         // Small/Medium
        placement: "Left Forearm",             // Where on body
        date: "December 2024"                  // When completed
    },
    // Add 14-19 more entries...
];
```

### Step 4: Test Locally

```bash
# Navigate to your project
cd /Users/oetattoo/Documents/Dev/OETATTOO_Website/oetattoo

# Start local server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

Test:
- ✅ Images load in portfolio
- ✅ Click links (smooth scroll)
- ✅ Hover on portfolio items (overlay appears)
- ✅ Mobile view (resize browser or use phone)
- ✅ Fill out form (should submit)

### Step 5: Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial OETATTOO site - geometric portfolio with free tattoos"

# Add your GitHub repo (replace USERNAME)
git branch -M main
git remote add origin https://github.com/USERNAME/oetattoo.git
git push -u origin main
```

### Step 6: Enable GitHub Pages

1. Go to your repo on GitHub
2. Settings → Pages
3. Source: `main` branch
4. Click Save
5. Site goes live at: `https://USERNAME.github.io/oetattoo`

### Step 7: Connect Custom Domain

1. GitHub: Settings → Pages → Custom domain: `oetattoo.com`
2. Your domain registrar: Add CNAME record pointing to your GitHub Pages URL
3. (GitHub will provide exact instructions)

---

## 🎨 Current Design

**Color Palette:**
- Background: Deep black (#0f0f0f)
- Text: Warm cream (#f5f5f0)
- Accents: Deep red (#c41e3a), Gold (#d4af37)

**Typography:**
- Headers: Playfair Display (serif, bold)
- Body: Inter (sans-serif, clean)

**Vibe:** Dark, minimal, poetic (like Sondaven)

---

## 🔧 If You Want to Customize

### Change Colors
Edit `style.css` `:root` section:
```css
--bg-primary: #0f0f0f;      /* Change if you want */
--accent-red: #c41e3a;      /* Your brand color */
```

### Change Copy
Edit `index.html` directly - search for:
- Hero title/subtitle
- About text
- Form labels
- Contact info

### Change Fonts
Edit in `index.html` and `style.css`:
- Replace Google Fonts link
- Update CSS variable `--font-serif` or `--font-sans`

---

## 📝 Important Files

| File | What to Edit |
|------|-------------|
| `portfolio-data.js` | ADD YOUR TATTOO PHOTOS & INFO HERE ⭐ |
| `images/portfolio/` | Place your JPG files here |
| `index.html` | Edit copy/text/contact info if needed |
| `style.css` | Edit colors/fonts if you want |
| `script.js` | (leave alone unless you know JS) |

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Add all 15-20 portfolio images
- [ ] Update `portfolio-data.js` with accurate info
- [ ] Test locally (http://localhost:8000)
- [ ] All images load correctly
- [ ] Form submits without errors
- [ ] Mobile looks good (test on phone)
- [ ] Spelling/grammar check
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Test live site
- [ ] (Optional) Connect custom domain

---

## 💡 Pro Tips

1. **Use consistent photo style** - Same lighting, exposure, angle for all portfolio pieces
2. **High quality matters** - Your work deserves sharp, clean photos
3. **Update regularly** - Add new pieces as you complete them
4. **Share on Instagram** - Link bio to your site
5. **Backup to GitHub** - Push changes regularly

---

## ❓ Questions?

**Images not showing?**
- Check file paths in `portfolio-data.js`
- Make sure images are in `images/portfolio/`

**Form not working?**
- Check browser console (F12) for errors
- Update Formspree endpoint in `script.js` if needed

**Site looks different locally vs live?**
- Use local server: `python3 -m http.server 8000`
- NOT file:// (won't work for Three.js)

**Want to customize design?**
- Edit CSS in `style.css`
- Change colors in `:root` section
- Modify HTML in `index.html`

---

## 📊 Site Structure

```
Hero Section
  ↓ (scroll down)
About Section  (Your Story)
  ↓
Portfolio  (Your Work - 15-20 pieces)
  ↓
Free Tattoos  (Sign-up Form)
  ↓
Contact  (Email, Instagram, Location)
  ↓
Footer
```

---

## 🎯 Your Site is Ready!

Everything is built and working. All you need to do is:

1. ✅ Add your tattoo photos to `images/portfolio/`
2. ✅ Update `portfolio-data.js` with your info
3. ✅ Test locally
4. ✅ Push to GitHub
5. ✅ Enable GitHub Pages
6. ✅ Share it with the world! 🌍

---

**You now have a professional, beautiful portfolio site that's 100% yours. No vendor lock-in, no monthly fees, just pure web technology. Good luck building your tattoo career! 🎨**
