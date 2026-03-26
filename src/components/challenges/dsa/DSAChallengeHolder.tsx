'use client';

import React, { useState } from 'react';
import DSAChallenge from './DSAChallenge';
import DSADescription from './DSADescription';
import DSAEditor from './DSAEditor';

export default function DSAChallengeHolder({ id }: { id: string }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    console.log('Submitting code:', code);
    // submission logic here
  };

  return (
    <main className="mx-auto flex h-full w-full max-w-[1536px] flex-1 flex-col gap-6 p-6 lg:flex-row xl:gap-14 xl:px-16 xl:py-8">
      {/* Left Panel: Info Cards */}
      <div className="flex h-full w-full flex-col gap-6 lg:w-[46.4%] lg:flex-shrink-0">
        <DSAChallenge />
        <DSADescription />
      </div>

      {/* Right Panel: Terminal area */}
      <DSAEditor code={code} setCode={setCode} onSubmit={handleSubmit} />
    </main>
  );
}
