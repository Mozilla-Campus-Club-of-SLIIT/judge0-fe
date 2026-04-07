'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import api from '@/lib/http';
import { LeaderboardUser, LeaderboardResponse } from '@/types/types';
import { supabase } from '@/lib/supabase';

// --- Internal Hooks ---

function useLeaderboard(pageSize: number) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [top3, setTop3] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get<LeaderboardResponse>(
        '/challenges/leaderboard/get',
        {
          params: { page: currentPage, pageSize },
        }
      );

      if (res.data.users) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages || 1);
        setError(null);

        if (currentPage === 1) {
          setTop3(res.data.users.slice(0, 3));
        } else {
          const top3Res = await api.get<LeaderboardResponse>(
            '/challenges/leaderboard/get',
            {
              params: { page: 1, pageSize: 3 },
            }
          );
          if (top3Res.data.users) {
            setTop3(top3Res.data.users);
          }
        }
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Error loading leaderboard. Please try again later.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('public-events', {
        config: { private: false },
      })
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Change received!', payload);
        setRefreshTick((prev) => prev + 1);
      })
      .subscribe((status, err) => {
        console.log('Realtime status:', status);
        if (err) {
          console.error('Realtime subscribe error:', err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage, pageSize, refreshTick]);

  return {
    users,
    top3,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  };
}

// --- Sub-components ---

const LeaderboardSkeleton = ({
  isFirstPage,
  pageSize,
}: {
  isFirstPage: boolean;
  pageSize: number;
}) => (
  <div className="w-full flex flex-col items-center animate-pulse">
    {isFirstPage && (
      <div className="flex items-end justify-center gap-2 md:gap-6 mb-16 w-full opacity-60">
        {/* 3rd place */}
        <div className="flex flex-col items-center w-[120px] md:w-[220px]">
          <div className="w-16 h-12 bg-[#162E19] mb-[-1.8rem]"></div>
          <div className="w-full h-40 bg-transparent border border-[#162E19] px-4 pt-12 pb-6 flex flex-col items-center gap-3">
            <div className="w-24 h-4 bg-[#162E19]"></div>
            <div className="w-16 h-3 bg-[#162E19]"></div>
            <div className="w-20 h-6 bg-[#162E19] mt-2"></div>
          </div>
        </div>
        {/* 1st place */}
        <div className="flex flex-col items-center w-[140px] md:w-[260px]">
          <div className="w-20 h-16 bg-[#162E19] mb-[-2.2rem]"></div>
          <div className="w-full h-48 bg-transparent border border-[#162E19] px-4 pt-12 pb-6 flex flex-col items-center gap-3">
            <div className="w-24 h-4 bg-[#162E19]"></div>
            <div className="w-16 h-3 bg-[#162E19]"></div>
            <div className="w-20 h-6 bg-[#162E19] mt-2"></div>
          </div>
        </div>
        {/* 2nd place */}
        <div className="flex flex-col items-center w-[120px] md:w-[220px]">
          <div className="w-16 h-12 bg-[#162E19] mb-[-1.8rem]"></div>
          <div className="w-full h-40 bg-transparent border border-[#162E19] px-4 pt-12 pb-6 flex flex-col items-center gap-3">
            <div className="w-24 h-4 bg-[#162E19]"></div>
            <div className="w-16 h-3 bg-[#162E19]"></div>
            <div className="w-20 h-6 bg-[#162E19] mt-2"></div>
          </div>
        </div>
      </div>
    )}
    <div className="w-full bg-transparent border border-[#162E19] p-2 opacity-50">
      <div className="flex items-center py-4 px-3 md:px-6 gap-4">
        <div className="w-[15%] md:w-[20%] h-3 bg-[#162E19] rounded opacity-50"></div>
        <div className="w-[60%] md:w-[55%] h-3 bg-[#162E19] rounded opacity-50"></div>
        <div className="w-[25%] h-3 bg-[#162E19] rounded opacity-50 ml-auto"></div>
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: isFirstPage ? 7 : pageSize }).map((_, i) => (
          <div
            key={i}
            className="flex items-center border border-[#162E19] bg-[#0C0E19]/80 py-3 md:py-4 px-3 md:px-6 h-14"
          >
            <div className="w-[15%] md:w-[20%] h-3 bg-[#162E19] rounded opacity-40"></div>
            <div className="w-[60%] md:w-[55%] h-3 bg-[#162E19] rounded opacity-40"></div>
            <div className="w-[25%] h-3 bg-[#162E19] rounded ml-auto opacity-40"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Podium = ({ top3 }: { top3: LeaderboardUser[] }) => {
  if (!top3 || top3.length === 0) return null;

  const podiumConfig = [
    {
      rank: 3,
      user: top3[2],
      marginClass: 'mt-[60px] md:mt-[120px] -translate-x-2 md:-translate-x-4',
      shadow: 'drop-shadow(0_0_10px_rgba(44,212,58,0.6))',
    },
    {
      rank: 1,
      user: top3[0],
      marginClass: 'mt-0 z-20',
      shadow: 'drop-shadow(0_0_12px_rgba(64,253,81,0.7))',
    },
    {
      rank: 2,
      user: top3[1],
      marginClass: 'mt-[60px] md:mt-[120px] translate-x-2 md:translate-x-4',
      shadow: 'drop-shadow(0_0_10px_rgba(64,253,81,0.6))',
    },
  ];

  return (
    <div className="flex items-start justify-center gap-2 md:gap-[70px] mb-12 md:mb-20 w-full px-2 md:px-4">
      {podiumConfig.map(
        ({ rank, user, marginClass, shadow }) =>
          user && (
            <div
              key={user.user_id}
              className={`flex flex-col items-center flex-1 max-w-[120px] md:max-w-[280px] w-full ${marginClass}`}
            >
              <div
                className={`mb-[-15px] md:mb-[-25px] relative z-10 flex items-center justify-center`}
              >
                <Image
                  src={`/assets/${rank}.svg`}
                  alt={`Rank ${rank}`}
                  width={40}
                  height={40}
                  className="object-contain w-8 h-8 md:w-10 md:h-10"
                  style={{ filter: shadow }}
                />
              </div>
              <div
                className={`w-full flex flex-col items-center pt-6 md:pt-8 pb-4 md:pb-6 border border-[#40fd51]/30 bg-[#0C0E19]/80 backdrop-blur-sm`}
              >
                <span
                  className={`text-sm md:text-2xl text-white mb-1 truncate max-w-[90%] font-normal tracking-wide`}
                >
                  {user.name}
                </span>
                <span className="text-xs md:text-xl text-white mb-3 md:mb-4 flex flex-col md:flex-row items-center">
                  {user.xp}{' '}
                  <span className="text-[#40fd51]/70 md:ml-1 text-[10px] md:text-lg">
                    XP
                  </span>
                </span>
                <div className="px-2 py-1 md:px-6 md:py-2.5 border border-[#40fd51]/40 text-[#40fd51] text-[10px] md:text-[13px] font-bold uppercase whitespace-nowrap">
                  # Rank {rank}
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

const UserRow = ({
  user,
  index,
  currentPage,
  pageSize,
  isFirstPage,
}: {
  user: LeaderboardUser;
  index: number;
  currentPage: number;
  pageSize: number;
  isFirstPage: boolean;
}) => {
  const rank =
    (currentPage - 1) * pageSize + (isFirstPage ? index + 4 : index + 1);
  return (
    <div className="flex items-center border border-[#40fd51]/60 bg-transparent py-3 md:py-4 px-3 md:px-6">
      <div className="w-[15%] md:w-[20%] text-white text-[14px] md:text-[18px] ml-1 md:ml-4">
        #{String(rank).padStart(2, '0')}
      </div>
      <div className="w-[60%] md:w-[55%] text-white text-[14px] md:text-[18px] font-normal truncate pr-2">
        {user.name}
      </div>
      <div className="w-[25%] text-white text-[14px] md:text-[18px] text-right md:text-left">
        {user.xp}
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center items-center gap-4 mt-6 text-sm pb-2">
    <button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className="text-[#40fd51] hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed font-bold text-lg"
    >
      &lt;
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-all ${
          currentPage === page
            ? 'bg-[#40fd51] text-black'
            : 'text-[#40fd51] hover:text-white'
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="text-[#40fd51] hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed font-bold text-lg"
    >
      &gt;
    </button>
  </div>
);

// --- Main Component ---

export default function Leaderboard() {
  const pageSize = 10;
  const {
    users,
    top3,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useLeaderboard(pageSize);

  const isFirstPage = currentPage === 1;

  const restOfUsers = useMemo(
    () => (isFirstPage ? users.slice(3) : users),
    [users, isFirstPage]
  );

  return (
    <div
      className="w-full flex justify-center pb-20 px-4 md:px-0"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      <main className="flex-1 flex flex-col items-center mt-8 md:mt-12 px-0 relative z-10 w-full max-w-[1000px]">
        <header className="flex flex-col items-center mb-10 md:mb-16">
          <h1 className="text-[16px] md:text-[18px] font-semibold text-[#40fd51] text-center uppercase">
            LEADERBOARD LIVE.
          </h1>
        </header>

        {loading ? (
          <LeaderboardSkeleton isFirstPage={isFirstPage} pageSize={pageSize} />
        ) : error ? (
          <div className="text-red-400 py-10 font-mono text-sm border border-red-900/30 bg-red-900/10 px-8 rounded-sm">
            {error}
          </div>
        ) : users.length > 0 || top3.length > 0 ? (
          <div className="w-full flex flex-col items-center fade-in">
            <Podium top3={top3} />

            <div className="w-full bg-transparent border border-[#40fd51]/20 p-4 md:p-8 pt-6 md:pt-10">
              <div className="flex items-center text-[#40fd51] text-[14px] md:text-[20px] font-bold pb-4 md:pb-6 mb-4 md:mb-6 border-b border-[#40fd51]/20 uppercase">
                <div className="w-[15%] md:w-[19%] ml-2 md:ml-10">Rank</div>
                <div className="w-[60%] md:w-[53%]">Participant</div>
                <div className="w-[25%] md:w-[27%] text-right md:text-left">
                  XP Points
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4 mb-4">
                {restOfUsers.map((user, index) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    index={index}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    isFirstPage={isFirstPage}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 py-12 border border-[#162E19] w-full text-center bg-[#0C0E19]/40 font-mono text-sm tracking-widest">
            NO USERS FOUND.
          </div>
        )}
      </main>
    </div>
  );
}
