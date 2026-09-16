# AGENTS.md

Contract for any AI agent working on this repository. Read this fully before
your first edit. It is vendor-neutral — nothing here assumes a particular
agent runtime.

`CLAUDE.md` is a pointer to this file. This file is the source of truth.

---

## 1. What this project is

The personal site of Duc (`duc.work`). Purpose: personal branding that
attracts **paid advisory work and agency partnerships** in DTC ecommerce
retention marketing. English is the primary market; Vietnamese is secondary.

That purpose decides most judgement calls. When two options are equally clean,
pick the one that better serves an English-speaking DTC operator deciding
whether to hire Duc.

## 2. Stack, in one paragraph

Astro 7, static output, no UI framework, no CSS framework. Content is markdown
files validated by a Zod schema at build time. Deploy target is Cloudflare
Pages. There is no database, no CMS, and no server at runtime.

## 3. Commands

Run these instead of guessing. All are defined in `package.json`.

| Command | Use it for |
|---|---|
| `npm run dev` | Local dev server. Drafts are visible here only. |
| `npm run build` | Production build into `dist/`. Drafts excluded. |
| `npm run check` | TypeScript + Astro diagnostics. |
| `npm run verify` | **Build, then crawl every internal link in `dist/`.** |
| `npm run new-post -- "<slug>"` | Scaffold an EN+VI post pair with correct frontmatter. |
| `npm run preview:flat` | Flat-file build for hosts without directory indexes (see §7). |

**Before you report work as done, run `npm run verify` and paste the result.**
A clean `npm run build` is not sufficient — it does not catch broken links
between pages.

## 4. File ownership

Avoid two agents editing the same area in parallel.

| Area | Path | Notes |
|---|---|---|
| Content | `src/content/**` | Posts, case studies, static page copy. |
| Presentation | `src/layouts/**`, `src/styles/**`, `src/components/**` | |
| Routing & i18n plumbing | `src/pages/**`, `src/i18n/**`, `src/lib/**` | Touch only with a reason. |
| Config & deploy | `src/site.config.mjs`, `astro.config.mjs` | Single owner. Do not change the domain, and do not add an adapter, without explicit instruction from Duc. |

## 5. Hard rules

- **Never invent numbers.** This site's credibility rests on real figures from
  real stores. If a metric is not supplied by Duc, leave the `TODO` marker in
  place rather than filling a plausible-looking value.
- **Do not publish drafts.** `draft: true` stays until Duc approves the piece.
- **Do not translate everything.** English is canonical. Vietnamese exists for
  pieces that are genuinely useful to a Vietnamese reader.
- **Women's-brand context:** Duc's portfolio brands sell women's products only.
  Never write copy or examples that pitch to men as buyers-for-themselves.
- **No emoji** in site copy or in reports to Duc.
- **Write to Duc in Vietnamese**, plain language, no marketing jargon. Write
  site content in the language of the file's directory.

## 6. Content model

Filename is the URL slug. Directory is the language.

```
src/content/posts/<lang>/<slug>.md    -> /<lang>/writing/<slug>/
src/content/cases/<lang>/<slug>.md    -> /<lang>/case-studies/<slug>/
src/content/pages/<lang>/<name>.md    -> /<lang>/<name>/
```

Frontmatter is enforced by `src/content.config.ts`. A wrong or missing field
**fails the build loudly** — that is intentional, do not work around it.

`translationOf` links a piece to its sibling in the other language, which is
what makes the header language switcher land on the translated article instead
of the section index. Set it on both sides. See `docs/content-schema.md`.

## 7. Two build modes — read before debugging a "broken" preview

Default build emits directories (`/en/writing/index.html`) and links carry a
trailing slash. That is what Cloudflare Pages serves.

Some static hosts do not resolve directory indexes. For those, set
`PREVIEW_FLAT=1` and `PUBLIC_LINK_SUFFIX=.html`, which emits
`/en/writing.html` and rewrites every in-site link to match. All internal links
go through `withBase()` / `localePath()` in `src/i18n/ui.ts`, so both modes stay
consistent automatically. Never hardcode an in-site path in a template.

## 8. Where knowledge lives

- `docs/architecture.md` — how the pieces fit, and why.
- `docs/content-schema.md` — every frontmatter field, with examples.
- `docs/deploy.md` — deploy runbook and DNS state.
- `docs/decisions.md` — decisions already made, with reasons.

**Read `docs/decisions.md` before proposing a change of direction.** Several
options in it were considered and rejected for stated reasons. Re-opening them
without new evidence wastes Duc's money.

## 9. Reporting back

End delegated work with:

```
Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
Summary: one or two sentences
Verification: output of `npm run verify`
Concerns: optional
```
