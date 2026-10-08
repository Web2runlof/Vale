
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

// GitHub Pages publica este repositorio dentro de /Vale/.
// En Google AI Studio y en desarrollo local se conserva la ruta /.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Vale';

const siteBase = isGitHubPages ? `/${repositoryName}/` : '/';

// La web recibida contiene rutas literales:
// /media/photos/foto-01.webp
//
// En GitHub Pages deben apuntar a:
// /Vale/media/photos/foto-01.webp
//
// Esta transformación solo se aplica al compilar
// para GitHub Pages, sin modificar los componentes
// ni los datos de las 28 fotografías.

const fixMediaPathsForPages: Plugin = {
  name: 'fix-media-paths-for-github-pages',
  enforce: 'pre',

  transform(code, id) {
    if (
      !isGitHubPages ||
      !id.includes('/src/') ||
      !/\.[cm]?[jt]sx?(?:\?.*)?$/.test(id)
    ) {
      return null;
    }

    if (!code.includes('/media/')) {
      return null;
    }

    return {
      code: code.replace(
        /(["'`])\/media\//g,
        `$1${siteBase}media/`
      ),
      map: null,
    };
  },
};

export default defineConfig(() => ({
  base: siteBase,

  plugins: [
    fixMediaPathsForPages,
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    // Compatibilidad con Google AI Studio.
    hmr: process.env.DISABLE_HMR !== 'true',

    watch:
      process.env.DISABLE_HMR === 'true'
        ? null
        : {},
  },
}));
