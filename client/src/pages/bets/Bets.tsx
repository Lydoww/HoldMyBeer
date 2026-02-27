import { getBetsCursor } from '@/api/bets';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import ProtectedBetCard from '@/components/bet/ProtectedBetCard';
import { useAuth } from '@/stores/authStore';
import { SkeletonBetItem } from '@/components/skeletons/SkeletonBetItem';
import { Spinner } from '@/components/ui/spinner';

const Bets = () => {
  const ref = useRef(null);

  const user = useAuth((state) => state.user);

  const {
    data,
    error,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['bets', 'community', user?.id],
    queryFn: ({ pageParam }) =>
      getBetsCursor(user?.id, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastCursorElem) => lastCursorElem.lastCursorElem,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && ref.current && hasNextPage) fetchNextPage();
      });
    });
    if (ref.current == null) return;
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, hasNextPage, fetchNextPage]);

  return (
    <div className='min-h-screen grid grid-rows-[auto_1fr_auto] pb-8 px-4'>
      <div className='flex justify-between m-4'>
        <h2 className='pb-4'>Community Bets</h2>
      </div>
      {error ? (
        <div className='rounded-xl border border-red-900/50 bg-red-950/30 p-4'>
          <p className='text-sm text-red-400'>{error.message}</p>
        </div>
      ) : isPending ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          <SkeletonBetItem />
        </div>
      ) : data.pages[0].communityBets.length === 0 ? (
        <div className='rounded-xl border border-border bg-card p-8 text-center'>
          <p className='text-muted-foreground'>
            No bets yet — time to create your first one!
          </p>
        </div>
      ) : (
        <>
          <div className='columns-1 sm:columns-2  md:columns-3 '>
            {data?.pages.flatMap((page) =>
              page.communityBets.map((bet) => (
                <ProtectedBetCard key={bet.id} bet={bet} />
              )),
            )}
          </div>
        </>
      )}
      {/* Pagination */}
      <div ref={ref} />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
};

export default Bets;
