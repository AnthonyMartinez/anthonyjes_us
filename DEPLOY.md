# Deploying to an Oracle Cloud VM

The site runs in Docker with two containers:

- **app**: the Next.js + Payload server. The SQLite database and uploaded images
  live on a Docker volume (`/data`), so they survive rebuilds.
- **caddy**: a reverse proxy that gets and renews HTTPS certificates
  automatically.

```
internet ──443──▶ caddy ──3000──▶ app ──▶ /data (site.db + media/)
```

---

## 0. Before you start (on your own computer, once)

Production doesn't change the database schema on its own. Instead, Payload runs
*migrations* when the server starts, so generate the first one locally:

```bash
npm install
cp .env.example .env            # set PAYLOAD_SECRET to anything for local use
npm run migrate:create -- initial
git add package-lock.json src/migrations
git commit -m "Add initial database migration"
git push
```

Repeat `npm run migrate:create -- <name>` and commit the result whenever you add or
change fields in a collection. Otherwise the live database won't have the new
columns.

## 1. VM sizing

- **Recommended:** an **Ampere A1 (ARM)** shape. Oracle's Always Free tier
  includes up to 4 OCPUs and 24 GB RAM, which is plenty. 1 OCPU / 6 GB is fine.
- The 1 GB **E2.1.Micro** shape can run the site, but `next build` will likely
  run out of memory. If that's your VM, add swap (step 3).
- Ubuntu 22.04/24.04 or Oracle Linux 9 both work. The commands below assume
  Ubuntu. Oracle Linux differences are noted.

## 2. Open ports 80 and 443

Oracle blocks these in **two** places.

**a) The cloud firewall (Security List)**
Console → Networking → Virtual Cloud Networks → *your VCN* → Subnet →
Security List → **Add Ingress Rules**:

| Source CIDR | Protocol | Destination port |
|---|---|---|
| `0.0.0.0/0` | TCP | `80` |
| `0.0.0.0/0` | TCP | `443` |
| `0.0.0.0/0` | UDP | `443` *(optional, for HTTP/3)* |

**b) The firewall inside the VM**

Ubuntu images on Oracle ship with restrictive iptables rules:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

Oracle Linux uses firewalld:

```bash
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --reload
```

## 3. Install Docker (and swap, for small VMs)

SSH in (`ssh ubuntu@<vm-public-ip>`), then:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit   # log out and back in so the docker group applies
```

Only on a 1 GB VM, add 4 GB of swap:

```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 4. Point your domain at the VM

At your DNS provider, create:

| Type | Name | Value |
|---|---|---|
| A | `@` (e.g. `anthonyjes.us`) | VM public IP |
| A | `www` | VM public IP |

Wait until `dig +short your-domain.com` returns the VM's IP before step 6, because
Caddy needs the domain to reach the VM to get a certificate.

## 5. Get the code and configure it

```bash
git clone -b nextjs-payload https://github.com/AnthonyMartinez/anthonyjes_us.git
cd anthonyjes_us
cp .env.example .env
nano .env
```

Set these values in `.env` (`DATABASE_URI` is ignored here because
docker-compose sets it):

```env
PAYLOAD_SECRET=<output of: openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://your-domain.com
DOMAIN=your-domain.com
```

> After you merge `nextjs-payload` into `main`, switch the server over with
> `git checkout main && git pull`.

## 6. Launch

```bash
chmod +x scripts/*.sh
docker compose up -d --build
docker compose logs -f app   # Ctrl+C to stop watching
```

The first build takes a few minutes. When the logs show the server is ready,
open `https://your-domain.com/admin` and **create your admin account right away**:
until you do, anyone who visits that page can create the first account.

## Updating the site

After you push changes to GitHub:

```bash
~/anthonyjes_us/scripts/deploy.sh
```

This pulls, rebuilds, restarts with a few seconds of downtime, and runs any new
migrations on startup.

## Backups

```bash
~/anthonyjes_us/scripts/backup.sh          # writes backups/site-<date>.tgz
crontab -e                                 # then add a daily 3am backup:
0 3 * * * $HOME/anthonyjes_us/scripts/backup.sh >> $HOME/backup.log 2>&1
```

Backups stay on the VM, so copy them elsewhere now and then
(`scp ubuntu@<ip>:anthonyjes_us/backups/*.tgz .`), or sync them to Oracle Object
Storage.

**Restore:**

```bash
docker compose stop app
docker compose run --rm --user root -v "$PWD/backups:/backups" app \
  sh -c 'rm -rf /data/* && tar xzf /backups/site-<date>.tgz -C / && chown -R 1001:1001 /data'
docker compose start app
```

## Troubleshooting

| Symptom | Check |
|---|---|
| Browser can't connect at all | Step 2: both the Security List *and* iptables/firewalld. Test with `curl -I http://<vm-ip>` from your laptop. |
| Certificate errors | `docker compose logs caddy`. DNS has to point at the VM and port 80 has to be open. |
| `www` cert errors in Caddy logs | No `www` DNS record. Add one, or delete the `www.` block in `Caddyfile`. |
| Build killed / exit code 137 | Out of memory. Add swap (step 3). |
| "no such table" errors | You deployed without a migration. Do step 0, push, run `deploy.sh`. |
| Uploads fail | `docker compose exec app ls -la /data/media` should be owned by `nextjs`. |
