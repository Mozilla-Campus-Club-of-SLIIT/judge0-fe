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

export default function DSAChallenge({
  dsaChallenge,
}: Readonly<{ dsaChallenge: DSAChallengeType }>) {
  return (
    <div className="relative flex shrink-0 flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
      <div className="border-b border-[#40FD51]/25 px-8 py-5 xl:px-10">
        <h1 className="text-lg font-semibold tracking-wide text-[#40FD51] xl:text-xl">
          {dsaChallenge?.title}
        </h1>
      </div>
      {/* Content */}
      <div className="px-8 py-6 xl:px-10">
        <div className="text-[15px] leading-7 text-[#ededed]/70 xl:text-base">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {dsaChallenge?.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
