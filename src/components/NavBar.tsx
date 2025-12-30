'use client';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NavBar = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
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
    <div className="fixed w-screen">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-screen h-14 bg-linear-to-r from-green-800 to-green-950 items-center justify-between px-12">
        <div className="nav-logo">
          <h2 className="font-segoe font-semibold text-xl">CodeLynx</h2>
        </div>
        <div className="nav-items">
          <ul className="flex items-center gap-5">
            {navLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-buttons">
          {!loggedIn && (
            <>
              <Link
                href={'/login'}
                className="mr-4 px-6 py-2 rounded-2xl border border-gray-100 text-gray-100 
                      font-bold text-sm bg-gray-100/15 hover:bg-gray-300/20 transition-colors"
              >
                Login
              </Link>
              <Link
                href={'/register'}
                className="mr-4 px-6 py-2 rounded-2xl bg-gray-100 text-black 
                      font-bold text-sm hover:bg-gray-300 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          {loggedIn && (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-2xl bg-gray-100 text-black 
          font-bold text-sm hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden relative">
        <div className="bar bg-linear-to-b from-green-800 to-green-950 flex items-center justify-between px-5 h-12">
          <div className="nav-logo">
            <h2 className="font-segoe font-semibold">CodeLynx</h2>
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
          className={`nav-bar -translate-x-full relative bg-linear-to-b 
            from-green-950 to-black/80 h-svh w-64 flex flex-col
            items-center justify-center duration-300 z-10
            transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="nav-items mb-50">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <li key={i} className="text-xl text-center">
                  <a href={link.path}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-buttons absolute bottom-[20vh]">
            {!loggedIn && (
              <>
                <Link
                  href={'/login'}
                  className="block mb-4 px-6 py-2 rounded-2xl border border-gray-100 text-gray-100
                                    font-bold text-sm bg-gray-100/15 hover:bg-gray-300/20 transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  href={'/register'}
                  className="block mb-4 px-6 py-2 rounded-2xl bg-gray-100 text-black
                                    font-bold text-sm hover:bg-gray-300 transition-colors text-center"
                >
                  Register
                </Link>
              </>
            )}
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-2xl bg-gray-100 text-black
                                font-bold text-sm hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
