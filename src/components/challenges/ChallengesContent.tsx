'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/http';
import { Challenge, ChallengesResponse } from '@/types/types';
import ChallengeCardHolder from './ChallengeCardHolder';

export default function ChallengesContent() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api
      .get<ChallengesResponse>('/challenges/get', {
        params: { page: 1, pageSize: 10 },
      })
      .then((res) => setChallenges(res.data.challenges))
      .catch(() => setError('Failed to load challenges.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStartChallenge = (challenge: Challenge) => {
    if (challenge.type === 'DSA') {
      router.push(`/challenges/dsa/${challenge.id}`);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-[#40FD51]/60 tracking-widest">
        LOADING...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 tracking-widest">{error}</p>;
  }

  return (
    <ChallengeCardHolder
      challenges={challenges}
      onStartChallenge={handleStartChallenge}
    />
  );
}
