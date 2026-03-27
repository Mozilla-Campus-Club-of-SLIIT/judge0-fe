'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { loading, setLoading, setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as {
        accessToken?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(data.message ?? 'Login failed');
        return;
      }

      if (!data.accessToken) {
        setError('Login succeeded but access token is missing');
        return;
      }

      setToken(data.accessToken);
      setSuccess('Login successful. Access token saved.');
      setEmail('');
      setPassword('');
      router.push('/');
    } catch {
      setError('Something went wrong while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-105 mx-auto px-4">
      {/* Gradient border wrapper */}
      <div className="relative rounded-[36px] bg-linear-to-b from-white/30 to-[#0d2a12] p-px shadow-[0_0_60px_-15px_rgba(64,253,81,0.12)]">
        {/* Card */}
        <div className="rounded-[35px] bg-linear-to-b from-[#060906] to-[#0d2a12] px-8 py-16 backdrop-blur-md sm:px-10 sm:py-18">
          <div className="flex flex-col items-center justify-center mb-4">
            <Image
              src="/main_logo.webp"
              alt="CodeLynx"
              width={130}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h1
            className="text-2xl text-[#66ca6e] text-center mb-2"
            style={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}
          >
            Welcome Back!
          </h1>
          <p className="text-xs text-gray-400 text-center mb-5">
            Sign in to continue
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Field — fieldset/legend style */}
            <fieldset className="rounded-lg border-2 border-white/50 px-3 pb-3 pt-1 transition-colors focus-within:border-primary/60">
              <legend className="px-1 text-[8px] font-medium text-primary/70">
                Your Email Address
              </legend>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full bg-transparent text-sm text-white outline-none placeholder-gray-500 mt-0.5"
              />
            </fieldset>

            {/* Password Field — fieldset/legend style */}
            <div>
              <fieldset className="rounded-lg border-2 border-white/50 px-3 pb-3 pt-1 transition-colors focus-within:border-primary/60">
                <legend className="px-1 text-[8px] font-medium text-primary/70">
                  Enter Your Password
                </legend>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-gray-500 mt-0.5"
                />
              </fieldset>
              <div className="mt-1 text-right">
                <Link
                  href="#"
                  className="text-[8px] text-primary/80 hover:text-primary underline transition"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error ? (
              <p className="text-center text-xs text-red-400">{error}</p>
            ) : null}

            {success ? (
              <p className="text-center text-xs text-green-400">{success}</p>
            ) : null}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-white py-1.5 text-lg font-semibold text-black transition hover:bg-gray-200 active:scale-[0.98] cursor-pointer mt-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-4 text-center text-sm text-gray-100">
            Don&apos;t have an account ?{' '}
            <Link
              href="#"
              className="text-primary underline transition hover:text-primary/80"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
