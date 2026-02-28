import Image from 'next/image';

export default function heroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-[20px] border-2 text-[#40fd51] pr-10 pl-10 p-0.5 relative ">
        STATUS GREEN. WELCOME PARTICIPANTS.
      </h1>

      <Image
        src="/assets/logo.svg"
        width={550}
        height={370}
        className="w-137.5 h-92.5 relative "
        alt="logo"
      />

      <div className="text-center text-3xl text-[#ededed] ">
        <p>The ultimate arena for developers.</p>

        <p>
          Test your skills, solve complex algorithmic challenges, and climb the
          leaderboard.
        </p>
      </div>

      <div>
        <button className="text-[23px] border-2 cursor-pointer relative top-10 text-[#40fd51] pr-20 pl-20">
          VIEW LEADERBOARD
        </button>
      </div>
    </div>
  );
}
