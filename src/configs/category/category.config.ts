/**
 * Category pages content configuration
 * All hardcoded UI content extracted from category page components
 */

import type { CategoryPagesConfig } from './category.schema';

export const CATEGORY_PAGES_CONFIG: CategoryPagesConfig = {
  shop: {
    metadata: {
      seo: {
        title: 'Shop — AROMAZUR',
        description: 'Shop premium fragrances, diffusers, oils, room sprays, candles, and perfumes. Filter by category and price, then add to cart instantly.',
        canonicalPath: '/shop'
      },
      header: {
        eyebrow: 'Shop',
        title: 'The Collection',
        description: 'Discover fragrances inspired by the perfumery heritage of Grasse. Each creation embodies the refined elegance of the French Riviera, where timeless sophistication meets modern artistry.'
      },
      backgroundImagePrompt: 'premium luxury fragrance collection elegant modern interior curated products professional photography soft lighting'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      },
      sections: {
        bestSellers: {
          title: 'Best Sellers',
          description: 'Our most loved scents, chosen by you.'
        }
      }
    }
  },
  new: {
    metadata: {
      seo: {
        title: 'New Arrivals — AROMAZUR',
        description: 'Discover the latest fragrances inspired by Grasse. Each new arrival embodies the refined elegance of the French Riviera, crafted with care and guided by French luxury traditions.'
      },
      header: {
        eyebrow: 'Latest Drops',
        title: 'New Arrivals',
        description: 'Discover the latest fragrances inspired by Grasse. Each new arrival embodies the refined elegance of the French Riviera, crafted with care and guided by French luxury traditions.'
      },
      backgroundImagePrompt: 'new luxury fragrances latest arrivals premium products elegant modern interior professional photography'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      }
    },
    filterCategory: null,
    featuredContent: {
      title: 'The Hotel Collection',
      subtitle: 'Featured launch',
      description: 'Experience the refined elegance of the French Riviera. Our newest collection features fragrances inspired by Grasse, where timeless sophistication meets modern artistry.',
      ctaLabel: 'Shop the collection',
      imagePrompt: 'photorealistic premium home fragrance collection, elegant diffuser bottle and fragrance oils, modern interior background, luxury editorial product photo, high detail, 85mm'
    }
  },
  sale: {
    metadata: {
      seo: {
        title: 'Sale — AROMAZUR',
        description: 'Exclusive deals on our premium diffusers and fragrances. Limited time only.'
      },
      header: {
        eyebrow: 'Limited Time Offers',
        title: 'Specials',
        description: 'Exclusive deals on our premium diffusers and fragrances. Limited time only.'
      },
      backgroundImagePrompt: 'luxury sale special offers premium fragrances elegant modern retail professional photography'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      }
    },
    filterCategory: null
  },
  diffusers: {
    metadata: {
      seo: {
        title: 'Diffusers — AROMAZUR',
        description: 'Elevate your environment with our state-of-the-art cold-air diffusion technology.'
      },
      header: {
        eyebrow: 'Latest Drops',
        title: 'Scent Diffusers',
        description: 'Elevate your environment with our state-of-the-art cold-air diffusion technology.'
      },
      backgroundImagePrompt: 'premium luxury scent diffusers modern interior elegant design professional photography soft lighting'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      }
    },
    filterCategory: 'Diffusers'
  },
  oils: {
    metadata: {
      seo: {
        title: 'Fragrance Oils — AROMAZUR',
        description: 'Fragrance oils inspired by the perfumery heritage of Grasse. Each creation reflects a delicate balance of nature, emotion, and savoir‑faire. Safe for Pets & Kids.'
      },
      header: {
        eyebrow: 'Best Sellers',
        title: 'Fragrance Oils',
        description: 'Fragrance oils inspired by the perfumery heritage of Grasse. Each creation reflects a delicate balance of nature, emotion, and savoir‑faire. Safe for Pets & Kids.'
      },
      backgroundImagePrompt: 'premium fragrance oils luxury bottles elegant arrangement professional photography soft golden light'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      }
    },
    filterCategory: 'Fragrance Oils'
  },
  sprays: {
    metadata: {
      seo: {
        title: 'Room Sprays — AROMAZUR',
        description: 'Transform your space instantly with fragrances inspired by the French Riviera. Each spray embodies the refined elegance of Grasse perfumery.'
      },
      header: {
        eyebrow: 'Instant Freshness',
        title: 'Room Sprays',
        description: 'Transform your space instantly with fragrances inspired by the French Riviera. Each spray embodies the refined elegance of Grasse perfumery.'
      },
      backgroundImagePrompt: 'luxury room sprays premium bottles elegant modern interior professional photography'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No products found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      }
    },
    filterCategory: 'Room Sprays'
  },
  candles: {
    metadata: {
      seo: {
        title: 'Candles — AROMAZUR',
        description: 'Hand-poured luxury candles crafted to transform your space with warmth, elegance, and unforgettable fragrance.',
        canonicalPath: '/candles'
      },
      header: {
        eyebrow: 'Hand-poured luxury',
        title: 'The Candle Collection',
        description: 'Illuminate your senses with candles inspired by the perfumery heritage of Grasse. Crafted with care, each creation reflects the delicate balance of nature, emotion, and savoir‑faire.'
      },
      backgroundImagePrompt: 'luxury scented candles elegant arrangement warm ambient lighting modern interior cozy atmosphere professional photography'
    },
    filterCategory: 'Candles',
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No candles found matching your mood.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      },
      sections: {
        findYourScent: {
          title: 'Find Your Scent',
          description: 'Explore our fragrances by olfactory family'
        }
      }
    },
    filters: {
      scentFamilies: [
        { id: 'all', label: 'All Scents', color: 'bg-gray-100' },
        { id: 'Woody', label: 'Woody', color: 'bg-amber-800' },
        { id: 'Fresh', label: 'Fresh', color: 'bg-sky-400' },
        { id: 'Floral', label: 'Floral', color: 'bg-rose-300' },
        { id: 'Oriental', label: 'Oriental', color: 'bg-[color:var(--ds-gold)]' }
      ],
      categories: ['All Products', 'Relaxing', 'Energizing', 'Romantic', 'Cozy']
    },
    guideContent: {
      title: 'Candle care',
      subtitle: 'The art of wax',
      items: [
        {
          number: '01',
          title: 'Trim the wick',
          description: 'Trim to 1/4 inch before every burn to keep the flame even and smoke-free.'
        },
        {
          number: '02',
          title: 'The first burn',
          description: 'Let wax melt to the edges on the first burn to prevent tunneling.'
        },
        {
          number: '03',
          title: 'Safety first',
          description: 'Never leave unattended. Keep away from drafts, pets, and children.'
        }
      ],
      ctaLabel: 'Shop accessories'
    }
  },
  perfumes: {
    metadata: {
      seo: {
        title: 'Perfumes — AROMAZUR',
        description: 'Luxury perfumes inspired by iconic designer fragrances. Shop by scent profile and find your signature scent.',
        canonicalPath: '/perfumes'
      },
      header: {
        eyebrow: 'Designer inspired',
        title: 'Fine Fragrance',
        description: 'Discover your signature scent. Luxury perfumes inspired by Grasse, where timeless sophistication meets modern artistry. Subtle yet unforgettable, radiant yet deeply personal.'
      },
      backgroundImagePrompt: 'luxury designer perfumes elegant bottles premium arrangement modern interior soft golden lighting professional photography'
    },
    filterCategory: 'Perfumes',
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No perfumes found matching your criteria.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      },
      sections: {
        olfactoryNotes: {
          title: 'Olfactory Notes',
          description: 'Browse by profile to find your signature.'
        }
      }
    },
    filters: {
      scentProfiles: [
        { id: 'all', label: 'All Profiles' },
        { id: 'Woody', label: 'Woody & Earthy' },
        { id: 'Fruity/Fresh', label: 'Fresh & Fruity' },
        { id: 'Amber/Floral', label: 'Amber & Floral' },
        { id: 'Floral', label: 'Floral' }
      ],
      categories: ['All Products', 'Unisex', 'Feminine', 'Masculine']
    },
    concentrationGuide: {
      title: 'Fragrance Concentrations',
      subtitle: 'Know your scent',
      items: [
        {
          name: 'Eau de Toilette',
          concentration: '5–15% oil concentration',
          description: 'Light, fresh, and perfect for daily wear. Typically lasts 3–4 hours on the skin.'
        },
        {
          name: 'Eau de Parfum',
          concentration: '15–20% oil concentration',
          description: 'Rich, long-lasting, and intense. A luxury standard, lasting 6–8 hours.',
          isStandard: true
        },
        {
          name: 'Extrait de Parfum',
          concentration: '20–40% oil concentration',
          description: 'The purest and most potent form with a long-lasting presence that can linger 12+ hours.'
        }
      ]
    }
  },
  voyage: {
    metadata: {
      seo: {
        title: 'Scent Voyage — AROMAZUR',
        description: 'Travel the world through scent. Explore destination-inspired discovery sets and premium fragrance oils.',
        canonicalPath: '/collection/voyage'
      },
      header: {
        eyebrow: 'The world collection',
        title: 'Scent Voyage',
        description: 'Embark on a sensory journey inspired by the French Riviera. Each destination reflects the refined elegance of Grasse perfumery, crafted with care and guided by French luxury traditions.'
      },
      backgroundImagePrompt: 'luxury travel destinations premium fragrance collection elegant modern interior professional photography'
    },
    ui: {
      toolbar: {
        showingResults: 'Showing',
        filtersButton: 'Filters'
      },
      emptyState: {
        noProducts: 'No scents found in this region.',
        clearFilters: 'Clear Filters',
        resetCollection: 'Reset Collection',
        viewAllDestinations: 'View All Destinations'
      },
      sections: {
        exploreByDestination: {
          title: 'Explore by Destination',
          description: 'Select a region to discover its signature scents.'
        }
      }
    },
    filters: {
      destinations: [
        {
          id: 'all',
          label: 'All Destinations',
          imagePrompt: 'photorealistic luxury travel collage, elegant destinations moodboard, premium editorial, high detail'
        },
        {
          id: 'Paris',
          label: 'Paris',
          imagePrompt: 'photorealistic Paris luxury hotel vibe, soft golden light, elegant architecture, premium editorial'
        },
        {
          id: 'London',
          label: 'London',
          imagePrompt: 'photorealistic London luxury vibe, classic architecture, moody sky, premium editorial'
        },
        {
          id: 'Mediterranean',
          label: 'Mediterranean',
          imagePrompt: 'photorealistic Mediterranean coastline luxury resort vibe, bright sun, white stone, premium editorial'
        },
        {
          id: 'Miami',
          label: 'Miami',
          imagePrompt: 'photorealistic Miami luxury hotel vibe, palm trees, warm sunset, premium editorial'
        },
        {
          id: 'California',
          label: 'California',
          imagePrompt: 'photorealistic California coastal luxury vibe, cliffs and ocean, golden hour, premium editorial'
        },
        {
          id: 'Coastal',
          label: 'Coastal',
          imagePrompt: 'photorealistic coastal resort vibe, airy and fresh, ocean breeze, premium editorial'
        }
      ]
    },
    featuredContent: {
      title: 'Summer in Santorini',
      subtitle: 'Editor\'s pick',
      description: 'Experience the crisp Aegean breeze, white-washed architecture, and volcanic earth. Our upcoming Santorini collection brings the essence of the Greek islands home.',
      ctaLabel: 'Join the waitlist',
      imagePrompt: 'photorealistic Santorini summer luxury travel vibe, whitewashed buildings, blue sea, premium editorial, high detail'
    }
  }
};
