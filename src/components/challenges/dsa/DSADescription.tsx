import { DSAChallengeType } from '@/types/types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

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
        <code>{dsaChallenge.sample_input}</code>
        <br />
        <code>{dsaChallenge.sample_output}</code>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {dsaChallenge.note}
        </ReactMarkdown>
      </div>
    </div>
  );
}
