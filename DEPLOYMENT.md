# Deploy OETATTOO to www.oetattoo.com

## Option 1: GitHub Pages + Custom Domain (Recommended)

### Step 1: Push to GitHub
```bash
cd /Users/oetattoo/Documents/Dev/OETATTOO_Website/oetattoo

# Initialize git (if not done)
git init
git add .
git commit -m "OE Tattoo - Geometric portfolio with free tattoos"
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/oetattoo.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to GitHub → Your repo → Settings
2. Navigate to **Pages** (left sidebar)
3. Source: Select `main` branch
4. Click Save
5. Wait 1-2 minutes for deployment

### Step 3: Connect Custom Domain
1. Go to **Settings → Pages**
2. Under "Custom domain," enter: `oetattoo.com`
3. Save
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Update DNS settings:
   - Type: CNAME
   - Name: www
   - Value: `YOUR_USERNAME.github.io`
6. Wait 24-48 hours for DNS propagation

Your site will be live at `https://www.oetattoo.com`

---

## Option 2: Netlify (Easiest)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "OE Tattoo site"
git push -u origin main
```

### Step 2: Deploy to Netlify
1. Go to https://netlify.com
2. Sign up (free)
3. Click "New site from Git"
4. Connect GitHub → Select your repo
5. Deploy settings:
   - Build command: (leave empty - static site)
   - Publish directory: `.` (root)
6. Click Deploy

### Step 3: Add Custom Domain
1. Netlify Dashboard → Domain Settings
2. Add custom domain: `oetattoo.com`
3. Update DNS at your registrar (same as GitHub Pages)

---

## Option 3: Manual Upload (If You Have FTP)

If your hosting provider supports FTP/SFTP:

1. Zip all files (except .git folder):
   ```bash
   zip -r oetattoo-site.zip . -x "*.git*"
   ```

2. Upload to your hosting:
   - Use FileZilla or your host's FTP tool
   - Upload to: `public_html/` or `www/`

3. Done! Visit `www.oetattoo.com`

---

## Before You Deploy - Final Checklist

- [ ] Portfolio images added to `images/portfolio/`
- [ ] `portfolio-data.js` updated with your tattoos
- [ ] All images load locally (test with `python3 -m http.server 8000`)
- [ ] Form works (test submission)
- [ ] Mobile looks good (test on phone)
- [ ] All spelling/grammar checked
- [ ] Contact info correct (email, Instagram)
- [ ] All links work

---

## Quick Test Before Going Live

```bash
# Test locally first
python3 -m http.server 8000

# Open http://localhost:8000 and verify:
# ✓ Hero section displays
# ✓ Portfolio images load
# ✓ All links work
# ✓ Mobile responsive
# ✓ Form submits
```

---

## Post-Deployment

1. **Test live site** at www.oetattoo.com
2. **Share on Instagram** - update your bio link
3. **Monitor form submissions** - respond quickly
4. **Update portfolio regularly** - add new work as you do it
5. **Check analytics** - see how people find you

---

## Troubleshooting Deployment

**Site not live after GitHub Pages setup?**
- Wait 2-5 minutes for deployment to complete
- Check GitHub Actions tab (should show green checkmark)
- Clear browser cache (Ctrl+Shift+Delete)

**Custom domain not working?**
- Wait 24-48 hours for DNS to propagate
- Check DNS records at your registrar
- Verify CNAME points to `YOUR_USERNAME.github.io`

**Images broken on live site?**
- Check file paths in `portfolio-data.js`
- Make sure `images/portfolio/` folder is committed to Git
- Verify image files exist in repo

**Form not submitting?**
- Check Formspree endpoint in `script.js`
- Make sure you created account at formspree.io
- Test in incognito window (no cache)

---

## All Files in Your Repo

Make sure these are committed to GitHub:

```
✓ index.html
✓ style.css
✓ script.js
✓ portfolio-data.js
✓ README.md
✓ QUICKSTART.md
✓ .gitignore
✓ images/portfolio/*.jpg (your tattoo photos)
```

---

## Your Site is Production-Ready!

Everything is built, tested, and ready to go live. Just:

1. Add your portfolio images
2. Push to GitHub
3. Enable GitHub Pages
4. Connect custom domain
5. 🚀 Live!

---

**Questions? Start with the deployment checklist above, then troubleshooting section if needed.**
