import { getOneBet } from '@/api/bets';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { Spinner } from '@/components/ui/spinner';
import { Trophy, Vote, Calendar, User, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter, formattedDate } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';

const Bet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ['bet', id],
    queryFn: () => getOneBet(Number(id)),
  });

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='rounded-xl border border-red-900/50 bg-red-950/30 p-6 max-w-sm text-center'>
          <p className='text-red-400'>Error while loading the bet page.</p>
        </div>
      </div>
    );
  }

  if (data == null) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <p className='text-2xl font-bold text-card-foreground'>
            Bet not found
          </p>
          <p className='text-muted-foreground'>
            This bet doesn't exist or has been removed.
          </p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pb-16'>
      {/* Back button */}
      <div className='max-w-4xl mx-auto px-6 pt-6'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-card-foreground transition-colors group'
        >
          <ChevronLeft
            size={16}
            className='group-hover:-translate-x-0.5 transition-transform'
          />
          Back
        </button>
      </div>

      <div className='max-w-4xl mx-auto px-6 mt-6 space-y-6'>
        {/* Hero image */}
        {data.imageURL && (
          <div className='relative w-full rounded-2xl overflow-hidden border border-border'>
            <img
              src={data.imageURL}
              alt={data.title}
              className='w-full h-auto'
            />
            <div className='absolute top-4 left-4 z-20'>
              {' '}
              <StatusBadge status={data.status} />
            </div>
          </div>
        )}

        {/* Main content card */}
        <div className='relative overflow-hidden rounded-2xl border border-border bg-card'>
          {/* Gradient glow */}
          <div className='absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 bg-[#fde639]/5 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -top-24 right-1/4 h-48 w-64 bg-[#527de3]/5 rounded-full blur-3xl pointer-events-none' />

          <div className='relative p-6 sm:p-8 space-y-5'>
            {/* Status badge fallback if no image */}
            {!data.imageURL && (
              <div className='w-fit'>
                <StatusBadge status={data.status} />
              </div>
            )}

            {/* Title */}
            <h1 className='text-2xl sm:text-3xl font-bold text-card-foreground leading-tight'>
              {data.title}
            </h1>

            {/* Description */}
            {data.description && (
              <p className='text-muted-foreground leading-relaxed text-sm sm:text-base'>
                {data.description}
              </p>
            )}

            {/* Divider */}
            <div className='border-t border-border' />

            {/* Meta row */}
            <div className='flex flex-wrap gap-4'>
              {/* Creator */}
              <div className='flex items-center gap-2 text-sm'>
                <div className='flex items-center justify-center w-7 h-7 rounded-full bg-[#527de3]/10 border border-[#527de3]/20'>
                  <User size={14} className='text-[#527de3]' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground leading-none mb-0.5'>
                    Created by
                  </p>
                  <p className='font-semibold text-card-foreground'>
                    {capitalizeFirstLetter(data.creator.username)}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className='flex items-center gap-2 text-sm'>
                <div className='flex items-center justify-center w-7 h-7 rounded-full bg-muted border border-border'>
                  <Calendar size={14} className='text-muted-foreground' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground leading-none mb-0.5'>
                    Created on
                  </p>
                  <p className='font-semibold text-card-foreground'>
                    {formattedDate(data.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Votes */}
          <div className='rounded-2xl border border-[#527de3]/20 bg-[#527de3]/5 p-5 flex items-center gap-4'>
            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-[#527de3]/15 border border-[#527de3]/20'>
              <Vote size={20} className='text-[#527de3]' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>Total Votes</p>
              <p className='text-3xl font-bold text-[#527de3]'>
                {data._count.votes}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className='rounded-2xl border border-[#fde639]/20 bg-[#fde639]/5 p-5 flex items-center gap-4'>
            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-[#fde639]/15 border border-[#fde639]/20'>
              <Trophy size={20} className='text-[#fde639]' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>Status</p>
              <p className='text-xl font-bold text-[#fde639] capitalize'>
                {data.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bet;
