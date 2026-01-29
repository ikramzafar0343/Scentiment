# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy example env file (if not exists)
cp .env.example .env

# Edit .env and set at minimum:
# MONGODB_URI=mongodb://localhost:27017/scentiment
# JWT_SECRET=your-secret-key-here
```

### Step 3: Start MongoDB

**Windows:**
- MongoDB should auto-start if installed as service
- Or use MongoDB Compass (auto-starts MongoDB)
- Or manually: `mongod` in MongoDB bin folder

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Docker (All Platforms):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Start Redis (Optional)
Redis is optional - app works without it using in-memory cache.

**Docker (Easiest):**
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

**macOS:**
```bash
brew services start redis
```

### Step 5: Start Backend
```bash
npm run start:dev
```

### ✅ Verify It Works

- **API:** http://localhost:3000/api/v1/health
- **Docs:** http://localhost:3000/api/docs

## 🐛 Common Issues

**MongoDB Connection Failed?**
- Make sure MongoDB is running
- Check `.env` has correct `MONGODB_URI`
- Try: `mongosh` to test MongoDB connection

**Redis Errors?**
- These are harmless - app uses in-memory cache
- Or start Redis: `docker run -d -p 6379:6379 redis`

**Port 3000 in use?**
- Change `PORT=3001` in `.env`

## 📖 Full Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions.
