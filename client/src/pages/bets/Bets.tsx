import { getBets } from '@/api/bets';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CreateBetForm from './CreateBetForm';
import { BetCard } from '@/components/BetCard';

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
      <div className='grid grid-cols-2 gap-8'>
        {data.data.map((bet) => (
          <>
            <BetCard key={bet.id} bet={bet} />
          </>
        ))}
      </div>
    </div>
  );
};

export default Bets;
