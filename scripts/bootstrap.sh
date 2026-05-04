#!/usr/bin/env bash
# One-shot setup for a fresh Pat LLC template clone.
#
# Idempotent: re-runnable. Skips steps that are already complete.
#
# What it does:
#   1. Verifies / installs Node.js 20+ via the OS package manager (dnf, apt, brew)
#   2. Runs `npm install` which triggers postinstall (Playwright Chromium fetch)
#   3. Verifies the Playwright browser is available
#   4. Optionally installs Playwright system deps if --with-deps is passed
#
# Usage:
#   bash scripts/bootstrap.sh                # standard
#   bash scripts/bootstrap.sh --with-deps    # also install system libs (Linux only; uses sudo)

set -euo pipefail

WITH_DEPS=false
for arg in "$@"; do
  case "$arg" in
    --with-deps) WITH_DEPS=true ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# *//'
      exit 0
      ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

log()  { printf '\033[1;36m[bootstrap]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[bootstrap]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[bootstrap]\033[0m %s\n' "$*" >&2; }

ensure_node() {
  if command -v node >/dev/null 2>&1; then
    local v
    v="$(node -v | sed 's/^v//')"
    local major="${v%%.*}"
    if [ "$major" -ge 20 ]; then
      log "Node.js $v already installed."
      return 0
    fi
    warn "Node.js $v is below the required >=20.3.0. Upgrading..."
  else
    log "Node.js not found. Installing via system package manager..."
  fi

  if command -v dnf >/dev/null 2>&1; then
    log "Detected dnf (Fedora / Asahi / RHEL). Running: sudo dnf install -y nodejs npm"
    sudo dnf install -y nodejs npm
  elif command -v apt-get >/dev/null 2>&1; then
    log "Detected apt (Debian / Ubuntu). Installing Node.js 20.x via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif command -v pacman >/dev/null 2>&1; then
    log "Detected pacman (Arch). Running: sudo pacman -S --noconfirm nodejs npm"
    sudo pacman -S --noconfirm nodejs npm
  elif command -v brew >/dev/null 2>&1; then
    log "Detected Homebrew. Running: brew install node"
    brew install node
  elif command -v winget >/dev/null 2>&1; then
    log "Detected winget. Running: winget install OpenJS.NodeJS.LTS"
    winget install OpenJS.NodeJS.LTS
  else
    err "No supported package manager found (tried dnf, apt-get, pacman, brew, winget)."
    err "Install Node.js >=20.3.0 manually from https://nodejs.org and re-run this script."
    exit 1
  fi

  if ! command -v node >/dev/null 2>&1; then
    err "Node.js still not on PATH after install. Open a new shell and re-run."
    exit 1
  fi

  log "Node $(node -v), npm $(npm -v) installed."
}

ensure_deps() {
  log "Running: npm install (this also fetches Chromium via postinstall)"
  npm install
}

ensure_browser() {
  if [ -d "$HOME/.cache/ms-playwright" ] || [ -d "$HOME/Library/Caches/ms-playwright" ] || [ -d "$LOCALAPPDATA/ms-playwright" ]; then
    log "Playwright cache present. Verifying chromium binary..."
  else
    log "Playwright cache not detected. Fetching chromium..."
  fi
  npx playwright install chromium
  log "Chromium ready."
}

ensure_system_deps() {
  if [ "$WITH_DEPS" != true ]; then
    return 0
  fi
  log "--with-deps flag set. Installing Playwright system libs (uses sudo)..."
  npx playwright install-deps chromium || warn "playwright install-deps did not complete cleanly. Some Linux distributions are not auto-detected; install libnss3, libgbm, libxshmfence, libxcomposite, libxdamage, libxrandr, fontconfig manually if Chromium fails to launch."
}

main() {
  log "Pat LLC template — one-shot setup"
  ensure_node
  ensure_deps
  ensure_browser
  ensure_system_deps
  log "Setup complete."
  log "Try:  npm run dev    (then open http://localhost:4321)"
  log "QA:   npx playwright test --project=smoke"
}

main "$@"
