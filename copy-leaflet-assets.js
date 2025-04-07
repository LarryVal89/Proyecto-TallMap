const fs = require('fs');
const path = require('path');

// Crear la carpeta public si no existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Archivos a copiar
const files = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

// Ruta de origen (node_modules)
const sourceDir = path.join(__dirname, 'node_modules', 'leaflet', 'dist', 'images');

// Copiar archivos
files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copiado: ${file}`);
  } else {
    console.error(`No se encontró: ${file}`);
  }
});

console.log('Proceso completado. Los archivos de Leaflet han sido copiados a la carpeta public.'); 