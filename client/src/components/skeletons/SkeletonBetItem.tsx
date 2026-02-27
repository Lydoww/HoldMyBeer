import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SkeletonBetItem() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card
          key={index}
          className='group relative min-h-[260px] flex flex-col mx-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-[0_0_24px_rgba(82,125,227,0.15)] hover:border-[#527de3]/40'
        >
          <CardHeader key={index}>
            <CardTitle className='break-all line-clamp-2 bg-gray-800 rounded-full h-2 w-60 animate-pulse' />
            <div className='flex justify-between px-4 py-2'>
              <CardDescription className='bg-gray-800 rounded-full h-2 w-10 animate-pulse' />
              <CardDescription className='bg-gray-800 rounded-full h-2 w-10 animate-pulse' />
            </div>
          </CardHeader>
          <CardContent className='flex-1'>
            <p className='break-all line-clamp-2  bg-gray-800 rounded-full h-2 w-25 animate-pulse' />
          </CardContent>
          <CardFooter>
            <div className='flex w-full justify-between'>
              <div className='size-8 lg:size-10 rounded-full bg-gray-800 animate-pulse' />
              <div className='size-8 lg:size-10 rounded-full bg-gray-800 animate-pulse' />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
