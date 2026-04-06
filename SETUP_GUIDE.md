# 🛡️ SOC Dashboard - Setup Guide

Welcome to the **SOC Dashboard**! This application has been hardened for production and comes out-of-the-box in a **"Zero-Data" state** (no fake alerts, no mock incidents). Follow the steps below to initialize your workspace and start integrating your actual security tools.

---

## ⚡ 1-Click Automated Setup 

The entire stack (database, dependencies, frontend, backend) is orchestrated by a single setup script.

### For Windows Users
Simply double-click the `setup.bat` file in the root directory.

### For Mac / Linux Users
From the `soc-dashboard` root directory, run:
```bash
node setup.js
```

### What the Setup Script Automates:
1.  **Dependencies:** Automatically traverses the root, `client`, and `server` folders to install all NPM packages.
2.  **Environment Variables:** Clones `.env.example` into a local `.env` and **auto-generates a secure 64-byte `JWT_SECRET`** for your session management.
3.  **Database Migration:** Runs `prisma migrate reset` against your PostgreSQL server to spin up all fresh core tables.
4.  **Base Configuration:** Inserts the initial structural data (Workspace configurations, Integration placeholders, and default User roles). 
5.  **Simultaneous Boot:** Instantly spawns `npm run dev` in the background, firing up both the React client and Express API concurrently.

> [!NOTE] 
> - **Backend API** runs on: `http://localhost:5000`
> - **Frontend Dashboard** runs on: `http://localhost:3000`

---

## 🔐 Default Credentials

The setup process generates two native user profiles. **You must change these passwords immediately** after logging in for the first time via the *Settings → Team Management* view.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |
| **Analyst** | `analyst@soc.com` | `password123` |

---

## ⚙️ Integrations & Configuration

Since all mock data was stripped securely for production deployment, your dashboard widget panels will rightfully report "No vulnerabilities detected" or "No Active Sources" until you hook up integrations.

All environmental settings are located inside `server/.env`. 

### Threat Intelligence Sync (OpenCTI)
To ingest live IOCs and campaigns, append your actual OpenCTI endpoint tokens to `.env`:
```env
OPENCTI_URL=https://your-opencti-instance.com/graphql
OPENCTI_TOKEN=your_real_token
```
*(Leave `OPENCTI_TOKEN` completely blank to safely disable synchronization without errors.)*

### Vulnerability / CVE Feeds
The **Top Exploited CVEs** widget has been defaulted to a zero-data empty state. For production deployment, you should hook this React component (`TopCvesWidget.js`) to your internal Vulnerability Management scanner API (like Qualys, Nessus, or DefectDojo).

### WAF / Firewall Simulation
Set `SIMULATE_FIREWALL=true` in `.env` to test Naxsi WAF rule generation natively without writing physical configuration files onto your OS host.

---

## 🐧 Prerequisites

If the automated setup fails, ensure you have the following installed on your host machine:

**Windows:**
- Node.js (v18+)
- PostgreSQL (Listening natively on port 5432)

**Ubuntu/Debian Linux:**
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib
```

Happy Monitoring! 🛡️
