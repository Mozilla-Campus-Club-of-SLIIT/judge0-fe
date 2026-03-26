import React from 'react';

export default function DSADescription() {
  return (
    <div className="relative flex flex-1 flex-col border border-[#40FD51]/25 bg-[#0C0E19]/80 transition-all duration-300">
      {/* Header */}
      <div className="border-b border-[#40FD51]/25 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-wide text-[#40FD51] xl:text-xl">
          Description
        </h2>
      </div>

      {/* Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 pb-12">
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#ededed]/70 xl:text-base">
          Write a program that reads a line of text and determines how many
          distinct words appear in it. Words are sequences of letters separated
          by spaces. Uppercase and lowercase letters are treated as the same.
          {'\n\n'}
          Input: A single line of text containing words separated by spaces.
          {'\n\n'}
          Output: Print the number of distinct words in the given text.
        </p>
      </div>
    </div>
  );
}
