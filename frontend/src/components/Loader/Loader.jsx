import { FiCloud, FiLoader } from 'react-icons/fi';

export const Loader = ({ message = 'Loading tasks from Cloudant NoSQL database...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow animate-pulse-slow">
          <FiCloud className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700">
          <FiLoader className="w-5 h-5 text-brand-400 animate-spin" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-24"></div>
        <div className="h-5 bg-slate-800 rounded w-16"></div>
      </div>
      <div className="h-6 bg-slate-800 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-full"></div>
        <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
      </div>
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-28"></div>
        <div className="h-8 bg-slate-800 rounded w-24"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Loader;
