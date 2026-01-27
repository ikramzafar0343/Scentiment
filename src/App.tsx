import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Contact } from './pages/Contact';
import { NewArrivals } from './pages/NewArrivals';
import { ScentVoyage } from './pages/ScentVoyage';
import { Candles } from './pages/Candles';
import { Perfumes } from './pages/Perfumes';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui/motion/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/category/:slug" element={<PageTransition><Shop /></PageTransition>} />
        
        {/* New Arrivals Routes */}
        <Route path="/collections/new" element={<PageTransition><NewArrivals /></PageTransition>} />
        <Route path="/new" element={<PageTransition><NewArrivals /></PageTransition>} />

        {/* Specials / Sale Routes */}
        <Route path="/collections/specials" element={<PageTransition><NewArrivals /></PageTransition>} />
        <Route path="/sale" element={<PageTransition><NewArrivals /></PageTransition>} />

        {/* Scent Diffusers Routes */}
        <Route path="/collections/scent-diffusers" element={<PageTransition><NewArrivals /></PageTransition>} />
        <Route path="/diffusers" element={<PageTransition><NewArrivals /></PageTransition>} />

        {/* Fragrance Oils Routes */}
        <Route path="/collections/fragrance-oils" element={<PageTransition><NewArrivals /></PageTransition>} />
        <Route path="/oils" element={<PageTransition><NewArrivals /></PageTransition>} />

        {/* Room Sprays Routes */}
        <Route path="/collections/fragrance-room-sprays" element={<PageTransition><NewArrivals /></PageTransition>} />
        <Route path="/sprays" element={<PageTransition><NewArrivals /></PageTransition>} />

        {/* Candles Routes */}
        <Route path="/collections/candles" element={<PageTransition><Candles /></PageTransition>} />
        <Route path="/candles" element={<PageTransition><Candles /></PageTransition>} />

        {/* Perfumes Routes */}
        <Route path="/collections/perfumes" element={<PageTransition><Perfumes /></PageTransition>} />
        <Route path="/perfumes" element={<PageTransition><Perfumes /></PageTransition>} />

        {/* Scent Voyage Routes */}
        <Route path="/collection/voyage" element={<PageTransition><ScentVoyage /></PageTransition>} />
        <Route path="/collections/scent-voyage" element={<PageTransition><ScentVoyage /></PageTransition>} />
        <Route path="/pages/scent-voyage" element={<PageTransition><ScentVoyage /></PageTransition>} />
        
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        {/* Fallback route */}
        <Route path="*" element={<PageTransition><Home /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
