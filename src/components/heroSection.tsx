import Image from 'next/image';
import Button from '@/components/ViewLeaderboardButton/Button';

export default function heroSection() {
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

      <Button>VIEW LEADERBOARD</Button>
    </div>
  );
}
