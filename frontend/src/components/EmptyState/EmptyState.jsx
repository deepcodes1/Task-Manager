import { Link } from 'react-router-dom';
import { FiInbox, FiPlus, FiRotateCcw } from 'react-icons/fi';

export const EmptyState = ({
  title = 'No tasks found',
  description = 'You currently have no tasks matching your selected filters or search query.',
  onResetFilters,
  showCreateButton = true,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-10 text-center max-w-lg mx-auto my-8 border border-slate-800 space-y-5 animate-fade-in">
      
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-brand-400 shadow-inner">
        <FiInbox className="w-8 h-8" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center"
          >
            <FiRotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Filters</span>
          </button>
        )}

        {showCreateButton && (
          <Link
            to="/tasks/new"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-600/20 active:scale-95 transition flex items-center"
          >
            <FiPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Create New Task</span>
          </Link>
        )}
      </div>

    </div>
  );
};

export default EmptyState;
