# Deploy runbook

## Live

| | |
|---|---|
| Production | https://duc.work |
| Pages subdomain | https://duc-work.pages.dev |
| Cloudflare project | `duc-work` (account `7157fc4f22f85c512688c9eb4a084ef8`) |
| Zone | `duc.work` (`6c4faebbf1a06ee3e5b45946837f26f9`) |
| Repository | https://github.com/mrdnguyend-design/duc-work |

Deployment is **Git-connected**: every push to `main` on
`mrdnguyend-design/duc-work` builds and deploys automatically. Build command
`npm run build`, output `dist`, Node pinned to 22 by `.node-version`.

You normally do not need to deploy by hand. `npm run deploy` remains available
for an out-of-band push when CI is unavailable — see below.

## Deploying by hand (fallback only)

```bash
export CLOUDFLARE_API_TOKEN=...      # Pages:Edit, DNS:Edit, Zone:Read
export CLOUDFLARE_ACCOUNT_ID=7157fc4f22f85c512688c9eb4a084ef8
npm run deploy                        # verify (build + link crawl) then upload
```

`npm run deploy` refuses to run if the build or the link crawl fails.

### Do not run `wrangler pages deploy` in the project root

On 2026-09-16 it auto-detected Astro and, without prompting, installed
`@astrojs/cloudflare`, added an SSR adapter to `astro.config.mjs`, rewrote
`package.json` (clobbering the `preview` script), `tsconfig.json` and
`.gitignore`, and created a `wrangler.jsonc`. The static site became a worker
build (`dist/client` + `dist/server`).

Everything was in git, so `git checkout` reverted it cleanly. `scripts/deploy.mjs`
now stages `dist/` into a directory containing no framework project, which
leaves wrangler nothing to detect. Do not simplify that away.

## DNS

Current records on the zone:

| Type | Name | Value | Purpose |
|---|---|---|---|
| CNAME | duc.work | duc-work.pages.dev (proxied) | the site |
| MX ×3 | duc.work | mx1-3.larksuite.com | Lark Mail — **do not touch** |
| TXT | duc.work | `v=spf1 +include:spf.onlarksuite.com -all` | mail SPF — **do not touch** |
| TXT ×2 | duc.work | `verification-code-site-App_lark=...` | Lark verification — **do not touch** |

The old `A` record pointing at 123HOST (`103.97.126.29`) was deleted on
2026-09-16; it served only a hosting placeholder.

`www.duc.work` has no record. Add one only after deciding whether `www` should
redirect to the apex.

Inbound mail depends entirely on the MX and SPF rows above. Any DNS change must
leave them intact — verify with a record listing after every change.

## Cloudflare features affecting the site

**Email Address Obfuscation is on** (zone default). Cloudflare rewrites
`mailto:` links into `/cdn-cgi/l/email-protection#...` and injects a small
script to decode them. Consequences:

- The site is no longer strictly zero-JavaScript in production.
- Those URLs 404 for crawlers that do not execute JavaScript. That is expected,
  not a broken link.
- It does reduce address scraping, which is why it is left on.

Turn it off under Scrape Shield if a plain `mailto:` is preferred.

## Build environment

`PREVIEW_FLAT`, `PUBLIC_LINK_SUFFIX`, `PREVIEW_BASE` and `PREVIEW_SITE` must stay
**unset** on the Pages project. They exist for internal previews and would
change the URL shape of the production build.

Node is pinned by `.node-version`. Astro 7 requires a current Node; do not
remove that file.

## Internal preview without a domain

For hosts that do not resolve directory indexes:

```bash
PREVIEW_FLAT=1 PUBLIC_LINK_SUFFIX=.html PREVIEW_BASE=/some/path \
  npx astro build --outDir ./preview-dist
```

## Rollback

Cloudflare Pages keeps previous deployments; promote an earlier one from the
dashboard. In the repository, `git revert` and redeploy.
