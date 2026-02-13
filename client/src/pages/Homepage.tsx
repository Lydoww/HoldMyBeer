import { getBets } from '@/api/bets';
import { getVotes } from '@/api/votes';
import ProtectedBetCard from '@/components/bet/ProtectedBetCard';
import { SkeletonBetItem } from '@/components/layout/SkeletonBetItem';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import VoteCard from '@/components/VoteCard';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useAuth } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const Homepage = () => {
  const user = useAuth((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: votesData,
    isPending: votesLoading,
    error: votesError,
  } = useQuery({
    queryKey: ['votes', user?.id],
    queryFn: () => getVotes(user?.id),
  });

  const {
    data: betsData,
    isPending: betsLoading,
    error: betsError,
  } = useQuery({
    queryKey: ['bets', page, pageSize, user?.id],
    queryFn: () => getBets(page, pageSize, user?.id),
  });

  return (
    <div className='pb-8 px-4'>
      <div className='flex justify-center py-8 gap-12'>
        <p>Welcome, {capitalizeFirstLetter(user!.username)}</p>
        <p>🏆{user?.points} </p>
      </div>
      <Separator className='mb-6' />
      <h2 className='pb-4'>Here are your previous bets</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {betsError ? (
          <p className='text-red-500'>{betsError.message}</p>
        ) : betsLoading ? (
          <SkeletonBetItem />
        ) : (
          betsData?.data.map((bet) => (
            <ProtectedBetCard key={bet.id} bet={bet} />
          ))
        )}
      </div>
      <Separator className='mb-6 mt-6' />
      <ul>
        <h2 className=' pb-4'>All your votes</h2>
        <div className='flex flex-col gap-4'>
          {votesError ? (
            <p>{votesError.message}</p>
          ) : votesLoading ? (
            <Spinner />
          ) : (
            votesData?.map((vote) => <VoteCard key={vote.id} vote={vote} />)
          )}
        </div>
      </ul>
    </div>
  );
};

export default Homepage;
