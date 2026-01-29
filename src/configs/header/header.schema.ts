export type HeaderNavBadge = {
  text: string;
  colorClass: string;
};

export type HeaderNavItem = {
  name: string;
  href: string;
  iconId: string;
  badges?: HeaderNavBadge[];
};

export type HeaderAnnouncement = {
  text: string;
  accent: 'gold' | 'accent' | 'primary';
};

export type HeaderConfig = {
  navLinks: HeaderNavItem[];
  announcements: HeaderAnnouncement[];
  marqueeSpeed: number;
};

