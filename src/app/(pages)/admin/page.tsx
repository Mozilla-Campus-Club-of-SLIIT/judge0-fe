'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/http';
import { haveAccess } from '@/utils/utils';

const adminSections = [
  {
    title: 'Challenge Manager',
    description:
      'Create new DSA challenges and keep the challenge bank ready for events.',
    href: '/admin/add/dsa',
    action: 'Add DSA Challenge',
  },
  {
    title: 'Linux Challenge Manager',
    description:
      'Create Linux challenges with title, note, and flag for CTF-style tasks.',
    href: '/admin/add/linux',
    action: 'Add Linux Challenge',
  },
  {
    title: 'DSA Challenges',
    description:
      'View every DSA challenge with pagination, status, marks, and test case count.',
    href: '/admin/challenges/dsa',
    action: 'View Challenges',
  },
  {
    title: 'DSA Submission Review',
    description:
      'Open the DSA submission queue and inspect Judge0 results from there.',
    href: '/admin/submissions/dsa',
    action: 'View Queue',
  },
  {
    title: 'Admin Leaderboard',
    description:
      'Inspect the live leaderboard feed used for admin monitoring and checks.',
    href: '/admin/leaderboard',
    action: 'Open Leaderboard',
  },
  {
    title: 'Linux Challenges',
    description:
      'View and manage all Linux challenges with pagination, status control, and bulk updates.',
    href: '/admin/challenges/linux',
    action: 'View Challenges',
  },
];

export default function AdminHomePage() {
  const userContext = useAuth();
  const [isTogglingLeaderboard, setIsTogglingLeaderboard] = useState(false);
  const [leaderboardToggleMessage, setLeaderboardToggleMessage] = useState<
    string | null
  >(null);

  const onToggleLeaderboard = async () => {
    setLeaderboardToggleMessage(null);
    setIsTogglingLeaderboard(true);

    try {
      const response = await api.patch('/admin/leaderboard/toggle');
      setLeaderboardToggleMessage(
        response.data?.message || 'Leaderboard state updated successfully.'
      );
    } catch {
      setLeaderboardToggleMessage('Failed to toggle leaderboard state.');
    } finally {
      setIsTogglingLeaderboard(false);
    }
  };

  if (!haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-12 text-zinc-300 md:px-8">
          You do not have access to view the admin area.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-3 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Admin Hub
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#40FD51] md:text-4xl">
              Manage the event from one place
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Use this dashboard to move quickly between challenge creation,
              submission review, and detailed Judge0 inspection.
            </p>
          </div>

          <div className="rounded-xl border border-[#40FD51]/20 bg-[#40FD51]/5 px-4 py-3 text-sm text-zinc-300">
            Signed in as{' '}
            <span className="font-semibold text-[#40FD51]">
              {userContext?.user?.name || 'host'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {adminSections.map((section) => (
            <section
              key={section.title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[#40FD51]/40"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                {section.title}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-zinc-100">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {section.description}
              </p>

              <Link
                href={section.href}
                className="mt-6 inline-flex items-center rounded-md border border-[#40FD51]/30 bg-[#40FD51]/5 px-4 py-2 text-sm font-medium text-[#40FD51] transition-colors hover:border-[#40FD51]/60 hover:bg-[#40FD51]/15"
              >
                {section.action}
              </Link>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Quick shortcuts
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Keep this page open as the starting point for admin work.
              </p>
              {leaderboardToggleMessage && (
                <p className="mt-2 text-xs text-zinc-300">
                  {leaderboardToggleMessage}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/add/dsa"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                New Challenge
              </Link>
              <Link
                href="/admin/add/linux"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                New Linux Challenge
              </Link>
              <Link
                href="/admin/challenges/dsa"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                Browse Challenges
              </Link>
              <Link
                href="/admin/submissions/dsa"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                Review DSA Queue
              </Link>
              <Link
                href="/admin/leaderboard"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                Admin Leaderboard
              </Link>
              <Link
                href="/admin/challenges/linux"
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-[#40FD51]/50 hover:text-[#40FD51]"
              >
                Linux Challenges
              </Link>
              <button
                type="button"
                onClick={() => void onToggleLeaderboard()}
                disabled={isTogglingLeaderboard}
                className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isTogglingLeaderboard
                  ? 'Toggling Leaderboard...'
                  : 'Toggle Leaderboard'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
