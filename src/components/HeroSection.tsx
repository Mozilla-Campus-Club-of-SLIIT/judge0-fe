import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-[20px] text-[#40fd51] pr-10 pl-10 p-0.5 relative ">
        STATUS GREEN. WELCOME PARTICIPANTS.
      </h1>

      <Image
        src="/assets/logo.svg"
        width={550}
        height={370}
        className="w-137.5 h-92.5 relative "
        alt="logo"
      />

      <div className="text-center text-[18px]">
        <p>The ultimate arena for developers.</p>

        <p>
          Test your skills, solve complex algorithmic challenges, and climb the
          leaderboard.
        </p>
      </div>

      <Link
        href="/leaderboard"
        className="text-[23px] border-2 cursor-pointer relative top-10 text-[#40FD51] pr-20 pl-20 mt-1"
      >
        VIEW LEADERBOARD
      </Link>
    </div>
  );
}
