# Architecture

## Shape

Static site. Every page is rendered at build time into plain HTML. There is no
server, no database and no runtime API. Deployment is a folder of files.

```
src/
  site.config.mjs     single source of name, domain, email, socials
  content.config.ts   Zod schemas — the contract for every content file
  content/            markdown, one directory per language
    posts/{en,vi}/
    cases/{en,vi}/
    pages/{en,vi}/
  i18n/ui.ts          UI strings, path helpers, date formatting
  lib/content.ts      collection queries + translation path resolution
  layouts/Base.astro  <head>, SEO, hreflang, JSON-LD, header/footer shell
  components/         Header, Footer, EntryList
  pages/
    index.astro           redirects to the default language
    [lang]/...            every real page, generated twice (en, vi)
    rss-[lang].xml.ts     one feed per language
    robots.txt.ts
docs/                 this directory
scripts/              maintenance scripts used by npm run ...
```

## Why `[lang]` dynamic routes

Every page lives once in `src/pages/[lang]/` and `getStaticPaths` emits it for
each language. Adding a third language means adding it to `LANGS` — no page
files are duplicated.

The alternative (separate `/en/` and `/vi/` page directories) was rejected: it
doubles the file count and the two copies drift apart over time.

## Why links go through helpers

`localePath()` and `withBase()` in `src/i18n/ui.ts` build every in-site link.
This exists so that two things can change without touching templates:

1. **Deploy base path.** The site can live at a domain root or under a
   sub-path. `import.meta.env.BASE_URL` feeds `withBase()`.
2. **URL shape.** Directory URLs (`/en/writing/`) or flat files
   (`/en/writing.html`), selected by `PUBLIC_LINK_SUFFIX`.

A hardcoded `href="/en/writing"` breaks silently in both cases. Do not write
one.

## Why the schema is strict

`src/content.config.ts` validates every markdown file at build time. A typo in
a frontmatter key fails the build with a named error instead of publishing a
page with a missing date or an unlinked translation.

This is deliberate. The owner has been burned twice by pipelines that reported
success while writing wrong data. Loud failure is the requirement, not a
side effect.

## SEO surface

`Base.astro` emits, for every page: canonical URL, `hreflang` alternates for
both languages plus `x-default`, Open Graph tags, and a `Person` JSON-LD block
built from `site.config.mjs`.

Canonical and `hreflang` must agree **exactly**, including the trailing slash.
They diverged once (canonical had the slash, `hreflang` did not) which makes
search engines treat the two forms as separate URLs and splits the bilingual
signal. `localePath()` now guarantees agreement.

## What is deliberately absent

- No CMS. See `docs/decisions.md`.
- No email capture. A hidden, inert slot is reserved on the home page and in
  `global.css` (`.subscribe-slot`) so one can be added later without touching
  the layout.
- No analytics yet. Cloudflare Web Analytics is the intended choice.
- No JavaScript shipped to the browser at all, currently. Keep it that way
  unless a feature genuinely requires it.
