import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import LinuxChallenge from '@/components/challenges/linux/LinuxChallenge';

export default async function LinuxChallengePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <div className="relative z-10 flex min-h-screen flex-col font-sans text-[#ededed]">
      <Navbar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-16 lg:py-12">
          <LinuxChallenge id={id} />
        </div>
      </div>
    </div>
  );
}
