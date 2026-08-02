import {
  FiGrid,
  FiClock,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlusCircle,
  FiServer
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { TASK_STATUS } from '../../utils/constants';

export const Sidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, stats } = useTasks();

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  const handlePrioritySelect = (priority) => {
    setPriorityFilter(priority);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="space-y-6">

          {/* Action Button */}
          <div>
            <NavLink
              to="/tasks/new"
              onClick={() => mobileSidebarOpen && setMobileSidebarOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold transition"
            >
              <FiPlusCircle className="w-5 h-5 text-brand-400" />
              <span>Create Task</span>
            </NavLink>
          </div>

          {/* Filter by Status */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Status Filters
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => handleStatusSelect('ALL')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${statusFilter === 'ALL'
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <FiGrid className="w-4 h-4" />
                  <span>All Tasks</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {stats.total}
                </span>
              </button>

              <button
                onClick={() => handleStatusSelect(TASK_STATUS.PENDING)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${statusFilter === TASK_STATUS.PENDING
                    ? 'bg-slate-700/50 text-slate-200 border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <FiClock className="w-4 h-4 text-slate-400" />
                  <span>Pending</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400 font-semibold">
                  {stats.pending}
                </span>
              </button>

              <button
                onClick={() => handleStatusSelect(TASK_STATUS.IN_PROGRESS)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${statusFilter === TASK_STATUS.IN_PROGRESS
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <FiLoader className="w-4 h-4 text-amber-400" />
                  <span>In Progress</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-amber-400 font-semibold">
                  {stats.inProgress}
                </span>
              </button>

              <button
                onClick={() => handleStatusSelect(TASK_STATUS.COMPLETED)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${statusFilter === TASK_STATUS.COMPLETED
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Completed</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-emerald-400 font-semibold">
                  {stats.completed}
                </span>
              </button>
            </nav>
          </div>

          {/* Filter by Priority */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Priority Filters
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => handlePrioritySelect('ALL')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${priorityFilter === 'ALL'
                    ? 'bg-slate-800 text-slate-200'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <span>All Priorities</span>
              </button>

              <button
                onClick={() => handlePrioritySelect('High')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${priorityFilter === 'High'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <FiAlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>High Priority</span>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-rose-400 font-semibold">
                  {stats.highPriority}
                </span>
              </button>

              <button
                onClick={() => handlePrioritySelect('Medium')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${priorityFilter === 'Medium'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <span>Medium Priority</span>
              </button>

              <button
                onClick={() => handlePrioritySelect('Low')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition ${priorityFilter === 'Low'
                    ? 'bg-slate-700/50 text-slate-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <span>Low Priority</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
