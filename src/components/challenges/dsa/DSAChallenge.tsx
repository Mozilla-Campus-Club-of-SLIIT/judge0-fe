import React from 'react';

export default function DSAChallenge() {
  return (
    <div className="relative flex flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
      {/* Header */}
      <div className="border-b border-[#40FD51]/25 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-wide text-[#40FD51] xl:text-xl">
          Count Distinct Words
        </h1>
      </div>
      {/* Content */}
      <div className="p-6">
        <p className="text-[15px] leading-7 text-[#ededed]/70 xl:text-base">
          Write a program that reads a line of text and determines how many
          distinct words appear in it. Words are sequences of letters separated
          by spaces. Uppercase....
        </p>
      </div>
    </div>
  );
}
