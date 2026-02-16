# Deploy Todoly sur OVH VPS + Cloudflare

## Prerequis

- VPS Ubuntu/Debian accessible en SSH.
- Domaine `todoly.app` déjà délégué chez Cloudflare.
- Ce repo disponible sur le VPS (clone git ou copie de fichiers).

Note: `2001:41d0:305:2100::1` est une gateway IPv6, pas l'IPv6 publique de ton VPS.  
Sans IPv6 publique confirmée, crée uniquement un enregistrement DNS `A`.

## 1) DNS Cloudflare

Dans Cloudflare, zone DNS de `todoly.app`:

- `A` | `@` | `37.187.236.159` | `Proxy: ON`
- Optionnel: `CNAME` | `www` | `@` | `Proxy: ON`

## 2) Copier le projet sur le VPS

Option git:

```bash
ssh root@37.187.236.159
mkdir -p /opt
cd /opt
git clone <TON_REPO_GIT> todoly
cd /opt/todoly
```

Option copie directe:

```bash
scp -r ./todoly root@37.187.236.159:/opt/todoly
ssh root@37.187.236.159
cd /opt/todoly
```

## 3) Lancer l'installation automatique

```bash
chmod +x deploy/vps/install.sh deploy/vps/deploy.sh
./deploy/vps/install.sh --domain todoly.app --email ton-email@domaine.com
```

Ce script fait:

- Installation de Node.js 20, Nginx, PostgreSQL, UFW, Certbot.
- Création/configuration de la base PostgreSQL.
- Import de `todoly.sql` (uniquement si la DB est vide).
- Build `server` + `client/taskly`.
- Création des services `systemd`:
  - `todoly-api` (port local `3001`)
  - `todoly-web` (port local `3000`)
- Configuration Nginx reverse proxy vers Next.js.
- HTTPS Let's Encrypt (si `--email` fourni).

## 4) Variables d'environnement

Le script crée ces fichiers si absents:

- `server/.env` depuis `deploy/vps/env/server.env.example`
- `client/taskly/.env` depuis `deploy/vps/env/client.env.example`

Vérifie surtout les variables Firebase dans `client/taskly/.env`.

## 5) Vérifications

```bash
systemctl status todoly-api todoly-web nginx --no-pager
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:3001
```

Puis teste:

- `https://todoly.app`

## 6) Déploiements suivants

```bash
cd /opt/todoly
./deploy/vps/deploy.sh
```

Si tu as déjà mis à jour les fichiers autrement qu'avec `git pull`:

```bash
./deploy/vps/deploy.sh --skip-pull
```
