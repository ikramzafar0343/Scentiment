# Render Deployment Configuration

## Frontend Service Configuration

### Option 1: Web Service (Current - Uses vite preview)

**Service Type:** Web Service  
**Environment:** Node.js

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start
```

This uses `vite preview` which:
- ✅ Serves production build (optimized)
- ✅ Lower memory usage than dev server
- ✅ Production-ready performance
- ✅ Works on port 10000

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `VITE_API_BASE_URL` = `https://scentiment-backend.onrender.com/api/v1`

### Option 2: Static Site (Alternative - No server needed)

If you want to use a static site (no Node.js server):

**Service Type:** Static Site

**Build Command:**
```
npm install && npm run build
```

**Publish Directory:**
```
dist
```

**No Start Command Needed** - Render serves files directly from CDN

**Environment Variables:**
- `VITE_API_BASE_URL` = `https://scentiment-backend.onrender.com/api/v1`

**SPA Routing:**
- Add rewrite rule: `/*` → `/index.html`

## Current Setup

The `render.yaml` is configured for **Web Service** using `vite preview`:
- Builds the production bundle
- Serves it with `vite preview --port 10000 --host`
- Lower memory usage than dev server
- Production-ready

## Memory Optimization

The `vite preview` server:
- Uses pre-built static files (no compilation)
- Minimal memory footprint
- Fast response times
- Suitable for production

## Verification

After deployment, check:
1. ✅ Build completes successfully
2. ✅ Start command runs `npm run start` (vite preview)
3. ✅ No `npm run dev` in logs
4. ✅ Service stays within memory limits
5. ✅ Application accessible on assigned URL
