Add your images into `images/portfolio/` and generate a manifest for the static site

1) Create the directory (if it doesn't exist):

```bash
mkdir -p images/portfolio
```

2) Copy your image files into `images/portfolio/`.

3) Use ImageMagick (optional) to pre-resize images for the web (1200px max):

```bash
magick mogrify -path images/portfolio -resize "1200x1200>" -quality 85 /path/to/source/*.{jpg,jpeg,png}
```

Or with macOS `sips` fallback:

```bash
for f in /path/to/source/*.{jpg,jpeg,png}; do
  [ -f "$f" ] || continue
  sips -Z 1200 "$f" --out images/portfolio/"$(basename "$f")"
done
```

4) Generate the manifest so the site can list these images:

```bash
node scripts/generate_portfolio_manifest.js
```

This writes `images/portfolio/manifest.json` which the front-end will fetch and display in the "Collaborate" section.

5) Commit and push the files:

```bash
git add images/portfolio images/portfolio/manifest.json index.html script.js style.css scripts/generate_portfolio_manifest.js README_IMAGES.md
git commit -m "Add portfolio images and manifest; site loads committed images"
git push origin $(git branch --show-current)
```
