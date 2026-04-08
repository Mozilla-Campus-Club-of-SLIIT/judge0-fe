import { DSAChallengeType } from '@/types/types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
  p: ({ children }: Readonly<{ children?: React.ReactNode }>) => (
    <p className="mt-4 leading-7 first:mt-0">{children}</p>
  ),
  ul: ({ children }: Readonly<{ children?: React.ReactNode }>) => (
    <ul className="ml-6 mt-4 list-disc">{children}</ul>
  ),
};

export default function DSADescription({
  dsaChallenge,
}: Readonly<{ dsaChallenge: DSAChallengeType }>) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300 lg:min-h-[min(24rem,45vh)]">
      <div className="shrink-0 border-b border-[#40FD51]/25 px-8 py-5 xl:px-10">
        <h2 className="text-lg font-semibold tracking-wide text-[#40FD51] xl:text-xl">
          Description
        </h2>
      </div>
      <div className="custom-scrollbar min-h-40 flex-1 overflow-y-auto px-8 py-6 pb-12 xl:px-10">
        <div className="mb-6 flex flex-col gap-4">
          <section className="rounded border border-[#40FD51]/25 bg-[#05070f]">
            <header className="border-b border-[#40FD51]/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#40FD51]">
              Sample Input
            </header>
            <pre className="custom-scrollbar overflow-x-auto px-4 py-3 text-sm leading-6 text-[#E6FEE9]">
              <code>
                {dsaChallenge.sample_input || 'No sample input provided.'}
              </code>
            </pre>
          </section>

          <section className="rounded border border-[#40FD51]/25 bg-[#05070f]">
            <header className="border-b border-[#40FD51]/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#40FD51]">
              Sample Output
            </header>
            <pre className="custom-scrollbar overflow-x-auto px-4 py-3 text-sm leading-6 text-[#E6FEE9]">
              <code>
                {dsaChallenge.sample_output || 'No sample output provided.'}
              </code>
            </pre>
          </section>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {dsaChallenge.note}
        </ReactMarkdown>
      </div>
    </div>
  );
}
