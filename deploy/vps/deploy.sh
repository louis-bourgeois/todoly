#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "[todoly-deploy] %s\n" "$*"
}

die() {
  printf "[todoly-deploy] ERROR: %s\n" "$*" >&2
  exit 1
}

if [[ "${EUID}" -ne 0 ]]; then
  die "Run this script as root."
fi

APP_ROOT="${APP_ROOT:-/opt/todoly}"
APP_USER="${APP_USER:-todoly}"
SKIP_PULL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-pull)
      SKIP_PULL=1
      shift
      ;;
    --help)
      cat <<'EOF'
Usage:
  ./deploy/vps/deploy.sh [--skip-pull]

Environment:
  APP_ROOT   Default: /opt/todoly
  APP_USER   Default: todoly
EOF
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

[[ -d "$APP_ROOT" ]] || die "App root not found: $APP_ROOT"
[[ -d "$APP_ROOT/server" ]] || die "Missing server directory in $APP_ROOT"
[[ -d "$APP_ROOT/client/taskly" ]] || die "Missing client directory in $APP_ROOT"

if [[ "$SKIP_PULL" -eq 0 && -d "$APP_ROOT/.git" ]]; then
  log "Pulling latest git changes..."
  runuser -u "$APP_USER" -- bash -lc "cd '$APP_ROOT' && git pull --ff-only"
fi

log "Installing dependencies..."
runuser -u "$APP_USER" -- bash -lc "cd '$APP_ROOT/server' && npm ci"
runuser -u "$APP_USER" -- bash -lc "cd '$APP_ROOT/client/taskly' && npm ci && npm run build"

log "Restarting services..."
systemctl restart todoly-api todoly-web

api_status="$(systemctl is-active todoly-api || true)"
web_status="$(systemctl is-active todoly-web || true)"

log "Deploy complete. Service status: todoly-api=${api_status}, todoly-web=${web_status}"
