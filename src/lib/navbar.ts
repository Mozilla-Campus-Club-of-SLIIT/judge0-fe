export interface NavLink {
  label: string;
  href: string;
  secure: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', secure: false },
  { label: 'Challenges', href: '/challenges', secure: true },
  { label: 'Leaderboard', href: '/leaderboard', secure: false },
  { label: 'Profile', href: '/profile', secure: true },
];
