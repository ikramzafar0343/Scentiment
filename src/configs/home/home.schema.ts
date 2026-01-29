/**
 * Schema definitions for Home page content
 * All content is data-driven and backend-ready
 */

export interface HomeFeature {
  title: string;
  description: string;
  iconId: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

export interface HomeBanner {
  title: string;
  description: string;
  imagePrompt: string;
}

export interface HomeStep {
  title: string;
  description: string;
  iconId: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

export interface HomeUseCase {
  title: string;
  description: string;
  iconId: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

export interface HomeFAQ {
  q: string;
  a: string;
}

export interface HomeStat {
  value: string;
  label: string;
  iconId: string;
  gradient: string;
  iconColor: string;
}

export interface HomeTestimonial {
  quote: string;
  name: string;
  meta: string;
}

export interface HomeReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    stars: number;
    percentage: number;
  }[];
}

export interface HomeCollection {
  title: string;
  to: string;
  desc: string;
  iconId: string;
  gradient: string;
}

export interface HomeGuarantee {
  iconId: string;
  text: string;
}

export interface HomeCTAContent {
  eyebrow: string;
  title: string;
  description: string;
  emailPlaceholder: string;
  subscribeButtonText: string;
  subscribedButtonText: string;
  privacyText: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCta: string;
  secondaryCta: string;
  backgroundImagePrompt: string;
}

export interface HomeSectionContent {
  eyebrow?: string;
  title: string;
  description: string;
}

export interface HomeConfig {
  hero: HomeHeroContent;
  features: {
    section: HomeSectionContent;
    items: HomeFeature[];
    banners: HomeBanner[];
  };
  howItWorks: {
    section: HomeSectionContent;
    steps: HomeStep[];
  };
  useCases: {
    section: HomeSectionContent;
    items: HomeUseCase[];
  };
  faq: {
    section: HomeSectionContent;
    items: HomeFAQ[];
  };
  stats: {
    section: HomeSectionContent;
    items: HomeStat[];
  };
  socialProof: {
    section: HomeSectionContent;
    testimonials: HomeTestimonial[];
    reviewStats: HomeReviewStats;
  };
  collections: {
    section: HomeSectionContent;
    items: HomeCollection[];
  };
  guarantees: HomeGuarantee[];
  cta: HomeCTAContent;
}
