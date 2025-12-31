// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import compressor from 'astro-compressor';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  image: {
    // Image service configuration for optimal performance
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  experimental: {
    // Enable live content collections in development
    liveContentCollections: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
    alias: {
        '@': '/src',
        '@components': '/src/components',
        '@types': '/src/types',
        '@layouts': '/src/layouts',
        '@utils': '/src/utils',
        },
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false, // Disable in production for smaller builds
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'vendor-astro': ['astro'],
            'vendor-web-vitals': ['web-vitals'],
            
            // Utility chunks
            'utils-seo': ['./src/utils/seo'],
            'utils-content': ['./src/utils/content'],
            'utils-vitals': ['./src/utils/vitals'],
            
            // Component chunks
            'components-seo': ['./src/components/seo/Meta.astro', './src/components/seo/Schema.astro'],
            'components-analytics': ['./src/components/analytics/TagManager.astro', './src/components/analytics/WebVitals.astro'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: !process.env.DEV, // Remove console.log in production
          drop_debugger: true,
        },
      },
    },
    // Dependency optimization
    optimizeDeps: {
      include: ['web-vitals'],
    },
  },
  site: process.env.SITE_URL || 'https://stargazers.club',
  integrations: [
    icon({
      include: {
        tabler: ['*'], // Include all tabler icons, or specify: ['home', 'menu', 'x', ...]
      },
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }), 
    partytown({
      config: {
        forward: ['gtag', 'dataLayer.push'],
      },
    }), 
    compressor({
      gzip: true,
      brotli: true,
    })
  ],
  adapter: vercel(),
});