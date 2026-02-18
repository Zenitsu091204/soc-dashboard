# SOC Dashboard (Full-Stack)

A production-ready Security Operations Center (SOC) dashboard built with the PERN stack (PostgreSQL, Express, React, Node.js). Designed for real-time threat monitoring and intelligence analysis.

## 🚀 Features

### **Operations**
- **Live Monitor**: Real-time alerts trend, recent activity feed, and system health status.
- **Global Search**: Instant search across Alerts, IOCs, and Threat Actors.
- **Draggable Dashboard**: Custom dashboard builder with persisted layouts.

### **Intelligence**
- **Campaign Timeline**: Track complex security campaigns with interactive timelines and MITRE ATT&CK mapping.
- **Threat Actor Profiles**: Detailed profiles with known TTPs and associated IOCs.
- **IOC Workbench**: Feed of Indicators of Compromise with filtering and export.

### **Architecture**
- **Frontend**: React 18, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: PostgreSQL.
- **Authentication**: JWT-based secure auth flow.

## 🛠️ Prerequisites

- **Node.js**: v16+
- **PostgreSQL**: v13+ (Local installation or Docker)
- **Git**

## 📂 Project Structure

- **/client**: React Frontend application
- **/server**: Node.js/Express Backend API
- **docker-compose.yml**: Database configuration

## ⚡ Setup Instructions

### 1. Database Setup (PostgreSQL)

**Option A: Docker (Recommended)**
```powershell
docker-compose up -d
```

**Option B: Local Install**
Ensure PostgreSQL is running and update `server/.env` with your credentials:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/soc_dashboard?schema=public"
```

### 2. Backend Setup
```powershell
cd server
npm install

# Initialize Database
npx prisma migrate dev --name init

# Seed Data (Creates Users, Alerts, Threat Actors, Campaigns)
node prisma/seed.js

# Start Server
npm run dev
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup
```powershell
cd client
npm install
npm start
```
*Client runs on http://localhost:3000*

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |
| **Analyst** | `analyst@soc.com` | `password123` |

## 🎨 Theme & UI
The dashboard uses a "Glassmorphism" design system with:
- Tailwind CSS for utility-first styling.
- Custom reusable `Card` components with blur effects.
- Dynamic charts using Recharts with custom tooltips.
