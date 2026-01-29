/**
 * Hook for accessing Home page configuration
 * Provides typed access to all home page content
 */

import { useMemo } from 'react';
import { HomeService } from '@/services/home/home.service';
import { getIconById } from '@/configs/icons/iconRegistry';
import { aiImageUrl } from '@/lib/images';
import type { IconComponent } from '@/configs/icons/iconRegistry';

export function useHomeConfig() {
  return useMemo(() => {
    const config = HomeService.getHomeConfig();

    // Helper to resolve icons from iconId
    const resolveIcon = (iconId: string): IconComponent => {
      return getIconById(iconId);
    };

    // Helper to resolve banner images from prompts
    const resolveBannerImage = (prompt: string): string => {
      return aiImageUrl(prompt);
    };

    return {
      ...config,
      resolveIcon,
      resolveBannerImage,
    };
  }, []);
}
