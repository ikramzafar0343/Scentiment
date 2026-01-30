# AROMAZUR Frontend

**Les Parfums de la Côte d'Azur**

Frontend application for the AROMAZUR e-commerce platform.

## 🚀 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v7

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file** (optional for local dev)
   ```bash
   # Create .env file in frontend directory
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

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── lib/            # Utility functions
│   └── assets/         # Static assets
├── public/             # Public assets
└── dist/               # Build output
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
