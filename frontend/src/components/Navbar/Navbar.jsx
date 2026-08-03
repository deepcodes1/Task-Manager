import { Link } from 'react-router-dom';
import {
  FiCloud,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { stats } = useTasks();
  const { isAuthenticated, user, logout, isMock } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle mobile menu"
            >
              {mobileSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
                <FiCloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    TaskManager
                  </span>
                </div>

              </div>
            </Link>
          </div>

          {/* Real-time Status Badges (Tablet & Desktop) */}
          <div className="hidden md:flex items-center space-x-4 bg-slate-800/60 py-1.5 px-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Total:</span>
              <span className="font-bold text-white">{stats.total}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-300">
              <FiClock className="w-3.5 h-3.5 text-slate-400" />
              <span>Pending:</span>
              <span className="font-bold text-slate-300">{stats.pending}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 text-xs text-amber-300">
              <FiLoader className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>In Progress:</span>
              <span className="font-bold text-amber-400">{stats.inProgress}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-300">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Done:</span>
              <span className="font-bold text-emerald-400">{stats.completed}</span>
            </div>
          </div>

          {/* Create Task CTA & User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>

                <div className="flex items-center space-x-2 bg-slate-800/80 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700/50">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase border border-indigo-500/30">
                    {user?.name ? user.name[0] : <FiUser className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white max-w-[100px] truncate">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 max-w-[100px] truncate">{isMock ? 'Mock Mode' : 'Secured'}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                    title="Sign Out"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : null}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
