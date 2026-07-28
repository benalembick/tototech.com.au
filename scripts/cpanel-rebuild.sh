#!/bin/sh
set -eu

APP_ROOT="${1:-$(pwd)}"

cd "$APP_ROOT"

echo "[deploy] Starting detached cPanel rebuild at $(date)"
echo "[deploy] App root: $APP_ROOT"
echo "[deploy] Node: $(node -v)"
echo "[deploy] npm: $(npm -v)"

echo "[deploy] Removing node_modules and .next to mirror the known-good manual rebuild"
rm -rf node_modules .next

echo "[deploy] Installing dependencies with dev packages, without lifecycle recursion"
npm install --include=dev --ignore-scripts

echo "[deploy] Building with webpack"
NEXT_TELEMETRY_DISABLED=1 npx next build --webpack

echo "[deploy] Rebuild completed successfully at $(date)"
