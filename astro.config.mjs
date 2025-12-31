// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import compressor from 'astro-compressor';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },

  integrations: [
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
    }),
  ],

  adapter: vercel(),
});