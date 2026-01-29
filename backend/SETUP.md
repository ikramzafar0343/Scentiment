# Backend Setup Guide

This guide will help you set up and run the Scentiment backend server.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (Optional, but recommended) - [Download](https://redis.io/download)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/scentiment

# Redis Configuration (Optional)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Start MongoDB

#### Windows

**Option A: MongoDB as a Service (Recommended)**
- MongoDB should start automatically if installed as a Windows service
- Check if it's running: Open Services (`services.msc`) and look for "MongoDB"

**Option B: Manual Start**
```bash
# Navigate to MongoDB bin directory (usually)
cd "C:\Program Files\MongoDB\Server\<version>\bin"
mongod.exe
```

**Option C: Using MongoDB Compass**
- Install [MongoDB Compass](https://www.mongodb.com/products/compass)
- It will automatically start MongoDB when you connect

#### macOS

```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

#### Linux

```bash
# Using systemd
sudo systemctl start mongod

# Or manually
sudo mongod --config /etc/mongod.conf
```

#### Docker (All Platforms)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Start Redis (Optional)

Redis is optional - the application will use in-memory caching if Redis is unavailable.

#### Windows

**Option A: Using WSL (Windows Subsystem for Linux)**
```bash
wsl
sudo apt-get update
sudo apt-get install redis-server
redis-server
```

**Option B: Using Memurai (Windows Redis Alternative)**
- Download from [Memurai](https://www.memurai.com/)
- Install and start the service

**Option C: Docker**
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

#### macOS

```bash
# Using Homebrew
brew install redis
brew services start redis

# Or manually
redis-server
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# Or manually
redis-server
```

#### Docker (All Platforms)

```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

### 5. Verify Services

**Check MongoDB:**
```bash
# Windows
mongosh

# macOS/Linux
mongosh

# Or using MongoDB Compass GUI
```

**Check Redis:**
```bash
redis-cli ping
# Should return: PONG
```

### 6. Start the Backend Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server should start on `http://localhost:3000`

### 7. Verify Installation

- **API Health Check:** http://localhost:3000/api/v1/health
- **API Documentation:** http://localhost:3000/api/docs
- **API Base URL:** http://localhost:3000/api/v1

## Troubleshooting

### MongoDB Connection Errors

**Error: `ECONNREFUSED ::1:27017`**

This means MongoDB is not running. Solutions:

1. **Start MongoDB:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Check MongoDB is listening:**
   ```bash
   # Windows
   netstat -an | findstr 27017
   
   # macOS/Linux
   lsof -i :27017
   ```

3. **Verify MongoDB URI in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/scentiment
   ```

4. **Use MongoDB Atlas (Cloud):**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Update `.env`:
     ```env
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scentiment
     ```

### Redis Connection Errors

**Error: `ECONNREFUSED` for Redis**

Redis errors are **non-critical** - the app will use in-memory caching instead.

To fix:

1. **Start Redis:**
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis-server
   
   # Docker
   docker start redis
   ```

2. **Or disable Redis in `.env`:**
   ```env
   # Leave empty to use in-memory cache
   REDIS_URL=
   REDIS_HOST=
   REDIS_PORT=
   ```

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::3000`**

```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change the port in `.env`:
```env
PORT=3001
```

### Mongoose Warning: `isNew` is reserved

This is a **warning, not an error**. The schema already suppresses this warning with `suppressReservedKeysWarning: true`. The application will work fine.

If you want to remove the warning completely, you can rename the field in the schema from `isNew` to `isNewProduct`, but this requires a database migration.

## Development Workflow

### Running in Development Mode

```bash
npm run start:dev
```

- Auto-reloads on file changes
- Detailed error messages
- TypeScript compilation in watch mode

### Building for Production

```bash
npm run build
npm run start:prod
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

Once the server is running, visit:

- **Swagger UI:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000/api/v1/health

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment (development/production) |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL for CORS |
| `MONGODB_URI` | **Yes** | - | MongoDB connection string |
| `REDIS_URL` | No | - | Redis connection URL (optional) |
| `REDIS_HOST` | No | `127.0.0.1` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration |

## Database Setup

### Initial Data (Optional)

You can seed the database with initial data:

```bash
# Create a seed script in src/scripts/seed.ts
# Then run:
npm run seed
```

## Production Deployment

### Using Docker

```bash
# Build image
docker build -t scentiment-backend .

# Run container
docker run -p 3000:3000 --env-file .env scentiment-backend
```

### Using PM2

```bash
npm install -g pm2
npm run build
pm2 start dist/main.js --name scentiment-backend
```

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Documentation](http://localhost:3000/api/docs)
3. Check MongoDB and Redis logs
4. Review backend logs in the console

## Next Steps

- ✅ Backend server running
- ✅ MongoDB connected
- ✅ Redis connected (optional)
- ✅ API accessible at http://localhost:3000/api/v1
- ✅ Frontend can connect to backend

Now you can:
- Test API endpoints using Swagger UI
- Connect your frontend to the backend
- Start developing features!
