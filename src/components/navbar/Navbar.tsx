import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/navbar';

export default function Navbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-12 py-6 bg-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/logo.svg"
          alt="CodeNight Logo"
          width={120}
          height={40}
          priority
        />
      </Link>

      {/* Desktop Nav Links — absolutely centered */}
      <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-lg font-normal text-white/80 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        type="button"
        className="hidden md:inline-flex items-center px-10 py-2 text-sm font-bold font-sans tracking-widest text-[#40fd51] border border-[#40fd51] bg-transparent cursor-pointer transition-colors duration-200 hover:bg-[#40fd51] hover:text-black"
      >
        LOGOUT
      </button>
    </nav>
  );
}
