// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';

// Set PREVIEW_BASE to build a copy that lives under a sub-path
// (used for internal previews). Unset for the real deploy.
const base = process.env.PREVIEW_BASE || undefined;

// Some static hosts do not resolve directory indexes (/en/ -> /en/index.html).
// PREVIEW_FLAT emits /en.html style files instead, and PUBLIC_LINK_SUFFIX makes
// the in-site links match. The real Cloudflare Pages deploy uses neither.
const flat = Boolean(process.env.PREVIEW_FLAT);

export default defineConfig({
  site: process.env.PREVIEW_SITE || SITE.url,
  base,
  build: { format: flat ? 'file' : 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', vi: 'vi' } },
    }),
  ],
});
