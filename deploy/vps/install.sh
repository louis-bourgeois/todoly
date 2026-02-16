#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "[todoly-install] %s\n" "$*"
}

warn() {
  printf "[todoly-install] WARNING: %s\n" "$*" >&2
}

die() {
  printf "[todoly-install] ERROR: %s\n" "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  ./deploy/vps/install.sh --domain todoly.app [options]

Options:
  --domain <fqdn>          Required. Main domain (example: todoly.app)
  --email <email>          Optional. Email for Let's Encrypt
  --app-root <path>        Optional. Install path (default: /opt/todoly)
  --app-user <user>        Optional. Linux app user (default: todoly)
  --db-name <name>         Optional. PostgreSQL DB name (default: todoly)
  --db-user <name>         Optional. PostgreSQL user (default: todoly_app_user)
  --db-password <value>    Optional. PostgreSQL password (auto-generated if missing)
  --skip-certbot           Optional. Skip HTTPS cert provisioning
  --skip-firewall          Optional. Skip UFW configuration
  --help                   Show this help
EOF
}

escape_sed_replacement() {
  printf "%s" "$1" | sed -e "s/[\\/&|]/\\\\&/g"
}

set_env_var() {
  local file="$1"
  local key="$2"
  local value="$3"
  local escaped
  escaped="$(escape_sed_replacement "$value")"

  if grep -qE "^${key}=" "$file"; then
    sed -i "s|^${key}=.*|${key}=${escaped}|" "$file"
  else
    printf "%s=%s\n" "$key" "$value" >> "$file"
  fi
}

get_env_var() {
  local file="$1"
  local key="$2"
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d "=" -f 2- || true
}

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    die "Run this script as root."
  fi
}

validate_identifier() {
  local value="$1"
  local label="$2"
  if [[ ! "$value" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
    die "${label} '${value}' is invalid. Use only letters, digits and underscore."
  fi
}

require_root

if ! command -v apt-get >/dev/null 2>&1; then
  die "This installer currently supports Debian/Ubuntu only."
fi

DOMAIN=""
LETSENCRYPT_EMAIL=""
APP_ROOT="/opt/todoly"
APP_USER="todoly"
DB_NAME="todoly"
DB_USER="todoly_app_user"
DB_PASSWORD=""
SKIP_CERTBOT=0
SKIP_FIREWALL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="${2:-}"
      shift 2
      ;;
    --email)
      LETSENCRYPT_EMAIL="${2:-}"
      shift 2
      ;;
    --app-root)
      APP_ROOT="${2:-}"
      shift 2
      ;;
    --app-user)
      APP_USER="${2:-}"
      shift 2
      ;;
    --db-name)
      DB_NAME="${2:-}"
      shift 2
      ;;
    --db-user)
      DB_USER="${2:-}"
      shift 2
      ;;
    --db-password)
      DB_PASSWORD="${2:-}"
      shift 2
      ;;
    --skip-certbot)
      SKIP_CERTBOT=1
      shift
      ;;
    --skip-firewall)
      SKIP_FIREWALL=1
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

[[ -n "$DOMAIN" ]] || die "--domain is required."
validate_identifier "$DB_NAME" "DB name"
validate_identifier "$DB_USER" "DB user"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

log "Installing OS packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg git rsync ufw nginx postgresql postgresql-contrib certbot python3-certbot-nginx build-essential python3 openssl

NODE_MAJOR="$(node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/' || true)"
if [[ -z "$NODE_MAJOR" || "$NODE_MAJOR" -lt 20 ]]; then
  log "Installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  log "Node.js v${NODE_MAJOR} detected."
fi

if ! id -u "$APP_USER" >/dev/null 2>&1; then
  log "Creating app user '${APP_USER}'..."
  useradd --create-home --shell /bin/bash "$APP_USER"
fi

mkdir -p "$APP_ROOT"

