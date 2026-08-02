import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiX, 
  FiFilter, 
  FiSliders,
  FiRotateCcw 
} from 'react-icons/fi';
import { useTasks } from '../../hooks/useTasks';
import { useDebounce } from '../../hooks/useDebounce';
import { TASK_STATUSES, TASK_PRIORITIES, SORT_OPTIONS } from '../../utils/constants';

export const SearchBar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    tasks
  } = useTasks();

  const [localInput, setLocalInput] = useState(searchQuery);
  const debouncedInput = useDebounce(localInput, 300);

  // Sync debounced search to context
  useEffect(() => {
    setSearchQuery(debouncedInput);
  }, [debouncedInput, setSearchQuery]);

  // Keep local input in sync if context searchQuery is cleared from elsewhere
  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  const handleClearAll = () => {
    setLocalInput('');
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSortBy('createdAt_desc');
  };

  const isFiltered = localInput !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || sortBy !== 'createdAt_desc';

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 mb-6">
      
      {/* Top row: Search input & Sort dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search tasks by title or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
          />
          {localInput && (
            <button
              onClick={() => setLocalInput('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              title="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FiSliders className="w-4 h-4 text-slate-400 hidden md:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 transition"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Bottom row: Filter Chips & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center whitespace-nowrap">
            <FiFilter className="w-3.5 h-3.5 mr-1" /> Filter:
          </span>

          {/* Status Chips */}
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Statuses
          </button>

          {TASK_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}

          <span className="text-slate-700">|</span>

          {/* Priority dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters button */}
        {isFiltered && (
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
          >
            <FiRotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}

      </div>

    </div>
  );
};

export default SearchBar;
