'use client';

import Navbar from '@/components/navbar/Navbar';

export default function Leaderboard() {
  return (
    <div>
      <Navbar />

      <main className="flex-1 flex flex-col items-center mt-12 px-6 relative z-10 w-full mb-20">
        <h1 className="text-[20px] text-[#40fd51] text-center mb-8">
          LEADERBOARD LIVE
        </h1>

        <div className="w-[85vw] max-w-[2000px] mt-15 overflow-x-auto bg-[#0C0E19]/80 border-[#162E19]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[18%] h-[5%] py-6 px-20 border-2 border-[#162E19]"></th>
                <th className="w-[18%] h-[5%] py-6 px-20 border-2 border-[#162E19]"></th>
                <th className="w-[18%] h-[5%] py-6 px-20 border-2 border-[#162E19]"></th>
                <th className="w-[46%] h-[5%] py-6 px-20 border-2 border-[#162E19]"></th>
              </tr>

              <tr>
                <th className="py-70 px-20 border-2 border-[#162E19]"></th>
                <th className="py-70 px-20 border-2 border-[#162E19]"></th>
                <th className="py-70 px-20 border-2 border-[#162E19]"></th>
                <th className="py-70 px-20 border-2 border-[#162E19]"></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
