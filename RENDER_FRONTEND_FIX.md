# Fix: Frontend Running as Web Service Instead of Static Site

## Problem
Render is trying to run your frontend as a web service (`npm run dev`) instead of serving it as a static site. This causes:
- Out of memory errors
- Port detection issues
- Wrong service type

## Solution

### Option 1: Delete and Recreate (Recommended)

1. **Delete the existing frontend service:**
   - Go to Render Dashboard
   - Find `scentiment-frontend` service
   - Click "Settings" → Scroll down → "Delete Service"

2. **Redeploy from Blueprint:**
   - Go to your Blueprint
   - Click "Manual Deploy" or wait for auto-deploy
   - Render will create it as a static site this time

### Option 2: Manually Change Service Type

1. **Go to Frontend Service Settings:**
   - Render Dashboard → `scentiment-frontend` → Settings

2. **Change Service Type:**
   - Scroll to "Service Details"
   - You can't directly change type, but you can:
     - Delete the service
     - Create new "Static Site" manually
     - Or redeploy from blueprint

### Option 3: Create Static Site Manually

1. **Delete the web service version:**
   - Delete `scentiment-frontend` web service

2. **Create New Static Site:**
   - Render Dashboard → "New +" → "Static Site"
   - Connect your repository
   - Configure:
     - **Name:** `scentiment-frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
   
3. **Set Environment Variable:**
   - `VITE_API_BASE_URL` = `https://scentiment-backend.onrender.com/api/v1`
     (Replace with your actual backend URL)

4. **Enable SPA Routing:**
   - In "Advanced" → "Redirects/Rewrites"
   - Add rewrite rule:
     - Source: `/*`
     - Destination: `/index.html`

## Verify It's Working

After fixing, the static site should:
- ✅ Build successfully
- ✅ Serve files from `dist` directory
- ✅ Not run `npm run dev`
- ✅ Not require ports
- ✅ Not use memory for a dev server

## Current render.yaml (Correct)

The `render.yaml` is already correct with `type: static`. The issue is that Render created the service as a web service before the fix. You need to delete and recreate it.
