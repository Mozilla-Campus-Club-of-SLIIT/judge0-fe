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

  const getChallengeType = (challenge: Challenge): string => {
    if (challenge.type) {
      return challenge.type.trim().toLowerCase();
    }
    return 'UNKNOWN';
  };

  const handleChallengeStart = (challenge: Challenge) => {
    const type = getChallengeType(challenge);
    if (type !== 'unknown') {
      router.push(`/challenges/${type}/${challenge.id}`);
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,408px)] justify-center gap-6">
      {challenges.map((challenge) => {
        const challengeType = getChallengeType(challenge);
        return (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            description={challenge.description}
            marks={challenge.marks}
            startDisabled={challengeType === 'unknown'}
            onStart={
              challengeType !== 'unknown'
                ? () => handleChallengeStart(challenge)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
