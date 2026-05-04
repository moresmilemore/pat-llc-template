// Checks the `refreshed:` frontmatter date on every knowledge/*.md file.
// Reports any file older than the staleness threshold.
//
// Used by:
//   - Phase 0 of the engagement (orchestrator runs this; refreshes if stale)
//   - Manual: `node scripts/check-knowledge-freshness.mjs`

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const KNOWLEDGE_DIR = 'knowledge';
const STALENESS_DAYS = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const files = readdirSync(KNOWLEDGE_DIR).filter(
  (f) => f.endsWith('.md') && f !== 'README.md',
);

const now = Date.now();
const stale = [];
const fresh = [];

for (const f of files) {
  const content = readFileSync(join(KNOWLEDGE_DIR, f), 'utf8');
  const match = content.match(/^refreshed:\s*(\d{4}-\d{2}-\d{2})/m);
  if (!match) {
    stale.push({ file: f, refreshed: null, ageDays: Infinity });
    continue;
  }
  const refreshed = new Date(match[1]).getTime();
  const ageDays = Math.round((now - refreshed) / MS_PER_DAY);
  if (ageDays > STALENESS_DAYS) {
    stale.push({ file: f, refreshed: match[1], ageDays });
  } else {
    fresh.push({ file: f, refreshed: match[1], ageDays });
  }
}

console.log('\n[knowledge-freshness] threshold: ' + STALENESS_DAYS + ' days\n');

if (fresh.length > 0) {
  console.log('Fresh:');
  for (const { file, refreshed, ageDays } of fresh) {
    console.log(`  ✓ ${file.padEnd(20)} (${refreshed}, ${ageDays}d)`);
  }
}

if (stale.length > 0) {
  console.log('\nStale (refresh recommended):');
  for (const { file, refreshed, ageDays } of stale) {
    const age = refreshed ? `${refreshed}, ${ageDays}d` : 'no `refreshed:` frontmatter';
    console.log(`  ✗ ${file.padEnd(20)} (${age})`);
  }
  console.log('\nTo refresh, the orchestrator dispatches researcher with the refresh-knowledge HANDOFF_PACKET');
  console.log('(or update each file manually, bumping the `refreshed:` date).\n');
  process.exit(1);
}

console.log('\nAll knowledge files fresh.\n');
process.exit(0);
