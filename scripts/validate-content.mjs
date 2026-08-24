// Validates the course content against the authoring contract:
//   - 24 lessons (8 beginner / 8 intermediate / 8 advanced), 24 quizzes, 24 manifest entries
//   - front-matter completeness + agreement with filename/order/level
//   - all required H1 sections present and in order; Examples/Exercises subsections
//   - exactly 5 tags, >= 6 flash cards, an Options table
//   - code fences restricted to the allowed PRISM_LANGS + text
//   - quiz schema per question type, all five types covered, every question explained
//   - manifest entries match each lesson's front-matter
// Exit code 1 on any error, so CI/build can gate on it.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = resolve(root, 'public', 'content');
const QUIZZES = resolve(root, 'public', 'quizzes');
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const ALLOWED_FENCES = new Set(['bash', 'python', 'javascript', 'sql', 'http', 'json', 'text']);
const REQUIRED_SECTIONS = [
  'Learning Objectives', 'Why It Matters', 'Concept Explanation', 'Key Terminology',
  'Options and Trade-offs', 'Worked Example', 'Real World Analogy', 'Examples',
  'Common Mistakes', 'Best Practices', 'Summary', 'Flash Cards', 'Exercises', 'Further Reading',
];
const QUESTION_TYPES = ['single-choice', 'multiple-choice', 'fill-blank', 'ordering', 'match-pair'];

const errors = [];
const err = (where, msg) => errors.push(`[${where}] ${msg}`);
const pad = (n) => String(n).padStart(2, '0');

// --- tiny front-matter parser for our controlled format ---------------------
function parseFrontMatter(raw, where) {
  const m = /^\ufeff?---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) { err(where, 'missing YAML front-matter'); return null; }
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

// Strip fenced code so section/fence scans don't trip over '#' inside code.
function scanFences(body, where) {
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    const f = /^```(\S*)/.exec(line);
    if (f) {
      if (!inFence) {
        const lang = f[1];
        if (lang && !ALLOWED_FENCES.has(lang)) err(where, `disallowed code fence language: \`${lang}\``);
      }
      inFence = !inFence;
    }
  }
  if (inFence) err(where, 'unbalanced code fence (```)');
}

function h1Sections(body) {
  const out = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^# (.+)$/.exec(line);
    if (m) out.push(m[1].trim());
  }
  return out;
}

function sectionBody(body, heading) {
  const lines = body.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === `# ${heading}`) { start = i; break; }
  if (start === -1) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^# /.test(lines[i])) { end = i; break; }
  return lines.slice(start + 1, end).join('\n');
}

