# Deployment Guide

This guide will walk you through deploying your **Echo** application.
- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Backend**: Deployed on [Render](https://render.com/) (Best for Free Socket.IO support)

---

## 🚀 1. Deploy Backend (Render)

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [Render.com](https://render.com/) and sign in.
3.  Click **"New"** -> **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Configure Service**:
    - **Name**: `echo-backend` (or whatever you like).
    - **Root Directory**: `backend` (Important!).
    - **Environment**: `Node`.
    - **Build Command**: `npm install`.
    - **Start Command**: `node index.js`.
    - **Plan**: Free.
6.  **Environment Variables**:
    - Scroll down to "Environment Variables".
    - Add `CLIENT_URL`: `https://your-vercel-frontend-url.vercel.app` (You can start with `*` if you just want to test).
    - **Note**: Render automatically handles the `PORT`.
7.  Click **"Create Web Service"**.
8.  Wait for deployment. Render will give you a public URL (e.g., `https://echo-backend.onrender.com`).
    - **Copy this URL.** You need it for the frontend.

---

## 🌐 2. Update Frontend (Vercel)

Now connect the frontend to your new Render backend.

1.  Go to your **Vercel Project Dashboard**.
2.  Click **Settings** -> **Environment Variables**.
3.  Add/Update `VITE_SOCKET_URL`:
    - Value: `https://echo-backend.onrender.com` (The URL you copied from Render).
    - *Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are also set!*
4.  **Important**: Go to the **Deployments** tab and **Redeploy** for changes to take effect.

---

## ✅ Verification
1.  Open your Vercel URL.
2.  The site should load.
3.  Go to the Chat page. It should connect successfully (Socket should work).
