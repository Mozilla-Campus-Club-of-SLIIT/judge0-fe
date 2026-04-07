'use client';

import api from '@/lib/http';
import axios from 'axios';
import DSAChallenge from './DSAChallenge';
import DSADescription from './DSADescription';
import DSAEditor from './DSAEditor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DSAChallengeSubmissionResponse,
  DSAChallengeTestResponseType,
  DSAChallengeType,
} from '@/types/types';
import { languages } from '@/lib/langauges';

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
  const [selectedLanguage, setSelectedLanguage] = useState<number>(71);
  const testRequestIdRef = useRef(0);

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

    const currentRequestId = ++testRequestIdRef.current;
    setTesting(true);
    setTestError(null);
    setTestResult(null);
    setSubmissionError(null);

    const payload = {
      challenge_id: dsaChallenge.id,
      language_id: selectedLanguage,
      source_code: toBase64Utf8(sourceCode),
      stdin: toBase64Utf8(dsaChallenge.sample_input || ''),
      expected_output: toBase64Utf8(dsaChallenge.sample_output || ''),
    };

    try {
      const res = await api.post('challenges/test/dsa', payload);

      if (currentRequestId !== testRequestIdRef.current) return;
      setTestResult(res.data);
    } catch (error) {
      if (currentRequestId !== testRequestIdRef.current) return;
      setTestResult(null);
      setTestError(formatRequestError(error, 'Test failed'));
    } finally {
      if (currentRequestId === testRequestIdRef.current) {
        setTesting(false);
      }
    }
  }, [dsaChallenge, selectedLanguage, sourceCode]);

  const onSubmitCode = useCallback(async () => {
    if (!dsaChallenge) return;

    const payload = {
      challenge_id: dsaChallenge.id,
      language_id: selectedLanguage,
      source_code: toBase64Utf8(sourceCode),
    };

    try {
      setSubmissionError(null);
      setSubmissionResponseBody(null);
      setTestError(null);
      setTestResult(null);
      setEvaluatingSubmission(true);

      const res = await api.post('challenges/submit/dsa', payload);
      setSubmissionID(res.data.submission_id);
    } catch (error) {
      setTestResult(null);
      setEvaluatingSubmission(false);
      setSubmissionError(formatRequestError(error, 'Submit failed'));
    }
  }, [dsaChallenge, selectedLanguage, sourceCode]);

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

  const submission = submissionResponseBody;
  const submissionDone =
    submission && submission.evaluation_status !== 1 && !evaluatingSubmission;

  const testActive = testing || Boolean(testResult) || Boolean(testError);

  let passedCases = 0;
  let failedCases = 0;
  let totalCases = 0;

  if (testResult) {
    totalCases = 1;
    if (testResult.status.id === 3) {
      passedCases = 1;
      failedCases = 0;
    } else {
      passedCases = 0;
      failedCases = 1;
    }
  } else if (testError) {
    totalCases = 1;
    passedCases = 0;
    failedCases = 1;
  } else if (testing) {
    /* In-flight test: avoid showing previous submission counts. */
  } else if (submissionDone) {
    passedCases = submission.pass_count;
    failedCases = submission.fail_count;
    totalCases = submission.test_count;
  }

  const testStdout = fromBase64Utf8(testResult?.stdout);
  const testStderr = fromBase64Utf8(testResult?.stderr);
  const testCompile = fromBase64Utf8(testResult?.compile_output);
  const testMessage = testResult?.message ?? '';

  const outputLines = [
    !testActive && submissionError && `Submission: ${submissionError}`,
    testError && `Test: ${testError}`,
    testMessage && `Message: ${testMessage}`,
    testCompile && `Compile:\n${testCompile}`,
    testStdout,
    testStderr && `Stderr:\n${testStderr}`,
  ].filter(Boolean) as string[];

  const outputBody =
    outputLines.length > 0 ? outputLines.join('\n\n') : '\u2014';

  const resultsHeader = evaluatingSubmission
    ? 'EVALUATING SUBMISSION.....'
    : testing
      ? 'EVALUATING TEST'
      : 'RESULTS';

  const testCasesLabel =
    totalCases > 0
      ? `${totalCases} TEST CASE${totalCases === 1 ? '' : 'S'}`
      : '\u2014';

  const hasCaseMetrics =
    Boolean(testResult) ||
    Boolean(testError) ||
    (submissionDone && !testActive);

  const isSubmissionResultsPhase =
    !testActive &&
    (evaluatingSubmission ||
      submission?.evaluation_status === 1 ||
      submissionDone);

  const showOutputColumn = testActive || !isSubmissionResultsPhase;

  return (
    <main className="mx-auto flex h-full w-full max-w-[1536px] flex-1 flex-col gap-6 px-6 pb-4 pt-6 xl:gap-14 xl:px-16 xl:pb-6 xl:pt-8">
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6 lg:flex-row lg:items-stretch xl:gap-14">
        <div className="flex h-full min-h-0 w-full flex-col gap-6 lg:w-[46.4%] lg:shrink-0">
          <DSAChallenge dsaChallenge={dsaChallenge} />
          <DSADescription dsaChallenge={dsaChallenge} />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:self-stretch">
          <DSAEditor
            code={sourceCode}
            isEvaluating={evaluatingSubmission || testing}
            testing={testing}
            evaluatingSubmission={evaluatingSubmission}
            selectedLanguage={selectedLanguage}
            onEditCode={onEditCode}
            onTestCode={onTestCode}
            onSubmitCode={onSubmitCode}
            languageSelector={
              <div className="relative mr-2 w-[180px]">
                <select
                  className="custom-scrollbar w-full appearance-none border border-[#40FD51] bg-transparent py-2 pl-4 pr-12 text-sm text-white outline-none"
                  name="language"
                  id="language"
                  value={selectedLanguage ?? ''}
                  onChange={(e) => setSelectedLanguage(Number(e.target.value))}
                >
                  <option disabled hidden value="">
                    Select the Lang
                  </option>
                  {languages.map((lang) => (
                    <option
                      key={lang.id}
                      value={lang.id}
                      className="bg-[#0C0E19] text-white"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
                />
              </div>
            }
          />
        </div>
      </div>

      <section
        className="w-full shrink-0 border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300"
        aria-label="Challenge results"
      >
        <div className="border-b border-[#40FD51]/25 px-8 py-5 xl:px-10">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-[#40FD51] xl:text-xl">
            {resultsHeader}
          </h2>
        </div>
        {showOutputColumn ? (
          <div className="flex flex-col sm:flex-row">
            <div className="flex w-full flex-col gap-4 px-8 py-6 sm:w-1/3 sm:border-r sm:border-[#40FD51]/25 xl:px-10">
              <p className="text-sm font-bold uppercase tracking-wide text-[#40FD51] sm:text-base">
                PASSED TEST CASES
                {hasCaseMetrics ? (
                  <span className="ml-2 tabular-nums">{passedCases}</span>
                ) : null}
              </p>
              <p className="text-sm font-bold uppercase tracking-wide text-[#FF5733] sm:text-base">
                FAILED TEST CASES
                {hasCaseMetrics ? (
                  <span className="ml-2 tabular-nums">{failedCases}</span>
                ) : null}
              </p>
              <p className="text-sm uppercase tracking-wide text-[#ededed]/60 sm:text-base">
                {testCasesLabel}
              </p>
            </div>
            <div className="min-w-0 flex-1 border-t border-[#40FD51]/25 px-8 py-6 sm:border-t-0 xl:px-10">
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#40FD51] sm:text-base">
                OUTPUT
              </p>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white sm:text-base">
                {outputBody}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-8 py-6 xl:px-10">
            <p className="text-sm font-bold uppercase tracking-wide text-[#40FD51] sm:text-base">
              PASSED TEST CASES
              {hasCaseMetrics ? (
                <span className="ml-2 tabular-nums">{passedCases}</span>
              ) : null}
            </p>
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF5733] sm:text-base">
              FAILED TEST CASES
              {hasCaseMetrics ? (
                <span className="ml-2 tabular-nums">{failedCases}</span>
              ) : null}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#ededed]/50 sm:text-sm">
              {testCasesLabel}
            </p>
          </div>
        )}
      </section>

      <div className="h-4 w-full shrink-0 xl:h-5" aria-hidden />
    </main>
  );
}
