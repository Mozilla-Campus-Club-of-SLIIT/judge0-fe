'use client';

import { basicSetup, EditorView } from 'codemirror';
import React, { useEffect, useRef, useState } from 'react';

export default function DSAEditor({
  onEditCode,
  onTestCode,
  onSubmitCode,
  isEvaluating,
  testing,
  evaluatingSubmission,
  languageSelector,
}: Readonly<{
  onEditCode?: (code: string) => void;
  onTestCode?: () => void;
  onSubmitCode?: () => void;
  isEvaluating?: boolean;
  testing?: boolean;
  evaluatingSubmission?: boolean;
  languageSelector?: React.ReactNode;
}>) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
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

  useEffect(() => {
    if (!editorRef.current) return;

    viewRef.current = new EditorView({
      extensions: [
        basicSetup,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onEditCode?.(update.state.sliceDoc());
          }
        }),
      ],
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [onEditCode]);

  const terminalActionBaseClass =
    'cursor-pointer border bg-transparent px-3 py-2.5 text-sm font-semibold tracking-widest text-[#40FD51] transition-[border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40FD51] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0E19] disabled:cursor-not-allowed active:enabled:scale-[0.98]';

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
        {/* Terminal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#40FD51]/25 px-8 py-3 xl:px-10">
          <span className="text-base font-medium tracking-wide text-white">
            Terminal
          </span>
          {languageSelector}
        </div>

        {/* Terminal Content */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 pb-20 xl:px-10">
          <div ref={editorRef} className="min-h-48 flex-1" />

          {/* Buttons */}
          <div className="absolute bottom-6 right-8 flex gap-1.5 xl:right-10">
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
