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
import type { Bet, Choice } from '@/types';
import { useAuth } from '@/stores/authStore';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { formattedDate } from '@/lib/utils';

import { useVoteMutations } from '@/hooks/votes/useVoteMutations';
import { useBetMutations } from '@/hooks/bets/useBetMutations';

interface BetProps {
  bet: Bet;
}

export function BetCard({ bet }: BetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
  });
  const user = useAuth((state) => state.user);
  const userAlreadyVoted = bet.votes.find((vote) => vote.userId === user?.id);

  const { updateMutation, deleteMutation } = useBetMutations();
  const { mutationCreateVote, mutationDeleteVote, mutationChangeVoteChoice } =
    useVoteMutations();

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

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className=' min-h-[250px] flex flex-col mx-auto w-full max-w-[500px] shadow-lg hover:border-gray-700 transition-colors'>
      <CardHeader>
        <CardTitle className='break-all line-clamp-2'>
          {isEditing ? (
            <Input
              className='text-white'
              value={editData.title}
              name='title'
              onChange={handleChangeEdit}
            />
          ) : (
            <div className='flex justify-between'>
              <p className='break-all line-clamp-2'> {bet.title} </p>
              <p>{formattedDate(bet.createdAt)} </p>
              <p>{bet.creator.username} </p>
            </div>
          )}
        </CardTitle>
        <div className='flex justify-between px-4 py-8'>
          <CardDescription>{bet.status}</CardDescription>
          <CardDescription>Votes: {bet._count.votes}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='flex-1'>
        {isEditing ? (
          <Input
            className='text-white'
            value={editData.description}
            name='description'
            onChange={handleChangeEdit}
          />
        ) : (
          <p className='break-all line-clamp-2'>{bet.description}</p>
        )}
      </CardContent>
      <CardFooter>
        {user?.id !== bet.creatorId && (
          <div className='flex min-w-full justify-between'>
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
        )}

        <div className='flex justify-between w-full gap-12'>
          {bet.creatorId === user?.id ? (
            !isEditing ? (
              <>
                <Button
                  className='flex-1 cursor-pointer hover:text-red-600 hover:transition-colors hover:bg-gray-200'
                  onClick={() => deleteMutation.mutate(bet.id)}
                >
                  Delete
                </Button>

                <Button
                  className='flex-1 cursor-pointer hover:text-blue-600 hover:transition-colors hover:bg-gray-200'
                  onClick={() => {
                    setIsEditing(true);
                    setEditData({
                      title: bet.title,
                      description: bet.description,
                    });
                  }}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  className='flex-1 cursor-pointer hover:text-red-600 hover:transition-colors hover:bg-gray-200'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  className='flex-1 cursor-pointer hover:text-green-600 hover:transition-colors hover:bg-gray-200'
                  onClick={() =>
                    updateMutation.mutate({
                      id: bet.id,
                      data: editData,
                    })
                  }
                >
                  Save
                </Button>
              </>
            )
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
