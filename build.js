const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  
  // Files to copy
  const filesToCopy = ['index.html', 'manifest.json', 'service-worker.js'];
  for (const file of filesToCopy) {
    const srcFile = path.join(srcDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(destDir, file));
      console.log(`Copied ${file} to www/`);
    } else {
      console.warn(`Warning: ${file} not found in root, skipping.`);
    }
  }

  // Copy icons if folder exists
  const srcIcons = path.join(srcDir, 'icons');
  const destIcons = path.join(destDir, 'icons');
  if (fs.existsSync(srcIcons)) {
    copyDirSync(srcIcons, destIcons);
    console.log(`Copied icons/ to www/icons/`);
  }
  
  console.log('Build completed successfully!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
