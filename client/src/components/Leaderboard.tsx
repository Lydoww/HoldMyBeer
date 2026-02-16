import { leaderboard } from '@/api/user';
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

const Leaderboard = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboard(),
  });

  if (isPending) {
    return (
      <div className='rounded-xl border border-border bg-card p-6'>
        <p className='text-sm text-muted-foreground'>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-xl border border-red-900/50 bg-red-950/30 p-4'>
        <p className='text-sm text-red-400'>Error while loading leaderboard.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const topUsers = data.slice(0, 5);

  return (
    <div className='rounded-2xl border border-border bg-card p-6 shadow-sm'>
      <div className='space-y-3'>
        {topUsers.map((user: User, index: number) => (
          <div
            key={user.id}
            className={`flex items-center justify-between rounded-xl px-4 py-2 transition-colors
              ${
                index === 0
                  ? 'bg-[#fde639]/10 border border-[#fde639]/20'
                  : 'bg-muted/40'
              }
            `}
          >
            <div className='flex items-center gap-3'>
              {/* Rank */}
              <span
                className={`text-xs font-bold w-6 text-center
                  ${index === 0 ? 'text-[#fde639]' : 'text-muted-foreground'}
                `}
              >
                #{index + 1}
              </span>

              {/* Avatar initial */}
              <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-card-foreground'>
                {user.username.charAt(0).toUpperCase()}
              </div>

              <p className='text-sm font-medium text-card-foreground'>
                {user.username}
              </p>
            </div>

            <p
              className={`text-sm font-bold ${
                index === 0 ? 'text-[#fde639]' : 'text-[#527de3]'
              }`}
            >
              {user.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
