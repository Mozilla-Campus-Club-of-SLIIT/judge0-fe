import React from 'react';

export interface ChallengeCardProps {
  title: string;
  description: string;
  onStart?: () => void;
}

export default function ChallengeCard({
  title,
  description,
  onStart,
}: ChallengeCardProps) {
  return (
    <div className="group relative flex w-full h-[291px] flex-col justify-between border border-[#40FD51]/15 bg-[#0C0E19]/80 p-7 transition-all duration-300 hover:border-[#40FD51]/30 hover:shadow-[0_0_20px_rgba(64,253,81,0.1)]">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#40FD51]">{title}</h3>
        <p className="text-base leading-7 text-[#ededed]/70">{description}</p>
      </div>

      <button
        onClick={onStart}
        className="w-full cursor-pointer border border-[#40FD51]/40 bg-transparent px-4 py-3 text-sm font-semibold tracking-widest text-[#40FD51] transition-all duration-200 hover:bg-[#40FD51]/10 hover:border-[#40FD51]/60 active:scale-[0.98]"
      >
        START CHALLENGE
      </button>
    </div>
  );
}
