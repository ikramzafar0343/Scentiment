# CORS Error Fix

## Problem

The frontend deployed at `https://scentiment-9zi3.onrender.com` is:
1. Trying to access `http://localhost:3000` (wrong - should use production backend)
2. Getting blocked by CORS because backend only allows `http://localhost:5173`

## Root Causes

1. **Frontend Environment Variable Not Set**: `VITE_API_BASE_URL` is not configured in Render, so it falls back to `http://localhost:3000`
2. **Backend CORS Too Restrictive**: Only allows a single origin instead of multiple (dev + production)

## Fixes Applied

### 1. Backend CORS Configuration ✅

Updated `backend/src/main.ts` to:
- Allow multiple origins (localhost for dev, production URL)
- Support both development and production environments
- Properly handle CORS preflight requests

### 2. Frontend Environment Variable ⚠️ **ACTION REQUIRED**

You need to set `VITE_API_BASE_URL` in Render dashboard:

1. Go to Render Dashboard → `scentiment-frontend` service
2. Go to **Environment** tab
3. Add/Update environment variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://scentiment-backend.onrender.com/api/v1`
     (Replace `scentiment-backend` with your actual backend service name)
4. **Save** and **Redeploy** the frontend service

### 3. Backend Environment Variable ⚠️ **ACTION REQUIRED**

Set `FRONTEND_URL` in backend service:

1. Go to Render Dashboard → `scentiment-backend` service
2. Go to **Environment** tab
3. Add/Update environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://scentiment-9zi3.onrender.com`
     (Your actual frontend URL)
4. **Save** and **Redeploy** the backend service

## Verification

After setting environment variables and redeploying:

1. ✅ Frontend should call: `https://scentiment-backend.onrender.com/api/v1/auth/login`
2. ✅ Backend should allow CORS from: `https://scentiment-9zi3.onrender.com`
3. ✅ No more CORS errors in browser console
4. ✅ Login/API calls should work

## Quick Checklist

- [ ] Backend code updated (CORS allows multiple origins) ✅
- [ ] Frontend `VITE_API_BASE_URL` set in Render ⚠️
- [ ] Backend `FRONTEND_URL` set in Render ⚠️
- [ ] Both services redeployed
- [ ] Test login/API calls work
