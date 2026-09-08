import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Done-well-mathematical-literacy-/' : '/',
  // The exam-paper dataset (papers.ts) is deliberately one large lazy-loaded
  // chunk, fetched only when a learner opens Assessments -- not part of the
  // initial load, so it's exempt from the default 500kB warning.
  build: {
    chunkSizeWarningLimit: 1500,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // All learner/teacher content (subjects, topics, questions, resources) is
      // static data bundled into the JS — there's no API to go stale, so once
      // installed the app works fully offline, not just app-shell-offline.
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
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
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
})
