'use client';

import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/http';
import {
  AdminDSASubmissionResult,
  AdminDSASubmissionResultsResponse,
} from '@/types/types';
import { haveAccess } from '@/utils/utils';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

const getStatusStyle = (status: number) => {
  if (status === 3) {
    return 'bg-red-500/15 text-red-300 border border-red-500/30';
  }

  if (status === 2) {
    return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  }

  return 'bg-zinc-600/20 text-zinc-300 border border-zinc-600/40';
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function AdminSubmissionsPage() {
  const userContext = useAuth();

  const [submissions, setSubmissions] = useState<AdminDSASubmissionResult[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<AdminDSASubmissionResultsResponse>(
          '/admin/submissions/dsa',
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

        setSubmissions(res.data?.submissions ?? []);
        setCurrentPage(res.data?.currentPage ?? currentPage);
        setTotalPages(Math.max(1, res.data?.totalPages ?? 1));
      } catch {
        if (!mounted) {
          return;
        }

        setError('Failed to load submissions.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();

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
          You do not have access to view admin submissions.
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
              DSA Submission Results
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/70 text-zinc-300">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Submission
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    User
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Challenge
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Action
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-zinc-400"
                    >
                      Loading submissions...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-red-300"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && submissions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-zinc-400"
                    >
                      No submissions found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  submissions.map((submission) => (
                    <tr
                      key={`${submission.id}-${submission.token}`}
                      className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-zinc-100">
                        {submission.id}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {submission.submission_id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-100">{submission.name}</p>
                        <p className="text-xs text-zinc-500">
                          {submission.user_id}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {submission.challenge_id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getStatusStyle(submission.status)}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/submissions/dsa/${submission.token}?name=${encodeURIComponent(submission.name)}&submissionId=${encodeURIComponent(submission.submission_id)}`}
                          className="inline-flex items-center rounded-md border border-[#40FD51]/30 bg-[#40FD51]/5 px-2.5 py-1.5 text-xs font-medium text-[#40FD51] transition-all hover:bg-[#40FD51]/15 hover:border-[#40FD51]/60"
                        >
                          View
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                        {formatDateTime(submission.created_at)}
                      </td>
                    </tr>
                  ))}
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
