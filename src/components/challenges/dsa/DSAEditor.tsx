'use client';

import { basicSetup, EditorView } from 'codemirror';
import React, { useEffect, useRef } from 'react';

export default function DSAEditor({
  onEditCode,
  onTestCode,
  onSubmitCode,
  isEvaluating,
  languageSelector,
}: Readonly<{
  onEditCode?: (code: string) => void;
  onTestCode?: () => void;
  onSubmitCode?: () => void;
  isEvaluating?: boolean;
  languageSelector?: React.ReactNode;
}>) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

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
          <div className="absolute bottom-6 right-8 flex gap-3 xl:right-10">
            <button
              disabled={isEvaluating}
              onClick={onTestCode}
              type="button"
              className="cursor-pointer border border-[#40FD51] bg-transparent px-10 py-2.5 text-sm font-semibold tracking-widest text-[#40FD51] transition-all duration-200 hover:border-[#40FD51] hover:bg-[#40FD51]/10 active:scale-[0.98]"
            >
              Test
            </button>
            <button
              disabled={isEvaluating}
              onClick={onSubmitCode}
              type="button"
              className="cursor-pointer border border-[#40FD51] bg-transparent px-10 py-2.5 text-sm font-semibold tracking-widest text-[#40FD51] transition-all duration-200 hover:border-[#40FD51] hover:bg-[#40FD51]/10 active:scale-[0.98]"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
