import type { BetStatus } from '@/types';
import { cn } from '@/lib/utils'; // vérifie que c’est bien ton chemin

interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BetStatus;
}

const StatusBadge = ({ status, className, ...props }: StatusProps) => {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        status === 'open'
          ? 'bg-[#fde639]/15 text-[#fde639]'
          : status === 'success'
            ? 'bg-[#4ade80]/15 text-[#0eb727]'
            : status === 'failed'
              ? 'bg-[#f87171]/15 text-[#c60a26]'
              : 'bg-[#fde639]/15 text-[#fde639]',
        className,
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
