#!/usr/bin/env node
/**
 * Scaffold an English + Vietnamese post pair with matching translation links.
 *
 * Usage:
 *   npm run new-post -- "my-english-slug"
 *   npm run new-post -- "my-english-slug" --vi "slug-tieng-viet"
 *   npm run new-post -- "my-slug" --type case
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const FLAGS = new Set(['vi', 'type']);

const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg.startsWith('--')) {
    const name = arg.slice(2);
    if (!FLAGS.has(name)) {
      console.error(`Unknown flag: --${name}`);
      process.exit(1);
    }
    flags[name] = argv[i + 1];
    i += 1;
  } else {
    positional.push(arg);
  }
}

const flag = (name) => flags[name];
const enSlug = positional[0];

if (!enSlug) {
  console.error('Usage: npm run new-post -- "<english-slug>" [--vi "<vietnamese-slug>"] [--type post|case]');
  process.exit(1);
}

const type = flag('type') ?? 'post';
const viSlug = flag('vi') ?? `${enSlug}-vi`;
const collection = type === 'case' ? 'cases' : 'posts';
const today = new Date().toISOString().slice(0, 10);

const titleFromSlug = (s) =>
  s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const postBody = (lang, slug, sibling) => `---
title: "${titleFromSlug(slug)}"
description: "TODO — one real sentence. It is the lede, the meta description and the RSS summary."
pubDate: ${today}
tags: []
draft: true
translationOf: "${sibling}"
---

TODO — write the piece.
`;

const caseBody = (lang, slug, sibling) => `---
title: "${titleFromSlug(slug)}"
description: "TODO — one real sentence."
outcome: "TODO — one scannable measured line"
role: "TODO"
period: "TODO"
stack: []
order: 99
draft: true
translationOf: "${sibling}"
---

## ${lang === 'vi' ? 'Bối cảnh' : 'Context'}

TODO

## ${lang === 'vi' ? 'Tôi đã làm gì' : 'What I did'}

TODO

## ${lang === 'vi' ? 'Kết quả' : 'Outcome'}

TODO

## ${lang === 'vi' ? 'Nếu làm lại, tôi sẽ làm khác chỗ nào' : 'What I would do differently'}

TODO
`;

const body = type === 'case' ? caseBody : postBody;

const targets = [
  { lang: 'en', slug: enSlug, sibling: viSlug },
  { lang: 'vi', slug: viSlug, sibling: enSlug },
];

for (const t of targets) {
  const dir = path.join('src', 'content', collection, t.lang);
  const file = path.join(dir, `${t.slug}.md`);
  try {
    await access(file);
    console.error(`✗ Already exists, refusing to overwrite: ${file}`);
    process.exit(1);
  } catch {
    // does not exist — good
  }
  await mkdir(dir, { recursive: true });
  await writeFile(file, body(t.lang, t.slug, t.sibling), 'utf8');
  console.log(`✓ ${file}`);
}

console.log(`\nBoth files are draft: true. Remove that line when Duc approves.`);
