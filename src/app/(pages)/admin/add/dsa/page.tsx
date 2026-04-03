'use client';
import api from '@/lib/http';
import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import { haveAccess } from '@/utils/utils';
import { useState } from 'react';
import {
  CHALLENGE_STATUS_ID,
  CHALLENGE_TYPE_ID,
  challengeStatusOptions,
  challengeTypeOptions,
} from '@/lib/challengeMeta';

type TestCase = {
  test_input: string;
  test_output: string;
};

type ChallengeForm = {
  title: string;
  marks: number;
  description: string;
  type_id: number;
  status_id: number;
  sample_input: string;
  sample_output: string;
  note: string;
  test_cases: TestCase[];
};

const initialForm: ChallengeForm = {
  title: 'Merge Intervals',
  marks: 5,
  description:
    'Given a collection of intervals, merge all overlapping intervals and return the result.',
  type_id: CHALLENGE_TYPE_ID.DSA,
  status_id: CHALLENGE_STATUS_ID.ACTIVE,
  sample_input: '[[1,3],[2,6],[8,10],[15,18]]',
  sample_output: '[[1,6],[8,10],[15,18]]',
  note: '* [1,3] overlaps with [2,6]\n* They merge into [1,6]\n* The others do not overlap',
  test_cases: [
    {
      test_input: '[[1,3],[2,6],[8,10],[15,18]]',
      test_output: '[[1,6],[8,10],[15,18]]',
    },
    {
      test_input: '[[1,4],[4,5]]',
      test_output: '[[1,5]]',
    },
  ],
};

export default function AdminAddDSAPage() {
  const userContext = useAuth();
  const [form, setForm] = useState<ChallengeForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onFieldChange = <K extends keyof ChallengeForm>(
    key: K,
    value: ChallengeForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onTestCaseChange = (
    index: number,
    key: keyof TestCase,
    value: string
  ) => {
    setForm((prev) => {
      const nextCases = [...prev.test_cases];
      nextCases[index] = { ...nextCases[index], [key]: value };
      return { ...prev, test_cases: nextCases };
    });
  };

  const addTestCase = () => {
    setForm((prev) => ({
      ...prev,
      test_cases: [...prev.test_cases, { test_input: '', test_output: '' }],
    }));
  };

  const removeTestCase = (index: number) => {
    setForm((prev) => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const onSubmitChallenge = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const payload = {
      ...form,
      marks: Number(form.marks) || 0,
      type_id: Number(form.type_id) || 0,
      status_id: Number(form.status_id) || 0,
      test_cases: form.test_cases.filter(
        (item) => item.test_input.trim() && item.test_output.trim()
      ),
    };

    try {
      const res = await api.post('challenges/add/dsa', payload);
      const message = res.data?.message || 'Challenge added successfully.';
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
          : 'Failed to add challenge.';

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen text-zinc-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#40FD51]">
              Add DSA Challenge
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Fill the fields below and submit to create a new challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Title
                  </span>
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
                    <select
                      className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                      value={form.type_id}
                      onChange={(e) =>
                        onFieldChange('type_id', Number(e.target.value))
                      }
                    >
                      {challengeTypeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.id} - {option.label}
                        </option>
                      ))}
                    </select>
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
                    onChange={(e) =>
                      onFieldChange('description', e.target.value)
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Sample Input
                  </span>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                    value={form.sample_input}
                    onChange={(e) =>
                      onFieldChange('sample_input', e.target.value)
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">
                    Sample Output
                  </span>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                    value={form.sample_output}
                    onChange={(e) =>
                      onFieldChange('sample_output', e.target.value)
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-300">Note</span>
                  <textarea
                    rows={10}
                    className="min-h-52 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-[#40FD51]"
                    value={form.note}
                    onChange={(e) => onFieldChange('note', e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">
                  Test Cases
                </h2>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="rounded-md border border-[#40FD51] px-3 py-1 text-sm font-medium text-[#40FD51] hover:bg-[#40FD51]/10"
                >
                  Add Test Case
                </button>
              </div>

              <div className="space-y-4">
                {form.test_cases.map((testCase, index) => (
                  <div
                    key={`${index}-${testCase.test_input}`}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">
                        Case {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="rounded-md border border-red-400/50 px-2 py-1 text-xs text-red-300 hover:bg-red-400/10"
                        disabled={form.test_cases.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                    <label className="mb-2 block">
                      <span className="mb-1 block text-xs text-zinc-400">
                        Input
                      </span>
                      <textarea
                        rows={2}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                        value={testCase.test_input}
                        onChange={(e) =>
                          onTestCaseChange(index, 'test_input', e.target.value)
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-zinc-400">
                        Output
                      </span>
                      <textarea
                        rows={2}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-[#40FD51]"
                        value={testCase.test_output}
                        onChange={(e) =>
                          onTestCaseChange(index, 'test_output', e.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void onSubmitChallenge()}
              disabled={submitting}
              className="rounded-md bg-[#40FD51] px-4 py-2 text-sm font-semibold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Challenge'}
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
