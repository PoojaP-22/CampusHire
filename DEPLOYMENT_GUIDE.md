# Campus Hire - Deployment Guide

## Architecture

```
[Frontend - Vercel]  <-->  [Backend API - Render]  <-->  [MongoDB Atlas]
   React + Vite              Express + Node.js           Cloud Database
```

---

## Prerequisites

Before starting, make sure you have:
1. A **GitHub account** with this project pushed to a repository
2. A **Vercel account** (free) — https://vercel.com/signup
3. A **Render account** (free) — https://render.com/register
4. A **MongoDB Atlas account** (free) — https://www.mongodb.com/cloud/atlas/register

---

## STEP 1: Set Up MongoDB Atlas (Free Cloud Database)

Your app needs a cloud MongoDB database. Local `mongodb://localhost` won't work in production.

### 1.1 Create a Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and sign in
2. Click **"Build a Database"**
3. Select **M0 FREE** tier
4. Choose a cloud provider (AWS recommended) and region closest to you
5. Name your cluster (e.g., `campus-hire-cluster`)
6. Click **"Create Deployment"**

### 1.2 Create a Database User
1. In the **"Database Access"** section (left sidebar), click **"Add New Database User"**
2. Choose **Password** authentication
3. Set a username (e.g., `campushireAdmin`) and a strong password
4. **SAVE THIS PASSWORD** — you'll need it later
5. Under "Database User Privileges", select **"Read and Write to any database"**
6. Click **"Add User"**

### 1.3 Allow Network Access
1. In the **"Network Access"** section (left sidebar), click **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (sets `0.0.0.0/0`)
   - This is required so Render's servers can connect to your database
3. Click **"Confirm"**

