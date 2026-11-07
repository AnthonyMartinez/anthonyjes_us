#!/usr/bin/env bash
# Pull the latest code and rebuild/restart the site.
# Run on the server from anywhere: ~/anthonyjes_us/scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
docker compose up -d --build
docker image prune -f >/dev/null
docker compose ps
