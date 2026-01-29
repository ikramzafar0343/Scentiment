# Scentiment Backend API

A NestJS-based REST API for the Scentiment e-commerce platform.

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis (Optional)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Then start MongoDB and Redis (see SETUP.md)

# Start development server
npm run start:dev
```

## 📚 Documentation

- **Setup Guide:** [SETUP.md](./SETUP.md)
- **API Docs:** http://localhost:3000/api/docs (when server is running)

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev    # Start with hot reload

# Production
npm run build        # Build for production
npm run start:prod   # Start production server

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run e2e tests
npm run test:cov     # Test coverage

# Code Quality
npm run lint         # Lint code
npm run format       # Format code
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── products/      # Products module
│   ├── users/         # Users module
│   ├── redis/         # Redis cache module
│   ├── health/        # Health check endpoints
│   ├── app.module.ts  # Root module
│   └── main.ts        # Application entry point
├── test/              # E2E tests
├── .env.example       # Environment variables template
├── SETUP.md           # Detailed setup guide
└── package.json
```

## 🔧 Configuration

### Required Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/scentiment
JWT_SECRET=your-secret-key
```

### Optional Environment Variables

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

See [SETUP.md](./SETUP.md) for complete configuration guide.

## 🐛 Troubleshooting

Common issues and solutions:

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- See [SETUP.md](./SETUP.md#mongodb-connection-errors)

### Redis Connection Failed
- Redis is optional - app uses in-memory cache as fallback
- See [SETUP.md](./SETUP.md#redis-connection-errors)

### Port Already in Use
- Change `PORT` in `.env` or kill the process using port 3000

## 📝 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Products
- `GET /products` - List products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

See Swagger UI at `/api/docs` for complete API documentation.

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Helmet security headers
- Input validation with class-validator

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Docker

```bash
docker build -t scentiment-backend .
docker run -p 3000:3000 --env-file .env scentiment-backend
```

### PM2

```bash
npm run build
pm2 start dist/main.js --name scentiment-backend
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Submit a pull request

## 📄 License

Private - All rights reserved

## 🆘 Support

For setup help, see [SETUP.md](./SETUP.md)

For API documentation, visit http://localhost:3000/api/docs
