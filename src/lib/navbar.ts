export interface NavLink {
  label: string;
  href: string;
  secure: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', secure: false },
  { label: 'Challenges', href: '/challenges', secure: true },
  { label: 'Leaderboard', href: '/leaderboard', secure: false },
  { label: 'Gallery', href: '/gallery', secure: false },
  { label: 'Team', href: '/team', secure: false },
  { label: 'About Us', href: '/about', secure: false },
];
