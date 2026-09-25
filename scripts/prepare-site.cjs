const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'img'), { recursive: true });
for (const name of ['index.html', 'checkout.html', 'style.css', 'scrip.js', 'plans.js', 'checkout.js']) {
    fs.copyFileSync(path.join(root, name), path.join(out, name));
}
for (const name of ['gimnasio-interior.png', 'profe-lucas.png', 'profe-valentina.png', 'profe-mateo.png', 'zona-cardio-bicis.png']) {
    fs.copyFileSync(path.join(root, 'img', name), path.join(out, 'img', name));
}
console.log('Archivos públicos preparados en dist.');
