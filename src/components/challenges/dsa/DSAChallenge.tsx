import { DSAChallengeType } from '@/types/types';
import React from 'react';

export default function DSAChallenge({
  dsaChallenge,
}: Readonly<{ dsaChallenge: DSAChallengeType }>) {
  return (
    <div className="relative flex flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
      <div className="border-b border-[#40FD51]/25 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-wide text-[#40FD51] xl:text-xl">
          {dsaChallenge?.title}
        </h1>
      </div>
      {/* Content */}
      <div className="p-6">
        <p className="text-[15px] leading-7 text-[#ededed]/70 xl:text-base">
          {dsaChallenge?.description}
        </p>
      </div>
    </div>
  );
}
