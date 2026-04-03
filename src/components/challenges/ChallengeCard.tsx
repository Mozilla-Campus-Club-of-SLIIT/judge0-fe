import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/ChallengeCard';

export interface ChallengeCardProps {
  title: string;
  description: string;
  marks: number;
  onStart?: () => void;
  /** When false, Start is non-interactive (e.g. no route for this challenge type yet). */
  startDisabled?: boolean;
}

export default function ChallengeCard({
  title,
  description,
  onStart,
  marks,
  startDisabled,
}: Readonly<ChallengeCardProps>) {
  const getXp = (marks: number): 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME' => {
    switch (marks) {
      case 5:
        return 'EASY';
      case 10:
        return 'MEDIUM';
      case 15:
        return 'HARD';
      case 25:
        return 'EXTREME';
      default:
        return 'EASY';
    }
  };

  return (
    <Card rounded="sm" size="md">
      <CardHeader xp={getXp(marks)} className="ml-2 " />
      <CardContent className="text-white mt-4 flex-1 ">
        <h1 className="text-xl line-clamp-2 my-4">{title}</h1>
        <p className="line-clamp-4 ">{description}</p>
      </CardContent>
      <CardFooter align="center">
        <button
          className="w-full mx-2 my-3 border text-green-500 border-green-500 p-2 cursor-pointer transition-all hover:bg-green-800/30"
          type="button"
          disabled={startDisabled}
          onClick={onStart}
        >
          START CHALLENGE
        </button>
      </CardFooter>
    </Card>
  );
}
