import { createBet } from '@/api/bets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

const CreateBetForm = () => {
  const queryClient = useQueryClient();
  const [bet, setBet] = useState({
    title: '',
    description: '',
  });

  const mutation = useMutation({
    mutationFn: createBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      setBet({ title: '', description: '' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(bet);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input value={bet.title} name='title' onChange={handleChange} />
        <Label>Description</Label>
        <Input
          value={bet.description}
          name='description'
          onChange={handleChange}
        />
        <button type='submit'>Add a bet</button>
      </form>
    </div>
  );
};

export default CreateBetForm;
