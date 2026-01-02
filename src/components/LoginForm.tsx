'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setLoggedIn, setUser } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setLoggedIn(true);
        setUser({ id: data.user.id, email: data.user.email! });
        setMessage('Login successful');
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#070916] relative overflow-hidden font-['Segoe_UI',_sans-serif]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d3a20]/40 via-[#070916]/80 to-[#070916] pointer-events-none"></div>

      <div className="absolute top-[8%] left-[32%] opacity-30">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="w-3 h-3 bg-[#40FD51]"></div>
            <div className="w-3 h-3 bg-[#40FD51]"></div>
          </div>
          <div className="flex gap-0.5 ml-3">
            <div className="w-3 h-3 bg-[#40FD51]"></div>
            <div className="w-3 h-3 bg-[#40FD51]"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-[10%] right-[8%] opacity-30">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="w-3 h-3 bg-[#40FD51]"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[12%] right-[15%] opacity-30">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="w-3 h-3 bg-[#40FD51]"></div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 bg-[#40FD51]"></div>
            <div className="w-3 h-3 bg-[#40FD51]"></div>
            <div className="w-3 h-3 bg-[#40FD51]"></div>
          </div>
        </div>
      </div>

      <div className="absolute left-[8%] top-[55%]">
        <div className="flex gap-0.5">
          <div className="w-3 h-3 bg-[#40FD51]"></div>
          <div className="w-3 h-3 bg-[#40FD51]"></div>
          <div className="w-3 h-3 bg-[#40FD51]"></div>
          <div className="w-3 h-3 bg-[#40FD51]"></div>
        </div>
      </div>

      {/* login card */}
      <div className="relative w-full max-w-[380px] bg-[#151722]/80 backdrop-blur-xl px-8 py-10 rounded-[20px] border border-[#02730C]/30 shadow-2xl flex flex-col items-center z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3a20]/70 via-[#0a1f18]/50 to-[#0a1520]/30 pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="mb-4 flex flex-col items-center">
            <Image
              src="/assets/codelynx_logo.png"
              alt="CodeLynx Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          <h1 className="text-[22px] font-semibold text-[#40FD51] mb-2 text-center">
            Welcome Back!
          </h1>
          <p className="text-[#FFFFFF] text-[13px] mb-6">Sign in to continue</p>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {message && (
              <div
                className={`text-center px-4 py-2 rounded-lg text-sm ${
                  message === 'Login successful'
                    ? 'text-[#40FD51] bg-[#40FD51]/10 border border-[#40FD51]/20'
                    : 'text-red-400 bg-red-400/10 border border-red-400/20'
                }`}
              >
                {message}
              </div>
            )}

            <div className="relative">
              <fieldset className="w-full border border-[#FFFFFF] rounded-xl focus-within:border-[#40FD51] transition-all duration-300">
                <legend className="ml-3 px-1 text-[11px] text-[#40FD51] font-normal">
                  Your Email Address
                </legend>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-transparent text-[#FFFFFF] border-0 focus:outline-none placeholder:text-transparent"
                  placeholder=" "
                />
              </fieldset>
            </div>

            <div className="relative">
              <fieldset className="w-full border border-[#FFFFFF] rounded-xl focus-within:border-[#40FD51] transition-all duration-300">
                <legend className="ml-3 px-1 text-[11px] text-[#40FD51] font-normal">
                  Enter Your Password
                </legend>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-transparent text-[#FFFFFF] border-0 focus:outline-none placeholder:text-transparent"
                  placeholder=" "
                />
              </fieldset>
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#7AB181] hover:text-[#40FD51] transition-colors underline underline-offset-2"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-5 rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#FFFFFF]/90 transition-all font-semibold text-[16px] flex justify-center items-center shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  <span>Sign In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-5 text-[13px] text-[#FFFFFF]">
            Don&apos;t have an account ?{' '}
            <Link
              href="/register"
              className="text-[#40FD51] font-semibold hover:underline underline-offset-4"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
