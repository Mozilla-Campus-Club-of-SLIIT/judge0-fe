'use client';

import api from '@/lib/http';
import axios from 'axios';
import DSAChallenge from './DSAChallenge';
import DSADescription from './DSADescription';
import DSAEditor from './DSAEditor';
import { useCallback, useEffect, useState } from 'react';
import { DSAChallengeTestResponseType, DSAChallengeType } from '@/types/types';

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
  const [testing, setTesting] = useState(false);

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

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const statusPart = status ? ` (${status})` : '';
        setTestError(`Test failed${statusPart}: ${message || error.message}`);
      } else {
        setTestError('Test failed due to an unexpected error');
      }
    } finally {
      setTesting(false);
    }
  }, [dsaChallenge, sourceCode]);

  useEffect(() => {
    getChallenge()
      .then(setDsaChallenge)
      .catch(() => {
        setDsaChallenge(null);
      });
  }, [getChallenge]);

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
        <DSAEditor onEditCode={onEditCode} onTestCode={onTestCode} />
        <div>
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
