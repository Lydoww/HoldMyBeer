import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../layout/ErrorFallback';
import { BetCard } from './BetCard';
import type { Bet } from '@/types';
import { memo } from 'react';

interface BetProps {
  bet: Bet;
}

const ProtectedBetCard = memo(({ bet }: BetProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BetCard bet={bet} />
    </ErrorBoundary>
  );
});

export default ProtectedBetCard;
