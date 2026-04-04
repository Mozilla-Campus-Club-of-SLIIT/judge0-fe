'use client';

import Navbar from '@/components/navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/http';
import { languages } from '@/lib/langauges';
import { Judge0SubmissionDetails } from '@/types/types';
import { haveAccess } from '@/utils/utils';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const decodeBase64 = (encoded: string): string => {
  try {
    return atob(encoded.trim());
  } catch {
    return encoded;
  }
};

const CodePreview = ({
  code,
  textColor = 'text-zinc-300',
}: {
  code: string;
  textColor?: string;
}) => {
  if (!code || code.trim() === '') {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-3 text-xs text-zinc-500">
        (empty)
      </div>
    );
  }

  const lines = code.split('\n');
  const maxLineDigits = lines.length.toString().length;

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950/60">
      <pre className={`text-xs leading-relaxed ${textColor}`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={`${index}-${line.slice(0, 20)}`}>
                <td className="w-12 select-none border-r border-zinc-700 px-4 py-1 text-right text-zinc-600">
                  {String(index + 1).padStart(maxLineDigits, ' ')}
                </td>
                <td className="px-4 py-1">
                  <code>{line || '\u00A0'}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    </div>
  );
};

const getLanguageName = (languageId: number): string => {
  const language = languages.find((lang) => lang.id === languageId);
  return language ? language.name : `Language ${languageId}`;
};

const getStatusColor = (statusId: number): string => {
  if (statusId === 3) {
    return 'text-emerald-400 bg-emerald-500/10';
  }

  if (statusId === 4) {
    return 'text-red-400 bg-red-500/10';
  }

  return 'text-zinc-400 bg-zinc-600/10';
};

export default function SubmissionDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const userContext = useAuth();
  const searchParams = useSearchParams();
  const userName = searchParams.get('name');
  const submissionId = searchParams.get('submissionId');
  const [token, setToken] = useState<string>('');
  const [details, setDetails] = useState<Judge0SubmissionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setToken(id);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<Judge0SubmissionDetails>(
          `/admin/submissions/dsa/${token}`
        );

        if (!mounted) {
          return;
        }

        setDetails(res.data);
      } catch {
        if (!mounted) {
          return;
        }

        setError('Failed to load submission details.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [token]);

  if (!haveAccess(['Codenight host'], userContext?.user?.roles || [])) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-12 text-zinc-300 md:px-8">
          You do not have access to view submission details.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#40FD51] md:text-3xl">
            Submission Details
          </h1>
          <div className="mt-2 space-y-1">
            {userName && (
              <p className="text-sm text-zinc-300">
                User:{' '}
                <span className="font-semibold text-[#40FD51]">{userName}</span>
              </p>
            )}
            {submissionId && (
              <p className="text-sm text-zinc-300">
                Submission ID:{' '}
                <span className="font-semibold text-[#40FD51]">
                  {submissionId}
                </span>
              </p>
            )}
            <p className="text-sm text-zinc-400">Token: {token}</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 py-12">
            <p className="text-zinc-400">Loading submission details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-800 bg-red-500/10 px-6 py-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && details && (
          <div className="space-y-4">
            {/* Status and Language */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-2 text-sm text-zinc-400">Status</p>
                <div
                  className={`inline-flex rounded-lg px-3 py-2 font-semibold ${getStatusColor(details.status.id)}`}
                >
                  {details.status.description}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-2 text-sm text-zinc-400">Language</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {getLanguageName(details.language_id)}
                </p>
              </div>
            </div>

            {/* Source Code */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="mb-3 text-sm font-semibold text-zinc-300">
                Source Code
              </p>
              <CodePreview code={decodeBase64(details.source_code)} />
            </div>

            {/* Input and Expected Output */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Input (stdin)
                </p>
                <CodePreview code={decodeBase64(details.stdin)} />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Expected Output
                </p>
                <CodePreview code={decodeBase64(details.expected_output)} />
              </div>
            </div>

            {/* Actual Output and Stderr */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Actual Output (stdout)
                </p>
                <CodePreview
                  code={decodeBase64(details.stdout)}
                  textColor="text-emerald-300"
                />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="mb-3 text-sm font-semibold text-zinc-300">
                  Error Output (stderr)
                </p>

                {details.stderr ? (
                  <CodePreview
                    code={decodeBase64(details.stderr)}
                    textColor="text-red-300"
                  />
                ) : (
                  <p className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-3 text-xs text-zinc-500">
                    No errors
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
