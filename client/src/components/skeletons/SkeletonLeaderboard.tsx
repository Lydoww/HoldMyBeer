const SkeletonLeaderboard = () => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className='flex items-center bg-[#1d1d1d] rounded-xl px-4 py-2 transition-colors animate-pulse'
        >
          <div className='flex items-center gap-3 '>
            {/* Avatar initial */}
            <div className='w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center text-xs font-semibold text-card-foreground' />
            <p className='text-sm font-medium text-card-foreground bg-gray-700/30 h-4 w-28 rounded-lg' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLeaderboard;
