// Phase 2 direction scaffold. Mirrors new-engagement.mjs but for designer outputs.
// Takes the chosen archetype + a few key tokens, emits design/04-direction-{LETTER}.md
// pre-filled with the 13-section binding structure (per HANDOFF-PACKETS/direction-template.md)
// and the archetype defaults from .claude/skills/modernization-mapping.
//
// Designer fills the remaining specifics; the structural skeleton is non-negotiable.
//
// Usage:
//   node scripts/new-direction.mjs
//   npm run new-direction
//
// Auto-detects vibe from research/current-site-vibe.md if present and pre-fills
// the dominant archetype default.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });

const ARCHETYPE_DEFAULTS = {
  'warm-trad': {
    typography: { display: 'Fraunces', body: 'Inter Tight' },
    color: { primary: '#1F3A2A', accent: '#A66E2A', surface: '#F8F5F0', surfaceWarm: '#F0EAE0', ink: '#1A1A18' },
    duration: { fast: 350, med: 450, reveal: 800 },
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    composition: 'split (60/40 photo/content desktop, photo on top mobile)',
    densityTarget: 'balanced (3-4 ideas above fold)',
  },
  'polished-pro': {
    typography: { display: 'Inter Tight', body: 'Inter Tight' },
    color: { primary: '#0E1E3F', accent: '#2D7A4D', surface: '#FFFFFF', surfaceWarm: '#F4F6F9', ink: '#161513' },
    duration: { fast: 200, med: 280, reveal: 600 },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    composition: 'split asymmetric, content-left photo-right desktop',
    densityTarget: 'balanced to dense (3-5 ideas)',
  },
  'neighborhood': {
    typography: { display: 'Bricolage Grotesque', body: 'Geist' },
    color: { primary: '#9C3F26', accent: '#D6913F', surface: '#FCF7EF', surfaceWarm: '#F4ECDF', ink: '#1F1916' },
    duration: { fast: 280, med: 350, reveal: 700 },
    easing: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
    composition: 'photo-led but human-scale (owner / shop / dog / van)',
    densityTarget: 'spacious (1-2 above fold + clear next action)',
  },
  'engineered': {
    typography: { display: 'Geist', body: 'Geist', mono: 'JetBrains Mono' },
    color: { primary: '#1A1B1E', accent: '#F2C200', surface: '#FAFAFA', surfaceWarm: '#EFEFEF', ink: '#0F1011' },
    duration: { fast: 150, med: 200, reveal: 0 },
    easing: 'ease-out',
    composition: 'type-led, no hero photo required; precise capability claim',
    densityTarget: 'dense-utilitarian (5+ ideas; B2B reads)',
  },
  'boutique': {
    typography: { display: 'Recoleta', body: 'Söhne' },
    color: { primary: '#1A1A1C', accent: '#7A4A2A', surface: '#FAF8F5', surfaceWarm: '#EFE9E1', ink: '#1A1A1C' },
    duration: { fast: 400, med: 500, reveal: 900 },
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    composition: 'full-bleed photo OR generous-margin typography hero',
    densityTarget: 'spacious (1-2 above fold)',
  },
  'civic': {
    typography: { display: 'Source Serif 4', body: 'Source Sans 3' },
    color: { primary: '#0B3D8C', accent: '#9C7B1F', surface: '#FFFFFF', surfaceWarm: '#F1F4F8', ink: '#0B0F1A' },
    duration: { fast: 180, med: 220, reveal: 0 },
    easing: 'ease-out',
    composition: 'type-led with credentials block prominent',
    densityTarget: 'balanced to dense (text-readable)',
  },
};

function log(msg) { process.stdout.write(`[new-direction] ${msg}\n`); }

async function ask(label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  return ((await rl.question(`  ${label}${suffix}: `)).trim() || fallback);
}

function detectArchetype() {
  const vibePath = 'research/current-site-vibe.md';
  if (!existsSync(vibePath)) return null;
  const src = readFileSync(vibePath, 'utf8');
  const m = src.match(/\*\*Dominant:\*\*\s*([a-z-]+)/i) || src.match(/Dominant.*?:\s*([a-z-]+)/i);
  return m && ARCHETYPE_DEFAULTS[m[1].toLowerCase()] ? m[1].toLowerCase() : null;
}

