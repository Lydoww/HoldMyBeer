import { getBets } from '@/api/bets';
import { getVotes } from '@/api/votes';
import { BetCard } from '@/components/BetCard';
import { SkeletonBetItem } from '@/components/layout/SkeletonBetItem';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
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
    <div className='text-white pb-8 px-4'>
      <div className='flex justify-center py-8 gap-12'>
        <p>Welcome, {capitalizeFirstLetter(user!.username)}</p>
        <p>🏆{user?.points} </p>
      </div>
      <Separator className='mb-6' />
      <h2 className='pb-4'>Here are your previous bets</h2>
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {betsLoading ? (
          <SkeletonBetItem />
        ) : (
          betsData?.data.map((bet) => <BetCard key={bet.id} bet={bet} />)
        )}
      </div>
      <Separator className='m-6' />
      <ul>
        <h2 className=' pb-4'>All your votes</h2>
        {votesError ? (
          <p>Error while loading votes</p>
        ) : votesLoading ? (
          <Spinner />
        ) : (
          votesData?.map((vote) => (
            <li key={vote.id}>
              <p>{vote.choice}</p>
              <div>
                <p>{vote.bet.description} </p>
                <p>{vote.bet.title} </p>
                <p>{vote.bet.description} </p>
                <p>{vote.bet.status} </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Homepage;
