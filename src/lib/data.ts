export const SAMPLE_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop';

export const PRODUCTS = [
  {
    id: 'air-2-kit',
    name: 'Diffuser Air 2 Discovery Kit',
    price: 74.74,
    originalPrice: 213.59,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Covers up to 1,000 sq ft. Includes Top 3 Hotel Scents',
    rating: 5,
    reviews: 455,
    badge: 'SALE',
    saveAmount: 138,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'air-2',
    name: 'Diffuser Air 2',
    price: 59.99,
    originalPrice: 200.00,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Covers up to 1,000 sqft. Pairs 120 mL Fragrance Oil',
    rating: 5,
    reviews: 320,
    badge: 'SALE',
    saveAmount: 140,
    variants: ['Black', 'Silver', 'White', 'Graphite Gold'],
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'mini-2-le-kit',
    name: 'Diffuser Mini 2 LE Discovery Kit',
    price: 64.06,
    originalPrice: 119.61,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Covers 500 sqft. Includes Top 3 Hotel Scents',
    rating: 5,
    reviews: 206,
    badge: 'SALE',
    saveAmount: 55,
    variants: ['Black', 'Silver', 'White', 'Red', 'Space Gray', 'Graphite Gold'],
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'mini-2-le',
    name: 'Diffuser Mini 2 LE',
    price: 29.99,
    originalPrice: 100.00,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Up to 500 sqft coverage. Pairs 20 mL Fragrance Oil',
    rating: 4.9,
    reviews: 150,
    badge: 'SALE',
    saveAmount: 70,
    variants: ['Black', 'Silver', 'White', 'Red', 'Space Gray', 'Graphite Gold'],
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'pro-2',
    name: 'Diffuser Pro 2',
    price: 80.09,
    originalPrice: 512.65,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Covers up to 2,000 sqft. Large Spaces',
    rating: 5,
    reviews: 100,
    badge: 'SALE',
    saveAmount: 432.52,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'hvac-2',
    name: 'Diffuser HVAC 2',
    price: 199.99,
    originalPrice: 800.00,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Covers up to 5,000 sqft. 500 ML Bottle Included',
    rating: 5,
    reviews: 85,
    badge: 'SALE',
    saveAmount: 600,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'car-diffuser-kit',
    name: 'Car Diffuser Discovery Kit',
    price: 38.42,
    originalPrice: 68.35,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Motion Activated Scenting. Includes Top 3 Hotel Scents',
    rating: 5,
    reviews: 40,
    badge: '44% OFF',
    saveAmount: null,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'starter-kit',
    name: 'Scent Diffuser Starter Kit',
    price: 40.00,
    originalPrice: 100.00,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Build Your Custom Kit. Subscribe & Save 70% OFF!',
    rating: 5,
    reviews: 25,
    badge: '64% OFF',
    saveAmount: 60,
    customButtonText: 'Build Your Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'car-diffuser',
    name: 'Car Diffuser',
    price: 39.99,
    originalPrice: 60.00,
    category: 'Diffusers',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Motion Activated Misting',
    rating: 4.8,
    reviews: 112,
    badge: '50% OFF',
    saveAmount: 20,
    variants: ['Black', 'Silver', 'Rose Gold'],
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  // FRAGRANCE OILS
  {
    id: 'diffuser-oil-discovery',
    name: 'Diffuser Oil Discovery Set',
    price: 32.00,
    originalPrice: 60.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Sample hotel, designer or fall best-sellers',
    rating: 5,
    reviews: 850,
    badge: '47% OFF',
    saveAmount: null,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'hotel-scents-discovery',
    name: 'Hotel Scents Discovery Set',
    price: 32.00,
    originalPrice: 60.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by 1 Hotel®, Ritz-Carlton®, Westin® & more. The One, Ocean Breeze, Day Dream',
    rating: 5,
    reviews: 1240,
    badge: '47% OFF',
    saveAmount: null,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'mystery-scent',
    name: 'Mystery Scent',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Feeling lucky? Receive a Best-seller or New Arrival!',
    rating: 4.8,
    reviews: 95,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'designer-scents-discovery',
    name: 'Designer Scents Discovery Set',
    price: 32.00,
    originalPrice: 50.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Baccarat Rouge 540®, Creed® Aventus & 3 others. Brilliance, Royalty, Santal',
    rating: 5,
    reviews: 320,
    badge: '36% OFF',
    saveAmount: null,
    customButtonText: 'Customize your Discovery Kit',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'the-one',
    name: 'The One',
    price: 16.00,
    originalPrice: 20.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by 1 Hotel® Miami Beach. Oud Wood, Leather, Sandalwood',
    rating: 5,
    reviews: 2100,
    badge: '20% OFF',
    saveAmount: null,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    price: 16.00,
    originalPrice: 20.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Ritz-Carlton®. Bergamot, Jasmine, Marine',
    rating: 5,
    reviews: 1800,
    badge: '20% OFF',
    saveAmount: null,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'day-dream',
    name: 'Day Dream',
    price: 16.00,
    originalPrice: 20.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Westin® Hotels. Aloe Vera, Cedar, White Tea',
    rating: 4.9,
    reviews: 1500,
    badge: '20% OFF',
    saveAmount: null,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'hotel-lounge',
    name: 'Hotel Lounge',
    price: 16.00,
    originalPrice: 20.00,
    category: 'Fragrance Oils',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Hilton®. White Tea, Fig, Rose',
    rating: 4.8,
    reviews: 900,
    badge: '20% OFF',
    saveAmount: null,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  // ROOM SPRAYS
  {
    id: 'ocean-breeze-spray',
    name: 'Ocean Breeze Room Spray',
    price: 16.00,
    originalPrice: 30.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by The Ritz-Carlton®. Bergamot, Jasmine, Marine',
    rating: 5,
    reviews: 420,
    badge: '47% OFF',
    saveAmount: 14,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'day-dream-spray',
    name: 'Day Dream Room Spray',
    price: 16.00,
    originalPrice: 29.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Westin® Hotels. Aloe Vera, Cedar, White Tea',
    rating: 5,
    reviews: 350,
    badge: '45% OFF',
    saveAmount: 13,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'amalfi-coast-spray',
    name: 'Amalfi Coast Room Spray',
    price: 16.00,
    originalPrice: 30.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by W Hotels®. Citrus, Lemongrass, Jasmine',
    rating: 4.9,
    reviews: 280,
    badge: '47% OFF',
    saveAmount: 14,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'fresh-rain-spray',
    name: 'Fresh Rain Room Spray',
    price: 16.00,
    originalPrice: 30.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Marriott® Hotels. Jasmine, Grapefruit, Red Currant',
    rating: 4.8,
    reviews: 190,
    badge: '47% OFF',
    saveAmount: 14,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'secret-desires-spray',
    name: 'Secret Desires Room Spray',
    price: 16.00,
    originalPrice: 50.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by ARIA® Las Vegas. Peony, Pomegranate, Vanilla',
    rating: 5,
    reviews: 520,
    badge: '68% OFF',
    saveAmount: 34,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'tropical-paradise-spray',
    name: 'Tropical Paradise Room Spray',
    price: 32.00,
    originalPrice: 50.00,
    category: 'Room Sprays',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Bellagio® Las Vegas. Grapefruit, Green Apple, Musk',
    rating: 4.9,
    reviews: 150,
    badge: '36% OFF',
    saveAmount: 18,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  // CANDLES
  {
    id: 'the-one-candle',
    name: 'The One Candle',
    price: 12.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by 1 Hotel® Miami. Oud Wood, Leather, Sandalwood',
    rating: 5,
    reviews: 620,
    badge: '40% OFF',
    saveAmount: 8,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'mystery-candle',
    name: 'Mystery Candle',
    price: 12.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Feeling lucky? Receive a best-seller or new arrival!',
    rating: 4.8,
    reviews: 140,
    badge: '40% OFF',
    saveAmount: 8,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'ocean-breeze-candle',
    name: 'Ocean Breeze Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Ritz Carlton®. Bergamot, Jasmine, Marine',
    rating: 5,
    reviews: 450,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'amalfi-coast-candle',
    name: 'Amalfi Coast Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by W Hotels®. Bergamot, Lemon, Lemongrass',
    rating: 5,
    reviews: 380,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'day-dream-candle',
    name: 'Day Dream Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Westin® Hotels. Aloe Vera, Cedar, White Tea',
    rating: 4.9,
    reviews: 310,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'secret-desires-candle',
    name: 'Secret Desires Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by ARIA® Las Vegas. Peony, Pomegranate, Vanilla',
    rating: 5,
    reviews: 290,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'brilliance-candle',
    name: 'Brilliance Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Baccarat Rouge 540®. Saffron, Amberwood, Fir Resin',
    rating: 5,
    reviews: 800,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'french-hotel-candle',
    name: 'French Hotel Candle',
    price: 8.00,
    originalPrice: 30.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Hotel Costes® Paris. Amber, Sandalwood, Vanilla',
    rating: 5,
    reviews: 150,
    badge: '73% OFF',
    saveAmount: 22,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'santal-candle',
    name: 'Santal Candle',
    price: 8.00,
    originalPrice: 20.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Le Labo® Santal 33. Cardamom, Iris, Violet',
    rating: 5,
    reviews: 420,
    badge: '60% OFF',
    saveAmount: 12,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'candle-care-kit',
    name: 'Candle Care Kit',
    price: 8.00,
    originalPrice: 40.00,
    category: 'Candles',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Essential tools for candle maintenance. Wick Trimmer, Dipper, Snuffer.',
    rating: 5,
    reviews: 85,
    badge: '80% OFF',
    saveAmount: 32,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  // PERFUMES
  {
    id: 'womens-fragrance-discovery',
    name: "Women's Fragrance Discovery Set",
    price: 40.00,
    originalPrice: 150.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Sample our best-selling perfumes. Includes 5 luxury scents.',
    rating: 5,
    reviews: 320,
    badge: '73% OFF',
    saveAmount: 110,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'cherry-perfume',
    name: 'Cherry',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Tom Ford® Lost Cherry. Bitter Almond, Black Cherry, Cherry Liqueur',
    rating: 5,
    reviews: 210,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'brilliance-perfume',
    name: 'Brilliance',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Baccarat Rouge 540®. Saffron, Amberwood, Fir Resin',
    rating: 5,
    reviews: 850,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'addictive-perfume',
    name: 'Addictive',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by YSL® Black Opium. Coffee, Vanilla, White Flowers',
    rating: 4.9,
    reviews: 180,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'royalty-perfume',
    name: 'Royalty',
    price: 32.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Creed® Aventus. Apple, Pineapple, Bergamot',
    rating: 5,
    reviews: 620,
    badge: '36% OFF',
    saveAmount: 18,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'diamond-perfume',
    name: 'Diamond',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Baccarat Rouge 540® Extrait. Almond, Saffron, Ambergris',
    rating: 5,
    reviews: 410,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'savage-perfume',
    name: 'Savage',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Dior® Sauvage. Mandarin, Citrus, Sandalwood',
    rating: 4.8,
    reviews: 550,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'oud-perfume',
    name: 'Oud',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Tom Ford® Oud Wood. Oud Wood, Sandalwood, Cardamom',
    rating: 5,
    reviews: 300,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sky-perfume',
    name: 'Sky',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Dolce & Gabbana® Light Blue. Sicilian Lemon, Apple, Cedar',
    rating: 4.9,
    reviews: 280,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'love-potion-perfume',
    name: 'Love Potion',
    price: 24.00,
    originalPrice: 50.00,
    category: 'Perfumes',
    image: SAMPLE_PRODUCT_IMAGE,
    description: 'Inspired by Killian® Love Don’t Be Shy. Orange Blossom, Vanilla, Marshmallow',
    rating: 5,
    reviews: 340,
    badge: '52% OFF',
    saveAmount: 26,
    customButtonText: 'Add to Cart',
    flashSale: {
      code: 'STORM',
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: 'Sarah M.',
    text: 'Absolutely obsessed with the Santal scent. It makes my entire apartment smell like a 5-star hotel.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James L.',
    text: 'Long lasting and very elegant packaging. Will definitely order again.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily R.',
    text: 'The best diffuser I have ever purchased. Worth every penny.',
    rating: 5,
  },
];
