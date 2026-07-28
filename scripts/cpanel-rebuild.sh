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
echo "[deploy] Incoming NODE_OPTIONS: ${NODE_OPTIONS:-<unset>}"
echo "[deploy] Incoming npm_config_node_options: ${npm_config_node_options:-<unset>}"
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

echo "[deploy] Building with webpack via the local Next binary"
echo "[deploy] Next binary exists at: $NEXT_BIN"
echo "[deploy] Build Node path: $(command -v node)"

BUILD_NODE="${CPANEL_BUILD_NODE:-}"

if [ -z "$BUILD_NODE" ] && [ -x "/opt/alt/alt-nodejs22/root/usr/bin/node" ]; then
  BUILD_NODE="/opt/alt/alt-nodejs22/root/usr/bin/node"
fi

if [ -z "$BUILD_NODE" ]; then
  BUILD_NODE="$(command -v node)"
fi

echo "[deploy] Build node path selected: $BUILD_NODE"
"$BUILD_NODE" -v || true

env \
  -u INIT_CWD \
  -u NODE_OPTIONS \
  -u npm_command \
  -u npm_config_node_options \
  -u npm_config_prefix \
  -u npm_config_global_prefix \
  -u npm_config_local_prefix \
  -u npm_execpath \
  -u npm_lifecycle_event \
  -u npm_lifecycle_script \
  -u npm_node_execpath \
  -u npm_package_json \
  NEXT_TELEMETRY_DISABLED=1 \
  "$BUILD_NODE" --max-old-space-size=2048 --max-semi-space-size=64 "$NEXT_BIN" build --webpack

echo "[deploy] Rebuild completed successfully at $(date)"
