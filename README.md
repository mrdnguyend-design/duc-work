# personal-site

Astro 7 static site. Bilingual EN/VI, no email capture yet (slot reserved).
Built to be deployed on Cloudflare Pages.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

## The only config file

`src/site.config.mjs` — name, domain, email, social links, booking URL.
Change it there and the whole site follows. **Before the real deploy, replace
`url: 'https://example.com'` with the actual domain** (it feeds canonical URLs,
hreflang, sitemap and RSS).

## Adding content

Everything lives in `src/content/`. Filename = URL slug.

| What | Where | Route |
|---|---|---|
| Blog post | `src/content/posts/<lang>/<slug>.md` | `/<lang>/writing/<slug>` |
| Case study | `src/content/cases/<lang>/<slug>.md` | `/<lang>/case-studies/<slug>` |
| Static page | `src/content/pages/<lang>/{about,work-with-me}.md` | `/<lang>/<page>` |

Set `draft: true` to keep an entry out of the production build (it still shows
in `npm run dev`).

### Linking the two languages

Each entry may carry `translationOf: <slug-of-the-sibling>`. That is what makes
the header language switcher jump to the translated article instead of the
section index. If a post exists in English only, omit the field — the switcher
falls back gracefully.

You do **not** have to translate everything. English is canonical.

## Deploy to Cloudflare Pages

1. Push the repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `dist`, framework preset
   Astro.
4. Add the custom domain in Pages → Custom domains.

Nothing else is required; the site is fully static.

## Internal preview builds

To render a copy that lives under a URL sub-path (for review before the domain
exists):

```bash
PREVIEW_BASE=/some/sub/path PREVIEW_SITE=https://host.example \
  npx astro build --outDir ./preview-dist
```

All in-site links go through `withBase()` in `src/i18n/ui.ts`, so they follow
the base automatically.

## Reserved for later

`.subscribe-slot` in `src/styles/global.css` and the `data-slot="subscribe"`
element on the home page are placeholders for an email capture form. They are
hidden and inert. When a newsletter is added, the markup drops in without
touching the layout.
