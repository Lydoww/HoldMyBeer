import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { type BetResult, type Bet, type Choice } from '@/types';
import { useAuth } from '@/stores/authStore';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { cn, formattedDate } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Pencil, Trash2, X, Check } from 'lucide-react';

import { useVoteMutations } from '@/hooks/votes/useVoteMutations';
import { useBetMutations } from '@/hooks/bets/useBetMutations';
import ModalDeleteBet from '../modals/ModalDeleteBet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ModalConfirmChoice from '../modals/ModalConfirmChoice';
import StatusBadge from '../ui/StatusBadge';
import { Link } from 'react-router';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

interface BetProps {
  bet: Bet;
}

export const BetCard = ({ bet }: BetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BetResult | null>(null);

  const user = useAuth((state) => state.user);
  const userAlreadyVoted = bet.votes.find((vote) => vote.userId === user?.id);
  const isOwner = user?.id === bet.creatorId;

  const { updateMutation } = useBetMutations();
  const { mutationCreateVote, mutationDeleteVote, mutationChangeVoteChoice } =
    useVoteMutations();

  const SuccessOrFailVotes = bet.votes.reduce(
    (acc, currentValue) => {
      if (currentValue.choice === 'success') {
        acc.success++;
      } else {
        acc.fail++;
      }
      return acc;
    },
    { success: 0, fail: 0 },
  );

  const totalVotes = bet._count.votes;
  const successPercent =
    totalVotes > 0 ? (SuccessOrFailVotes.success / totalVotes) * 100 : 50;

  const handleVote = (choice: Choice) => {
    if (userAlreadyVoted == null) {
      mutationCreateVote.mutate({ betId: bet.id, data: { choice } });
    } else if (userAlreadyVoted.choice === choice) {
      mutationDeleteVote.mutate(userAlreadyVoted.id);
    } else {
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

  const handleSave = () => {
    updateMutation.mutate({ id: bet.id, data: editData });
    setIsEditing(false);
  };

  const toggleDeleteModal = () => setIsOpen(!isOpen);

  const closeChoiceModal = () => setSelectedResult(null);

  return (
    <Card
      className={cn(
        'break-inside-avoid group relative mb-6 flex flex-col mx-auto w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-[0_0_24px_rgba(82,125,227,0.15)] hover:border-[#527de3]/40',
        bet.imageURL && 'pt-0',
      )}
    >
      {bet.imageURL && (
        <div className='rounded-t-lg overflow-hidden'>
          <img
            className='object-cover w-full h-[200px]'
            src={bet.imageURL}
            alt=''
          />
        </div>
      )}
      <CardHeader className='space-y-3 pb-2'>
        {/* Meta row */}
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span className='font-medium text-[#527de3]'>
            @{bet.creator.username}
          </span>
          <div className='flex items-center gap-2'>
            {isOwner && bet.status === 'open' ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer' asChild>
                  <StatusBadge status={bet.status} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setSelectedResult('success')}
                    >
                      Success
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedResult('failed')}
                    >
                      Failed
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <StatusBadge status={bet.status} />
            )}
            <span>{formattedDate(bet.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        {isEditing ? (
          <Input
            value={editData.title}
            name='title'
            onChange={handleChangeEdit}
            className='h-10 rounded-lg bg-muted border-border focus:ring-[#527de3] focus:border-[#527de3]'
            placeholder='Bet title'
          />
        ) : (
          <HoverCard openDelay={10} closeDelay={100}>
            <Link to={`/bets/${bet.id}`}>
              <HoverCardTrigger asChild>
                <Button variant='link' className='cursor-pointer'>
                  {bet.title}
                </Button>
              </HoverCardTrigger>
            </Link>
            <HoverCardContent className='flex w-fit flex-col'>
              <div className='flex justify-between gap-4'>
                <div className='shrink-0 w-fit inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#4ade80]/15 text-[#0eb727]'>
                  Success votes: {SuccessOrFailVotes.success}
                </div>
                <div className='shrink-0 w-24 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#f87171]/15 text-[#c60a26]'>
                  Fail votes: {SuccessOrFailVotes.fail}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardHeader>

      {/* Description */}
      <CardContent className='flex-1 pb-4'>
        {isEditing ? (
          <Input
            value={editData.description}
            name='description'
            onChange={handleChangeEdit}
            className='h-10 rounded-lg bg-muted border-border text-card-foreground focus:ring-[#527de3] focus:border-[#527de3]'
            placeholder='Description'
          />
        ) : (
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3 break-all'>
            {bet.description}
          </p>
        )}
      </CardContent>

      <CardFooter className='flex flex-col gap-3 pt-0 pb-4'>
        {/* Vote section - only for non-owners */}
        {!isOwner && (
          <div className='w-full space-y-2'>
            {/* Vote bar */}
            <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-[#fde639] to-[#fde639]/70 transition-all duration-500'
                style={{ width: `${successPercent}%` }}
              />
              <div
                className='absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-[#527de3] to-[#527de3]/70 transition-all duration-500'
                style={{ width: `${100 - successPercent}%` }}
              />
            </div>

            {/* Vote buttons */}
            {bet.status !== 'open' ? (
              <div className='flex justify-around mt-4 font-semibold'>
                <h3>Bet closed</h3>
                <p>Total bets: {bet._count.votes} </p>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <button
                  onClick={() => handleVote('success')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    userAlreadyVoted?.choice === 'success'
                      ? 'bg-[#fde639]/20 text-[#fde639] ring-1 ring-[#fde639]/50'
                      : 'text-muted-foreground hover:bg-[#fde639]/10 hover:text-[#fde639]'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{SuccessOrFailVotes.success}</span>
                </button>

                <span className='text-xs text-muted-foreground font-medium'>
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </span>

                <button
                  onClick={() => handleVote('fail')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    userAlreadyVoted?.choice === 'fail'
                      ? 'bg-[#527de3]/20 text-[#527de3] ring-1 ring-[#527de3]/50'
                      : 'text-muted-foreground hover:bg-[#527de3]/10 hover:text-[#527de3]'
                  }`}
                >
                  <span>{SuccessOrFailVotes.fail}</span>
                  <ThumbsDown size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Owner actions */}
        {bet.status !== 'open' ? (
          <p className='text-xs text-muted-foreground'>This bet is closed</p>
        ) : bet._count.votes > 0 ? (
          <p className='text-xs text-muted-foreground'>
            Votes submitted – editing disabled
          </p>
        ) : (
          isOwner && (
            <div className='flex w-full gap-2'>
              {!isEditing ? (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 gap-1.5 rounded-lg border-border text-muted-foreground hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all'
                    onClick={toggleDeleteModal}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                  {isOpen && (
                    <ModalDeleteBet bet={bet} onClose={toggleDeleteModal} />
                  )}
                  <Button
                    size='sm'
                    className='flex-1 gap-1.5 rounded-lg font-semibold text-black bg-[#fde639] hover:brightness-90 transition-all'
                    onClick={() => {
                      setIsEditing(true);
                      setEditData({
                        title: bet.title,
                        description: bet.description,
                      });
                    }}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 gap-1.5 rounded-lg border-border text-muted-foreground hover:border-border hover:bg-muted transition-all'
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={14} />
                    Cancel
                  </Button>
                  <Button
                    size='sm'
                    className='flex-1 gap-1.5 rounded-lg font-semibold  bg-[#527de3] hover:brightness-90 transition-all'
                    onClick={handleSave}
                  >
                    <Check size={14} />
                    Save
                  </Button>
                </>
              )}
            </div>
          )
        )}
      </CardFooter>
      {selectedResult && (
        <ModalConfirmChoice
          onClose={closeChoiceModal}
          bet={bet}
          selectedResult={selectedResult}
        />
      )}
    </Card>
  );
};
