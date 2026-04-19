'use client';

import Navbar from '../../../../../components/navbar/Navbar';
import { useAuth } from '../../../../../context/AuthContext';
import api from '../../../../../lib/http';
import {
  AdminLinuxChallenge,
  AdminLinuxChallengesResponse,
} from '../../../../../types/types';
import { haveAccess } from '../../../../../utils/utils';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getStatusStyle = (status: string) => {
  if (status.toUpperCase() === 'ACTIVE') {
    return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  }

  return 'bg-zinc-600/20 text-zinc-300 border border-zinc-600/40';
};

export default function AdminLinuxChallengesPage() {
  const userContext = useAuth();

  const [challenges, setChallenges] = useState<AdminLinuxChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] =
    useState<AdminLinuxChallenge | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bulkUpdatingStatusId, setBulkUpdatingStatusId] = useState<
    number | null
  >(null);
  const [togglingChallengeId, setTogglingChallengeId] = useState<number | null>(
    null
  );
  const [deletingChallengeId, setDeletingChallengeId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const getNextStatusId = (statusId: number) => (statusId === 2 ? 1 : 2);
  const getStatusLabel = (statusId: number) =>
    statusId === 2 ? 'ACTIVE' : 'INACTIVE';
  const getToggleActionLabel = (challenge: AdminLinuxChallenge) => {
    if (togglingChallengeId === challenge.id) {
      return 'Updating...';
    }

    if (challenge.status_id === 2) {
      return 'Deactivate';
    }

    return 'Activate';
  };

  useEffect(() => {
    let mounted = true;

    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<AdminLinuxChallengesResponse>(
          '/admin/challenges/linux',
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

        setChallenges(res.data?.challenges ?? []);
        setCurrentPage(res.data?.currentPage ?? currentPage);
        setTotalPages(Math.max(1, res.data?.totalPages ?? 1));
        setSelectedChallenge(null);
      } catch {
        if (!mounted) {
          return;
        }

        setError('Failed to load Linux challenges.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchChallenges();

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

  const onToggleChallengeStatus = async (challenge: AdminLinuxChallenge) => {
    setError(null);
    setTogglingChallengeId(challenge.id);

    const nextStatusId = getNextStatusId(challenge.status_id);

    try {
      await api.patch(`/admin/challenges/${challenge.id}/${nextStatusId}`);

      setChallenges((prev) =>
        prev.map((item) =>
          item.id === challenge.id
            ? {
                ...item,
                status_id: nextStatusId,
                status: getStatusLabel(nextStatusId),
              }
            : item
        )
      );

      setSelectedChallenge((prev: AdminLinuxChallenge | null) => {
        if (prev?.id !== challenge.id) {
          return prev;
        }

        return {
          ...prev,
          status_id: nextStatusId,
          status: getStatusLabel(nextStatusId),
        };
      });
    } catch {
      setError('Failed to update challenge activity status.');
    } finally {
      setTogglingChallengeId(null);
    }
  };

  const onBulkSetStatus = async (statusId: number) => {
    setError(null);
    setBulkUpdatingStatusId(statusId);

    try {
      await api.patch(`/admin/challenges/linux/${statusId}`);

      const status = getStatusLabel(statusId);

      setChallenges((prev) =>
        prev.map((challenge) => ({
          ...challenge,
          status_id: statusId,
          status,
        }))
      );

      setSelectedChallenge((prev: AdminLinuxChallenge | null) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          status_id: statusId,
          status,
        };
      });
    } catch {
      setError('Failed to update all Linux challenge statuses.');
    } finally {
      setBulkUpdatingStatusId(null);
    }
  };

  const onDeleteChallenge = async (challenge: AdminLinuxChallenge) => {
    const confirmed = globalThis.confirm(
      `Delete challenge #${challenge.id} (${challenge.title})? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingChallengeId(challenge.id);

    try {
      await api.delete('/admin/challenges/linux', {
        params: { id: challenge.id },
      });

      setChallenges((prev) => prev.filter((item) => item.id !== challenge.id));
      setSelectedChallenge((prev) => (prev?.id === challenge.id ? null : prev));
    } catch {
      setError('Failed to delete challenge.');
    } finally {
      setDeletingChallengeId(null);
    }
  };

  if (!haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-12 text-zinc-300 md:px-8">
          You do not have access to view admin challenges.
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
              Linux Challenges
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onBulkSetStatus(2)}
              disabled={loading || bulkUpdatingStatusId !== null}
              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkUpdatingStatusId === 2 ? 'Activating...' : 'Activate All'}
            </button>

            <button
              type="button"
              onClick={() => onBulkSetStatus(1)}
              disabled={loading || bulkUpdatingStatusId !== null}
              className="rounded-md border border-zinc-600 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkUpdatingStatusId === 1
                ? 'Deactivating...'
                : 'Deactivate All'}
            </button>
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
                    Title
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Marks
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    Type
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
                      Loading challenges...
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

                {!loading && !error && challenges.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border-t border-zinc-800 px-4 py-10 text-center text-zinc-400"
                    >
                      No challenges found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  challenges.map((challenge) => (
                    <tr
                      key={challenge.id}
                      className="border-t border-zinc-800 transition-colors hover:bg-zinc-800/30"
                    >
                      <td className="px-4 py-3 text-zinc-100">
                        {challenge.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-100">
                          {challenge.title}
                        </p>
                        <p className="line-clamp-2 max-w-md text-xs text-zinc-400">
                          {challenge.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {challenge.marks}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {challenge.type}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getStatusStyle(challenge.status)}`}
                        >
                          {challenge.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedChallenge(challenge)}
                            className="inline-flex items-center rounded-md border border-[#40FD51]/30 bg-[#40FD51]/5 px-2.5 py-1.5 text-xs font-medium text-[#40FD51] transition-all hover:border-[#40FD51]/60 hover:bg-[#40FD51]/15"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleChallengeStatus(challenge)}
                            disabled={
                              togglingChallengeId === challenge.id ||
                              deletingChallengeId === challenge.id
                            }
                            className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-all hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {getToggleActionLabel(challenge)}
                          </button>

                          <button
                            type="button"
                            onClick={() => void onDeleteChallenge(challenge)}
                            disabled={
                              deletingChallengeId === challenge.id ||
                              togglingChallengeId === challenge.id
                            }
                            className="inline-flex items-center rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-all hover:border-red-400/70 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingChallengeId === challenge.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                        {formatDateTime(challenge.created_at)}
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

      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close challenge details"
            onClick={() => setSelectedChallenge(null)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#40FD51]">
                  {selectedChallenge.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Challenge ID {selectedChallenge.id} •{' '}
                  {selectedChallenge.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500"
              >
                Close
              </button>
            </div>

            <p className="mb-4 text-sm leading-6 text-zinc-300">
              {selectedChallenge.description}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Marks
                </p>
                <p className="text-sm text-zinc-200">
                  {selectedChallenge.marks}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </p>
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getStatusStyle(selectedChallenge.status)}`}
                >
                  {selectedChallenge.status}
                </span>
              </div>
            </div>

            {selectedChallenge.note && (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Note
                </p>
                <pre className="whitespace-pre-wrap text-xs text-zinc-200">
                  {selectedChallenge.note}
                </pre>
              </div>
            )}

            {selectedChallenge.flag && (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Flag
                </p>
                <pre className="whitespace-pre-wrap break-all text-xs text-zinc-200">
                  {selectedChallenge.flag}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
