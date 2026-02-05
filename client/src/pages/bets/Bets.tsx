import { getBets } from '@/api/bets';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CreateBetForm from './CreateBetForm';
import BetItem from './BetItem';

const Bets = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending, error } = useQuery({
    queryKey: ['bets', page, pageSize],
    queryFn: () => getBets(page, pageSize),
  });

  if (isPending) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>ERROR</p>;
  }

  if (data == null) {
    return <p>No Data</p>;
  }

  return (
    <div>
      <CreateBetForm />
      {data.data.map((bet) => (
        <BetItem key={bet.id} bet={bet} />
      ))}
    </div>
  );
};

export default Bets;
