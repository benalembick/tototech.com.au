#!/bin/sh
set -eu

APP_ROOT="${1:-$(pwd)}"
LOG_FILE="$APP_ROOT/cpanel-rebuild.log"

mkdir -p "$APP_ROOT"

{
  echo "[deploy] Scheduled detached rebuild at $(date)"
  echo "[deploy] App root: $APP_ROOT"
  echo "[deploy] The rebuild will start after cPanel's npm lifecycle process exits."
} > "$LOG_FILE"

if command -v setsid >/dev/null 2>&1; then
  setsid sh -c 'sleep 8; exec sh "$1/scripts/cpanel-rebuild.sh" "$1"' cpanel-rebuild "$APP_ROOT" >> "$LOG_FILE" 2>&1 < /dev/null &
else
  nohup sh -c 'sleep 8; exec sh "$1/scripts/cpanel-rebuild.sh" "$1"' cpanel-rebuild "$APP_ROOT" >> "$LOG_FILE" 2>&1 < /dev/null &
fi

echo "[deploy] Rebuild scheduled. Log: $LOG_FILE"
