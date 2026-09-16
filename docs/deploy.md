# Deploy runbook

## Target

Cloudflare Pages, custom domain `duc.work`.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 |
| Framework preset | Astro |

No adapter, no SSR, no environment variables are required for the production
build. `PREVIEW_FLAT`, `PUBLIC_LINK_SUFFIX`, `PREVIEW_BASE` and `PREVIEW_SITE`
are for internal previews only — never set them on the Pages project.

## DNS state as of 2026-09-16

- `duc.work` resolves through Cloudflare (`104.21.30.230`, `172.67.173.246`).
- It currently serves the **123HOST default placeholder page** — no real site.
  That record must be removed or repointed when Pages takes over, otherwise the
  two compete.
- `www.duc.work` has **no DNS record**. Add it and redirect it to the apex, or
  decide deliberately not to support `www`.
- Mail: MX points to Lark (`mx1-3.larksuite.com`), SPF `spf.onlarksuite.com`.
  The site advertises `contact@duc.work` — confirm that mailbox or alias exists
  in Lark Admin, or inbound enquiries bounce.

## First deploy

1. Push this repository to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Set build command and output directory as in the table above.
4. Pages → Custom domains → add `duc.work`. Because DNS already lives in
   Cloudflare, the record is created automatically.
5. Remove the stale 123HOST record.
6. Verify: `https://duc.work/` redirects to `/en/`, and the language switcher
   moves between `/en/` and `/vi/`.

Afterwards every push to the default branch redeploys automatically.

## Internal preview (no domain needed)

For hosts that do not resolve directory indexes — including the HCBot share
link host — build flat:

```bash
npm run preview:flat -- --outDir ./preview-dist
# with PREVIEW_BASE set to the sub-path the files will be served from
```

Then copy `preview-dist/` to the public directory. See `docs/decisions.md` for
why this mode exists.

## Rollback

Cloudflare Pages keeps previous deployments; promote an earlier one from the
dashboard. In the repository, `git revert` the offending commit and push.
