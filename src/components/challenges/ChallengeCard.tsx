import React from 'react';
import Image from 'next/image';
import {
  getChallengeDifficultyColorByMarks,
  getChallengeDifficultyByMarks,
  getChallengeXpFromMarks,
} from '@/lib/challengeMeta';

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
  marks,
  onStart,
  startDisabled,
}: Readonly<ChallengeCardProps>) {
  const maxDescLength = 95;
  const truncatedDesc =
    description.length > maxDescLength
      ? `${description.slice(0, maxDescLength).trimEnd()}...`
      : description;

  const difficulty = getChallengeDifficultyByMarks(marks);
  const difficultyColor = getChallengeDifficultyColorByMarks(marks);
  const xp = getChallengeXpFromMarks(marks);

  return (
    <div className="group relative flex h-[291px] w-full flex-col justify-between border border-[#40FD51]/15 bg-[#0C0E19]/80 px-7 pb-7 pt-4 transition-all duration-300 hover:border-[#40FD51]/30 hover:shadow-[0_0_20px_rgba(64,253,81,0.1)]">
      <div>
        <div className="mb-7 flex items-center justify-between">
          <div
            className="inline-flex h-6 min-w-[68px] items-center justify-center border bg-[#14321f]/50 px-3 text-center text-xs leading-none font-semibold tracking-wide max-[420px]:px-2.5"
            style={{
              borderColor: difficultyColor,
              color: difficultyColor,
              backgroundColor: `${difficultyColor}1A`,
            }}
          >
            <span className="relative top-px">{difficulty}</span>
          </div>

          <div className="flex h-7 items-center gap-1.5 bg-[#14321f]/80 px-3 ">
            <Image
              src="/assets/medal.svg"
              alt="Medal icon"
              width={16}
              height={16}
            />
            <span className="text-sm font-semibold tracking-wide text-[#38D949]">
              +{xp} XP
            </span>
          </div>
        </div>

        <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
        <p className="text-base leading-7 text-[#ededed]/70">{truncatedDesc}</p>
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
