# Astro Technical SEO Starter - Project Vision

## Core Purpose

**A Minimum Viable Site (MVS) template** that provides the absolute best technical foundation for Astro websites, allowing beginners to go from zero to one fast without missing any technical SEO fundamentals.

---

## The Problem This Solves

When building a small website (1-5 pages), developers face a choice:
- **WordPress/Wix**: Easy but bloated, requires plugins, poor performance baseline
- **Custom build**: High technical overhead, easy to miss SEO fundamentals
- **Basic templates**: Often skip critical technical SEO, schema, meta handling

This template provides a **third path**: production-ready technical foundation that handles all the boring-but-critical stuff, letting developers focus on content and design.

---

## Design Philosophy

### 1. Technical Excellence, Not Design Prescription

The template demonstrates:
- **SEO metadata architecture** (per-page meta, OG images, Twitter cards)
- **Schema.org structured data** (page-specific JSON-LD)
- **Performance foundation** (Core Web Vitals, lazy loading, critical CSS)
- **Layout hierarchy** (Technical → Base → Page)

The template does NOT prescribe:
- Specific visual design
- Component library choices
- Content structure beyond SEO needs

### 2. Community Plugins Over Custom Code

**Use well-maintained community solutions:**
- `@astrolib/seo` or `astro-seo` for meta tags
- `astro-schema` for JSON-LD generation
- `@astrojs/sitemap` for sitemap generation
- `astro-robots-txt` for robots.txt

**Why?** 
- Better maintained than custom implementations
- Battle-tested edge cases
- Lower learning curve for adopters
- Easier to upgrade

### 3. Tailwind CSS as the Styling Foundation

**Why Tailwind?**
- Beginner-friendly utility classes
- Excellent documentation
- Huge ecosystem of free components (Tailwind UI, Headless UI)
- Easy to copy/paste from official examples
- Tokenized design system built-in

**What this enables:**
- Users can grab free components from tailwindui.com
- Easy to customize with design tokens
- No CSS architecture decisions needed

### 4. Three Pages, Maximum Clarity

The template should demonstrate capability with minimal complexity:

| Page | Purpose | Schema Type |
|------|---------|-------------|
| **Homepage** | Hero, services overview, testimonials | Organization, WebSite |
| **Services** | Service list with pricing/features | Service, PriceSpecification |
| **Contact** | Form, FAQ section | ContactPage, FAQPage |

Each page demonstrates:
- Unique meta tags (title, description)
- Page-specific OG image
- Appropriate schema.org markup
- Different content patterns

---

## Architecture

### Layout Hierarchy

```
┌─────────────────────────────────────────────┐
│ TechnicalLayout.astro (or BaseLayout)       │
│ ├── <head>                                  │
│ │   ├── CommonMeta (charset, viewport)      │
│ │   ├── SEO Meta (via community plugin)     │
│ │   ├── Schema JSON-LD (via plugin)         │
│ │   ├── Favicons                            │
│ │   ├── Analytics (optional)                │
│ │   └── Performance hints                   │
│ └── <body>                                  │
│     └── <slot /> ← Page content injected    │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ SiteLayout.astro                            │
│ ├── Navigation                              │
│ ├── <slot /> ← Page sections                │
│ └── Footer                                  │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ Page.astro (e.g., index.astro)              │
│ ├── Define metadata & schema                │
│ ├── Pass props to SiteLayout                │
│ └── Page-specific sections                  │
└─────────────────────────────────────────────┘
```

### Data Flow for SEO

```
Page Content (src/content/seo/homepage.json)
    │
    ▼
Page Component (src/pages/index.astro)
    │ reads content, constructs metadata object
    ▼
SiteLayout → TechnicalLayout
    │ receives metadata & schema as props
    ▼
SEO Plugin renders <meta> and <script type="application/ld+json">
```

---

## Target Dependencies

### Core (Required)
```json
{
  "astro": "^5.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "@astrojs/sitemap": "^3.x",
  "astro-robots-txt": "^1.x"
}
```

### SEO (Community Plugins)
```json
{
  "@astrolib/seo": "^1.x",
  "astro-schema": "^x.x"
}
```

### Optional (Remove if not needed)
```json
{
  "@astrojs/partytown": "for third-party scripts",
  "sharp": "for image optimization",
  "web-vitals": "for performance monitoring"
}
```

---

## What Success Looks Like

### For a Beginner User

1. Clone template
2. Update `src/content/global/site-config.json` with their info
3. Replace placeholder content on 3 pages
4. Deploy to Vercel/Netlify
5. **Result**: A site that scores 100 on Lighthouse, has proper schema markup, renders perfect OG cards on social, and ranks well on Google

### For SEO

- Every page has unique, descriptive meta tags
- Schema.org markup validates in Google's Rich Results Test
- OG images render correctly on WhatsApp, Twitter, LinkedIn
- Sitemap and robots.txt are auto-generated
- No duplicate content issues
- Fast Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)

### For Developers

- Clear separation of concerns (technical vs. content vs. styling)
- Easy to add new pages following the pattern
- Easy to swap out Tailwind for another system if desired
- Minimal dependencies, minimal magic

---

## Refactoring Checklist

### Remove / Simplify
- [ ] Remove pages beyond the core 3 (homepage, services, contact)
- [ ] Remove custom SEO utilities in favor of community plugins
- [ ] Remove custom schema generation in favor of `astro-schema`
- [ ] Clean up content collections to only what's needed for 3 pages
- [ ] Remove vanilla CSS in favor of Tailwind utilities

### Add / Improve
- [ ] Add `@astrolib/seo` or equivalent community SEO plugin
- [ ] Add `astro-schema` for JSON-LD generation
- [ ] Add tokenized Tailwind config (`brand-tokens.css` integration)
- [ ] Add example OG images per page
- [ ] Add clear comments explaining WHY each SEO element exists

### Document
- [ ] Update README with clear "Getting Started" for beginners
- [ ] Add inline comments on the "teaching" parts (schema, meta)
- [ ] Create a simple diagram of the layout hierarchy

---

## Non-Goals

This template intentionally does NOT:
- Provide a complete design system
- Include a blog with pagination
- Include authentication
- Include a CMS integration
- Include e-commerce functionality
- Prescribe a specific component library

These are extensions users can add. The template stays minimal.

---

## Summary

**Astro Technical SEO Starter is a MVS (Minimum Viable Site) template.**

It answers: "What's the minimum I need to ship a small site that has enterprise-grade technical SEO?"

The answer: 3 pages, proper meta/schema architecture, Tailwind for easy styling, community plugins for SEO heavy lifting, and clear documentation on why things work the way they do.
