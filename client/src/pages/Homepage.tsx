import { getBets } from '@/api/bets';
import { getVotes } from '@/api/votes';
import ProtectedBetCard from '@/components/bet/ProtectedBetCard';
import { SkeletonBetItem } from '@/components/layout/SkeletonBetItem';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import VoteCard from '@/components/VoteCard';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useAuth } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Trophy,
  Flame,
  Vote,
  ChevronLeft,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { me } from '@/api/auth';
import { ModalBetForm } from '@/components/modals/ModalBetForm';
import Leaderboard from '@/components/Leaderboard';

const Homepage = () => {
  const user = useAuth((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const updatePoint = useAuth((state) => state.updatePoints);

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

  const {
    data: userData,
    isPending,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => me(),
  });

  useEffect(() => {
    if (userData) {
      updatePoint(userData.points);
    }
  }, [userData, updatePoint]);

  const totalPages = betsData ? Math.ceil(betsData.total / pageSize) : 1;

  return (
    <div className='min-h-screen pb-12'>
      {/* Hero section */}
      <div className='relative overflow-hidden border-b border-border bg-card'>
        {/* Background gradient glow */}
        <div className='absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 bg-[#fde639]/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute -top-24 left-1/3 h-48 w-64 bg-[#527de3]/10 rounded-full blur-3xl pointer-events-none' />

        <div className='relative max-w-7xl mx-auto px-6 py-10'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
            <div className='space-y-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-card-foreground'>
                Welcome back,{' '}
                <span className='bg-linear-to-r from-[#fde639] to-[#527de3] bg-clip-text text-transparent'>
                  {capitalizeFirstLetter(user!.username)}
                </span>
              </h1>
              <p className='text-sm text-muted-foreground'>
                Here's an overview of your bets and votes.
              </p>
            </div>

            {/* Stats */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2 rounded-xl bg-[#fde639]/10 border border-[#fde639]/20 px-4 py-2.5'>
                <Trophy size={18} className='text-[#fde639]' />
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground leading-none'>
                    Points
                  </p>
                  <p className='text-lg font-bold text-[#fde639] leading-tight'>
                    {user?.points}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 rounded-xl bg-[#527de3]/10 border border-[#527de3]/20 px-4 py-2.5'>
                <Vote size={18} className='text-[#527de3]' />
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground leading-none'>
                    Votes
                  </p>
                  <p className='text-lg font-bold text-[#527de3] leading-tight'>
                    {votesData?.length ?? 0}
                  </p>
                </div>
              </div>

              {isModalOpen && <ModalBetForm onClose={toggleModal} />}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard section */}
      <section className='mt-8 max-w-7xl mx-auto px-6'>
        <div className='flex items-center gap-2 mb-5'>
          <Trophy size={20} className='text-[#fde639]' />
          <h2 className='text-lg font-bold text-card-foreground'>
            Leaderboard
          </h2>
        </div>

        <Leaderboard />
      </section>

      <div className='max-w-7xl mx-auto px-6'>
        {/* Bets section */}
        <section className='mt-8'>
          <div className='flex items-center gap-2 mb-5'>
            <Flame size={20} className='text-[#fde639]' />
            <h2 className='text-lg font-bold text-card-foreground'>
              Your Bets
            </h2>
            {betsData && (
              <span className='ml-1 text-xs text-muted-foreground rounded-full bg-muted px-2 py-0.5'>
                {betsData.total}
              </span>
            )}
            <Button
              variant={'outline'}
              onClick={toggleModal}
              size='sm'
              className='hidden md:flex items-center gap-1.5'
            >
              <Plus size={16} />
              Create Bet
            </Button>
          </div>

          {betsError ? (
            <div className='rounded-xl border border-red-900/50 bg-red-950/30 p-4'>
              <p className='text-sm text-red-400'>{betsError.message}</p>
            </div>
          ) : betsLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              <SkeletonBetItem />
            </div>
          ) : betsData?.data.length === 0 ? (
            <div className='rounded-xl border border-border bg-card p-8 text-center'>
              <p className='text-muted-foreground'>
                No bets yet — time to create your first one!
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {betsData?.data.map((bet) => (
                  <ProtectedBetCard key={bet.id} bet={bet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-center gap-2 mt-6'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-lg border-border text-muted-foreground hover:bg-muted'
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className='text-sm text-muted-foreground px-3'>
                    <span className='font-semibold text-card-foreground'>
                      {page}
                    </span>{' '}
                    / {totalPages}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-lg border-border text-muted-foreground hover:bg-muted'
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Votes section */}
        <section className='mt-10'>
          <div className='flex items-center gap-2 mb-5'>
            <Vote size={20} className='text-[#527de3]' />
            <h2 className='text-lg font-bold text-card-foreground'>
              Your Votes
            </h2>
            {votesData && (
              <span className='ml-1 text-xs text-muted-foreground rounded-full bg-muted px-2 py-0.5'>
                {votesData.length}
              </span>
            )}
          </div>

          {votesError ? (
            <div className='rounded-xl border border-red-900/50 bg-red-950/30 p-4'>
              <p className='text-sm text-red-400'>{votesError.message}</p>
            </div>
          ) : votesLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner />
            </div>
          ) : votesData?.length === 0 ? (
            <div className='rounded-xl border border-border bg-card p-8 text-center'>
              <p className='text-muted-foreground'>
                You haven't voted on any bets yet.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {votesData?.map((vote) => (
                <VoteCard key={vote.id} vote={vote} />
              ))}
            </div>
          )}
        </section>
      </div>
      <button
        onClick={toggleModal}
        className='md:hidden fixed bottom-6 right-6 bg-[#fde639] hover:bg-[#fde639]/80 text-primary-foreground rounded-full p-2 shadow-lg hover:shadow-xl transition-colors z-50 flex items-center justify-center cursor-pointer'
        aria-label='Create new bet'
      >
        <Plus className='w-4 h-4' />
      </button>
    </div>
  );
};

export default Homepage;
