import { deleteBet, updateBet } from '@/api/bets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/stores/authStore';
import type { Bet, UpdateBetPayload } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface BetProps {
  bet: Bet;
}

const BetItem = ({ bet }: BetProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
  });

  const user = useAuth((state) => state.user);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBetPayload }) =>
      updateBet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      setIsEditing(false);
    },
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (betId: number) => {
    deleteMutation.mutate(betId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    },
  });

  return (
    <div>
      <li className='text-white'>
        {isEditing ? (
          <>
            <Input
              className='text-white'
              value={editData.title}
              name='title'
              onChange={handleChangeEdit}
            />

            <Input
              className='text-white'
              value={editData.description}
              name='description'
              onChange={handleChangeEdit}
            />
            <Button
              onClick={() =>
                updateMutation.mutate({ id: bet.id, data: editData })
              }
            >
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <p>{bet.title}</p>
            <p>{bet.description}</p>
            {bet.creatorId === user?.id && (
              <Button onClick={() => handleDelete(bet.id)}>Delete</Button>
            )}
            <Button
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
        )}
      </li>
    </div>
  );
};

export default BetItem;
