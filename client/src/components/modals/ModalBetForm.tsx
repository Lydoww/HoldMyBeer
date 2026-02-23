import { createBet } from '@/api/bets';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import ModalPortal from './ModalPortal';

interface ModalProps {
  onClose: () => void;
}

export const ModalBetForm = ({ onClose }: ModalProps) => {
  const queryClient = useQueryClient();
  const [bet, setBet] = useState({
    title: '',
    description: '',
  });
  const [image, setImage] = useState<File | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: createBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      setBet({ title: '', description: '' });
      setImage(undefined);
      onClose();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bet.title.trim()) return;
    mutation.mutate({ ...bet, image });
  };

  return (
    <ModalPortal onClose={onClose}>
      <div
        className='relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='text-gray-200 flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-200'>
            Create a new bet
          </h2>
          <button
            onClick={onClose}
            className='rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-card-foreground transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label
              htmlFor='title'
              className='text-gray-200 text-sm font-medium '
            >
              Title
            </Label>
            <Input
              id='title'
              name='title'
              value={bet.title}
              onChange={handleChange}
              placeholder='e.g. France wins the World Cup'
              className=' h-11 rounded-lg bg-muted border-border text-gray-200 placeholder:text-muted-foreground focus:ring-[#527de3] focus:border-[#527de3]'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-sm font-medium text-gray-200'
            >
              Description
            </Label>
            <Input
              id='description'
              name='description'
              value={bet.description}
              onChange={handleChange}
              placeholder='Add some details about this bet...'
              className='h-11 rounded-lg bg-muted border-border text-gray-200 placeholder:text-muted-foreground focus:ring-[#527de3] focus:border-[#527de3]'
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='image'
              className='text-sm font-medium text-gray-200'
            >
              Upload an image
            </Label>
            <Input
              id='image'
              name='image'
              type='file'
              onChange={(e) => setImage(e.target.files?.[0] ?? undefined)}
              accept='image/*'
              className='h-11 rounded-lg bg-muted border-border text-muted-foreground placeholder:text-muted-foreground focus:ring-[#527de3] focus:border-[#527de3]'
            />
          </div>

          {mutation.isError && (
            <p className='text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg p-3'>
              Something went wrong. Please try again.
            </p>
          )}

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
              type='submit'
              disabled={mutation.isPending || !bet.title.trim()}
              className='flex-1 h-11 rounded-lg  font-semibold text-black disabled:opacity-40 transition-all hover:brightness-90'
              style={{
                backgroundColor: '#fde639',
              }}
            >
              {mutation.isPending ? 'Creating...' : 'Create bet'}
            </Button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
