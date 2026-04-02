'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/http';
import { LeaderboardUser, LeaderboardResponse } from '@/types/types';

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<LeaderboardResponse>('/challenges/leaderboard/get', {
        params: { page: 1, pageSize: 10 },
      })
      .then((res) => setUsers(res.data.users))
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <main className="flex-1 flex flex-col items-center mt-12 px-6 relative z-10 w-full mb-20">
        <h1 className="text-[20px] text-[#40fd51] text-center mb-8">
          LEADERBOARD LIVE
        </h1>

        <div className="w-[85vw] max-w-[2000px] mt-15 overflow-x-auto bg-[#0C0E19]/80  border-[#162E19]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-6 px-10 border-2 border-[#162E19] text-[#40fd51] text-left w-[10%]">
                  Rank
                </th>
                <th className="py-6 px-10 border-2 border-[#162E19] text-[#40fd51] text-left w-[60%]">
                  Name
                </th>
                <th className="py-6 px-10 border-2 border-[#162E19] text-[#40fd51] text-left w-[30%]">
                  XP
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 text-center text-gray-400 border-2 border-[#162E19]"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 text-center text-red-400 border-2 border-[#162E19]"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                users.map((user, index) => (
                  <tr key={user.user_id}>
                    <td className="py-4 px-10 border-2 border-[#162E19] text-white">
                      {index + 1}
                    </td>
                    <td className="py-4 px-10 border-2 border-[#162E19] text-white">
                      {user.name}
                    </td>
                    <td className="py-4 px-10 border-2 border-[#162E19] text-[#40fd51]">
                      {user.xp}
                    </td>
                  </tr>
                ))}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 text-center text-gray-400 border-2 border-[#162E19]"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
