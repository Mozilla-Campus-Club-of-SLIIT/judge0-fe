'use client';

import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { getMonacoLanguage } from '@/lib/monacoLanguage';

export default function DSAEditor({
  code,
  selectedLanguage,
  onEditCode,
  onTestCode,
  onSubmitCode,
  isEvaluating,
  testing,
  evaluatingSubmission,
  languageSelector,
}: Readonly<{
  code: string;
  selectedLanguage?: number;
  onEditCode?: (code: string) => void;
  onTestCode?: () => void;
  onSubmitCode?: () => void;
  isEvaluating?: boolean;
  testing?: boolean;
  evaluatingSubmission?: boolean;
  languageSelector?: React.ReactNode;
}>) {
  const [activeAction, setActiveAction] = useState<'none' | 'test' | 'submit'>(
    'submit'
  );

  useEffect(() => {
    if (testing) {
      setActiveAction('test');
      return;
    }
    if (evaluatingSubmission) {
      setActiveAction('submit');
    }
  }, [testing, evaluatingSubmission]);

  const terminalActionBaseClass =
    'cursor-pointer border bg-transparent px-3 py-2.5 text-sm font-semibold tracking-widest text-[#40FD51] transition-[border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40FD51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0E19] disabled:cursor-not-allowed active:enabled:scale-[0.98]';

  const monacoLanguage = getMonacoLanguage(selectedLanguage);

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
        <div className="flex items-center justify-between gap-4 border-b border-[#40FD51]/25 px-8 py-3 xl:px-10">
          <span className="text-base font-medium tracking-wide text-white">
            Editor
          </span>
          {languageSelector}
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 xl:px-8 xl:py-6">
          <div className="min-h-48 flex-1 overflow-hidden rounded border border-[#40FD51]/15 bg-[#05070f]">
            <Editor
              height="100%"
              language={monacoLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                onEditCode?.(value ?? '');
              }}
              onMount={(editor) => editor.focus()}
              options={{
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                tabSize: 4,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                padding: {
                  top: 16,
                  bottom: 16,
                },
              }}
            />
          </div>

          <div className="mt-4 flex self-end gap-1.5">
            <button
              disabled={isEvaluating}
              onClick={() => {
                setActiveAction('test');
                onTestCode?.();
              }}
              type="button"
              className={`${terminalActionBaseClass} ${
                activeAction === 'test'
                  ? 'border-[#40FD51]'
                  : 'border-transparent'
              }`}
            >
              RUN / TEST
            </button>
            <button
              disabled={isEvaluating}
              onClick={() => {
                setActiveAction('submit');
                onSubmitCode?.();
              }}
              type="button"
              className={`${terminalActionBaseClass} ${
                activeAction === 'submit'
                  ? 'border-[#40FD51]'
                  : 'border-transparent'
              }`}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