### 1.4 Get Your Connection String
1. Go to **"Database"** section → click **"Connect"** on your cluster
2. Select **"Drivers"**
3. Copy the connection string. It looks like:
   ```
   mongodb+srv://campushireAdmin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add the database name before the `?`:
   ```
   mongodb+srv://campushireAdmin:YourPassword@cluster0.abc123.mongodb.net/campus-hire?retryWrites=true&w=majority
   ```

**Keep this connection string ready — you'll need it in Step 2.**

---

## STEP 2: Deploy Backend on Render

### 2.1 Push Code to GitHub
Make sure your full project (including the `server/` folder) is pushed to GitHub:
```bash
git add .
git commit -m "deployment ready"
git push origin main
```

### 2.2 Create a New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub account** if not already connected
4. Select the **Campus-hire** repository
5. Configure the service with these settings:

| Setting | Value |
|---|---|
| **Name** | `campus-hire-api` |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 2.3 Add Environment Variables
Scroll down to the **"Environment Variables"** section and add these one by one:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://campushireAdmin:YourPassword@cluster0.abc123.mongodb.net/campus-hire?retryWrites=true&w=majority` (your Atlas string from Step 1.4) |
| `JWT_SECRET` | Any random long string (e.g., `mySuper$ecretKey2026!campus#hire`) |
| `JWT_EXPIRE` | `7d` |
| `JWT_COOKIE_EXPIRE` | `7` |
| `FRONTEND_URL` | `https://your-app-name.vercel.app` (update this AFTER deploying frontend in Step 3) |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for the build and deployment to finish (takes 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://campus-hire-api.onrender.com`
4. Test it by visiting: `https://campus-hire-api.onrender.com/api/health`
   - You should see: `{"success":true,"message":"🚀 Campus Hire API is running!"}`

**Copy your Render URL** — you'll need it in Step 3.

> **Note:** Render free tier spins down after 15 minutes of inactivity. The first request after inactivity takes ~30-50 seconds to wake up. This is normal for free tier.

---

## STEP 3: Deploy Frontend on Vercel

### 3.1 Go to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Connect your **GitHub account** if not already connected
4. Import the **Campus-hire** repository

### 3.2 Configure the Project
Set these values in the configuration screen:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` (Vercel auto-detects this) |
| **Root Directory** | `./ ` (leave as default — the frontend is at the root) |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

### 3.3 Add Environment Variable
In the **"Environment Variables"** section, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://campus-hire-api.onrender.com/api` |

> **Important:** Replace `campus-hire-api` with your actual Render service name from Step 2.4. The URL must end with `/api`.

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (takes 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://campus-hire.vercel.app`
4. Visit your URL — you should see the login page!

**Copy your Vercel URL** — you need it for Step 4.

---

## STEP 4: Update Backend CORS (Critical!)

Now that you have your Vercel URL, go back to Render and update the `FRONTEND_URL`:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **campus-hire-api** service
3. Go to **"Environment"** tab
4. Update the `FRONTEND_URL` value to your Vercel URL:
   ```
   https://campus-hire.vercel.app
   ```
   (Replace with your actual Vercel URL — **NO trailing slash**)
5. Click **"Save Changes"**
6. Render will automatically redeploy with the new value

---

## STEP 5: Verify Everything Works

1. Open your Vercel URL (e.g., `https://campus-hire.vercel.app`)
2. Try to **Register** a new account
3. Try to **Login** with that account
4. Navigate through different pages to confirm routes work
5. If something fails, check the browser console (F12 → Console tab) for errors

---

## Troubleshooting

### "Network Error" or API calls failing
- **Check** that `VITE_API_URL` on Vercel points to your Render URL with `/api` at the end
- **Check** that `FRONTEND_URL` on Render matches your Vercel URL exactly (no trailing slash)
- **Check** Render logs: Dashboard → your service → "Logs" tab

### "CORS error" in browser console
- Make sure `FRONTEND_URL` on Render is set to your exact Vercel URL
- The CORS config supports comma-separated origins if you need multiple:
  ```
  https://campus-hire.vercel.app,http://localhost:5173
  ```

### Page shows blank or 404 on refresh
- The `vercel.json` file handles SPA rewrites. Make sure it's committed and pushed.

### Render deploy fails
- Check that `Root Directory` is set to `server`
- Check Render build logs for the exact error
- Ensure `package-lock.json` exists in the `server/` folder (it was generated)

### MongoDB connection error
- Check your `MONGODB_URI` is correct with the right password
- Ensure Network Access is set to `0.0.0.0/0` (allow all) in Atlas
- Check your database user credentials

### Render free tier is slow
- First request after inactivity takes ~30-50 seconds (cold start)
- This is a limitation of the free tier. For production, consider upgrading to a paid instance ($7/month)

---

## File Changes Summary

Here's what was added/modified for deployment:

| File | Purpose |
|---|---|
| `vercel.json` | SPA rewrite rules so React Router works on Vercel |
| `render.yaml` | Render Blueprint spec (optional — for automatic config) |
| `.env.example` | Reference for frontend environment variables |
| `server/.env.example` | Reference for backend environment variables |
| `.gitignore` | Fixed: no longer ignores `package-lock.json` |
| `server/server.js` | Updated CORS to support multiple origins |
| `package-lock.json` | Generated (required by Vercel) |
| `server/package-lock.json` | Generated (required by Render) |

---

## Environment Variables Quick Reference

### Vercel (Frontend)
| Variable | Example Value |
|---|---|
| `VITE_API_URL` | `https://campus-hire-api.onrender.com/api` |

### Render (Backend)
| Variable | Example Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/campus-hire` |
| `JWT_SECRET` | `myRandomSecretString123!` |
| `JWT_EXPIRE` | `7d` |
| `JWT_COOKIE_EXPIRE` | `7` |
| `FRONTEND_URL` | `https://campus-hire.vercel.app` |

---

## Custom Domain (Optional)

### Vercel
1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `campushire.com`)
3. Update DNS records as instructed by Vercel

### Render
1. Go to your service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `api.campushire.com`)
3. Update DNS records as instructed by Render
4. Update `VITE_API_URL` on Vercel to use the new API domain
