# Scentiment

A modern full-stack e-commerce application for luxury home fragrances and perfumes, built with React, Vite, and NestJS.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with Mongoose
- **Cache:** [Redis](https://redis.io/) (Optional)
- **Authentication:** JWT with Passport
- **API Documentation:** Swagger/OpenAPI
- **Payment Processing:** Stripe (Optional)

## ✨ Features

- **Responsive Design:** Fully responsive UI for desktop, tablet, and mobile
- **Dynamic Collections:**
  - Diffusers
  - Fragrance Oils
  - Room Sprays
  - Candles
  - Perfumes
- **Shopping Cart:** Persistent cart state management using Zustand
- **Product Management:** Full CRUD operations for products
- **Seller Dashboard:** Analytics, inventory management, and order tracking
- **User Authentication:** Secure JWT-based authentication
- **Payment Integration:** Stripe payment processing
- **API Documentation:** Swagger UI for API exploration

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or MongoDB Atlas)
- Redis (Optional, for caching)

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file** (optional for local dev)
   ```bash
   # Create .env file in root directory
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env (if exists) or create .env file
   # Required variables:
   MONGODB_URI=mongodb://localhost:27017/scentiment
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   
   # Optional variables:
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   REDIS_URL=redis://localhost:6379
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services
   ```

5. **Start Redis** (optional, if using)
   ```bash
   # macOS (with Homebrew)
   brew services start redis
   
   # Linux
   sudo systemctl start redis
   
   # Windows
   # Start Redis service
   ```

6. **Seed admin account** (optional)
   ```bash
   npm run seed:admin
   ```

7. **Start development server**
   ```bash
   npm run start:dev
   ```

8. **Access API documentation**
   - Swagger UI: http://localhost:3000/api/v1/docs
   - Health Check: http://localhost:3000/api/v1/health

For detailed backend setup instructions, see [backend/README.md](./backend/README.md) and [backend/SETUP.md](./backend/SETUP.md).

## 📦 Deployment on Render

This project is configured for deployment on [Render](https://render.com/) with a `render.yaml` blueprint.

### Prerequisites

1. **MongoDB Database**
   - Create a MongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)
   - Or use Render's MongoDB service
   - Get your connection string (MONGODB_URI)

2. **Redis** (Optional)
   - Create a Redis instance on Render or use an external service
   - Get your Redis URL

3. **Stripe Account** (Optional, for payments)
   - Create a Stripe account and get your secret key

### Deployment Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will detect `render.yaml` automatically

3. **Configure Environment Variables**

   In the Render dashboard, set the following environment variables for the **backend** service:

   **Required:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (generate with: `openssl rand -base64 32`)
   - `JWT_REFRESH_SECRET` - Another secure random string

   **Optional:**
   - `REDIS_URL` - Your Redis connection URL (if using Redis)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (if using payments)
   - `JWT_EXPIRATION` - JWT token expiration (default: `1h`)
   - `JWT_REFRESH_EXPIRATION` - Refresh token expiration (default: `7d`)

   **For Frontend Service:**
   - `VITE_API_BASE_URL` - **REQUIRED** - Set this to your backend URL + `/api/v1`
     - Example: `https://scentiment-backend.onrender.com/api/v1`
     - **Important:** You must set this manually in the Render dashboard after the backend is deployed
     - Get your backend URL from the backend service's "Settings" → "Info" section
   
   **For Backend Service:**
   - `FRONTEND_URL` - **REQUIRED** - Set this to your frontend URL
     - Example: `https://scentiment-frontend.onrender.com`
     - Used for CORS configuration
     - Set this after the frontend is deployed

4. **Deploy**
   - Render will automatically build and deploy both services
   - The backend will be available at: `https://scentiment-backend.onrender.com`
   - The frontend will be available at: `https://scentiment-frontend.onrender.com`
   - API Documentation: `https://scentiment-backend.onrender.com/api/v1/docs`

### Render Configuration Details

The `render.yaml` file configures:

- **Backend Service:**
  - Type: Web Service (Node.js)
  - Build: `cd backend && npm install && npm run build`
  - Start: `cd backend && npm run start:prod`
  - Port: 10000 (Render's default)

- **Frontend Service:**
  - Type: Static Site
  - Build: `npm install && npm run build`
  - Publish: `./dist` directory
  - SPA Routing: All routes rewrite to `/index.html`

### Post-Deployment

1. **Access Your Application**
   - Frontend: Your frontend service URL
   - Backend API: Your backend service URL
   - API Docs: `https://your-backend-url.onrender.com/api/v1/docs`

2. **Seed Admin Account** (if needed)
   - SSH into your backend service or use Render's shell
   - Run: `npm run seed:admin`

3. **Verify Health**
   - Check: `https://your-backend-url.onrender.com/api/v1/health`

## 📂 Project Structure

```
scentiment/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route components
│   ├── features/           # Feature modules
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── store/              # Zustand stores
│   ├── configs/            # Configuration files
│   └── lib/                # Utilities
├── backend/                # Backend source code
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/        # Products module
│   │   ├── orders/         # Orders module
│   │   ├── analytics/      # Analytics module
│   │   ├── payments/       # Payment processing
│   │   └── main.ts         # Application entry
│   └── package.json
├── public/                 # Static assets
├── dist/                  # Frontend build output
├── render.yaml            # Render deployment config
└── README.md              # This file
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb://localhost:27017/scentiment
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Optional
PORT=3000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
```

## 🧪 Testing

### Frontend
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
```

### Backend
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

## 📚 API Documentation

When the backend is running, access Swagger UI at:
- Local: http://localhost:3000/api/v1/docs
- Production: `https://your-backend-url.onrender.com/api/v1/docs`

## 🔒 Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation with class-validator
- Environment variable protection

## 🐛 Troubleshooting

### Frontend Issues

**Products not showing:**
- Check that `VITE_API_BASE_URL` points to your backend
- Verify backend is running and accessible
- Check browser console for errors

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

### Backend Issues

**MongoDB connection failed:**
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (local) or accessible (Atlas)
- Ensure network access is allowed (for Atlas)

**Port already in use:**
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:3000 | xargs kill` (macOS/Linux)

**Redis connection failed:**
- Redis is optional - app uses in-memory cache as fallback
- Only set `REDIS_URL` if you have Redis running

See [backend/SETUP.md](./backend/SETUP.md) for more troubleshooting.

## 📝 Available Scripts

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run test         # Run tests
```

### Backend
```bash
cd backend
npm run start:dev    # Start with hot reload
npm run build        # Build for production
npm run start:prod   # Start production server
npm run seed:admin   # Seed admin account
npm run lint         # Lint code
npm run test         # Run tests
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Backend Setup:** See [backend/SETUP.md](./backend/SETUP.md)
- **API Documentation:** Visit `/api/v1/docs` when backend is running
- **Issues:** Check existing issues or create a new one

---

Built with ❤️ using React, NestJS, and modern web technologies.
