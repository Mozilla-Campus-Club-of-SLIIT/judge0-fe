'use client';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navbar';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-4 pb-1 bg-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/codelynx_logo.png"
          alt="CodeLynx Logo"
          width={140}
          height={36}
          priority
        />
      </Link>

      {/* Desktop Nav Links — absolutely centered */}
      <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_LINKS.map((link) =>
          link.secure && !user ? null : (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-lg font-normal text-white/80 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          )
        )}
      </ul>

      {user ? (
        <Link
          href="/logout"
          className="hidden md:inline-flex items-center px-10 py-1.5 text-sm font-semibold tracking-wider text-primary border border-primary cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-black"
        >
          LOGOUT
        </Link>
      ) : (
        <Link
          href="/login"
          className="hidden md:inline-flex items-center px-10 py-1.5 text-sm font-semibold tracking-wider text-primary border border-primary cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-black"
        >
          LOGIN
        </Link>
      )}
    </nav>
  );
}
