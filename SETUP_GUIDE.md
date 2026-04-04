# 🛡️ SOC Dashboard - Setup Guide

Welcome to the **SOC Dashboard**! This project has been simplified for rapid development and testing. Follow the steps below to get started in minutes.

---

## ⚡ Quick Start (Node.js & PostgreSQL)

The easiest way to run the full application (Frontend + Backend) with a single command.

### 1. Initialize the Project
From the `soc-dashboard` root directory, run:

```bash
# Install and initialize everything (DB, Seed, Dependencies)
npm run setup
```

### 2. Start the Application
Run both the React frontend and Express backend concurrently:

```bash
# Launch concurrent development servers
npm run dev
```

> [!NOTE]
> - **Backend** runs on [http://localhost:5000](http://localhost:5000)
> - **Frontend** runs on [http://localhost:3000](http://localhost:3000)

---

## 🐧 OS-Specific Prerequisites

### Ubuntu (Linux)
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib
```

### Windows
Ensure **Node.js** and **PostgreSQL** are installed and running.

---

## 🔐 Default Credentials (Demo Data)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |
| **Analyst** | `analyst@soc.com` | `password123` |

---

## ⚙️ Advanced Configuration (Optional)

You can find all environment settings in `server/.env`.

- **Mock Intelligence**: Set `MOCK_OPENCTI=true` to use demo data if OpenCTI is not connected.
- **Firewall Simulation**: Set `SIMULATE_FIREWALL=true` to test rule generation without modifying your local system.

---

Happy Monitoring! 🛡️
