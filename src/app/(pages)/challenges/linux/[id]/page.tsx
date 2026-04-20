import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import LinuxChallenge from '@/components/challenges/linux/LinuxChallenge';

export default async function LinuxChallengePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  // Hardcoded data as requested
  const linuxChallenge = {
    id: parseInt(id),
    title: 'The Missing Log File',
    description:
      'A suspicious process has been deleting log files in the `/var/log` directory. Your task is to find the hidden backup of the deleted log file and retrieve the flag stored inside it.',
    note: '### Steps to follow:\n1. Connect to the server via SSH.\n2. Navigate to the recovery directory.\n3. The flag is in the format `FLAG{...}`.\n\n*Note: Use `ls -a` to find hidden files.*',
    marks: 50,
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col font-sans text-[#ededed]">
      <Navbar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-16 lg:py-12">
          <LinuxChallenge challenge={linuxChallenge} />
        </div>
      </div>
    </div>
  );
}
