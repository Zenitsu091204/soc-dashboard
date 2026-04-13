# 🚀 SOC Dashboard: Ubuntu Deployment Guide

This guide details the process of deploying the SOC Dashboard into a production environment on **Ubuntu 22.04+**.

## 📋 Prerequisites

Before starting, ensure your Ubuntu server has:
- At least 4GB RAM (for building React)
- Internet access
- A non-root user with `sudo` privileges

---

## 🛠️ Step 1: Automated Bootstrap
We have provided a bootstrap script that installs Node.js, PostgreSQL, and normalizes line endings.

```bash
chmod +x setup-ubuntu.sh
./setup-ubuntu.sh
```

---

## 📦 Step 2: Production Build
Once the dependencies are installed, generate the production bundles:

```bash
# From the root directory
npm run build
```

The server is now configured to serve the **React Frontend** as static files from `client/build/`.

---

## 🗄️ Step 3: Database Migration
Deploy the production schema to your PostgreSQL instance:

```bash
npm run db:deploy
npm run db:seed
```

---

## 🛡️ Step 4: Nginx & NAXSI Setup
1. **Transfer the template**: Copy `config/nginx.conf.template` to `/etc/nginx/sites-available/soc-dashboard`.
2. **Configure Domain**: Edit the file and replace `YOUR_DOMAIN_OR_IP` with your server's address.
3. **Enable NAXSI**:
    - Ensure NAXSI is installed: `sudo apt install libnginx-mod-http-naxsi` on some distros, or use a custom build.
    - Path for rules: Ensure `/etc/nginx/naxsi_rules.conf` is writable by the user running the dashboard.
4. **Symlink and Restart**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/soc-dashboard /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## 🔄 Step 5: Systemd Service
To ensure the dashboard starts on boot and auto-restarts on failure:

1. **Configure Service**: Edit `config/soc-dashboard.service` and replace `YOUR_UBUNTU_USER` with your actual username.
2. **Install Service**:
    ```bash
    sudo cp config/soc-dashboard.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable soc-dashboard
    sudo systemctl start soc-dashboard
    ```

---

## 🔍 Step 6: Verify Deployment
- **Logs**: `journalctl -u soc-dashboard -f`
- **Status**: `systemctl status soc-dashboard`
- **Dashboard**: Access via `http://your-server-ip`

> [!IMPORTANT]
> **SSL/TLS**: For production, it is highly recommended to use **Certbot (Let's Encrypt)** to secure your traffic with HTTPS.
> ```bash
> sudo apt install certbot python3-certbot-nginx
> sudo certbot --nginx -d your-domain.com
> ```

> [!WARNING]
> Ensure `SIMULATE_FIREWALL` is set to `false` in your production `.env` to enable real-time rule updates.