// --- lessons ----------------------------------------------------------------
const lessons = []; // {order, level, slug, fm, file}
for (const level of LEVELS) {
  const dir = resolve(CONTENT, level);
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  for (const file of files) {
    const where = `${level}/${file}`;
    const raw = readFileSync(resolve(dir, file), 'utf8');
    const fm = parseFrontMatter(raw, where);
    if (!fm) continue;
    const body = raw.slice(raw.indexOf('\n---', 3) + 4);
    const slug = basename(file, '.md');

    // front-matter
    for (const k of ['id', 'slug', 'title', 'level', 'order', 'duration', 'summary'])
      if (!fm[k] || (typeof fm[k] === 'string' && !fm[k].length)) err(where, `front-matter missing ${k}`);
    if (fm.slug !== slug) err(where, `slug "${fm.slug}" != filename "${slug}"`);
    if (fm.level !== level) err(where, `level "${fm.level}" != folder "${level}"`);
    const order = Number(fm.order);
    if (!Number.isInteger(order) || order < 1 || order > 24) err(where, `bad order ${fm.order}`);
    if (fm.id !== `lesson-${pad(order)}`) err(where, `id "${fm.id}" != lesson-${pad(order)}`);
    if (!Number.isInteger(Number(fm.duration)) || Number(fm.duration) <= 0) err(where, `bad duration ${fm.duration}`);
    if (!Array.isArray(fm.tags) || fm.tags.length !== 5) err(where, `tags must be exactly 5 (got ${Array.isArray(fm.tags) ? fm.tags.length : 'none'})`);

    // sections in order
    const got = h1Sections(body);
    const missing = REQUIRED_SECTIONS.filter((s) => !got.includes(s));
    if (missing.length) err(where, `missing sections: ${missing.join(', ')}`);
    else {
      const idx = REQUIRED_SECTIONS.map((s) => got.indexOf(s));
      for (let i = 1; i < idx.length; i++) if (idx[i] < idx[i - 1]) { err(where, 'sections out of order'); break; }
    }

    // fences
    scanFences(body, where);

    // Examples subsections
    const ex = sectionBody(body, 'Examples');
    for (const n of [1, 2, 3]) if (!new RegExp(`^## Example ${n}\\b`, 'm').test(ex)) err(where, `Examples missing "## Example ${n}"`);

    // Exercises subsections
    const exr = sectionBody(body, 'Exercises');
    for (const lvl of ['Easy', 'Medium', 'Challenging']) if (!new RegExp(`^### ${lvl}\\b`, 'm').test(exr)) err(where, `Exercises missing "### ${lvl}"`);

    // Flash cards
    const fc = sectionBody(body, 'Flash Cards');
    const qn = (fc.match(/^Q:/gm) || []).length;
    const an = (fc.match(/^A:/gm) || []).length;
    if (qn < 6) err(where, `Flash Cards must have >= 6 Q: (got ${qn})`);
    if (qn !== an) err(where, `Flash Cards Q count ${qn} != A count ${an}`);

    // Options table
    const opt = sectionBody(body, 'Options and Trade-offs');
    if (!/\|.*\|/.test(opt)) err(where, 'Options and Trade-offs must contain a table');

    lessons.push({ order, level, slug, fm, file: `${level}/${slug}.md` });
  }
}

// cross-lesson counts
if (lessons.length !== 24) err('lessons', `expected 24 lessons, found ${lessons.length}`);
for (const level of LEVELS) {
  const n = lessons.filter((l) => l.level === level).length;
  if (n !== 8) err('lessons', `expected 8 ${level} lessons, found ${n}`);
}
const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
for (let i = 0; i < orders.length; i++) if (orders[i] !== i + 1) { err('lessons', `orders not 1..24 contiguous/unique (index ${i} = ${orders[i]})`); break; }

