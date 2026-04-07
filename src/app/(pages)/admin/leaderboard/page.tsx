'use client';

import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/http';
import { LeaderboardResponse, LeaderboardUser } from '@/types/types';
import { haveAccess } from '@/utils/utils';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

export default function AdminLeaderboardPage() {
  const userContext = useAuth();

  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<LeaderboardResponse>(
          '/admin/leaderboard/get',
          {
            params: {
              page: currentPage,
              pageSize: PAGE_SIZE,
            },
          }
        );

        if (!mounted) {
          return;
        }

        setUsers(res.data?.users ?? []);
        setCurrentPage(res.data?.currentPage ?? currentPage);
        setTotalPages(Math.max(1, res.data?.totalPages ?? 1));
      } catch {
        if (!mounted) {
          return;
        }

        setError('Failed to load admin leaderboard.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchLeaderboard();

    return () => {
      mounted = false;
    };
  }, [currentPage]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const pages: number[] = [];

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (!haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-12 text-zinc-300 md:px-8">
          You do not have access to view the admin leaderboard.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#40FD51] md:text-3xl">
              Admin Leaderboard
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Live leaderboard entries. Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/70 text-zinc-300">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Rank
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    XP
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    User ID
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-zinc-400"
                    >
                      Loading leaderboard...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-red-300"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-zinc-400"
                    >
                      No leaderboard users found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  users.map((user, index) => {
                    const rank = (currentPage - 1) * PAGE_SIZE + index + 1;

                    return (
                      <tr
                        key={`${user.user_id}-${rank}`}
                        className="border-t border-zinc-800 transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="px-4 py-3 text-zinc-100">#{rank}</td>
                        <td className="px-4 py-3 text-zinc-200">{user.name}</td>
                        <td className="px-4 py-3 text-zinc-200">{user.xp}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400">
                          {user.user_id}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-4 py-4">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={loading || currentPage <= 1}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((page) => {
                const active = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`h-8 min-w-8 rounded-md px-2 text-sm ${
                      active
                        ? 'bg-[#40FD51] font-semibold text-zinc-900'
                        : 'border border-zinc-700 text-zinc-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={loading || currentPage >= totalPages}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
