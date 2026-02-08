import type { Vote } from '@/types';

interface VoteProps {
  vote: Vote;
}

const VoteCard = ({ vote }: VoteProps) => {
  return (
    <div className=' bg-gray-800 rounded-full shadow-lg border hover:border-gray-600 hover:transition-colors'>
      <div className='flex justify-between py-2 px-4'>
        <p
          className={
            vote.choice === 'success' ? 'text-green-500' : 'text-red-500'
          }
        >
          {vote.choice}
        </p>
        {/* <p className='line-clamp-1'>{vote.bet.creator.username} </p> */}
        <p className='line-clamp-1'>{vote.bet.description} </p>
        <p>{vote.bet.status} </p>
      </div>
    </div>
  );
};

export default VoteCard;
