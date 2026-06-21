#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'images', 'portfolio');
const out = path.join(dir, 'manifest.json');

if (!fs.existsSync(dir)) {
  console.error('Directory does not exist:', dir);
  process.exit(1);
}

const files = fs.readdirSync(dir)
  .filter(f => /\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(f))
  .sort();

fs.writeFileSync(out, JSON.stringify(files, null, 2), 'utf8');
console.log('Wrote manifest with', files.length, 'files to', out);
