#!/usr/bin/env bash
# Copy the database and uploaded media out of the Docker volume into
# ./backups/<timestamp>.tgz and keep the 14 most recent backups.
# Schedule daily with:  crontab -e  →  0 3 * * * ~/anthonyjes_us/scripts/backup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

stamp=$(date +%Y-%m-%d_%H%M)
tmp=$(mktemp -d)
mkdir -p backups

docker compose cp app:/data "$tmp/data"
tar czf "backups/site-$stamp.tgz" -C "$tmp" data
rm -rf "$tmp"

ls -1t backups/site-*.tgz | tail -n +15 | xargs -r rm --
echo "Saved backups/site-$stamp.tgz"
