'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import api from '@/lib/http';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-4 leading-7 first:mt-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="ml-6 mt-4 list-disc">{children}</ul>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-6 text-lg font-semibold text-[#40FD51]">{children}</h3>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="bg-[#14321f] px-1.5 py-0.5 rounded text-sm">
      {children}
    </code>
  ),
};

interface LinuxChallengeProps {
  id: string;
}

type LinuxChallengeData = {
  id: number;
  title: string;
  description: string;
  note?: string | null;
  type?: string;
  type_id?: number;
};

type LinuxChallengeResponse = {
  challenge?: LinuxChallengeData;
};

type LinuxSubmissionOkResponse = {
  is_correct: boolean;
  message: string;
  marks?: number;
};

type LinuxSubmissionBadRequest = {
  is_correct?: false;
  message?: string;
  error?: string;
};

const isLinuxChallenge = (challenge?: LinuxChallengeData) => {
  if (!challenge) return false;

  const challengeType = challenge.type?.trim().toUpperCase();
  return challengeType === 'LINUX' || challenge.type_id === 3;
};

export default function LinuxChallenge({ id }: Readonly<LinuxChallengeProps>) {
  const [challenge, setChallenge] = useState<LinuxChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [earnedMarks, setEarnedMarks] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadChallenge = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const response = await api.get<LinuxChallengeResponse>(
          `challenges/get/linux/${id}`
        );

        if (cancelled) return;

        const fetchedChallenge = response.data?.challenge;

        if (!fetchedChallenge || !isLinuxChallenge(fetchedChallenge)) {
          setChallenge(null);
          setLoadError('Challenge not found.');
          return;
        }

        setChallenge(fetchedChallenge);
      } catch (error) {
        if (cancelled) return;

        setChallenge(null);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setLoadError('Challenge not found.');
          } else {
            setLoadError('Failed to load challenge details.');
          }
        } else {
          setLoadError('Failed to load challenge details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadChallenge();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const challengeIdValid = challenge && Number.isFinite(challenge.id);
  const canSubmit =
    !loading && !submitting && challengeIdValid && flag.trim().length > 0;

  const handleSubmissionSuccess = (data: LinuxSubmissionOkResponse) => {
    setResultMessage(data.message);
    setIsSuccess(data.is_correct);
    setEarnedMarks(data.is_correct ? (data.marks ?? null) : null);
  };

  const handleSubmissionError = (error: unknown) => {
    setIsSuccess(false);
    setEarnedMarks(null);

    if (!axios.isAxiosError(error)) {
      setResultMessage('Failed to submit flag. Please try again.');
      return;
    }

    const status = error.response?.status;
    const data = error.response?.data as LinuxSubmissionBadRequest | undefined;

    switch (status) {
      case 400: {
        const backendMessage =
          data?.message ?? data?.error ?? 'Invalid request';
        setResultMessage(backendMessage);
        break;
      }
      case 401: {
        setResultMessage(
          'Authentication required. Please log in and try again.'
        );
        break;
      }
      case 404: {
        setResultMessage('Challenge not found.');
        break;
      }
      case 500: {
        setResultMessage(
          'Something went wrong while submitting. Please try again.'
        );
        break;
      }
      default: {
        const fallbackMessage =
          data?.message ??
          data?.error ??
          'Failed to submit flag. Please try again.';
        setResultMessage(fallbackMessage);
        break;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!challengeIdValid || !flag.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setResultMessage(null);
      setEarnedMarks(null);

      const payload = {
        challenge_id: challenge.id,
        flag: flag.trim(),
      };

      const response = await api.post<LinuxSubmissionOkResponse>(
        'challenges/submit/linux',
        payload
      );

      handleSubmissionSuccess(response.data);
    } catch (error: unknown) {
      handleSubmissionError(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg text-[#40FD51]">Loading...</p>
      </div>
    );
  }

  if (loadError || !challenge) {
    return (
      <div className="border border-red-400/30 bg-red-500/10 px-6 py-5 text-red-200">
        {loadError || 'Failed to load challenge details.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
        {/* Title */}
        <div className="border-b border-[#40FD51]/25 px-8 py-5 xl:px-10">
          <h1 className="text-xl font-semibold tracking-wide text-[#40FD51] xl:text-2xl">
            {challenge.title}
          </h1>
        </div>

        {/* Description & Note */}
        <div className="px-8 py-6 xl:px-10">
          <div className="text-[15px] leading-7 text-[#ededed]/90 xl:text-base space-y-6">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#40FD51] opacity-70 mb-2">
                Description
              </h2>
              <div className="text-[#ededed]/80">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents}
                >
                  {challenge.description}
                </ReactMarkdown>
              </div>
            </section>

            {challenge.note && (
              <section className="border-t border-[#40FD51]/10 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#40FD51] opacity-70 mb-2">
                  Note
                </h2>
                <div className="text-[#ededed]/70">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={markdownComponents}
                  >
                    {challenge.note}
                  </ReactMarkdown>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Flag Input Section */}
        <div className="border-t border-[#40FD51]/25 bg-[#14321f]/10 px-8 py-8 xl:px-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag here (e.g. FLAG{...})"
              required
              className="flex-1 border border-[#40FD51]/30 bg-[#0C0E19] px-4 py-3 text-sm text-[#ededed] placeholder:text-[#ededed]/30 focus:border-[#40FD51]/60 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="cursor-pointer border border-[#40FD51]/40 bg-[#40FD51]/10 px-8 py-3 text-sm font-semibold tracking-widest text-[#40FD51] transition-all hover:border-[#40FD51]/60 hover:bg-[#40FD51]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT FLAG'}
            </button>
          </form>

          {resultMessage && (
            <div
              className={`mt-4 rounded border px-4 py-3 text-sm ${
                isSuccess
                  ? 'border-[#40FD51]/40 bg-[#40FD51]/10 text-[#c6ffd1]'
                  : 'border-red-400/40 bg-red-500/10 text-red-200'
              }`}
            >
              <p>{resultMessage}</p>
              {isSuccess && earnedMarks !== null && (
                <p className="mt-1 text-[#40FD51]">
                  Marks earned: {earnedMarks}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
