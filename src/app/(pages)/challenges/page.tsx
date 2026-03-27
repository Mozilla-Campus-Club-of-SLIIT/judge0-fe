'use client';

import React from 'react';
import ChallengeCardHolder, {
  Challenge,
} from '@/components/challenges/ChallengeCardHolder';

const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
  {
    id: '2',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
  {
    id: '3',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
  {
    id: '4',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
  {
    id: '5',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
  {
    id: '6',
    title: 'Count Distinct Words',
    description:
      'Write a program that reads a line of text and determines how many distinct words appear in it. Words are sequences of letters separated by spaces. Uppercase...',
  },
];

export default function ChallengesPage() {
  const handleStartChallenge = (id: string) => {
    console.log(`Starting challenge: ${id}`);
  };

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
        <ChallengeCardHolder
          challenges={DUMMY_CHALLENGES}
          onStartChallenge={handleStartChallenge}
        />
      </div>
    </div>
  );
}
