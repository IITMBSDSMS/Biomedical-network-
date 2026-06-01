const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, 'temp-install');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(targetDir, 'package.json'),
  JSON.stringify({ name: 'temp-install', version: '1.0.0' })
);

console.log('Running npm install pdfkit inside temp folder...');
try {
  execSync('npm install pdfkit --no-audit --no-fund', { cwd: targetDir, stdio: 'inherit' });
} catch (err) {
  console.error('NPM installation failed in temp folder, trying with cache bypass...', err);
  execSync('npm install pdfkit --no-audit --no-fund --cache=./.npm-cache --force', { cwd: targetDir, stdio: 'inherit' });
}

console.log('Copying node_modules...');
const srcNodeModules = path.join(targetDir, 'node_modules');
const destNodeModules = path.join(__dirname, '../node_modules');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const srcEl = path.join(from, element);
    const destEl = path.join(to, element);
    if (fs.lstatSync(srcEl).isDirectory()) {
      copyFolderSync(srcEl, destEl);
    } else {
      fs.copyFileSync(srcEl, destEl);
    }
  });
}

copyFolderSync(srcNodeModules, destNodeModules);

console.log('Cleaning up...');
fs.rmSync(targetDir, { recursive: true, force: true });
console.log('Installation of pdfkit finished successfully!');
