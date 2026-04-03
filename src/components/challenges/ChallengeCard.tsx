import React from 'react';

export interface ChallengeCardProps {
  title: string;
  description: string;
  onStart?: () => void;
  /** When false, Start is non-interactive (e.g. no route for this challenge type yet). */
  startDisabled?: boolean;
}

export default function ChallengeCard({
  title,
  description,
  onStart,
  startDisabled,
}: Readonly<ChallengeCardProps>) {
  return (
    <div className="group relative flex w-full h-[291px] flex-col justify-between border border-[#40FD51]/15 bg-[#0C0E19]/80 p-7 transition-all duration-300 hover:border-[#40FD51]/30 hover:shadow-[0_0_20px_rgba(64,253,81,0.1)]">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#40FD51]">{title}</h3>
        <p className="text-base leading-7 text-[#ededed]/70">{description}</p>
      </div>

      <button
        type="button"
        disabled={startDisabled}
        onClick={onStart}
        className="w-full cursor-pointer border border-[#40FD51]/40 bg-transparent px-4 py-3 text-sm font-semibold tracking-widest text-[#40FD51] transition-all duration-200 hover:bg-[#40FD51]/10 hover:border-[#40FD51]/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-[#40FD51]/40"
      >
        START CHALLENGE
      </button>
    </div>
  );
}
