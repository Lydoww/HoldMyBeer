import { getBets } from '@/api/bets';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CreateBetForm from './CreateBetForm';
import ProtectedBetCard from '@/components/bet/ProtectedBetCard';

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
      <div className=' pb-8 px-4'>
        <h2 className='pb-4'>Community Bets</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {data.data.map((bet) => (
            <ProtectedBetCard key={bet.id} bet={bet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bets;
