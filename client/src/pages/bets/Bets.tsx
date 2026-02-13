import { getBets } from '@/api/bets';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProtectedBetCard from '@/components/bet/ProtectedBetCard';
import { useAuth } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { ModalBetForm } from '@/components/modals/ModalBetForm';

const Bets = () => {
  const user = useAuth((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ['bets', page, pageSize, user?.id],
    queryFn: () => getBets(page, pageSize, undefined, user?.id),
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
    <div className=' pb-8 px-4'>
      <div className='flex justify-between m-4'>
        <h2 className='pb-4'>Community Bets</h2>
        <Button
          onClick={toggleModal}
          variant={'outline'}
          className='px-6 text-[#527de3] text-xl font-semibold'
        >
          +
        </Button>
      </div>
      {isModalOpen && <ModalBetForm onClose={toggleModal} />}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {data.data.map((bet) => (
          <ProtectedBetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
};

export default Bets;
