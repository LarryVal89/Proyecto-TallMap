const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, 'public', 'wrench-marker.svg'));

sharp(svgBuffer)
  .png()
  .toFile(path.join(__dirname, 'public', 'wrench-marker.png'))
  .then(() => {
    console.log('SVG convertido a PNG exitosamente');
  })
  .catch(err => {
    console.error('Error al convertir SVG a PNG:', err);
  }); 