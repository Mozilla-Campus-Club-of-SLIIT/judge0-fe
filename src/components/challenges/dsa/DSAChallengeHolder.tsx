'use client';

import api from '@/lib/http';
import axios from 'axios';
import DSAChallenge from './DSAChallenge';
import DSADescription from './DSADescription';
import DSAEditor from './DSAEditor';
import { useCallback, useEffect, useState } from 'react';
import {
  DSAChallengeSubmissionResponse,
  DSAChallengeTestResponseType,
  DSAChallengeType,
} from '@/types/types';

const toBase64Utf8 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }

  return btoa(binary);
};

const fromBase64Utf8 = (value?: string) => {
  if (!value) return '';

  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
};

export default function DSAChallengeHolder({ id }: Readonly<{ id: string }>) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dsaChallenge, setDsaChallenge] = useState<DSAChallengeType | null>(
    null
  );
  const [sourceCode, setSourceCode] = useState<string>('');
  const [testResult, setTestResult] =
    useState<DSAChallengeTestResponseType | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [submissionID, setSubmissionID] = useState<string | null>(null);
  const [evaluatingSubmission, setEvaluatingSubmission] = useState(false);
  const [submissionResponseBody, setSubmissionResponseBody] =
    useState<DSAChallengeSubmissionResponse | null>(null);

  const formatRequestError = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const statusPart = status ? ` (${status})` : '';
      return `${fallback}${statusPart}: ${message || error.message}`;
    }

    return `${fallback}: unexpected error`;
  };

  const getChallenge = useCallback(async (): Promise<DSAChallengeType> => {
    setLoading(true);
    setLoadError(null);

    try {
      const resp = await api.get(`challenges/get/dsa/${id}`);
      return resp.data.challenge;
    } catch {
      setLoadError('Failed to load challenge');
      throw new Error('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onEditCode = useCallback((data: string) => {
    setSourceCode(data);
  }, []);

  const onTestCode = useCallback(async () => {
    if (!dsaChallenge) return;

    setTesting(true);
    setTestError(null);

    const payload = {
      challenge_id: dsaChallenge.id,
      language_id: 71,
      source_code: toBase64Utf8(sourceCode),
      stdin: toBase64Utf8(dsaChallenge.sample_input || ''),
      expected_output: toBase64Utf8(dsaChallenge.sample_output || ''),
    };

    try {
      const res = await api.post('challenges/test/dsa', payload);
      setTestResult(res.data);
    } catch (error) {
      setTestResult(null);
      setTestError(formatRequestError(error, 'Test failed'));
    } finally {
      setTesting(false);
    }
  }, [dsaChallenge, sourceCode]);

  const onSubmitCode = useCallback(async () => {
    if (!dsaChallenge) return;

    const payload = {
      challenge_id: dsaChallenge.id,
      language_id: 71,
      source_code: toBase64Utf8(sourceCode),
    };

    try {
      setSubmissionError(null);
      setSubmissionResponseBody(null);
      setEvaluatingSubmission(true);

      const res = await api.post('challenges/submit/dsa', payload);
      setSubmissionID(res.data.submission_id);
    } catch (error) {
      setTestResult(null);
      setEvaluatingSubmission(false);
      setSubmissionError(formatRequestError(error, 'Submit failed'));
    }
  }, [dsaChallenge, sourceCode]);

  useEffect(() => {
    getChallenge()
      .then(setDsaChallenge)
      .catch(() => {
        setDsaChallenge(null);
      });
  }, [getChallenge]);

  useEffect(() => {
    if (!submissionID) return;

    let isCancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchSubmission = async (): Promise<void> => {
      try {
        const res = await api.get('challenges/get/dsa/submission', {
          params: {
            id: submissionID,
          },
        });

        if (isCancelled) return;

        setSubmissionResponseBody(res.data);

        if (res.data?.evaluation_status === 1) {
          retryTimer = setTimeout(() => {
            void fetchSubmission();
          }, 2000);
          return;
        }

        setEvaluatingSubmission(false);
      } catch (error) {
        if (isCancelled) return;

        setEvaluatingSubmission(false);
        setSubmissionError(
          formatRequestError(error, 'Failed to fetch submission')
        );
      }
    };

    void fetchSubmission();

    return () => {
      isCancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [submissionID]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg text-[#40FD51]">Loading...</p>
      </div>
    );
  }

  if (loadError || !dsaChallenge) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg text-red-400">
          {loadError || 'Challenge not found'}
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-[1536px] flex-1 flex-col gap-6 p-6 lg:flex-row xl:gap-14 xl:px-16 xl:py-8">
      <div className="flex h-full w-full flex-col gap-6 lg:w-[46.4%] lg:flex-shrink-0">
        <DSAChallenge dsaChallenge={dsaChallenge} />
        <DSADescription dsaChallenge={dsaChallenge} />
      </div>

      <div className="w-full">
        <DSAEditor
          isEvaluating={evaluatingSubmission}
          onEditCode={onEditCode}
          onTestCode={onTestCode}
          onSubmitCode={onSubmitCode}
        />
        <div>
          <div>
            {evaluatingSubmission && <div>Evaluating submission...</div>}
            {submissionError && (
              <div className="text-red-400">{submissionError}</div>
            )}
            {submissionResponseBody?.evaluation_status === 3 && (
              <div className="text-red-400">Submission Failed</div>
            )}
            {submissionResponseBody?.evaluation_status === 2 && (
              <div className="text-green-400">Submission Passed</div>
            )}
          </div>
          <div>
            <h1>OUTPUT</h1>
            {testing && <div>Testing...</div>}
            {testError && <div className="text-red-400">{testError}</div>}
            {testResult && (
              <div>
                {testResult?.status.id === 3 ? 'Test Passed' : 'Test Failed'}
              </div>
            )}
            <pre>{fromBase64Utf8(testResult?.stdout)}</pre>
            <pre>{fromBase64Utf8(testResult?.stderr)}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}
