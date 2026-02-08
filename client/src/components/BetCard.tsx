import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import votePositive from '@/assets/positive-vote.png';
import voteNegative from '@/assets/negative-vote.png';
import type {
  Bet,
  Choice,
  CreateVotePayload,
  UpdateVotePayload,
} from '@/types';
import { useAuth } from '@/stores/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVote, deleteVote, updateVote } from '@/api/votes';

interface BetProps {
  bet: Bet;
}

export function BetCard({ bet }: BetProps) {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  const userAlreadyVoted = bet.votes.find((vote) => vote.userId === user?.id);

  const handleVote = (choice: Choice) => {
    if (userAlreadyVoted == null) {
      mutationCreateVote.mutate({ betId: bet.id, data: { choice } });
    } else if (userAlreadyVoted.choice === choice) {
      mutationDeleteVote.mutate(userAlreadyVoted.id);
    } else if (userAlreadyVoted.choice !== choice) {
      mutationChangeVoteChoice.mutate({
        id: userAlreadyVoted.id,
        data: { choice },
      });
    }
  };

  const mutationCreateVote = useMutation({
    mutationFn: ({ betId, data }: { betId: number; data: CreateVotePayload }) =>
      createVote(betId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    },
  });

  const mutationDeleteVote = useMutation({
    mutationFn: deleteVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    },
  });

  const mutationChangeVoteChoice = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVotePayload }) =>
      updateVote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    },
  });

  return (
    <Card className=' min-h-[200px] flex flex-col mx-auto w-full max-w-sm shadow-lg hover:border-gray-700 transition-colors'>
      <CardHeader>
        <CardTitle className='break-all line-clamp-2'>{bet.title}</CardTitle>
        <div className='flex justify-between px-4 py-2'>
          <CardDescription>{bet.status}</CardDescription>
          <CardDescription>Votes: {bet._count.votes}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='flex-1'>
        <p className='break-all line-clamp-2'>{bet.description}</p>
      </CardContent>
      <CardFooter>
        <div className='flex w-full justify-between'>
          <button
            onClick={() => handleVote('success')}
            className='hover:scale-105 transition-transform cursor-pointer'
          >
            {userAlreadyVoted?.choice === 'success' ? (
              <img
                className='size-8 lg:size-10 border border-yellow-500 rounded-full'
                src={votePositive}
                alt=''
              />
            ) : (
              <img className='size-8 lg:size-10' src={votePositive} alt='' />
            )}
          </button>
          <button
            onClick={() => handleVote('fail')}
            className='hover:scale-105 transition-transform cursor-pointer'
          >
            {userAlreadyVoted?.choice === 'fail' ? (
              <img
                className='size-8 lg:size-10 border border-yellow-500 rounded-full'
                src={voteNegative}
                alt=''
              />
            ) : (
              <img className='size-8 lg:size-10' src={voteNegative} alt='' />
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
