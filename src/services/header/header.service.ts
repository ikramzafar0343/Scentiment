import { HEADER_CONFIG } from '@/configs/header/header.config';
import type { HeaderConfig } from '@/configs/header/header.schema';

export const headerService = {
  getHeaderConfig(): HeaderConfig {
    return HEADER_CONFIG;
  },
};

