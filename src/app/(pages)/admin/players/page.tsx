'use client';

import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/http';
import { AdminPlayer, AdminPlayersResponse } from '@/types/types';
import { haveAccess } from '@/utils/utils';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

export default function AdminPlayersPage() {
  const userContext = useAuth();

  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<AdminPlayer | null>(
    null
  );
  const [marksDelta, setMarksDelta] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPlayers = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const res = await api.get<AdminPlayersResponse>('/admin/players', {
          signal: controller.signal,
        });

        setPlayers(res.data?.players ?? []);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }

        setLoadError('Failed to load players.');
        setLoading(false);
      }
    };

    fetchPlayers();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return players;
    }

    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        player.email.toLowerCase().includes(query)
    );
  }, [players, search]);

  const onSelectPlayer = (player: AdminPlayer) => {
    setSelectedPlayer(player);
    setMarksDelta('');
    setFormError(null);
    setFormSuccess(null);
  };

  const onSubmitMarks = async () => {
    if (!selectedPlayer) {
      return;
    }

    setFormError(null);
    setFormSuccess(null);

    const parsed = Number(marksDelta);

    if (!Number.isInteger(parsed) || parsed === 0) {
      setFormError('Marks must be a non-zero integer.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.patch(
        `/admin/players/${selectedPlayer.user_id}/marks`,
        { marks: parsed }
      );

      const updatedMarks = res.data?.marks ?? selectedPlayer.marks + parsed;

      setPlayers((prev) =>
        prev.map((player) =>
          player.user_id === selectedPlayer.user_id
            ? { ...player, marks: updatedMarks }
            : player
        )
      );
      setSelectedPlayer((prev) =>
        prev ? { ...prev, marks: updatedMarks } : prev
      );
      setMarksDelta('');
      setFormSuccess(
        `${parsed > 0 ? 'Added' : 'Deducted'} ${Math.abs(parsed)} marks. New total: ${updatedMarks}.`
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { error?: string } };
      };
      const status = err.response?.status;
      const apiError = err.response?.data?.error;

      if (status === 404) {
        setFormError('Player not found.');
      } else if (status === 400) {
        setFormError(apiError || 'Marks must be a non-zero integer.');
      } else if (status === 401 || status === 403) {
        setFormError('You are not authorized to update marks.');
      } else {
        setFormError('Failed to update marks.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-12 text-zinc-300 md:px-8">
          You do not have access to manage marks.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#40FD51] md:text-3xl">
            Manage Marks
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Search for a player and add or deduct marks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="mb-3 w-full rounded-md border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#40FD51]/60"
            />

            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-800">
              {loading && (
                <p className="px-4 py-6 text-center text-sm text-zinc-400">
                  Loading players...
                </p>
              )}

              {!loading && loadError && (
                <p className="px-4 py-6 text-center text-sm text-red-300">
                  {loadError}
                </p>
              )}

              {!loading && !loadError && filteredPlayers.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-zinc-400">
                  No players found.
                </p>
              )}

              {!loading &&
                !loadError &&
                filteredPlayers.map((player) => {
                  const active = selectedPlayer?.user_id === player.user_id;

                  return (
                    <button
                      key={player.user_id}
                      type="button"
                      onClick={() => onSelectPlayer(player)}
                      className={`flex w-full items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 text-left text-sm transition-colors last:border-b-0 ${
                        active
                          ? 'bg-[#40FD51]/10 text-[#40FD51]'
                          : 'text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span>
                        <span className="block font-medium">
                          {player.name}
                        </span>
                        <span className="block text-xs text-zinc-400">
                          {player.email}
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-xs font-semibold text-zinc-300">
                        {player.marks} pts
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            {!selectedPlayer && (
              <p className="text-sm text-zinc-400">
                Select a player to adjust their marks.
              </p>
            )}

            {selectedPlayer && (
              <div>
                <p className="text-sm text-zinc-400">Selected player</p>
                <p className="mt-1 text-lg font-semibold text-zinc-100">
                  {selectedPlayer.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {selectedPlayer.email}
                </p>
                <p className="mt-3 text-sm text-zinc-300">
                  Current marks:{' '}
                  <span className="font-semibold text-[#40FD51]">
                    {selectedPlayer.marks}
                  </span>
                </p>

                <div className="mt-5">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Marks delta (use a negative number to deduct)
                  </label>
                  <input
                    type="number"
                    value={marksDelta}
                    onChange={(e) => setMarksDelta(e.target.value)}
                    placeholder="e.g. 10 or -5"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#40FD51]/60"
                  />
                </div>

                {formError && (
                  <p className="mt-3 text-sm text-red-300">{formError}</p>
                )}

                {formSuccess && (
                  <p className="mt-3 text-sm text-emerald-300">
                    {formSuccess}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void onSubmitMarks()}
                  disabled={submitting || !marksDelta}
                  className="mt-4 w-full rounded-md border border-[#40FD51]/30 bg-[#40FD51]/5 px-4 py-2 text-sm font-medium text-[#40FD51] transition-colors hover:border-[#40FD51]/60 hover:bg-[#40FD51]/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
