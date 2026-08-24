// Generates public/content/course-manifest.json from each lesson's YAML
// front-matter, so the manifest can never drift from the lessons. Ordered by the
// `order` field (1..24), which lays out as 8 beginner / 8 intermediate / 8 advanced.
// Run after adding or editing any lesson: `node scripts/generate-manifest.mjs`.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = resolve(root, 'public', 'content');
const LEVELS = ['beginner', 'intermediate', 'advanced'];

function parseFrontMatter(raw) {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return null;
  const fm = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && listKey) { fm[listKey].push(line.replace(/^\s*-\s+/, '').trim()); continue; }
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, val] = kv;
    if (val === '') { fm[key] = []; listKey = key; }
    else { fm[key] = val.replace(/^["']|["']$/g, '').trim(); listKey = null; }
  }
  return fm;
}

const entries = [];
for (const level of LEVELS) {
  const dir = resolve(CONTENT, level);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const fm = parseFrontMatter(readFileSync(resolve(dir, file), 'utf8'));
    if (!fm) { console.error(`skip: no front-matter in ${level}/${file}`); continue; }
    const slug = basename(file, '.md');
    entries.push({
      id: fm.id,
      slug: fm.slug,
      title: fm.title,
      level: fm.level,
      order: Number(fm.order),
      duration: Number(fm.duration),
      file: `${level}/${slug}.md`,
      summary: fm.summary,
      tags: fm.tags,
    });
  }
}

entries.sort((a, b) => a.order - b.order);
const out = resolve(CONTENT, 'course-manifest.json');
writeFileSync(out, JSON.stringify(entries, null, 2) + '\n', 'utf8');
console.log(`Wrote ${out} with ${entries.length} entries (` +
  LEVELS.map((l) => `${entries.filter((e) => e.level === l).length} ${l}`).join(' / ') + ').');
