import React from 'react';
import ChallengesContent from '@/components/challenges/ChallengesContent';

export default function ChallengesPage() {
  return (
    <div className="relative z-10 min-h-screen px-4 py-12 sm:px-6 lg:px-16">
      {/* Header area */}
      <div className="mx-auto mb-12 max-w-7xl">
        <h1 className="text-center text-base tracking-[0.05em] text-[#40FD51] sm:text-lg">
          PHASE ONE ENGAGED.
        </h1>
      </div>

      {/* Challenge cards grid */}
      <div className="mx-auto max-w-7xl">
        <ChallengesContent />
      </div>
    </div>
  );
}
