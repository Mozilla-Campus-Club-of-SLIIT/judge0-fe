'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Challenge } from '@/types/types';
import ChallengeCard from './ChallengeCard';

function isDSAChallenge(challenge: Challenge): boolean {
  return challenge.type?.trim().toUpperCase() === 'DSA';
}

interface ChallengeCardHolderProps {
  challenges: Challenge[];
}

export default function ChallengeCardHolder({
  challenges,
}: Readonly<ChallengeCardHolderProps>) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,408px)] justify-center gap-6">
      {challenges.map((challenge) => {
        const isDsa = isDSAChallenge(challenge);
        return (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            description={challenge.description}
            startDisabled={!isDsa}
            onStart={
              isDsa
                ? () => router.push(`/challenges/dsa/${challenge.id}`)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
