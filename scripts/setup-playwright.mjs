// Postinstall hook: fetch the Chromium browser binary that Playwright drives.
// Runs after `npm install`. Designed to never fail the install — if the browser
// fetch fails (offline, disk space, network policy), prints a recovery hint
// and exits 0 so the rest of `npm install` succeeds.
//
// Skips entirely in production-only installs (where playwright is in devDeps
// and not present).
//
// For Linux users who additionally need system libs (libnss, libgbm, fonts),
// run the opt-in `npm run setup:deps` separately. That step uses the system
// package manager (sudo apt / sudo dnf) and is intentionally not part of
// postinstall — non-interactive sudo is a footgun.

import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function log(msg) {
  console.log(`[setup-playwright] ${msg}`);
}

try {
  require.resolve('playwright/package.json');
} catch {
  log('playwright is not installed (production-only install?). Skipping browser fetch.');
  process.exit(0);
}

try {
  log('Fetching Chromium browser via `playwright install chromium`...');
  log('(Chromium drives smoke + a11y + mobile-Pixel-5 + Lighthouse — sufficient for the wired test specs.');
  log(' To add WebKit for real Safari testing: npm run setup:deps && npx playwright install webkit)');
  execSync('playwright install chromium', { stdio: 'inherit' });
  log('Chromium ready. Run `npx playwright test --project=smoke` to verify.');
  process.exit(0);
} catch {
  console.warn(
    [
      '',
      '[setup-playwright] Chromium install did not complete.',
      '',
      'To finish setup, run:',
      '  npx playwright install chromium',
      '',
      'If you are on Linux and Chromium fails to launch with missing-library errors,',
      'install system libs once with:',
      '  npm run setup:deps     # uses sudo (apt or dnf) — review before running',
      '',
    ].join('\n'),
  );
  process.exit(0);
}
