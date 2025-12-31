# Astro Technical Starter

A minimal Astro template with production-ready technical SEO. Three pages, community plugins, Tailwind CSS.

## What This Is

A **Minimum Viable Site (MVS)** template that handles all the boring-but-critical technical SEO stuff, so you can focus on content and design.

- **3 pages**: Home, Services, Contact
- **Community plugins**: No custom SEO code to maintain
- **Tailwind CSS v4**: Copy/paste components from anywhere
- **Type-safe schema**: JSON-LD structured data with TypeScript

## Quick Start

```bash
# Clone
git clone https://github.com/ricardo-nth/astro-technicalSEO-starter.git
cd astro-technicalSEO-starter

# Install
pnpm install

# Dev
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321)

## What's Included

### SEO (via community plugins)

| Feature | Plugin | Output |
|---------|--------|--------|
| Meta tags | `astro-seo` | `<title>`, `<meta>`, Open Graph, Twitter Cards |
| Structured data | `astro-seo-schema` + `schema-dts` | JSON-LD with TypeScript types |
| Sitemap | `@astrojs/sitemap` | `/sitemap-index.xml` |
| Robots | Dynamic route | `/robots.txt` |

### Per-Page Schema Types

```
/           → WebSite
/services   → WebPage + FAQPage (for rich snippets)
/contact    → ContactPage
```

### Project Structure

```
src/
├── components/
│   ├── analytics/    # GTM, Clarity, WebVitals
│   ├── blocks/       # Tailwind UI components
│   └── seo/          # CommonMeta, Favicons
├── layouts/
│   ├── BaseLayout    # <head>, SEO, analytics
│   └── SiteLayout    # Header, Footer, navigation
├── pages/
│   ├── index.astro
│   ├── services.astro
│   └── contact.astro
└── styles/
    └── global.css    # Tailwind v4
```

## Adding SEO to a Page

```astro
---
// src/pages/example.astro
import SiteLayout from '@/layouts/SiteLayout.astro';
import type { WebPage, WithContext } from 'schema-dts';

const title = 'Page Title | Site Name';
const description = 'Page description for search results.';

const schema: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: new URL('/example', Astro.site).toString(),
};
---

<SiteLayout title={title} description={description} schema={schema}>
  <!-- Page content -->
</SiteLayout>
```

## Configuration

### Site URL

Update in `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```

### Analytics (Optional)

Set environment variables for tracking:

```env
PUBLIC_GTM_ID=GTM-XXXXXX
PUBLIC_CLARITY_ID=xxxxxxxxxx
PUBLIC_GOOGLE_VERIFICATION=xxxxx
```

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check` | TypeScript type checking |

## Tech Stack

- [Astro 5](https://astro.build)
- [Tailwind CSS 4](https://tailwindcss.com)
- [astro-seo](https://github.com/jonasmerlin/astro-seo)
- [astro-seo-schema](https://github.com/codiume/orbit/tree/main/packages/astro-seo-schema)
- [schema-dts](https://github.com/google/schema-dts)

## License

MIT