// --- quizzes ----------------------------------------------------------------
for (let n = 1; n <= 24; n++) {
  const id = `lesson-${pad(n)}`;
  const file = resolve(QUIZZES, `${id}.json`);
  const where = `quizzes/${id}.json`;
  if (!existsSync(file)) { err(where, 'quiz file missing'); continue; }
  let quiz;
  try { quiz = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { err(where, `invalid JSON: ${e.message}`); continue; }
  if (quiz.id !== `quiz-${id}`) err(where, `id must be "quiz-${id}"`);
  if (quiz.lessonId !== id) err(where, `lessonId must be "${id}"`);
  if (quiz.passingScore !== 60) err(where, 'passingScore must be 60');
  const qs = quiz.questions;
  if (!Array.isArray(qs) || qs.length < 5 || qs.length > 6) { err(where, `must have 5-6 questions (got ${Array.isArray(qs) ? qs.length : 'none'})`); continue; }
  const seenTypes = new Set();
  const ids = new Set();
  for (const q of qs) {
    if (!q.id) err(where, 'question missing id');
    if (ids.has(q.id)) err(where, `duplicate question id ${q.id}`); ids.add(q.id);
    if (!QUESTION_TYPES.includes(q.type)) { err(where, `bad question type "${q.type}" (${q.id})`); continue; }
    seenTypes.add(q.type);
    if (!q.prompt) err(where, `${q.id}: missing prompt`);
    if (!q.explanation) err(where, `${q.id}: missing explanation`);
    const optIds = Array.isArray(q.options) ? q.options.map((o) => o.id) : [];
    if (q.type === 'single-choice') {
      if (!Array.isArray(q.options) || q.options.length < 2) err(where, `${q.id}: needs >=2 options`);
      if (typeof q.answer !== 'string' || !optIds.includes(q.answer)) err(where, `${q.id}: answer must be one option id`);
    } else if (q.type === 'multiple-choice') {
      if (!Array.isArray(q.options) || q.options.length < 2) err(where, `${q.id}: needs >=2 options`);
      if (!Array.isArray(q.answer) || q.answer.length < 1 || !q.answer.every((a) => optIds.includes(a))) err(where, `${q.id}: answer must be ids from options`);
    } else if (q.type === 'fill-blank') {
      if (!Array.isArray(q.answer) || q.answer.length < 1 || !q.answer.every((a) => typeof a === 'string' && a.length)) err(where, `${q.id}: answer must be a non-empty string array`);
    } else if (q.type === 'ordering') {
      const itemIds = Array.isArray(q.items) ? q.items.map((o) => o.id) : [];
      if (itemIds.length < 2) err(where, `${q.id}: needs >=2 items`);
      if (!Array.isArray(q.answer) || q.answer.length !== itemIds.length || [...q.answer].sort().join() !== [...itemIds].sort().join()) err(where, `${q.id}: answer must be a permutation of item ids`);
    } else if (q.type === 'match-pair') {
      if (!Array.isArray(q.pairs) || q.pairs.length < 2 || !q.pairs.every((p) => p.left && p.right)) err(where, `${q.id}: needs >=2 {left,right} pairs`);
    }
  }
  const missingTypes = QUESTION_TYPES.filter((t) => !seenTypes.has(t));
  if (missingTypes.length) err(where, `must cover all five types; missing: ${missingTypes.join(', ')}`);
}

// --- manifest ---------------------------------------------------------------
const manPath = resolve(CONTENT, 'course-manifest.json');
if (!existsSync(manPath)) err('manifest', 'course-manifest.json missing');
else {
  let man;
  try { man = JSON.parse(readFileSync(manPath, 'utf8')); } catch (e) { err('manifest', `invalid JSON: ${e.message}`); man = null; }
  if (Array.isArray(man)) {
    if (man.length !== 24) err('manifest', `expected 24 entries, got ${man.length}`);
    const byId = new Map(lessons.map((l) => [l.fm.id, l]));
    // ordered 8/8/8
    for (let i = 0; i < man.length; i++) {
      const expLevel = i < 8 ? 'beginner' : i < 16 ? 'intermediate' : 'advanced';
      if (man[i].order !== i + 1) err('manifest', `entry ${i}: order ${man[i].order} != ${i + 1}`);
      if (man[i].level !== expLevel) err('manifest', `entry ${i} (${man[i].id}): level ${man[i].level} != ${expLevel}`);
    }
    for (const e of man) {
      const l = byId.get(e.id);
      if (!l) { err('manifest', `entry ${e.id} has no matching lesson`); continue; }
      for (const k of ['slug', 'title', 'level', 'summary']) if (String(e[k]) !== String(l.fm[k])) err('manifest', `${e.id}: ${k} mismatch with lesson front-matter`);
      if (Number(e.order) !== l.order) err('manifest', `${e.id}: order mismatch`);
      if (Number(e.duration) !== Number(l.fm.duration)) err('manifest', `${e.id}: duration mismatch`);
      if (e.file !== l.file) err('manifest', `${e.id}: file "${e.file}" != "${l.file}"`);
      if (!Array.isArray(e.tags) || e.tags.join('|') !== l.fm.tags.join('|')) err('manifest', `${e.id}: tags mismatch`);
    }
    for (const l of lessons) if (!man.find((e) => e.id === l.fm.id)) err('manifest', `lesson ${l.fm.id} missing from manifest`);
  }
}

// --- report -----------------------------------------------------------------
if (errors.length) {
  console.error(`\n❌ Content validation FAILED — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
} else {
  console.log(`\n✅ Content validation PASSED — 24 lessons, 24 quizzes, manifest all consistent.\n`);
}
