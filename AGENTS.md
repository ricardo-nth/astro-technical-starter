# Astro Technical Starter - AI Agent Guide

## Project Overview

A **Minimum Viable Site (MVS)** template demonstrating production-ready technical SEO in Astro. Educational reference for implementing meta tags, structured data, and Core Web Vitals.

**Key principle**: Use community plugins over custom code. Teach patterns, not prescribe solutions.

## Architecture

### Layout Hierarchy

```
BaseLayout.astro       → <head>, SEO plugins, analytics
  └─ SiteLayout.astro  → Header, Footer, navigation
       └─ Page.astro   → Content + page-specific schema
```

### SEO Implementation

| Concern | Solution |
|---------|----------|
| Meta tags | `astro-seo` plugin in BaseLayout |
| JSON-LD | `astro-seo-schema` + `schema-dts` types |
| Sitemap | `@astrojs/sitemap` integration |
| Robots | Dynamic `src/pages/robots.txt.ts` |

### File Structure

```
src/
├── components/
│   ├── analytics/     # GTM, Clarity, WebVitals, SiteVerification
│   ├── blocks/        # Tailwind UI components (Header, Hero, FAQ, etc.)
│   └── seo/           # CommonMeta, Favicons
├── layouts/
│   ├── BaseLayout.astro   # SEO + analytics wrapper
│   └── SiteLayout.astro   # Site chrome (header/footer)
├── pages/
│   ├── index.astro        # WebSite schema
│   ├── services.astro     # WebPage + FAQPage schema
│   ├── contact.astro      # ContactPage schema
│   └── robots.txt.ts      # Dynamic robots.txt
├── styles/
│   └── global.css         # Tailwind v4
└── utils/
    ├── env.ts             # Environment helpers
    └── vitals.ts          # Web Vitals tracking
```

## Common Tasks

### Adding a New Page

1. Create `src/pages/new-page.astro`
2. Import `SiteLayout` and schema types
3. Define `title`, `description`, and `schema`
4. Pass props to `SiteLayout`

```astro
---
import SiteLayout from '@/layouts/SiteLayout.astro';
import type { WebPage, WithContext } from 'schema-dts';

const title = 'New Page | Site Name';
const description = 'Description for meta tags.';

const schema: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: new URL('/new-page', Astro.site).toString(),
};
---

<SiteLayout title={title} description={description} schema={schema}>
  <!-- Content -->
</SiteLayout>
```

### Adding FAQ Schema (for rich snippets)

```astro
---
import type { FAQPage, WithContext } from 'schema-dts';

const faqs = [
  { question: 'Question?', answer: 'Answer.' },
];

const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

// Pass as array with other schemas
const schemas = [webPageSchema, faqSchema];
---

<SiteLayout title={title} description={description} schema={schemas}>
```

### Adding a Block Component

1. Create component in `src/components/blocks/`
2. Use Tailwind classes (copy from Tailwind UI, Flowbite, etc.)
3. Accept props for customization
4. Import in page

### Modifying Analytics

Analytics components use environment variables:

- `PUBLIC_GTM_ID` → TagManager.astro
- `PUBLIC_CLARITY_ID` → Clarity.astro
- `PUBLIC_GOOGLE_VERIFICATION` → SiteVerification.astro

Components render nothing if env vars are not set.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check` | TypeScript checking |

## Dependencies

### Core
- `astro` - Framework
- `tailwindcss` + `@tailwindcss/vite` - Styling

### SEO
- `astro-seo` - Meta tags, Open Graph, Twitter Cards
- `astro-seo-schema` - JSON-LD rendering
- `schema-dts` - TypeScript types for Schema.org

### Infrastructure
- `@astrojs/sitemap` - Auto-generate sitemap
- `@astrojs/partytown` - Third-party script isolation
- `astro-compressor` - Gzip/Brotli compression
- `@astrojs/vercel` - Deployment adapter

## Guidelines for AI Agents

1. **Use community plugins** - Don't write custom SEO utilities
2. **Keep it minimal** - This is an MVS, not a full CMS
3. **Tailwind only** - No custom CSS unless absolutely necessary
4. **Type-safe schemas** - Always use `schema-dts` types
5. **Document the why** - Comments should explain SEO concepts, not just code

## Non-Goals

This template intentionally does NOT include:
- Blog/pagination
- CMS integration
- Authentication
- E-commerce
- Complex content collections

These belong in extended templates built on top of this foundation.
