# Render Deployment Setup Guide

## ⚠️ Billing Suspended Error Fix

If you're seeing "billing_suspended" errors, you need to set up billing in your Render account, even for free tier services.

### Steps to Fix:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Click on your account settings (top right)

2. **Set Up Billing**
   - Go to "Billing" section
   - Add a payment method (credit card)
   - **Note:** Free tier services won't charge you, but Render requires a payment method on file
   - Free tier includes:
     - Web services (spins down after 15 min inactivity)
     - Static sites (always free)

3. **Verify Account**
   - Make sure your account email is verified
   - Check that billing is active (not suspended)

4. **Redeploy**
   - After billing is set up, try deploying again
   - The blueprint should work now

## Alternative: Manual Service Creation

If the blueprint still doesn't work, create services manually:

### Backend Service (Manual)

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** `scentiment-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm run start:prod`
   - **Plan:** Free (or Starter if you want)

4. Set Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `HOST` = `0.0.0.0`
   - `MONGODB_URI` = (your MongoDB connection string)
   - `JWT_SECRET` = (generate with: `openssl rand -base64 32`)
   - `JWT_REFRESH_SECRET` = (generate with: `openssl rand -base64 32`)
   - `JWT_EXPIRATION` = `1h`
   - `JWT_REFRESH_EXPIRATION` = `7d`
   - `FRONTEND_URL` = (set after frontend is deployed)

### Frontend Service (Manual)

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name:** `scentiment-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Set Environment Variables:
   - `VITE_API_BASE_URL` = `https://scentiment-backend.onrender.com/api/v1`
     (Replace with your actual backend URL)

5. Enable SPA Routing:
   - In "Advanced" settings, add rewrite rule:
     - Source: `/*`
     - Destination: `/index.html`

## Free Tier Limitations

- **Backend:** Spins down after 15 minutes of inactivity
  - First request after spin-down may take 30-60 seconds
  - Consider upgrading to Starter plan ($7/month) for always-on service

- **Frontend:** Always available, no limitations

## Troubleshooting

### Still Getting Billing Errors?

1. Check your Render account status
2. Verify payment method is active
3. Try creating services manually instead of using blueprint
4. Contact Render support if issues persist

### Backend Not Starting?

1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Review backend logs for errors

### Frontend Can't Connect to Backend?

1. Verify `VITE_API_BASE_URL` includes `/api/v1`
2. Check backend service is running
3. Verify CORS settings in backend allow frontend URL
4. Check browser console for CORS errors
