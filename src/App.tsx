import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Contact } from './pages/Contact';
import { NewArrivals } from './pages/NewArrivals';
import { ScentVoyage } from './pages/ScentVoyage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          
          {/* New Arrivals Routes */}
          <Route path="/collections/new" element={<NewArrivals />} />
          <Route path="/new" element={<NewArrivals />} />

          {/* Specials / Sale Routes */}
          <Route path="/collections/specials" element={<NewArrivals />} />
          <Route path="/sale" element={<NewArrivals />} />

          {/* Scent Diffusers Routes */}
          <Route path="/collections/scent-diffusers" element={<NewArrivals />} />
          <Route path="/diffusers" element={<NewArrivals />} />

          {/* Fragrance Oils Routes */}
          <Route path="/collections/fragrance-oils" element={<NewArrivals />} />
          <Route path="/oils" element={<NewArrivals />} />

          {/* Room Sprays Routes */}
          <Route path="/collections/fragrance-room-sprays" element={<NewArrivals />} />
          <Route path="/sprays" element={<NewArrivals />} />

          {/* Candles Routes */}
          <Route path="/collections/candles" element={<NewArrivals />} />
          <Route path="/candles" element={<NewArrivals />} />

          {/* Perfumes Routes */}
          <Route path="/collections/perfumes" element={<NewArrivals />} />
          <Route path="/perfumes" element={<NewArrivals />} />

          {/* Scent Voyage Routes */}
          <Route path="/collection/voyage" element={<ScentVoyage />} />
          <Route path="/collections/scent-voyage" element={<ScentVoyage />} />
          <Route path="/pages/scent-voyage" element={<ScentVoyage />} />
          
          <Route path="/contact" element={<Contact />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
