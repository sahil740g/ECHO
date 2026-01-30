# ECHO - Developer Social Platform

ECHO is a modern, developer-focused social platform designed for sharing knowledge, code snippets, and tech discussions.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, Socket.io
- **Database**: Supabase (PostgreSQL)

## Prerequisites

- Node.js (v16+)
- Supabase Account

## Setup

1. **Install Dependencies**

   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   ```

2. **Environment Variables**
   - Create `.env` in the root directory:
     ```
     VITE_SUPABASE_URL=...
     VITE_SUPABASE_ANON_KEY=...
     VITE_SOCKET_URL=http://localhost:3001
     ```
   - Create `.env` in `server/` directory:
     ```
     PORT=3001
     CLIENT_URL=http://localhost:5173
     ```

## How to Run

Run the frontend and backend in **two separate terminals**.

### 1. Frontend

```bash
npm run dev
```

Runs on: http://localhost:5173

### 2. Backend

```bash
cd server
npm run dev
```

Runs on: http://localhost:3001
