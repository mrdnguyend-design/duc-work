#!/usr/bin/env node
/**
 * Offline link checker for a built site.
 *
 * Crawls every .html file in the output directory, collects internal links and
 * asset references, and resolves each one against the files on disk. Exits
 * non-zero when anything is unresolved.
 *
 * Catches the failure that a successful `astro build` does not: pages that
 * exist but point at each other with the wrong URL shape.
 *
 * Usage: node scripts/verify-links.mjs [outDir]
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] ?? 'dist');

if (!existsSync(outDir)) {
  console.error(`✗ Output directory not found: ${outDir}\n  Run a build first.`);
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Resolve an in-site URL path to a file on disk, or null. */
function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const rel = clean.replace(/^\/+/, '');
  const candidates = [
    path.join(outDir, rel),
    path.join(outDir, rel, 'index.html'),
    path.join(outDir, `${rel}.html`),
  ];
  return candidates.find((c) => existsSync(c) && !isDir(c)) ?? null;
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

const files = (await walk(outDir)).filter((f) => f.endsWith('.html'));
if (files.length === 0) {
  console.error(`✗ No HTML files in ${outDir}`);
  process.exit(1);
}

const ATTR = /(?:href|src)="([^"]+)"/g;
const broken = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const from = path.relative(outDir, file);
  for (const [, raw] of html.matchAll(ATTR)) {
    // Only in-site absolute paths. External, mailto:, tel:, data: and
    // fragment-only links are out of scope.
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    checked += 1;
    if (!resolveTarget(raw)) broken.push({ from, to: raw });
  }
}

const pages = files.length;
if (broken.length > 0) {
  console.error(`✗ ${broken.length} broken reference(s) across ${pages} page(s):\n`);
  for (const b of broken) console.error(`   ${b.from}  ->  ${b.to}`);
  console.error(`\n  Checked ${checked} internal references.`);
  process.exit(1);
}

console.log(`✓ ${pages} pages, ${checked} internal references, 0 broken.`);
