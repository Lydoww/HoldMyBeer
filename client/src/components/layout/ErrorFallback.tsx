import { getErrorMessage, type FallbackProps } from 'react-error-boundary';
import { Button } from '../ui/button';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className='justify-center items-center min-h-[250px] flex flex-col mx-auto w-full max-w-sm border border-red-700 rounded-xl shadow-lg hover:border-red-600 transition-colors'
      role='alert'
    >
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{getErrorMessage(error)}</pre>
      <div className='flex justify-center mt-8 text-black mx-auto'>
        <Button className='cursor-pointer' onClick={resetErrorBoundary}>Retry</Button>
      </div>
    </div>
  );
}
