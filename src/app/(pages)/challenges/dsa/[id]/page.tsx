import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import DSAChallengeHolder from '@/components/challenges/dsa/DSAChallengeHolder';

export default async function DSAChallengePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <div className="relative z-10 flex h-screen flex-col font-sans text-[#ededed]">
      <Navbar />

      <DSAChallengeHolder id={id} />
    </div>
  );
}
