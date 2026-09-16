# Decisions

Each entry: what was decided, why, and what would justify revisiting it.
Read this before proposing a change of direction.

---

## 2026-09-15 — Own site instead of Substack or Medium

**Decided:** a self-owned Astro site on a personal domain.

**Why:** the goal is paid advisory and agency partnerships. That requires a
structured services page, case studies, and a bilingual split. Substack
supports none of the three: one publication is one mailing list, there is no
real services page, and the presentation frames the author as a writer rather
than an operator for hire. Substack's discovery network also skews toward
culture, politics and finance rather than DTC operators, who congregate on X.

**Revisit if:** the site is live and publishing stalls for months because of
friction. Publishing beats architecture. In that case move the *newsletter* to
Substack or beehiiv on a subdomain and keep the site as the home and services
front — do not fold the services page into a newsletter platform.

---

## 2026-09-15 — No newsletter during the build phase

**Decided:** no email capture, no sending platform, for now. Owner's call.

**Why:** the site had no content yet. A capture form with nothing to deliver
costs credibility.

**Left in place:** `.subscribe-slot` in `src/styles/global.css` and a
`data-slot="subscribe"` element on the home page, both hidden and inert, so
adding capture later does not require touching the layout.

---

## 2026-09-15 — No CMS yet; markdown in git is the interface

**Decided:** content stays as markdown files under version control. No admin UI.

**Why:** the primary editor is an AI agent, and plain files in git are the most
agent-friendly substrate available — direct read and edit, bulk changes in one
command, full history, and revert. Hosted CMS products put content behind an
API the agent must negotiate, and Substack has no publishing API at all, which
would force fragile browser automation.

**Note for future agents:** Sveltia CMS, Decap and Keystatic are *interfaces on
top of markdown in git*. Adding one later changes nothing for an agent — the
files stay the files. So this decision does not need to be revisited before
adding an editing UI.

**Keystatic specifically was rejected** for now: its GitHub OAuth flow has an
open bug on Cloudflare Pages (Thinkmill/keystatic issue #1497, opened January
2026). Sveltia is the preferred option if a UI is wanted, because it is purely
client-side and needs no adapter.

---

## 2026-09-15 — English-first, bilingual, not fully translated

**Decided:** English is canonical. Vietnamese is selective.

**Why:** the collaboration invitations being targeted come from English-speaking
DTC operators, agencies and SaaS vendors. Vietnamese serves a secondary local
audience. Translating everything doubles the work and is the usual reason
bilingual sites go stale.

---

## 2026-09-15 — Two build modes, because some hosts lack directory indexes

**Decided:** `PREVIEW_FLAT=1` + `PUBLIC_LINK_SUFFIX=.html` produce a flat-file
build; the default stays directory-style for Cloudflare Pages.

**Why:** the internal preview host serves `/en/index.html` but returns 404 for
`/en/` and `/en/writing`. Every in-site link was therefore dead in preview even
though the build was correct. Rather than hand-patching, link construction was
centralised in `withBase()` / `localePath()` so both URL shapes are generated
from one place.

**Consequence:** never hardcode an in-site path in a template.

---

## 2026-09-16 — Canonical and hreflang must match exactly

**Decided:** `localePath()` always emits the trailing slash in directory mode.

**Why:** `hreflang` pointed at `/vi/writing` while the canonical URL was
`/vi/writing/`. Search engines treat those as different URLs, which splits the
bilingual signal the tags exist to send.

---

## Open questions

- English display name for the site header. Currently the placeholder
  `Duc Nguyen` in `src/site.config.mjs`.
- X and LinkedIn URLs — currently `TODO` placeholders; the footer omits any
  social whose value is empty.
- Whether the sample post and sample case study are replaced with real work or
  set back to `draft: true` before the first real deploy. They are currently
  visible so the preview has content.
