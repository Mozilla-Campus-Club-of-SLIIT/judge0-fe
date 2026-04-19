'use client';

import api from '@/lib/http';
import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import { haveAccess } from '@/utils/utils';
import { useState } from 'react';
import {
  CHALLENGE_STATUS_ID,
  challengeStatusOptions,
} from '@/lib/challengeMeta';

type LinuxChallengeForm = {
  title: string;
  marks: number;
  description: string;
  type_id: number;
  status_id: number;
  note: string;
  flag: string;
};

const LINUX_TYPE_ID = 3;

const initialForm: LinuxChallengeForm = {
  title: 'Privilege Escalation Basics',
  marks: 10,
  description: 'Find the misconfiguration and capture the flag.',
  type_id: LINUX_TYPE_ID,
  status_id: CHALLENGE_STATUS_ID.ACTIVE,
  note: 'Start with system enumeration and sudo checks.',
  flag: 'FLAG{linux_challenge_example}',
};

export default function AdminAddLinuxPage() {
  const userContext = useAuth();
  const [form, setForm] = useState<LinuxChallengeForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onFieldChange = <K extends keyof LinuxChallengeForm>(
    key: K,
    value: LinuxChallengeForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmitChallenge = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const payload = {
      title: form.title,
      description: form.description,
      type_id: LINUX_TYPE_ID,
      status_id: Number(form.status_id) || 0,
      marks: Number(form.marks) || 0,
      note: form.note,
      flag: form.flag,
    };

    try {
      const res = await api.post('challenges/add/linux', payload);
      const message =
        res.data?.message || 'Linux challenge added successfully.';
      setSubmitSuccess(message);
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Failed to add Linux challenge.';

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen text-zinc-100">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#40FD51]">
              Add Linux Challenge
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Create a Linux challenge with title, note, and flag.
            </p>
          </div>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">Title</span>
                <input
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                  value={form.title}
                  onChange={(e) => onFieldChange('title', e.target.value)}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Marks
                  </span>
                  <input
                    type="number"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                    value={form.marks}
                    onChange={(e) =>
                      onFieldChange('marks', Number(e.target.value))
                    }
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Type ID
                  </span>
                  <input
                    readOnly
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 outline-none"
                    value={LINUX_TYPE_ID}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Status ID
                  </span>
                  <select
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                    value={form.status_id}
                    onChange={(e) =>
                      onFieldChange('status_id', Number(e.target.value))
                    }
                  >
                    {challengeStatusOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.id} - {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">
                  Description
                </span>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                  value={form.description}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">Note</span>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                  value={form.note}
                  onChange={(e) => onFieldChange('note', e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-zinc-300">Flag</span>
                <input
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-[#40FD51]"
                  value={form.flag}
                  onChange={(e) => onFieldChange('flag', e.target.value)}
                />
              </label>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void onSubmitChallenge()}
              disabled={submitting}
              className="rounded-md bg-[#40FD51] px-4 py-2 text-sm font-semibold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Linux Challenge'}
            </button>
            {submitSuccess && (
              <p className="text-sm text-green-400">{submitSuccess}</p>
            )}
            {submitError && (
              <p className="text-sm text-red-400">{submitError}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <p className="rounded-md border border-red-400/50 bg-red-950/20 px-4 py-3 text-red-300">
          Access denied
        </p>
      </div>
    </div>
  );
}
