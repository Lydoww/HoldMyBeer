import type { Vote } from '@/types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteProps {
  vote: Vote;
}

const VoteCard = ({ vote }: VoteProps) => {
  const isSuccess = vote.choice === 'success';

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:shadow-md hover:border-[#527de3]/30">
      {/* Vote icon */}
      <div
        className={`flex items-center justify-center rounded-full p-2 ${
          isSuccess
            ? 'bg-[#fde639]/15 text-[#fde639]'
            : 'bg-[#527de3]/15 text-[#527de3]'
        }`}
      >
        {isSuccess ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground line-clamp-1">
          {vote.bet.description}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          vote.bet.status === 'open'
            ? 'bg-[#fde639]/15 text-[#fde639]'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {vote.bet.status}
      </span>
    </div>
  );
};

export default VoteCard;