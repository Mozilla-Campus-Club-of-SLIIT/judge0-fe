'use client';

import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Callback() {
  const { setToken } = useAuth();
  const router = useRouter();

  const handleCallback = async (code: string) => {
    const response = await axios.get('/api/auth/callback', {
      params: {
        code,
      },
    });
    setToken(response.data.accessToken);
    console.log(response.data.accessToken);

    router.push('/');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    handleCallback(code ?? '');
  }, []);

  return <></>;
}
