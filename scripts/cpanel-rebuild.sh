#!/bin/sh
set -eu

APP_ROOT="${1:-$(pwd)}"

cd "$APP_ROOT"

echo "[deploy] Starting detached cPanel rebuild at $(date)"
echo "[deploy] App root: $APP_ROOT"
echo "[deploy] Node: $(node -v)"
echo "[deploy] Node path: $(command -v node)"
echo "[deploy] npm: $(npm -v)"
echo "[deploy] npm path: $(command -v npm)"
echo "[deploy] PATH: $PATH"
echo "[deploy] ulimit:"
ulimit -a || true

echo "[deploy] Removing node_modules and .next to mirror the known-good manual rebuild"
rm -rf node_modules .next

echo "[deploy] Installing dependencies with dev packages, without lifecycle recursion"
npm install --include=dev --ignore-scripts

NEXT_BIN="$APP_ROOT/node_modules/next/dist/bin/next"

if [ ! -f "$NEXT_BIN" ]; then
  echo "[deploy] ERROR: Next.js binary not found at $NEXT_BIN"
  exit 1
fi

echo "[deploy] Building with webpack via the same command used manually"
echo "[deploy] Next binary exists at: $NEXT_BIN"
echo "[deploy] Build Node path: $(command -v node)"

BUILD_NPX="${CPANEL_BUILD_NPX:-}"

if [ -z "$BUILD_NPX" ] && [ -x "/opt/alt/alt-nodejs22/root/usr/bin/npx" ]; then
  BUILD_NPX="/opt/alt/alt-nodejs22/root/usr/bin/npx"
fi

if [ -z "$BUILD_NPX" ]; then
  BUILD_NPX="$(command -v npx)"
fi

echo "[deploy] Build npx path: $BUILD_NPX"
"$BUILD_NPX" --version || true

env \
  -u INIT_CWD \
  -u npm_command \
  -u npm_config_prefix \
  -u npm_config_global_prefix \
  -u npm_config_local_prefix \
  -u npm_execpath \
  -u npm_lifecycle_event \
  -u npm_lifecycle_script \
  -u npm_node_execpath \
  -u npm_package_json \
  NEXT_TELEMETRY_DISABLED=1 \
  "$BUILD_NPX" next build --webpack

echo "[deploy] Rebuild completed successfully at $(date)"
