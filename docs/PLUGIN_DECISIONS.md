# Plugin Decisions & Evaluation

This document captures our evaluation of Astro community plugins for the MVS template refactor. Decisions are based on:
1. **Maintenance** - Is it actively maintained? When was the last update?
2. **Adoption** - How many projects use it? Stars, downloads?
3. **Stability** - Will it break? Does it need frequent updates?
4. **API Quality** - Is it well-designed and easy to use?
5. **Documentation** - Is it well-documented?

---

## SEO Meta Tags

### Candidates

| Package | Stars | Downloads | Last Updated | Maintainer |
|---------|-------|-----------|--------------|------------|
| `astro-seo` (jonasmerlin) | 1,200+ | 8,600+ dependents | Jun 2024 | Solo maintainer |
| `@astrolib/seo` (arthelokyo) | 70 | Lower | May 2024 | Fork, small team |

### Evaluation

#### `astro-seo` (jonasmerlin) ✅ RECOMMENDED

**Pros:**
- **Most popular** - 1,200+ stars, 8,600+ projects using it
- **Battle-tested** - 4 years old, 262 commits, 30 releases
- **Complete API** - Title templates, OG, Twitter, canonical, noindex/nofollow, language alternates
- **Extensible** - `extend.link` and `extend.meta` for custom tags
- **Simple** - Single component, straightforward props
- **Well-documented** - Comprehensive README with all props

**Cons:**
- Solo maintainer (bus factor)
- Last update Jun 2024 (6 months ago, but stable API)

**Example:**
```astro
<SEO
  title="Page Title"
  titleTemplate="%s | Site Name"
  description="Page description"
  canonical="https://example.com/page"
  openGraph={{
    basic: { title: "OG Title", type: "website", image: "/og.png" }
  }}
  twitter={{ card: "summary_large_image", creator: "@handle" }}
/>
```

#### `@astrolib/seo` (arthelokyo)

**Pros:**
- Based on Next SEO (familiar API)
- Supports multiple OG images
- More OG options (profile, book, article)

**Cons:**
- Much smaller adoption (70 stars vs 1,200)
- Fork of another project, unclear long-term maintenance
- Less battle-tested

### Decision: `astro-seo`

The massive adoption (8,600+ dependents) makes this the safe choice. The API is mature and unlikely to change significantly. Even if unmaintained, it's simple enough to fork or inline if needed.

---

## Schema.org / JSON-LD

### Candidates

| Package | Stars | Downloads | Last Updated | Approach |
|---------|-------|-----------|--------------|----------|
| `astro-seo-schema` (codiume/orbit) | 526 | Good | Jul 2025 | Type-safe with `schema-dts` |

### Evaluation

#### `astro-seo-schema` ✅ RECOMMENDED

**Pros:**
- **Type-safe** - Uses `schema-dts` for full TypeScript definitions
- **Active maintenance** - Updated Jul 2025, part of larger `orbit` monorepo
- **Simple API** - Just pass an `item` object
- **Correct approach** - Escapes JSON, outputs proper `<script type="application/ld+json">`
- **No magic** - You write the schema, it just renders it safely

**Cons:**
- Requires `schema-dts` as peer dependency (adds ~100KB to dev deps, not bundle)

**Example:**
```astro
<Schema
  item={{
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png'
  }}
/>
```

### Decision: `astro-seo-schema`

This is the clear winner. The type-safety from `schema-dts` is excellent for teaching correct schema usage. The "will never break" nature (it just serializes JSON) makes it maintenance-free.

---

## Sitemap

### Candidates

| Package | Official | Last Updated | Maintenance |
|---------|----------|--------------|-------------|
| `@astrojs/sitemap` | ✅ Yes | Active | Astro team |

### Evaluation

#### `@astrojs/sitemap` ✅ RECOMMENDED (No alternatives needed)

**Pros:**
- **Official Astro integration** - Maintained by core team
- **Auto-generates** from routes - No manual config needed
- **Handles dynamic routes** - Works with `getStaticPaths()`
- **Configurable** - filter, customPages, i18n support, serialize
- **Just works** - Add to config, done

**Example:**
```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
});
```

### Decision: `@astrojs/sitemap`

No reason to use anything else. Official, well-maintained, handles all edge cases.

---

## Robots.txt

### Candidates

| Package | Stars | Last Updated | Approach |
|---------|-------|--------------|----------|
| `astro-robots-txt` (alextim) | 127 | Sep 2023 | Integration |

### Evaluation

#### `astro-robots-txt` ⚠️ CONDITIONAL

**Pros:**
- **Feature-rich** - policy rules, host, transform, sitemap linking
- **Astro integration** - Runs at build time
- **Syncs with `site`** - Uses Astro config automatically

**Cons:**
- **Last updated Sep 2023** - 2+ years old
- **May be overkill** - For simple cases, a static file works

**Alternative: Static `public/robots.txt`**

For the MVS template, a simple static file may be sufficient:
```txt
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap-index.xml
```

**Alternative: Dynamic `src/pages/robots.txt.ts`**

