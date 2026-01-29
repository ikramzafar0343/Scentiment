/**
 * Home page content configuration
 * All hardcoded UI content extracted from components
 */

import type { HomeConfig } from './home.schema';

export const HOME_CONFIG: HomeConfig = {
  hero: {
    eyebrow: 'Scentiment',
    headline: 'Transform your space with premium home fragrance.',
    subtext:
      'Discover luxury diffusers and hotel-inspired fragrance oils designed for modern living. Experience clean ingredients, fast shipping, and personalized support that makes fragrance effortless.',
    primaryCta: 'Shop Collection',
    secondaryCta: 'See how it works',
    backgroundImagePrompt: 'premium luxury home fragrance diffuser oils elegant modern interior soft lighting professional photography'
  },
  features: {
    section: {
      eyebrow: 'Why Choose Us',
      title: 'What makes Scentiment different',
      description: 'Our commitment to quality, service, and your satisfaction'
    },
    items: [
      {
        title: 'Premium, curated catalog',
        description: 'Hand-picked categories and edits that feel intentional and premium.',
        iconId: 'GiTrophy',
        gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
        iconBg: 'bg-[#d4af37]/10',
        iconColor: 'text-[#d4af37]'
      },
      {
        title: 'Clean ingredients',
        description: 'Formulated for a safer, better everyday experience.',
        iconId: 'HiSparkles',
        gradient: 'from-emerald-200/30 via-green-100/30 to-emerald-50/40',
        iconBg: 'bg-emerald-200/20',
        iconColor: 'text-emerald-600'
      },
      {
        title: 'Fast shipping',
        description: 'Quick fulfillment with reliable tracking and careful packaging.',
        iconId: 'HiTruck',
        gradient: 'from-red-200/30 via-rose-100/30 to-red-50/40',
        iconBg: 'bg-red-200/20',
        iconColor: 'text-red-600'
      },
      {
        title: 'Trusted quality',
        description: 'Products designed to perform consistently and look great in your space.',
        iconId: 'HiStar',
        gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
        iconBg: 'bg-[#0066cc]/10',
        iconColor: 'text-[#0066cc]'
      },
      {
        title: 'Secure checkout',
        description: 'Confidence from browse to buy with clear policies and secure payments.',
        iconId: 'HiShieldCheck',
        gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
        iconBg: 'bg-purple-200/20',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Real support',
        description: 'Responsive help that feels human, not ticket-driven.',
        iconId: 'HiHeart',
        gradient: 'from-pink-200/30 via-pink-100/30 to-pink-50/40',
        iconBg: 'bg-pink-200/20',
        iconColor: 'text-pink-600'
      }
    ],
    banners: [
      {
        title: 'Hotel Lobby Vibes',
        description: 'Oud • Amber • Leather',
        imagePrompt: 'photorealistic luxury hotel lobby interior, warm ambient lighting, polished stone, subtle leather accents, premium editorial style, shallow depth of field, 35mm, high detail'
      },
      {
        title: 'Fresh & Airy Rooms',
        description: 'White Tea • Citrus • Cedar',
        imagePrompt: 'photorealistic bright modern hotel room, soft morning light, clean minimal decor, airy curtains, premium lifestyle editorial, high detail, 35mm'
      },
      {
        title: 'Candlelit Evenings',
        description: 'Vanilla • Sandalwood • Smoke',
        imagePrompt: 'photorealistic candlelit evening scene, warm glow, soft shadows, elegant table styling, cozy premium atmosphere, high detail, cinematic, 35mm'
      },
      {
        title: 'Designer-Grade Diffusion',
        description: 'Consistent performance • Reliable coverage',
        imagePrompt: 'photorealistic premium home scent diffuser on modern shelf, soft studio lighting, minimal design, luxury editorial product photo, high detail, 85mm'
      },
      {
        title: 'Signature Scent Collections',
        description: 'Mix • Layer • Customize',
        imagePrompt: 'photorealistic luxury fragrance bottles and scent oils arranged neatly, modern neutral background, premium editorial product styling, high detail, 85mm'
      }
    ]
  },
  howItWorks: {
    section: {
      eyebrow: 'How It Works',
      title: 'Your journey to premium home fragrance',
      description: 'A simple, guided experience that helps you discover and enjoy luxury scents in your space.'
    },
    steps: [
      {
        title: 'Discover your style',
        description: 'Browse curated collections inspired by luxury hotels and designer fragrances. Find scents that match your space and mood.',
        iconId: 'HiSparkles',
        gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
        iconBg: 'bg-[#d4af37]/10',
        iconColor: 'text-[#d4af37]'
      },
      {
        title: 'Select your products',
        description: 'Choose from premium diffusers, fragrance oils, room sprays, and candles. All crafted with clean ingredients for lasting performance.',
        iconId: 'HiBeaker',
        gradient: 'from-[#20b2aa]/20 via-[#d4f4f1]/30 to-[#e6f7f5]/40',
        iconBg: 'bg-[#20b2aa]/10',
        iconColor: 'text-[#20b2aa]'
      },
      {
        title: 'Set up in minutes',
        description: 'Follow our simple setup guide. Most diffusers are ready to use right out of the box with clear, step-by-step instructions.',
        iconId: 'HiCog',
        gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
        iconBg: 'bg-[#0066cc]/10',
        iconColor: 'text-[#0066cc]'
      },
      {
        title: 'Enjoy premium fragrance',
        description: 'Experience fast shipping, beautiful packaging, and ongoing support. Your space transforms into a luxury environment every day.',
        iconId: 'HiGift',
        gradient: 'from-rose-200/30 via-pink-100/30 to-rose-50/40',
        iconBg: 'bg-rose-200/20',
        iconColor: 'text-rose-600'
      }
    ]
  },
  useCases: {
    section: {
      eyebrow: 'Use Cases',
      title: 'Perfect for every space',
      description: 'From residential homes to commercial spaces, our premium fragrances enhance any environment with luxury scents.'
    },
    items: [
      {
        title: 'Residential',
        description: 'Transform your home into a luxury retreat. Create signature scents for every room that welcome you and your guests daily.',
        iconId: 'HiHome',
        gradient: 'from-amber-200/30 via-amber-100/30 to-amber-50/40',
        iconBg: 'bg-amber-200/20',
        iconColor: 'text-amber-700'
      },
      {
        title: 'Retail & Boutiques',
        description: 'Enhance the shopping experience with memorable fragrance. Create an atmosphere that turns visitors into loyal customers.',
        iconId: 'HiSparkles',
        gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
        iconBg: 'bg-purple-200/20',
        iconColor: 'text-purple-700'
      },
      {
        title: 'Workplaces',
        description: 'Improve focus and well-being in office spaces. Subtle, professional fragrances that enhance productivity and comfort.',
        iconId: 'HiOfficeBuilding',
        gradient: 'from-blue-200/30 via-blue-100/30 to-blue-50/40',
        iconBg: 'bg-blue-200/20',
        iconColor: 'text-blue-700'
      },
      {
        title: 'Hospitality',
        description: 'Deliver consistent, premium experiences for hotels, spas, and venues. Professional-grade solutions for guest satisfaction.',
        iconId: 'HiUsers',
        gradient: 'from-teal-200/30 via-teal-100/30 to-teal-50/40',
        iconBg: 'bg-teal-200/20',
        iconColor: 'text-teal-700'
      }
    ]
  },
  faq: {
    section: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Everything you need to know',
      description: 'Get answers to common questions about our products, shipping, returns, and more.'
    },
    items: [
      {
        q: 'How long do fragrance oils last?',
        a: 'A 50ml bottle typically lasts 2-3 months with normal use (4-6 hours per day). Our Mini Diffuser consumes approximately 1ml per hour at medium intensity. Coverage and longevity vary by product—check individual product pages for specific details.'
      },
      {
        q: 'Are your fragrance oils safe and clean?',
        a: 'Yes. All our products are formulated with clean ingredients and comply with IFRA (International Fragrance Association) safety standards. We use cruelty-free formulas that are safe for children and pets. Full ingredient lists are available on product pages.'
      },
      {
        q: 'How fast is shipping?',
        a: 'We ship most orders within 24 hours (business days). Delivery typically takes 2-4 days within the continental US. You will receive tracking information as soon as your order ships. Free shipping is available on orders over $100.'
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day satisfaction guarantee. If you are not completely happy with your purchase, contact our support team and we will process a return or exchange. Returns are free and simple—we will guide you through every step.'
      },
      {
        q: 'How do I choose the right scent for my space?',
        a: 'Browse our collections by mood or inspiration (Hotel Collection, Designer Collection). Each product page includes detailed scent notes and coverage information. For personalized recommendations, contact our support team—we are happy to help you find the perfect fragrance.'
      },
      {
        q: 'What does "inspired by" mean?',
        a: 'Our Designer Collection features original fragrance creations inspired by the signature scents of luxury brands. These are not duplicates but unique interpretations crafted by expert perfumers to capture the essence of beloved designer fragrances at accessible prices.'
      }
    ]
  },
  stats: {
    section: {
      eyebrow: 'Credibility',
      title: 'Premium experience, proven',
      description: 'Numbers that reflect trust, consistency, and service quality.'
    },
    items: [
      {
        value: '50k+',
        label: 'Happy customers',
        iconId: 'HiUsers',
        gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
        iconColor: 'text-[#0066cc]'
      },
      {
        value: '4.9/5',
        label: 'Average rating',
        iconId: 'HiStar',
        gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
        iconColor: 'text-[#d4af37]'
      },
      {
        value: '2–4 days',
        label: 'Typical delivery',
        iconId: 'HiTruck',
        gradient: 'from-emerald-200/30 via-green-100/30 to-emerald-50/40',
        iconColor: 'text-emerald-600'
      },
      {
        value: '24/7',
        label: 'Order tracking',
        iconId: 'HiClock',
        gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
        iconColor: 'text-purple-600'
      }
    ]
  },
  socialProof: {
    section: {
      eyebrow: 'Customer Reviews',
      title: 'What our customers say',
      description: 'Join thousands of satisfied customers who trust Scentiment'
    },
    testimonials: [
      {
        quote:
          'The scents are clean, premium, and the experience feels truly elevated. Setup was effortless and the packaging is beautiful.',
        name: 'Ayesha',
        meta: 'Verified customer'
      },
      {
        quote:
          'We use it in our studio space—guests constantly ask what the fragrance is. It\'s become part of our brand experience.',
        name: 'Daniel',
        meta: 'Small business owner'
      },
      {
        quote:
          'Fast shipping, great support, and the fragrance lasts. Everything feels well-designed and premium.',
        name: 'Mina',
        meta: 'Verified customer'
      }
    ],
    reviewStats: {
      averageRating: 4.9,
      totalReviews: 2847,
      ratingDistribution: [
        { stars: 5, percentage: 92 },
        { stars: 4, percentage: 6 },
        { stars: 3, percentage: 2 }
      ]
    }
  },
  collections: {
    section: {
      eyebrow: 'Collections',
      title: 'Shop by Collection',
      description: 'Discover curated fragrances for every space and mood'
    },
    items: [
      {
        title: 'Diffusers',
        to: '/collections/scent-diffusers',
        desc: 'From $40 to $475 • Coverage 46m² to 600m²',
        iconId: 'HiCloud',
        gradient: 'from-[#0066cc]/20 to-[#20b2aa]/20'
      },
      {
        title: 'Diffuser Oils',
        to: '/collections/fragrance-oils',
        desc: 'Premium fragrance oils • Starting at $19',
        iconId: 'HiBeaker',
        gradient: 'from-[#20b2aa]/20 to-[#d4f4f1]/20'
      },
      {
        title: 'Scent Voyage',
        to: '/collection/voyage',
        desc: 'Travel-inspired fragrances • Starting at $19',
        iconId: 'HiGlobe',
        gradient: 'from-[#d4af37]/20 to-[#f4e4bc]/20'
      },
      {
        title: 'Room Sprays',
        to: '/collections/fragrance-room-sprays',
        desc: 'Instant fragrance refresh • Starting at $19',
        iconId: 'GiSpray',
        gradient: 'from-[#ff4444]/20 to-[#ffcccc]/20'
      },
      {
        title: 'Candles',
        to: '/collections/candles',
        desc: 'Premium scented candles • Starting at $22',
        iconId: 'HiFire',
        gradient: 'from-[#ff9900]/20 to-[#ffcc99]/20'
      },
      {
        title: 'Perfumes',
        to: '/collections/perfumes',
        desc: 'Designer-inspired fragrances • Starting at $45',
        iconId: 'GiPerfumeBottle',
        gradient: 'from-[#9933cc]/20 to-[#cc99ff]/20'
      }
    ]
  },
  guarantees: [
    { iconId: 'HiShieldCheck', text: 'IFRA-certified' },
    { iconId: 'GiRabbit', text: 'Cruelty-free' },
    { iconId: 'GiWindSlap', text: 'Cold diffusion' },
    { iconId: 'FaBaby', text: 'Safe for kids & pets' },
    { iconId: 'HiSparkles', text: 'Premium quality' }
  ],
  cta: {
    eyebrow: 'Newsletter',
    title: 'Get 10% off your first order',
    description: 'Subscribe to receive exclusive offers, new arrivals, and fragrance tips delivered to your inbox.',
    emailPlaceholder: 'Enter your email address',
    subscribeButtonText: 'Subscribe',
    subscribedButtonText: 'Subscribed',
    privacyText: 'No spam. Unsubscribe anytime with one click.'
  }
};
