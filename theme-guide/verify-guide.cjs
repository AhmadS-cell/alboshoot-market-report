const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2] || __dirname;
const files = fs.readdirSync(root).filter(name => name.endsWith('.html'));
assert(files.includes('index.html'), 'Guide index must exist');
for (const name of files) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  assert(/<meta\s+name="robots"\s+content="noindex, nofollow"\s*>/i.test(html), `${name}: robots directive missing`);
  assert(/<html lang="ar" dir="rtl">/.test(html), `${name}: Arabic document semantics missing`);
  const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
  const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || '';
  const links = [...nav.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(links, sections, `${name}: contents and sections differ`);
  assert.equal(sections.at(-1), 'sources', `${name}: sources must be final section`);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(html.includes(`id="${match[1]}"`), `${name}: broken anchor ${match[1]}`);
  assert(!/<script\b|<iframe\b|<form\b|<img\b/i.test(html), `${name}: guide should remain a plain reading document`);
  assert(!/signature=|expires=|token=|(?:store|theme|draft)_id[=:]/i.test(html), `${name}: private identifiers or credential links found`);
}
console.log(`PASS: ${files.length} HTML document(s); noindex, Arabic semantics, contents, anchors, final sources and public-content checks.`);
