import Image from 'next/image';
//Hero Section

export default function heroSection() {
  return (
    //This Div contains the whole content and is responsive

    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* 
      
        This is the first heading
                 |
                 |
                 V

*/}

      <h1 className="text-[20px] border-2 text-[#40fd51] pr-10 pl-10 p-0.5 relative ">
        STATUS GREEN. WELCOME PARTICIPANTS.
      </h1>

      {/*
        
            SVG is here 
                |
                |
                V
        
*/}

      <Image
        src="/assets/logo.svg"
        className="w-137.5 h-92.5 relative "
        alt="logo"
      />

      {/*
      The description is inside the div tag the styles are applied to the div tag
                    |
                    |
                    V
            
*/}
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
