import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6 animate-fade-in">
      
      <div className="relative">
        <span className="text-9xl font-black bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent opacity-30 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
            <FiAlertCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-extrabold text-slate-100">Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The task page or route you are attempting to reach does not exist or may have been deleted from Cloudant store.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/25 active:scale-95 transition"
      >
        <FiHome className="w-4 h-4 mr-2" /> Return to Dashboard
      </Link>

    </div>
  );
};

export default NotFound;
