import { useBetMutations } from '@/hooks/bets/useBetMutations';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import type { Bet } from '@/types';
import ModalPortal from './ModalPortal';

interface ModalProps {
  onClose: () => void;
  bet: Bet;
}

const ModalDeleteBet = ({ onClose, bet }: ModalProps) => {
  const { deleteMutation } = useBetMutations();

  const handleDelete = () => {
    deleteMutation.mutate(bet.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <ModalPortal onClose={onClose}>
      <div
        className='relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-start justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-200'>
            Are you sure you want to delete your bet ?
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
            className='flex-1 h-11 rounded-lg border-border text-gray-200 hover:bg-muted'
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='flex-1 h-11 rounded-lg font-semibold text-black disabled:opacity-40 transition-all hover:brightness-90'
            style={{
              backgroundColor: '#fde639',
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete bet'}
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ModalDeleteBet;
