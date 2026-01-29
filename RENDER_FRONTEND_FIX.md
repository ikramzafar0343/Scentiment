# Fix: Frontend Running as Web Service Instead of Static Site

## Problem
Render is trying to run your frontend as a web service (`npm run dev`) instead of serving it as a static site. This causes:
- Out of memory errors
- Port detection issues
- Wrong service type

## Root Cause
The service was likely created as a **web service** before the `render.yaml` was fixed. Render doesn't automatically change service types - you must delete and recreate.

## Solution: Delete and Recreate Service

### Step 1: Delete Existing Service

1. Go to Render Dashboard: https://dashboard.render.com/
2. Find `scentiment-frontend` service
3. Click on it
4. Go to **Settings** (top right)
5. Scroll to **"Danger Zone"** at the bottom
6. Click **"Delete Service"**
7. Confirm deletion

### Step 2: Recreate as Static Site

**Option A: Let Blueprint Recreate It (Recommended)**

1. After deleting, go to your **Blueprint**
2. Click **"Manual Deploy"** or wait for auto-deploy
3. Render will recreate it as a static site from `render.yaml`

**Option B: Create Manually**

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect your Git repository
3. Configure:
   - **Name:** `scentiment-frontend`
   - **Branch:** `main`
   - **Root Directory:** (leave empty - root of repo)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Click **"Create Static Site"**
5. Set Environment Variable:
   - Go to **Environment** tab
   - Add: `VITE_API_BASE_URL` = `https://scentiment-backend.onrender.com/api/v1`
     (Replace with your actual backend URL)
6. Enable SPA Routing:
   - Go to **Settings** → **Redirects/Rewrites**
   - Add rewrite:
     - **Source:** `/*`
     - **Destination:** `/index.html`

## Verify It's Working

After recreating, check the logs. You should see:
- ✅ Build command runs: `npm install && npm run build`
- ✅ Files uploaded from `dist` directory
- ✅ **NO** `npm run dev` command
- ✅ **NO** port detection
- ✅ **NO** memory errors

## Important Notes

- **Static sites don't run servers** - they just serve files
- **No start command needed** - Render serves the built files automatically
- **No ports needed** - static sites use Render's CDN
- **Free tier** - static sites are always free on Render

## If It Still Doesn't Work

1. Check service type in Render dashboard - should say "Static Site"
2. Verify `render.yaml` has `type: static` (not `type: web`)
3. Make sure `publishPath` is `./dist` (not `staticPublishPath`)
4. Contact Render support if issues persist
