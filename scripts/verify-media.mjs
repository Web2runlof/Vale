import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'public', 'media');
const failures = [];
const required = [
  ...Array.from({ length: 28 }, (_, i) => `photos/foto-${String(i + 1).padStart(2, '0')}.webp`),
  'photos/hero-vale.webp',
  ...Array.from({ length: 4 }, (_, i) => `videos/video-${String(i + 1).padStart(2, '0')}.mp4`),
  ...Array.from({ length: 4 }, (_, i) => `videos/video-${String(i + 1).padStart(2, '0')}-poster.webp`),
];

for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`Falta ${rel}`);
    continue;
  }
  const fd = fs.openSync(full, 'r');
  const header = Buffer.alloc(16);
  fs.readSync(fd, header, 0, 16, 0);
  fs.closeSync(fd);
  if (rel.endsWith('.webp') && (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP')) {
    failures.push(`${rel}: no es un WebP real (no basta con renombrar un JPEG)`);
  }
  if (rel.endsWith('.mp4') && header.toString('ascii', 4, 8) !== 'ftyp') {
    failures.push(`${rel}: no es un MP4 real`);
  }
}

if (failures.length) {
  console.error('❌ Medios inválidos. Corrige antes de publicar:');
  for (const f of failures) console.error(`   - ${f}`);
  process.exit(1);
}
console.log('✅ Validación correcta: 28 fotos + portada en WebP REAL, 4 videos MP4 y 4 posters.');
