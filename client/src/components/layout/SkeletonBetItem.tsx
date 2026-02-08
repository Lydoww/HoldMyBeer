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
    <Card className=' min-h-[200px] flex flex-col mx-auto w-full max-w-sm shadow-lg hover:border-gray-700 transition-colors'>
      <CardHeader>
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
  );
}
