#!/usr/bin/env node
/**
 * Deploy dist/ to Cloudflare Pages (direct upload).
 *
 * Why this script instead of running wrangler in the project root:
 * `wrangler pages deploy` performs framework auto-detection and, in a
 * directory containing an Astro project, will install @astrojs/cloudflare and
 * rewrite astro.config.mjs, package.json, tsconfig.json and .gitignore without
 * asking — turning this static site into a server-rendered worker. It did
 * exactly that on 2026-09-16.
 *
 * Staging the built output in a directory that contains no framework project
 * removes anything for it to detect. Do not "simplify" this back.
 *
 * Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
 */
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';

const PROJECT = process.env.CF_PAGES_PROJECT ?? 'duc-work';
const BRANCH = process.env.CF_PAGES_BRANCH ?? 'main';
const dist = path.resolve('dist');

for (const v of ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']) {
  if (!process.env[v]) {
    console.error(`✗ Missing ${v}. See docs/deploy.md.`);
    process.exit(1);
  }
}

if (!existsSync(dist)) {
  console.error('✗ dist/ not found. Run `npm run verify` first.');
  process.exit(1);
}

// Staging must live outside any directory tree containing a framework project.
// $TMPDIR is avoided because a shared /tmp may deny creating /tmp/node_modules,
// which wrangler needs for its cache.
const stage = path.join(homedir(), '.cache', `pages-deploy-${PROJECT}`);
rmSync(stage, { recursive: true, force: true });
mkdirSync(path.join(stage, 'site'), { recursive: true });
cpSync(dist, path.join(stage, 'site'), { recursive: true });

console.log(`→ Deploying ${PROJECT} (branch ${BRANCH}) from ${stage}`);
execFileSync(
  'npx',
  ['--yes', 'wrangler@4', 'pages', 'deploy', 'site',
   '--project-name', PROJECT, '--branch', BRANCH, '--commit-dirty=true'],
  { cwd: stage, stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
);

rmSync(stage, { recursive: true, force: true });
console.log('✓ Deployed.');
