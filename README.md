# ECHO - Developer Social Platform

ECHO is a modern, developer-focused social platform designed for sharing knowledge, code snippets, and tech discussions.

## Project Structure

```
ECHO/
├── frontend/          # React/Vite application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── ...
├── backend/           # Node.js/Express/Socket.io server
│   ├── index.js       # Server entry point
│   └── ...
├── supabase/          # Database migrations
└── .env               # Environment variables (template)
```

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
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. **Environment Variables**
   
   Copy `.env` to both `frontend/` and `backend/` directories, or they're already set up.
   
   - **Frontend** (`frontend/.env`):
     ```
     VITE_SUPABASE_URL=...
     VITE_SUPABASE_ANON_KEY=...
     VITE_SOCKET_URL=http://localhost:3001
     ```
   - **Backend** (`backend/.env`):
     ```
     PORT=3001
     CLIENT_URL=http://localhost:5173
     ```

## How to Run

Run the frontend and backend in **two separate terminals**.

### 1. Frontend

```bash
cd frontend
npm run dev
```

Runs on: http://localhost:5173

### 2. Backend

```bash
cd backend
npm start
```

Runs on: http://localhost:3001

## Build for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.
