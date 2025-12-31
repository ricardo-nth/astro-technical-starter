# Refactoring Plan - Current State Analysis

> **Plugin decisions documented in:** [PLUGIN_DECISIONS.md](./PLUGIN_DECISIONS.md)

## Chosen Plugin Stack

| Package | Purpose | Replaces |
|---------|---------|----------|
| `astro-seo` | Meta tags, OG, Twitter | Custom `Meta.astro` |
| `astro-seo-schema` + `schema-dts` | JSON-LD structured data | Custom `Schema.astro`, `schema.ts` |
| `@astrojs/sitemap` | Auto-generate sitemap | (keep existing) |
| Dynamic `robots.txt.ts` | Robots.txt | `astro-robots-txt` plugin |

## Current State (What Exists)

### Pages (6 total - need to reduce to 3)
- `index.astro` - Homepage ✅ Keep
- `services.astro` - Services ✅ Keep
- `contact.astro` - Contact ✅ Keep
- `about.astro` - ❌ Remove or merge into homepage
- `blog.astro` - ❌ Remove (out of scope for MVS)
- `team.astro` - ❌ Remove (out of scope for MVS)

### Custom SEO Implementation (Replace with plugins)

**Current custom files to replace:**
```
src/components/seo/
├── CommonMeta.astro      → Keep (charset, viewport basics)
├── EnhancedSchema.astro  → Replace with astro-schema
├── Favicons.astro        → Keep (simple, no plugin needed)
├── Meta.astro            → Replace with @astrolib/seo
├── Schema.astro          → Replace with astro-schema

src/utils/
├── schema.ts (13KB!)     → DELETE (use astro-schema)
├── seo.ts                → Simplify or DELETE
├── validation.ts (15KB!) → Mostly DELETE (overkill for MVS)
├── plugins.ts            → Review, likely simplify
├── social.ts             → Review, may merge into seo
```

### Content Collections (Simplify)

**Current structure:**
```
src/content/
├── blog/           → DELETE
├── faqs/           → Keep (for Contact page)
├── global/         → Keep
├── navigation/     → Keep
├── pages/          → Keep (simplify to 3 pages)
├── seo/            → Keep (simplify to 3 pages)
├── services/       → Keep
├── team/           → DELETE
├── testimonials/   → Keep (for Homepage social proof)
├── config.ts       → Simplify schemas
```

### Dependencies to Add
```bash
pnpm add @astrolib/seo astro-schema
```

### Dependencies to Review/Remove
- `@sentry/browser` - Optional, keep but document as opt-in
- `astro-compressor` - Keep
- `web-vitals` - Keep but make opt-in

---

## Refactoring Steps (Recommended Order)

### Phase 1: Add Community Plugins
```bash
pnpm add astro-seo astro-seo-schema schema-dts
```
1. Update `BaseLayout.astro` to use `astro-seo` and `astro-seo-schema`
2. Create `src/pages/robots.txt.ts` for dynamic robots.txt
3. Test that existing pages still work

### Phase 2: Simplify Pages
1. Remove `about.astro`, `blog.astro`, `team.astro`
2. Update navigation to reflect 3 pages
3. Remove associated content collections

### Phase 3: Clean Up Custom Code
1. Delete `src/utils/schema.ts` (replaced by plugin)
2. Delete `src/utils/validation.ts` (overkill)
3. Simplify `src/components/seo/` to just basics
4. Clean up types that are no longer needed

### Phase 4: Content Collection Cleanup
1. Update `src/content/config.ts` - remove unused schemas
2. Delete content folders for removed pages
3. Simplify remaining schemas

### Phase 5: Documentation
1. Update README for beginners
2. Add inline comments explaining SEO concepts
3. Update AGENTS.md with new simplified structure

---

## Size Comparison (Before vs After)

| Metric | Current | Target |
|--------|---------|--------|
| Pages | 6 | 3 |
| Custom SEO utils lines | ~1500 | ~100 |
| Content collections | 10+ | 6 |
| src/utils/ files | 12 | 5-6 |
| Learning curve | Medium | Low |

---

## Quick Wins (Can do immediately)

1. **Delete unused pages** - Removes complexity instantly
2. **Add community plugins** - Better maintained, less code
3. **Delete schema.ts** - 13KB of custom code replaced by plugin
4. **Delete validation.ts** - 15KB of overkill validation

---

## Files to Keep As-Is

- `astro.config.mjs` - Already well configured
- `tailwindcss` setup - Already working
- `src/layouts/BaseLayout.astro` - Just update imports
- `src/content/global/site-config.json` - Core config
- `public/` static assets - No changes needed
