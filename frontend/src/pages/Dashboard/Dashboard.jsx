import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskCard from '../../components/TaskCard/TaskCard';
import { SkeletonGrid } from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { getTaskId } from '../../utils/helpers';
import { TASK_STATUSES } from '../../utils/constants';

export const Dashboard = () => {
  const { 
    filteredTasks, 
    tasks, 
    loading, 
    removeTask, 
    editTask,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter
  } = useTasks();

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Quick Status Cycling
  const handleQuickStatusChange = async (task) => {
    const taskId = getTaskId(task);
    const currentIndex = TASK_STATUSES.indexOf(task.status);
    const nextStatus = TASK_STATUSES[(currentIndex + 1) % TASK_STATUSES.length];
    
    try {
      await editTask(taskId, { status: nextStatus });
    } catch {
      // Error handled in TaskContext toast
    }
  };

  // Handle Task Deletion
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const id = getTaskId(taskToDelete);
    setIsDeleting(true);
    try {
      await removeTask(id);
      setTaskToDelete(null);
    } catch {
      // Error handled in TaskContext toast
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Task Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, filter, and track your Cloudant NoSQL tasks in real-time.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/60 py-1.5 px-3 rounded-lg border border-slate-700/60 self-start sm:self-auto">
          Showing <span className="font-bold text-slate-200">{filteredTasks.length}</span> of{' '}
          <span className="font-bold text-slate-200">{tasks.length}</span> tasks
        </div>
      </div>

      {/* Search & Filter Bar */}
      <SearchBar />

      {/* Main Grid or Loading / Empty states */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={isFiltered ? 'No matching tasks' : 'No tasks created yet'}
          description={
            isFiltered
              ? 'Try adjusting your search keywords, status filters, or priority selections.'
              : 'Get started by creating your first cloud-powered task!'
          }
          onResetFilters={
            isFiltered
              ? () => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }
              : null
          }
          showCreateButton={true}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={getTaskId(task)}
              task={task}
              onDeleteClick={(t) => setTaskToDelete(t)}
              onQuickStatusChange={handleQuickStatusChange}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default Dashboard;
