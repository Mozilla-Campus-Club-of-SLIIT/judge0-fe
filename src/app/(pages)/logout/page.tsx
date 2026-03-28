'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const { setToken } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        console.error('Failed to call logout endpoint');
      }

      setToken(null);
      router.push('/login');
    };

    performLogout();
  }, [router, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Logging out...</p>
    </div>
  );
}