if [[ "$REPO_ROOT" != "$APP_ROOT" ]]; then
  log "Syncing repository to ${APP_ROOT}..."
  rsync -a \
    --exclude ".git" \
    --exclude "node_modules" \
    --exclude "server/node_modules" \
    --exclude "client/taskly/node_modules" \
    --exclude "client/taskly/.next" \
    "${REPO_ROOT}/" "${APP_ROOT}/"
fi

chown -R "${APP_USER}:${APP_USER}" "$APP_ROOT"

SERVER_ENV="${APP_ROOT}/server/.env"
CLIENT_ENV="${APP_ROOT}/client/taskly/.env"
SERVER_ENV_TEMPLATE="${SCRIPT_DIR}/env/server.env.example"
CLIENT_ENV_TEMPLATE="${SCRIPT_DIR}/env/client.env.example"

if [[ ! -f "$SERVER_ENV" ]]; then
  cp "$SERVER_ENV_TEMPLATE" "$SERVER_ENV"
fi

if [[ ! -f "$CLIENT_ENV" ]]; then
  cp "$CLIENT_ENV_TEMPLATE" "$CLIENT_ENV"
fi

existing_db_password="$(get_env_var "$SERVER_ENV" "DB_PASSWORD")"
if [[ -z "$DB_PASSWORD" ]]; then
  if [[ -n "$existing_db_password" && "$existing_db_password" != "CHANGE_ME" ]]; then
    DB_PASSWORD="$existing_db_password"
  else
    DB_PASSWORD="$(openssl rand -base64 24 | tr -d '\n')"
  fi
fi

secret_session="$(get_env_var "$SERVER_ENV" "SECRET_SESSION")"
if [[ -z "$secret_session" || "$secret_session" == "CHANGE_ME_LONG_RANDOM" ]]; then
  secret_session="$(openssl rand -hex 32)"
fi

set_env_var "$SERVER_ENV" "DB_HOST" "127.0.0.1"
set_env_var "$SERVER_ENV" "DB_USER" "$DB_USER"
set_env_var "$SERVER_ENV" "DB_NAME" "$DB_NAME"
set_env_var "$SERVER_ENV" "DB_PASSWORD" "$DB_PASSWORD"
set_env_var "$SERVER_ENV" "DB_PORT" "5432"
set_env_var "$SERVER_ENV" "PORT" "3001"
set_env_var "$SERVER_ENV" "NODE_ENV" "production"
set_env_var "$SERVER_ENV" "SECRET_SESSION" "$secret_session"
set_env_var "$SERVER_ENV" "CORS_ORIGINS" "https://${DOMAIN},https://www.${DOMAIN}"

log "Configuring PostgreSQL..."
systemctl enable --now postgresql

db_password_sql="${DB_PASSWORD//\'/\'\'}"

runuser -u postgres -- psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${db_password_sql}';
  ELSE
    ALTER ROLE ${DB_USER} LOGIN PASSWORD '${db_password_sql}';
  END IF;
END
\$\$;
SQL

if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q "1"; then
  runuser -u postgres -- createdb -O "$DB_USER" "$DB_NAME"
fi

runuser -u postgres -- psql -v ON_ERROR_STOP=1 -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

if [[ -f "${APP_ROOT}/todoly.sql" ]]; then
  if [[ "$DB_USER" != "todoly_app_user" ]]; then
    warn "todoly.sql is owned by role 'todoly_app_user'. Custom --db-user may break import."
  fi
  if ! runuser -u postgres -- psql -d "$DB_NAME" -tAc "SELECT to_regclass('public.user_profile')" | grep -q "user_profile"; then
    log "Importing initial schema/data from todoly.sql..."
    runuser -u postgres -- psql -v ON_ERROR_STOP=1 -d "$DB_NAME" -f "${APP_ROOT}/todoly.sql"
  else
    log "Database already initialized, skipping todoly.sql import."
  fi
else
  warn "No todoly.sql found at ${APP_ROOT}/todoly.sql. Database schema import skipped."
