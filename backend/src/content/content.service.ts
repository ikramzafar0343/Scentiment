import { Injectable } from '@nestjs/common';

function readJsonEnv<T>(key: string, defaultValue: T): T {
  const raw = (process.env[key] ?? '').trim();
  if (!raw) {
    return defaultValue;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

@Injectable()
export class ContentService {
  getHomeConfig() {
    return readJsonEnv<any>('CONTENT_HOME_JSON', {
      hero: {
        title: 'Welcome',
        subtitle: 'Discover our collection',
      },
      sections: [],
    });
  }

  getSearchConfig() {
    return readJsonEnv<any>('CONTENT_SEARCH_JSON', {
      placeholder: 'Search...',
      suggestions: [],
    });
  }

  getHeaderConfig() {
    return readJsonEnv<any>('CONTENT_HEADER_JSON', {
      marqueeSpeed: 24,
      announcements: [],
      navLinks: [
        {
          name: 'SHOP',
          href: '/shop',
          iconId: 'shopping-bag',
        },
        {
          name: 'CONTACT',
          href: '/contact',
          iconId: 'mail',
        },
      ],
    });
  }
}