async function main() {
  log('Pat LLC — Phase 2 direction scaffold');
  log('');

  const detected = detectArchetype();
  if (detected) log(`Auto-detected archetype from research/current-site-vibe.md: ${detected}`);

  const letter = (await ask('Direction letter (A | B | C)', 'A')).toUpperCase();
  if (!['A', 'B', 'C'].includes(letter)) { log('Letter must be A, B, or C.'); rl.close(); process.exit(2); }

  const archetypeOptions = Object.keys(ARCHETYPE_DEFAULTS).join(' | ');
  const archetype = await ask(`Dominant archetype (${archetypeOptions})`, detected || 'polished-pro');
  if (!ARCHETYPE_DEFAULTS[archetype]) { log(`Unknown archetype: ${archetype}`); rl.close(); process.exit(2); }

  const blend = await ask('Blend archetype (optional, blank to skip)', '');
  const directionName = await ask('Short direction name (e.g. "Warm masthead with verified-trade trim")', '');
  const vibeFitScore = await ask('Vibe-fit score (0-100; ≥75 floor)', '85');

  rl.close();

  const d = ARCHETYPE_DEFAULTS[archetype];
  mkdirSync('design', { recursive: true });
  const outPath = `design/04-direction-${letter}.md`;
  if (existsSync(outPath)) {
    log(`WARN: ${outPath} exists. Refusing to overwrite. Move it aside first.`);
    process.exit(2);
  }

  const blendLine = blend ? `- **Blend (modulation)**: \`${blend}\`` : '- **Blend (modulation)**: (none — base archetype)';

  const body = `# Direction ${letter}${directionName ? ' — ' + directionName : ''}

<!-- This file was scaffolded by scripts/new-direction.mjs. Designer fills the remaining
     specifics. The 13-section structure is binding per HANDOFF-PACKETS/direction-template.md.
     Size cap: 12KB. -->

## 1. Vibe alignment
- **Detected archetype** (from \`research/current-site-vibe.md\`): \`${archetype}\`
- **This direction's archetype**: \`${archetype}\`
${blendLine}
- **Vibe-fit score**: ${vibeFitScore}  (≥75 floor; <75 requires explicit justification below)
- **Preserves from existing site**: TODO — 3-5 bullets from \`research/current-site-vibe.md\` "PRESERVE" list
- **Modernizes (dated → current)**: TODO — 3-5 bullets, concrete
- **Over-modernization risk for this archetype**: TODO — name the failure mode this direction guards against

## 2. Anti-patterns rejected
- TODO pattern 1: rationale citing research
- TODO pattern 2: rationale
- TODO pattern 3: rationale
- TODO pattern 4: rationale
- TODO pattern 5: rationale
- The AI editorial template (cream + serif italic + § markers + grain): rationale specific to this direction

## 3. Color tokens
| Token | Hex | Usage |
|---|---|---|
| primary | \`${d.color.primary}\` | dominant brand color |
| primary_deep | TODO darker variant | hover/pressed states |
| accent | \`${d.color.accent}\` | CTAs, links, highlights |
| accent_deep | TODO darker accent | hover state |
| ink_primary | \`${d.color.ink}\` | body text |
| ink_secondary | TODO | secondary text |
| ink_mute | TODO | captions, meta |
| surface | \`${d.color.surface}\` | base background |
| surface_warm | \`${d.color.surfaceWarm}\` | secondary background |
| surface_inverse | TODO | dark sections |
| border_subtle | TODO | dividers, card borders |
| error | TODO | form errors |
| success | TODO | confirmations |

## 4. Contrast pairings (WCAG AA = 4.5:1 body / 3:1 large)
| Foreground | Background | Ratio | Level |
|---|---|---|---|
| ink_primary | surface | TODO | TODO |
| surface | primary | TODO | TODO |
| accent | surface | TODO | TODO |
| accent_deep | surface_warm | TODO | TODO |
| ink_secondary | surface_warm | TODO | TODO |

## 5. Typography
- **Display family**: ${d.typography.display}
  - Weights: TODO
  - Sizes (h1 mobile / h1 desktop / h2 mobile / h2 desktop): TODO / TODO / TODO / TODO
- **Body family**: ${d.typography.body}
  - Weights: 400, 500
  - Sizes: 16px (floor), TODO desktop, TODO small
- **Mono family**: ${d.typography.mono || 'JetBrains Mono'}
  - Used for: caption · tag · spec · process numerals
- **Citation for pairing choice**: TODO — one-line citing readability research

## 6. Hero composition

### Desktop (1280×800)
- Variant: ${d.composition}
- Above-fold elements (priority order):
  1. TODO
  2. TODO
- LCP element: TODO

### Mobile (375×667)
- Variant: TODO
- Above-fold elements:
  1. TODO
- LCP element: TODO

## 7. First-scroll information density audit
- **Target**: ${d.densityTarget}
- **Mobile actual**: TODO — N ideas, listed
- **Desktop actual**: TODO — N ideas, listed
- **Density verdict**: TODO

## 8. Differentiation claim
TODO — one paragraph: how this direction differs from the OTHER TWO Phase 2 directions AND from the convergent industry default in \`research/competitive-teardown.md\`.

## 9. Reviews treatment
- Placement: TODO
- Format: tile grid (verbatim, no carousel)
- Schema: every review ships \`Review\` JSON-LD per knowledge/seo.md
- Source attribution format: First Last · Platform · YYYY-MM-DD

## 10. Contact-mechanism positioning (text-first per service-trade conversion research)
- Tap-to-call: TODO
- Tap-to-text: TODO
- Form: TODO
- Mobile-specific overrides: TODO

## 11. Component implications
- \`<Hero variant="...">\`: TODO
- \`<ServiceGrid>\`: TODO
- \`<ReviewsBlock>\`: TODO
- \`<TrustStrip>\`: TODO
- \`<ProcessSteps>\`: TODO
- \`<AreaPills>\`: TODO
- \`<ContactForm>\`: TODO
- \`<FaqList>\`: TODO

## 12. Motion (per motion-design SKILL)

### Character
TODO — 1-2 sentence description tied to \`${archetype}\` archetype.

### Token values
- duration_fast:  ${d.duration.fast}ms
- duration_med:   ${d.duration.med}ms
- duration_reveal: ${d.duration.reveal}ms
- easing_default: \`${d.easing}\`
- easing_exit:    \`ease-out\`

### Patterns shipped
- Hover on cards: ${d.duration.fast}ms background-color · ${d.easing} · pointer-fine only
- Focus ring: instant on, ${Math.min(150, d.duration.fast)}ms fade-out on blur
- Active/pressed: 100ms transform: scale(0.97) on tap
- TODO pattern 4
- TODO pattern 5 (3-6 patterns total, each with named JOB)

### Patterns explicitly rejected (3+ from motion-design SKILL)
- Auto-rotating carousel (testimonials especially): user agency loss
- Parallax beyond 8px translate range: motion sickness, scroll perf
- TODO third rejection
- Lottie >50KB: LCP killer

### Reduced-motion behavior
TODO — one paragraph: what is disabled, what stays. SiteLayout.astro global rule already disables animation/transition durations to 0.01ms when prefers-reduced-motion: reduce.

### Mobile adaptations
- Durations reduced ~25% from desktop values above
- TODO any mobile-specific pattern changes

## 13. Production gates checklist (designer self-check before submission)
- [ ] All 13 sections filled, no "TODO"
- [ ] File size ≤12KB
- [ ] 5+ anti-patterns rejected, includes AI editorial
- [ ] Every contrast pairing in section 4 has measured ratio
- [ ] Every text/bg pairing used in any section appears in section 4
- [ ] Body text ≥16px every variant
- [ ] Vibe-fit ≥75 OR justified <75 in section 1
- [ ] Mobile + desktop hero composition spec separate (section 6)
- [ ] Motion section 12 complete with all 5 sub-headings
- [ ] No invented copy anywhere; placeholder copy explicitly labeled (placeholder — not for ship)
`;

  writeFileSync(outPath, body);
  log(`Wrote ${outPath} (${body.length} bytes; cap is 12288)`);
  log('');
  log('Next: designer agent fills every TODO. UX agent cross-reviews after all 3 directions complete.');
}

main().catch((err) => {
  console.error('new-direction failed:', err);
  process.exit(1);
});
