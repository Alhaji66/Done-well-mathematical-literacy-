import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hosting } from './tools/hosting'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Done-well-mathematical-literacy-/' : '/',
  build: {
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // The app shell, notes and resources are bundled and precached. The
      // question bank is downloaded per subject and saved on the device (see
      // src/lib/contentPacks.ts), so a saved subject also works offline.
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // The question bank is not part of the build any more: each subject is
        // a content pack downloaded from Supabase Storage for a signed-in
        // account and saved on the device by src/lib/contentPacks.ts, which is
        // what keeps practice and papers working offline.
        runtimeCaching: [
          {
            // The maths fonts. Not precached (they are only needed once a page
            // shows maths), but kept once fetched: without them an offline
            // page draws every formula in a fallback font. Every browser that
            // installs the app reads the .woff2 files, so .woff and .ttf are
            // never fetched and are not cached.
            urlPattern: /\/assets\/KaTeX_[\w-]+\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'maths-fonts',
              expiration: { maxEntries: 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'DONE WELL® School Support Platform',
        short_name: 'DONE WELL',
        description:
          'Affordable, curriculum-aligned resources, practice and progress support for South African learners, parents, teachers and schools.',
        theme_color: '#0B1F3A',
        background_color: '#0B1F3A',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
    hosting(dirname),
  ],
  resolve: {
    alias: [
      // The browser gets the question bank from downloaded content packs, never
      // from the source modules -- see src/data/contentSource.ts. Must come
      // before the general '@' entry, which would otherwise match first.
      { find: /^@\/data\/contentSource$/, replacement: path.resolve(dirname, 'src/data/contentSource.client.ts') },
      { find: '@', replacement: path.resolve(dirname, 'src') },
    ],
  },
})
