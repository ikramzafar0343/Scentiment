# Scentiment

A modern e-commerce application for luxury home fragrances and perfumes, built with React and Vite.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)

## ✨ Features

- **Responsive Design:** Fully responsive UI for desktop, tablet, and mobile.
- **Dynamic Collections:**
  - Diffusers
  - Fragrance Oils
  - Room Sprays
  - Candles
  - Perfumes
- **Shopping Cart:** Persistent cart state management using Zustand.
- **Product Filtering:** Category-based product filtering logic.
- **Modern UI Components:** Custom-built components for Product Cards, Mega Menus, and Layouts.

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd scentiment
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📦 Deployment

This project is configured for deployment on [Render](https://render.com/).

### Render Configuration (`render.yaml`)
A `render.yaml` file is included to automate the deployment process.

- **Service Type:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Routing:** Rewrites all routes to `index.html` (SPA support)

To deploy:
1.  Push your code to a Git repository (GitHub/GitLab).
2.  Connect your repository to Render.
3.  Render will automatically detect the `render.yaml` blueprint.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Layout, UI, etc.)
├── lib/           # Utilities and static data (data.ts)
├── pages/         # Route components (Home, Shop, NewArrivals, etc.)
├── store/         # Global state management (Zustand stores)
├── App.tsx        # Main application component & Routing
└── main.tsx       # Entry point
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
