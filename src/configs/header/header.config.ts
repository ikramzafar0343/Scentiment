import type { HeaderConfig } from './header.schema';

export const HEADER_CONFIG: HeaderConfig = {
  marqueeSpeed: 26,
  announcements: [
    { text: 'Winter Event: extra 20% off', accent: 'gold' },
    { text: 'Free shipping over €100', accent: 'accent' },
    { text: 'Limited drops weekly', accent: 'primary' },
  ],
  navLinks: [
    { name: 'Shop All', href: '/shop', iconId: 'collection' },
    { name: 'NEW', href: '/new', iconId: 'sparkles' },
    { name: 'SALE', href: '/sale', iconId: 'tag' },
    {
      name: 'DIFFUSERS',
      href: '/collections/scent-diffusers',
      iconId: 'cloud',
      badges: [
        { text: '$4 OILS', colorClass: 'bg-red-600' },
        { text: 'ALMOST SOLD OUT', colorClass: 'bg-red-600' },
      ],
    },
    { name: 'DIFFUSER OILS', href: '/collections/fragrance-oils', iconId: 'beaker' },
    {
      name: 'SCENT VOYAGE',
      href: '/collection/voyage',
      iconId: 'globe',
      badges: [{ text: 'NEW', colorClass: 'bg-red-600' }],
    },
    {
      name: 'ROOM SPRAYS',
      href: '/collections/fragrance-room-sprays',
      iconId: 'spray',
      badges: [{ text: '50% OFF', colorClass: 'bg-red-600' }],
    },
    { name: 'CANDLES', href: '/collections/candles', iconId: 'fire' },
    { name: 'PERFUMES', href: '/collections/perfumes', iconId: 'perfume' },
  ],
};

