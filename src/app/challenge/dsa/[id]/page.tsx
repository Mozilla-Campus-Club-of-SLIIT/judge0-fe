import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import DSAChallengeHolder from '@/components/challenges/dsa/DSAChallengeHolder';

export default function DSAChallengePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="relative z-10 flex h-screen flex-col font-sans text-[#ededed]">
      <Navbar />

      <DSAChallengeHolder id={params.id} />
    </div>
  );
}