Generate dynamically using Astro's site config:
```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap.href}`);
};
```

### Decision: Dynamic route (no plugin)

For simplicity and zero dependencies, use the dynamic `robots.txt.ts` approach. It automatically syncs with the `site` config and requires no external package.

---

## Performance: Third-Party Scripts

### Candidates

| Package | Official | Purpose |
|---------|----------|---------|
| `@astrojs/partytown` | ✅ Yes | Offload scripts to web worker |

### Evaluation

#### `@astrojs/partytown` ⚠️ OPTIONAL

**Pros:**
- **Official Astro integration**
- **Real performance gains** for analytics/ads scripts
- **Easy to use** - Just add `type="text/partytown"` to scripts

**Cons:**
- **Only useful if you have third-party scripts** (analytics, ads)
- **Adds complexity** for simple sites
- **Can break some scripts** that rely on main thread

**When to use:**
- Sites with Google Analytics, GTM, Facebook Pixel, etc.
- Sites where third-party scripts block rendering

**When NOT to use:**
- MVS template with no analytics (keep it simple)
- Sites where all scripts are first-party

### Decision: Include but make optional

Include in the template as a **documented option**, but don't enable by default. Show how to use it for common cases (GA, GTM) in comments.

---

## Performance: Image Optimization

### Already Included

| Package | Purpose | Status |
|---------|---------|--------|
| `sharp` | Image optimization | ✅ Keep |

Astro's built-in `<Image>` component uses `sharp` for optimization. No additional plugin needed.

---

## Performance: Compression

### Already Included

| Package | Purpose | Status |
|---------|---------|--------|
| `astro-compressor` | Gzip/Brotli | ✅ Keep |

Simple integration that compresses output. Useful for non-Vercel/Netlify deployments.

---

## Final Plugin Stack

### Required (install these)

| Package | Purpose | Why |
|---------|---------|-----|
| `astro-seo` | Meta tags, OG, Twitter | Most adopted, complete API |
| `astro-seo-schema` | JSON-LD structured data | Type-safe, simple, reliable |
| `schema-dts` | TypeScript types for schema | Required by astro-seo-schema |
| `@astrojs/sitemap` | Auto-generate sitemap | Official, zero config |

### Keep (already in project)

| Package | Purpose |
|---------|---------|
| `tailwindcss` | Styling foundation |
| `@tailwindcss/forms` | Form styling plugin |
| `tw-animate-css` | Animation utilities |
| `sharp` | Image optimization |
| `astro-compressor` | Output compression |
| `@astrojs/vercel` | Vercel adapter |
| `astro-icon` | Icons via Iconify |
| `@iconify-json/tabler` | Tabler icon set |

### Optional (document but don't enable)

| Package | Purpose | When to enable |
|---------|---------|----------------|
| `@astrojs/partytown` | Third-party script isolation | When adding analytics |

### Remove (not needed with new plugins)

| Package | Reason |
|---------|--------|
| Custom `src/utils/schema.ts` | Replaced by `astro-seo-schema` |
| Custom `src/components/seo/Meta.astro` | Replaced by `astro-seo` |
| Custom `src/components/seo/Schema.astro` | Replaced by `astro-seo-schema` |
| `astro-robots-txt` | Use dynamic route instead |

---

## Installation Commands

```bash
# Add new plugins
pnpm add astro-seo astro-seo-schema schema-dts

# Remove if present (we're replacing with plugins)
pnpm remove astro-robots-txt  # if installed

# Already have these (keep them)
# @astrojs/sitemap - already in project
# tailwindcss - already in project
# sharp - already in project
```

---

## Migration Notes

### From custom Meta.astro to astro-seo

**Before (custom):**
```astro
<Meta 
  title={metadata.title}
  description={metadata.description}
  ogImage={metadata.ogImage}
/>
```

**After (plugin):**
```astro
import { SEO } from 'astro-seo';

<SEO
  title={metadata.title}
  description={metadata.description}
  openGraph={{
    basic: {
      title: metadata.title,
      type: "website",
      image: metadata.ogImage,
    }
  }}
/>
```

### From custom Schema.astro to astro-seo-schema

**Before (custom):**
```astro
<Schema schemaData={[organizationSchema, webPageSchema]} />
```

**After (plugin):**
```astro
import { Schema } from 'astro-seo-schema';

<Schema item={organizationSchema} />
<Schema item={webPageSchema} />
```

---

---

## Other Notable Plugins (Not Required, But Worth Knowing)

From the [official Astro integrations page](https://astro.build/integrations/?categories%5B%5D=performance%2Bseo):

| Package | Weekly Downloads | Purpose | Notes |
|---------|-----------------|---------|-------|
| `astro-icon` | 390K | Icon component | Useful for UI, not SEO-critical |
| `sonda` | 164K | Bundle analyzer | Good for debugging bundle size |
| `@swup/astro` | 115K | Smooth page transitions | Nice UX, but adds complexity |
| `astro-font` | 30K | Font optimization | Auto-optimizes custom/Google fonts |
| `astro-og-canvas` | 27K | Generate OG images | Creates OG images at build time |
| `astro-purgecss` | 15K | Remove unused CSS | Useful for Tailwind if not using JIT |

### `astro-og-canvas` - Worth Considering

This could be valuable for the MVS template since it auto-generates OG images:
```astro
import { OGImageRoute } from 'astro-og-canvas';
// Generates social share images automatically
```

**Decision**: Not required for MVP, but could be a nice addition in Phase 2.

### `astro-font` - Worth Considering

If using custom fonts, this optimizes them automatically:
```astro
import { AstroFont } from 'astro-font';
// Auto-preloads, subsets, and optimizes fonts
```

**Decision**: Nice to have, not essential for MVP.

---

## References

- [astro-seo GitHub](https://github.com/jonasmerlin/astro-seo)
- [astro-seo-schema GitHub](https://github.com/codiume/orbit/tree/main/packages/astro-seo-schema)
- [@astrojs/sitemap Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [@astrojs/partytown Docs](https://docs.astro.build/en/guides/integrations-guide/partytown/)
- [Astro Integrations Directory](https://astro.build/integrations/?categories%5B%5D=performance%2Bseo)
