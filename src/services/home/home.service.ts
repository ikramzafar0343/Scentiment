/**
 * Service layer for Home page content
 * Provides access to home page configuration data
 */

import { HOME_CONFIG } from '@/configs/home/home.config';
import type { HomeConfig } from '@/configs/home/home.schema';

export class HomeService {
  /**
   * Get complete home page configuration
   */
  static getHomeConfig(): HomeConfig {
    return HOME_CONFIG;
  }

  /**
   * Get hero section content
   */
  static getHeroContent() {
    return HOME_CONFIG.hero;
  }

  /**
   * Get features section content
   */
  static getFeaturesContent() {
    return HOME_CONFIG.features;
  }

  /**
   * Get how it works section content
   */
  static getHowItWorksContent() {
    return HOME_CONFIG.howItWorks;
  }

  /**
   * Get use cases section content
   */
  static getUseCasesContent() {
    return HOME_CONFIG.useCases;
  }

  /**
   * Get FAQ section content
   */
  static getFAQContent() {
    return HOME_CONFIG.faq;
  }

  /**
   * Get stats section content
   */
  static getStatsContent() {
    return HOME_CONFIG.stats;
  }

  /**
   * Get social proof section content
   */
  static getSocialProofContent() {
    return HOME_CONFIG.socialProof;
  }

  /**
   * Get collections section content
   */
  static getCollectionsContent() {
    return HOME_CONFIG.collections;
  }

  /**
   * Get guarantees list
   */
  static getGuarantees() {
    return HOME_CONFIG.guarantees;
  }

  /**
   * Get CTA section content
   */
  static getCTAContent() {
    return HOME_CONFIG.cta;
  }
}