fi

log "Applying DB compatibility fixes..."
runuser -u postgres -- psql -v ON_ERROR_STOP=1 -d "$DB_NAME" <<SQL
ALTER TABLE public.workspace
  ADD COLUMN IF NOT EXISTS is_deletable boolean NOT NULL DEFAULT true;
UPDATE public.workspace
SET is_deletable = false
WHERE lower(name) = 'personal';
SQL

firebase_api_key="$(get_env_var "$CLIENT_ENV" "NEXT_PUBLIC_FIREBASE_API_KEY")"
if [[ -z "$firebase_api_key" ]]; then
  warn "NEXT_PUBLIC_FIREBASE_API_KEY is empty in ${CLIENT_ENV}. Auth features may fail."
fi

log "Installing Node dependencies and building apps..."
runuser -u "$APP_USER" -- bash -lc "cd '${APP_ROOT}/server' && npm ci"
runuser -u "$APP_USER" -- bash -lc "cd '${APP_ROOT}/client/taskly' && npm ci && npm run build"

APP_ROOT_ESCAPED="$(escape_sed_replacement "$APP_ROOT")"
APP_USER_ESCAPED="$(escape_sed_replacement "$APP_USER")"
DOMAIN_ESCAPED="$(escape_sed_replacement "$DOMAIN")"

sed \
  -e "s|__APP_ROOT__|${APP_ROOT_ESCAPED}|g" \
  -e "s|__APP_USER__|${APP_USER_ESCAPED}|g" \
  "${SCRIPT_DIR}/systemd/todoly-api.service" > /etc/systemd/system/todoly-api.service

sed \
  -e "s|__APP_ROOT__|${APP_ROOT_ESCAPED}|g" \
  -e "s|__APP_USER__|${APP_USER_ESCAPED}|g" \
  "${SCRIPT_DIR}/systemd/todoly-web.service" > /etc/systemd/system/todoly-web.service

sed "s|__DOMAIN__|${DOMAIN_ESCAPED}|g" "${SCRIPT_DIR}/nginx/todoly.app.conf" > "/etc/nginx/sites-available/${DOMAIN}.conf"
ln -sfn "/etc/nginx/sites-available/${DOMAIN}.conf" "/etc/nginx/sites-enabled/${DOMAIN}.conf"
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable --now nginx
systemctl reload nginx

systemctl daemon-reload
systemctl enable --now todoly-api todoly-web
systemctl restart todoly-api todoly-web

if [[ "$SKIP_FIREWALL" -eq 0 ]]; then
  log "Configuring firewall (UFW)..."
  ufw allow OpenSSH >/dev/null
  ufw allow "Nginx Full" >/dev/null
  ufw --force enable >/dev/null
fi

if [[ "$SKIP_CERTBOT" -eq 0 ]]; then
  if [[ -n "$LETSENCRYPT_EMAIL" ]]; then
    log "Requesting HTTPS certificate..."
    if ! certbot --nginx --non-interactive --agree-tos -m "$LETSENCRYPT_EMAIL" -d "$DOMAIN" -d "www.${DOMAIN}" --redirect; then
      warn "HTTPS for www.${DOMAIN} failed. Retrying with ${DOMAIN} only."
      certbot --nginx --non-interactive --agree-tos -m "$LETSENCRYPT_EMAIL" -d "$DOMAIN" --redirect
    fi
  else
    warn "No --email provided, HTTPS certificate skipped."
    warn "Run manually: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
  fi
fi

api_status="$(systemctl is-active todoly-api || true)"
web_status="$(systemctl is-active todoly-web || true)"
nginx_status="$(systemctl is-active nginx || true)"

log "Install complete."
log "Services status: todoly-api=${api_status}, todoly-web=${web_status}, nginx=${nginx_status}"
log "Backend env: ${SERVER_ENV}"
log "Frontend env: ${CLIENT_ENV}"
log "Open: https://${DOMAIN}"
