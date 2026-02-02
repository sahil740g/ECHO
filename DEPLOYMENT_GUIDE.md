# Deployment Guide

This guide will walk you through deploying your **Echo** application.
- **Backend**: Deployed on [Railway](https://railway.app/)
- **Frontend**: Deployed on [Vercel](https://vercel.com/)

---

## 🚀 1. Deploy Backend (Railway)

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [Railway](https://railway.app/) and sign in.
3.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
4.  Select your repository.
5.  **Important**: Railway might auto-detect the root folder. You need to tell it to use the `backend` folder.
    - Go to **Settings** -> **Root Directory** and set it to `/backend`.
6.  **Environment Variables**:
    - Go to the **Variables** tab.
    - Add the following variables (you can copy values from your local `.env` or leave them for later if they are secrets like Supabase keys):
        - `CLIENT_URL`: `https://your-vercel-frontend-url.vercel.app` (You will update this *after* deploying the frontend, for now you can use `*` or leave it empty if you just want to test deployment).
        - Any other secrets your backend needs (e.g., Supabase keys if you use them in the backend).
    - **Note on PORT**: Railway automatically sets the `PORT` variable, and your code is already set up to use `process.env.PORT`, so you don't need to set this manually.
7.  Railway will build and deploy. Once finished, it will give you a public URL (e.g., `https://echo-server-production.up.railway.app`). **Copy this URL.**

---

## 🌐 2. Deploy Frontend (Vercel)

1.  Go to [Vercel](https://vercel.com/) and sign in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    - Expand **"Environment Variables"**.
    - Add the backend URL you copied from Railway (if your frontend needs to talk to the backend via an env var):
        - `VITE_API_URL` (or whatever variable name you use in your frontend): `https://echo-server-production.up.railway.app`
        - `VITE_SUPABASE_URL`: Your Supabase URL.
        - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
6.  Click **"Deploy"**.
7.  Vercel will build and deploy your site. You will get a domain like `echo-platform.vercel.app`.

---

## 🔗 3. Connect Them

1.  **Update Backend CORS**:
    - Go back to your **Railway** project dashboard.
    - Go to **Variables**.
    - Update/Add `CLIENT_URL` to match your new Vercel domain (e.g., `https://echo-platform.vercel.app`).
    - Railway will automatically redeploy with the new settings.

## ✅ Verification
- Open your Vercel URL.
- Try logging in or performing an action that connects to the backend.
- If something fails, check the **Console** (F12) in your browser and the **Logs** in Railway/Vercel dashboards.
