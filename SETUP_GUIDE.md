# 🛡️ SOC Dashboard - Setup Guide

## 🐧 Prerequisites
Ensure you have the following installed on your target machine:
- **Node.js** (v18+)
- **PostgreSQL** (Ensure it is running locally on port 5432)

---

## ⚡ Setup & Run (Development)

The entire stack is orchestrated by a single setup script. It installs dependencies, generates secure `.env` tokens, migrates the database, and boots everything concurrently.

**On Windows:**
Double-click `setup.bat` in the root directory.

**On Mac / Linux:**
```bash
node setup.js
```
*(Frontend runs on http://localhost:3000, Backend on http://localhost:5000)*

---

## 🚀 Setup & Run (Production)

For live deployments, you do not need two servers. The Express backend is configured to statically serve the optimized React frontend.

1. **Build the Frontend:**
```bash
cd client
npm run build
```

2. **Start the Unified Server:**
```bash
cd ../server
node index.js
```
*(The full application runs on http://localhost:5000)*

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |
| **Analyst** | `analyst@soc.com` | `password123` |
