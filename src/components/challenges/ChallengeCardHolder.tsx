import React from 'react';
import ChallengeCard from './ChallengeCard';

export interface Challenge {
  id: string;
  title: string;
  description: string;
}

interface ChallengeCardHolderProps {
  challenges: Challenge[];
  onStartChallenge?: (id: string) => void;
}

export default function ChallengeCardHolder({
  challenges,
  onStartChallenge,
}: ChallengeCardHolderProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,408px)] justify-center gap-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          title={challenge.title}
          description={challenge.description}
          onStart={() => onStartChallenge?.(challenge.id)}
        />
      ))}
    </div>
  );
}
