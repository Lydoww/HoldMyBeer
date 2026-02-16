import { X } from 'lucide-react';
import { Button } from '../ui/button';
import type { Bet, BetResult } from '@/types';
import { useBetMutations } from '@/hooks/bets/useBetMutations';
import { useAuth } from '@/stores/authStore';

interface ModalProps {
  onClose: () => void;
  bet: Bet;
  selectedResult: BetResult;
}

const ModalConfirmChoice = ({ onClose, selectedResult, bet }: ModalProps) => {
  const updatePoints = useAuth((state) => state.updatePoints);
  const { updateMutation } = useBetMutations();

  const handleUpdateBetStatus = () => {
    updateMutation.mutate(
      { id: bet.id, data: { status: selectedResult } },
      {
        onSuccess: (data) => {
          updatePoints(data.updatedCreator.points);
          onClose();
        },
      },
    );
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-card-foreground'>
            Are you sure you want to mark this bet as{' '}
            <span className='font-bold uppercase italic text-[#fde639]'>
              {selectedResult}
            </span>{' '}
            ? <br /> <br /> Points will be distributed to voters and this action
            cannot be undone.
          </h2>
          <button
            onClick={onClose}
            className='rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-card-foreground transition-colors'
          >
            <X size={20} />
          </button>
        </div>
        {/* Actions */}
        <div className='flex gap-3 pt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='flex-1 h-11 rounded-lg border-border text-card-foreground hover:bg-muted'
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateBetStatus}
            className='flex-1 h-11 rounded-lg font-semibold text-black disabled:opacity-40 transition-all hover:brightness-90'
            style={{
              backgroundColor: '#fde639',
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmChoice;
