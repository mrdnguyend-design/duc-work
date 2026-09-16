# Content schema

Enforced by `src/content.config.ts`. A missing or misspelled field fails the
build. Dates may be written as `YYYY-MM-DD`.

## Posts — `src/content/posts/<lang>/<slug>.md`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `description` | string | yes | Used as the lede, the meta description and the RSS summary. Write it as a real sentence, not a keyword list. |
| `pubDate` | date | yes | |
| `updatedDate` | date | no | Shown next to the publish date when present. |
| `tags` | string[] | no | Defaults to `[]`. |
| `draft` | boolean | no | Defaults to `false`. `true` hides it from `npm run build` but keeps it visible in `npm run dev`. |
| `translationOf` | string | no | Slug of the sibling post in the other language. |

## Case studies — `src/content/cases/<lang>/<slug>.md`

Same as posts, minus the dates, plus:

| Field | Type | Required | Notes |
|---|---|---|---|
| `outcome` | string | yes | One scannable line, e.g. `+29.8% email revenue in 30 days`. Rendered as a pill on listings. |
| `role` | string | yes | |
| `period` | string | yes | Free text, e.g. `2024 — present`. |
| `stack` | string[] | no | Tools, shown as tags. |
| `order` | number | no | Sort order on the index, ascending. Defaults to `99`. |

## Static pages — `src/content/pages/<lang>/<name>.md`

Only `title` and `description`. The filename must match a route in
`src/pages/[lang]/` — currently `about` and `work-with-me`.

## Linking translations

Set `translationOf` on **both** files, each pointing at the other's slug:

```yaml
# src/content/posts/en/sms-cost-data.md
translationOf: "du-lieu-chi-phi-sms"

# src/content/posts/vi/du-lieu-chi-phi-sms.md
translationOf: "sms-cost-data"
```

With it, the header language switcher jumps to the translated article. Without
it, the switcher falls back to the other language's section index — which is
acceptable for a piece that exists in one language only.

`npm run new-post -- "<slug>"` writes both files with the cross-links already
correct.
