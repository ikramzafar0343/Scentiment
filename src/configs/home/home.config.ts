/**
 * Home page content configuration
 * All hardcoded UI content extracted from components
 */

import type { HomeConfig } from './home.schema';

export const HOME_CONFIG: HomeConfig = {
  hero: {
    eyebrow: 'AROMAZUR',
    headline: 'Les Parfums de la Côte d\'Azur',
    subtext:
      'Aromazur embodies the refined elegance of the French Riviera, where timeless sophistication meets modern artistry. Inspired by the perfumery heritage of Grasse, each creation reflects a delicate balance of nature, emotion, and savoir‑faire.',
    primaryCta: 'Discover Our Collection',
    secondaryCta: 'Our Heritage',
    backgroundImagePrompt: 'French Riviera Côte d\'Azur Grasse perfumery elegant luxury fragrance bottles Mediterranean coast sophisticated modern artistry'
  },
  features: {
    section: {
      eyebrow: 'Our Heritage',
      title: 'What makes AROMAZUR different',
      description: 'Crafted with care and guided by French luxury traditions, Aromazur perfumes are designed to leave a lasting impression — subtle yet unforgettable, radiant yet deeply personal.'
    },
    items: [
      {
        title: 'Grasse Heritage',
        description: 'Inspired by the perfumery capital of the world, where centuries of artistry meet modern innovation.',
        iconId: 'GiTrophy',
        gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
        iconBg: 'bg-[#d4af37]/10',
        iconColor: 'text-[#d4af37]'
      },
      {
        title: 'Nature & Emotion',
        description: 'Each fragrance reflects a delicate balance of natural essences, emotional resonance, and savoir‑faire.',
        iconId: 'HiSparkles',
        gradient: 'from-emerald-200/30 via-green-100/30 to-emerald-50/40',
        iconBg: 'bg-emerald-200/20',
        iconColor: 'text-emerald-600'
      },
      {
        title: 'French Luxury',
        description: 'Guided by timeless French luxury traditions, crafted with meticulous attention to detail.',
        iconId: 'HiTruck',
        gradient: 'from-red-200/30 via-rose-100/30 to-red-50/40',
        iconBg: 'bg-red-200/20',
        iconColor: 'text-red-600'
      },
      {
        title: 'Lasting Impression',
        description: 'Subtle yet unforgettable, radiant yet deeply personal — designed to transform your space.',
        iconId: 'HiStar',
        gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
        iconBg: 'bg-[#0066cc]/10',
        iconColor: 'text-[#0066cc]'
      },
      {
        title: 'Timeless Sophistication',
        description: 'Where refined elegance meets modern artistry, creating scents that transcend trends.',
        iconId: 'HiShieldCheck',
        gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
        iconBg: 'bg-purple-200/20',
        iconColor: 'text-purple-600'
      },
      {
        title: 'Crafted with Care',
        description: 'Every creation is thoughtfully composed to evoke the essence of the French Riviera.',
        iconId: 'HiHeart',
        gradient: 'from-pink-200/30 via-pink-100/30 to-pink-50/40',
        iconBg: 'bg-pink-200/20',
        iconColor: 'text-pink-600'
      }
    ],
    banners: [
      {
        title: 'Côte d\'Azur Elegance',
        description: 'Lavender • Mimosa • Mediterranean',
        imagePrompt: 'French Riviera Côte d\'Azur Mediterranean coast elegant luxury Grasse perfumery sophisticated French luxury heritage timeless sophistication'
      },
      {
        title: 'Grasse Heritage',
        description: 'Rose • Jasmine • Bergamot',
        imagePrompt: 'Grasse France perfumery heritage traditional French perfumery artisanal craftsmanship elegant luxury fragrance creation savoir-faire'
      },
      {
        title: 'Timeless Sophistication',
        description: 'Neroli • Amber • Vanilla',
        imagePrompt: 'French luxury elegance refined sophistication timeless artistry modern luxury French Riviera refined elegance sophisticated fragrance'
      },
      {
        title: 'Nature & Emotion',
        description: 'Delicate balance • Savoir-faire',
        imagePrompt: 'natural essences emotional resonance delicate balance French perfumery artistry sophisticated composition elegant fragrance creation'
      },
      {
        title: 'Radiant & Personal',
        description: 'Subtle yet unforgettable',
        imagePrompt: 'luxury French fragrance bottles elegant arrangement sophisticated personal scent collection radiant deeply personal lasting impression'
      }
    ]
  },
  howItWorks: {
    section: {
      eyebrow: 'Our Craft',
      title: 'The art of French perfumery',
      description: 'Discover how Aromazur brings the refined elegance of the French Riviera into your space through time-honored traditions and modern artistry.'
    },
    steps: [
      {
        title: 'Grasse Inspiration',
        description: 'Each fragrance draws from the perfumery heritage of Grasse, where nature, emotion, and savoir‑faire converge in perfect harmony.',
        iconId: 'HiSparkles',
        gradient: 'from-[#d4af37]/20 via-[#f4e4bc]/30 to-[#fff9e6]/40',
        iconBg: 'bg-[#d4af37]/10',
        iconColor: 'text-[#d4af37]'
      },
      {
        title: 'Artisanal Creation',
        description: 'Crafted with care and guided by French luxury traditions, our perfumes reflect a delicate balance of natural essences and emotional resonance.',
        iconId: 'HiBeaker',
        gradient: 'from-[#20b2aa]/20 via-[#d4f4f1]/30 to-[#e6f7f5]/40',
        iconBg: 'bg-[#20b2aa]/10',
        iconColor: 'text-[#20b2aa]'
      },
      {
        title: 'Timeless Sophistication',
        description: 'Where refined elegance meets modern artistry, creating scents that are subtle yet unforgettable, radiant yet deeply personal.',
        iconId: 'HiCog',
        gradient: 'from-[#0066cc]/20 via-[#e6f2ff]/30 to-[#f0f7ff]/40',
        iconBg: 'bg-[#0066cc]/10',
        iconColor: 'text-[#0066cc]'
      },
      {
        title: 'Lasting Impression',
        description: 'Experience the essence of the French Riviera in your space. Each creation is designed to leave a lasting impression that transforms your environment.',
        iconId: 'HiGift',
        gradient: 'from-rose-200/30 via-pink-100/30 to-rose-50/40',
        iconBg: 'bg-rose-200/20',
        iconColor: 'text-rose-600'
      }
    ]
  },
  useCases: {
    section: {
      eyebrow: 'Every Space',
      title: 'Perfect for every environment',
      description: 'From intimate residences to grand hospitality spaces, Aromazur fragrances bring the refined elegance of the French Riviera to any setting.'
    },
    items: [
      {
        title: 'Residential',
        description: 'Transform your home with the timeless sophistication of the Côte d\'Azur. Create signature scents that reflect your personal style and elevate daily moments.',
        iconId: 'HiHome',
        gradient: 'from-amber-200/30 via-amber-100/30 to-amber-50/40',
        iconBg: 'bg-amber-200/20',
        iconColor: 'text-amber-700'
      },
      {
        title: 'Retail & Boutiques',
        description: 'Enhance the shopping experience with fragrances inspired by Grasse. Create an atmosphere of refined elegance that captivates and inspires.',
        iconId: 'HiSparkles',
        gradient: 'from-purple-200/30 via-purple-100/30 to-purple-50/40',
        iconBg: 'bg-purple-200/20',
        iconColor: 'text-purple-700'
      },
      {
        title: 'Workplaces',
        description: 'Infuse professional spaces with subtle, sophisticated scents. Enhance focus and well-being through the delicate balance of nature and emotion.',
        iconId: 'HiOfficeBuilding',
        gradient: 'from-blue-200/30 via-blue-100/30 to-blue-50/40',
        iconBg: 'bg-blue-200/20',
        iconColor: 'text-blue-700'
      },
      {
        title: 'Hospitality',
        description: 'Deliver the essence of French luxury to hotels, spas, and venues. Professional-grade fragrances that leave a lasting, unforgettable impression.',
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
      description: 'Discover answers about Aromazur fragrances, inspired by the perfumery heritage of Grasse and crafted with French luxury traditions.'
    },
    items: [
      {
        q: 'What makes Aromazur fragrances unique?',
        a: 'Aromazur embodies the refined elegance of the French Riviera, where timeless sophistication meets modern artistry. Each creation is inspired by the perfumery heritage of Grasse and reflects a delicate balance of nature, emotion, and savoir‑faire. Crafted with care and guided by French luxury traditions, our perfumes are designed to leave a lasting impression — subtle yet unforgettable, radiant yet deeply personal.'
      },
      {
        q: 'Are your fragrances inspired by Grasse?',
        a: 'Yes. Aromazur draws inspiration from Grasse, the perfumery capital of the world. Each fragrance reflects centuries of French perfumery artistry, combining natural essences with modern innovation. Our creations honor the delicate balance of nature, emotion, and savoir‑faire that defines the Grasse tradition.'
      },
      {
        q: 'How do I choose the right fragrance?',
        a: 'Browse our collections inspired by the French Riviera and Grasse heritage. Each product reflects the refined elegance of the Côte d\'Azur. For personalized guidance in selecting a fragrance that embodies timeless sophistication, contact our team — we are here to help you discover the perfect scent.'
      },
      {
        q: 'What is your shipping policy?',
        a: 'We ship most orders within 24 hours (business days). Delivery typically takes 2-4 days within the continental US. You will receive tracking information as soon as your order ships. Free shipping is available on orders over €100.'
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day satisfaction guarantee. If you are not completely happy with your purchase, contact our support team and we will process a return or exchange. Returns are free and simple—we will guide you through every step.'
      },
      {
        q: 'Are your fragrances safe and clean?',
        a: 'Yes. All our products are crafted with care and comply with IFRA (International Fragrance Association) safety standards. We use cruelty-free formulas that are safe for children and pets. Full ingredient lists are available on product pages.'
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
      description: 'Join those who have discovered the refined elegance of Aromazur — subtle yet unforgettable, radiant yet deeply personal.'
    },
    testimonials: [
      {
        quote:
          'The sophistication of the French Riviera captured in every scent. Each fragrance tells a story of timeless elegance and modern artistry.',
        name: 'Sophie',
        meta: 'Verified customer'
      },
      {
        quote:
          'Inspired by Grasse, crafted with care. These fragrances transform our space with the delicate balance of nature, emotion, and savoir‑faire.',
        name: 'Jean-Pierre',
        meta: 'Luxury boutique owner'
      },
      {
        quote:
          'Subtle yet unforgettable — exactly as promised. Aromazur brings the essence of the Côte d\'Azur into our home, leaving a lasting impression every day.',
        name: 'Isabelle',
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
    title: 'Discover the essence of the French Riviera',
    description: 'Subscribe to receive exclusive offers, new arrivals inspired by Grasse, and insights into the art of French perfumery.',
    emailPlaceholder: 'Enter your email address',
    subscribeButtonText: 'Subscribe',
    subscribedButtonText: 'Subscribed',
    privacyText: 'No spam. Unsubscribe anytime with one click.'
  }
};
