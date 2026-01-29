import { useMemo } from 'react';
import type { HeaderConfig } from '@/configs/header/header.schema';
import { headerService } from '@/services/header/header.service';

export function useHeaderConfig(): HeaderConfig {
  return useMemo(() => headerService.getHeaderConfig(), []);
}

