import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Done-well-mathematical-literacy-/' : '/',
  // The exam-paper dataset (papers.ts) is deliberately one large lazy-loaded
  // chunk per subject, fetched only when a learner opens Assessments -- not
  // part of the initial load, so it's exempt from the default 500kB warning.
  build: {
    chunkSizeWarningLimit: 2000,
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
        // The per-subject paper chunks are big and a learner studies one or two
        // of them, so precaching all four would make every install download
        // roughly 1.4 MB gzipped of papers nobody in that browser will open.
        // They are cached on first use instead, by the runtime rule below, and
        // are then available offline exactly as before -- for the subjects that
        // learner actually uses.
        //
        // This also removes a hard build failure: Life Sciences crossed
        // workbox's 2 MiB precache ceiling when its Level 4 content landed, and
        // an asset over the ceiling fails the build rather than being skipped.
        globIgnores: ['**/{life-sciences,physical-sciences,mathematics,mat-lit}-*.js'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/(life-sciences|physical-sciences|mathematics|mat-lit)-[\w-]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'subject-papers',
              // Content-hashed filenames, so a cached entry is never stale --
              // a new build simply requests a new name. The cap is a housekeeping
              // limit, not a freshness one.
              expiration: { maxEntries: 8 },
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
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
})
