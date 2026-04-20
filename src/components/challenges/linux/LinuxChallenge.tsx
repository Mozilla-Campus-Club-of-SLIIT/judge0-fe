'use client';

import React, { useState, ReactNode } from 'react';
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
  challenge: {
    title: string;
    description: string;
    note?: string | null;
  };
}

export default function LinuxChallenge({
  challenge,
}: Readonly<LinuxChallengeProps>) {
  const [flag, setFlag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting flag:', flag);
    // Logic for submission would go here (e.g., API call)
  };

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
              className="flex-1 border border-[#40FD51]/30 bg-[#0C0E19] px-4 py-3 text-sm text-[#ededed] placeholder:text-[#ededed]/30 focus:border-[#40FD51]/60 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="cursor-pointer border border-[#40FD51]/40 bg-[#40FD51]/10 px-8 py-3 text-sm font-semibold tracking-widest text-[#40FD51] transition-all hover:border-[#40FD51]/60 hover:bg-[#40FD51]/20 active:scale-[0.98]"
            >
              SUBMIT FLAG
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
