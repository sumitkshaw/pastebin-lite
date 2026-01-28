# Pastebin Lite

A simple pastebin-like application built with Next.js 14 and SQLite/Turso. Supports TTL expiration, view limits, and deterministic testing mode.

## Project Description

Pastebin Lite is a lightweight text-sharing application that allows users to create temporary text pastes with optional constraints:
- Time-based expiration (TTL)
- View count limits
- Combined constraints support
- TEST_MODE for deterministic expiry testing

The application provides both a REST API and a web UI for creating and viewing pastes.

## Running the Project Locally

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repo-url>
cd pastebin-lite
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with the following:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TURSO_DB_URL=file:local.db
TURSO_DB_AUTH_TOKEN=
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Testing the Application

- **Health Check:** Visit `http://localhost:3000/api/healthz`
- **Create Paste:** Use the web UI or POST to `/api/pastes`
- **View Paste:** Access created pastes at `/p/:id`

## Persistence Layer

**Database:** SQLite (local development) / Turso (production)

The application uses a persistent database storage layer with no global mutable state:
- **Development:** SQLite with a local file database (`file:local.db`)
- **Production:** Turso (LibSQL) - a distributed SQLite database for serverless deployments
- **Schema:** Single `pastes` table storing content, timestamps, TTL, view limits, and remaining views
- **Advantages:** Data persists across server restarts, scales horizontally, supports concurrent access

Database abstraction layer (`lib/database.ts`) handles initialization, CRUD operations, and expiry cleanup automatically.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript
- **Backend:** Next.js API Routes
- **Database:** SQLite (dev) / Turso (prod)
- **Deployment:** Vercel

## Features
- Create text pastes with optional constraints
- Time-based expiration (TTL)
- View count limits
- Combined constraints support
- TEST_MODE for deterministic expiry testing
- REST API + Web UI