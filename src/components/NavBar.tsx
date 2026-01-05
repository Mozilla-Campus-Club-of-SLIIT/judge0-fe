'use client';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

const NavBar = () => {
  const navLinks: { name: string; path: string }[] = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'About', path: '/about' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loggedIn, setLoggedIn, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setLoggedIn(false);
      setUser(null);

      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  return (
    <div className="sticky top-0 w-full z-50 overflow-x-clip">
      {/* Desktop Navigation */}
      <nav
        className="
  hidden md:flex w-full box-border py-4
  bg-[#070916]/20
  items-center justify-between px-12
  relative overflow-hidden
"
      >
        <div className="nav-logo relative z-10">
          <Image
            src="/main_logo.webp"
            height={120}
            width={120}
            className="max-w-full"
            alt="main logo"
          />
        </div>

        <div className="nav-items relative z-10">
          <ul className="flex items-center gap-5 text-gray-200">
            {navLinks.map((link, i) => (
              <li key={i}>
                <Link
                  href={link.path}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-buttons relative z-10">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-2xl
        bg-gray-100 text-black
        font-bold text-sm hover:bg-gray-300
        transition-colors cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link
                href="/login"
                className="mr-4 px-6 py-2 rounded-2xl
          border border-gray-100 text-gray-100
          font-bold text-sm
          bg-gray-100/15 hover:bg-gray-300/20
          transition-colors cursor-pointer"
              >
                Login
              </Link>
            </Fragment>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50">
        <div
          className="bar bg-[#081318]/70
        flex items-center justify-between px-5 py-8 h-14"
        >
          <div className="nav-logo">
            <Image
              src="/main_logo.webp"
              height={80}
              width={80}
              alt="main logo"
            />
          </div>
          <div className="nav-icon">
            <button
              className="text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div
          className={`bg-[#081318]/50 absolute top-14 left-0 z-40 h-fit w-full
             transition duration-300 ease-in-out py-10
        flex flex-col items-center gap-4 transform ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
        >
          <div className="nav-items mt-10">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <li
                  key={i}
                  className="text-md text-center font-bold text-gray-200"
                >
                  <Link href={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-buttons mt-6">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-2xl bg-gray-100 text-black
                                font-bold text-sm hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Fragment>
                <Link
                  href={'/login'}
                  className="block mb-4 px-6 py-2 rounded-2xl border border-gray-100 text-gray-100
                                    font-bold text-sm bg-gray-100/15 hover:bg-gray-300/20 transition-colors text-center"
                >
                  Login
                </Link>
              </Fragment>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
