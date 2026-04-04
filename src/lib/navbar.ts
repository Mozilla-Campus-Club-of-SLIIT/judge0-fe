export interface NavLink {
  label: string;
  href: string;
  secure: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'About Us', href: '/about' },
];
