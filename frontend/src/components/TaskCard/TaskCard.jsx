import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiArrowRight 
} from 'react-icons/fi';
import { 
  getTaskId, 
  formatDate, 
  isOverdue, 
  getStatusBadgeStyle, 
  getPriorityBadgeStyle, 
  truncateText 
} from '../../utils/helpers';
import { TASK_STATUS } from '../../utils/constants';

export const TaskCard = ({ task, onDeleteClick, onQuickStatusChange }) => {
  const taskId = getTaskId(task);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="group glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-800 hover:border-brand-500/40 hover:shadow-glow transition-all duration-300 relative overflow-hidden">
      
      {/* Glow highlight top bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 ${
          task.status === TASK_STATUS.COMPLETED
            ? 'bg-emerald-500'
            : task.status === TASK_STATUS.IN_PROGRESS
            ? 'bg-amber-500'
            : 'bg-brand-500'
        }`} 
      />

      <div>
        {/* Badges Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusBadgeStyle(task.status)}`}>
              {task.status === TASK_STATUS.COMPLETED && <FiCheckCircle className="w-3 h-3 mr-1" />}
              {task.status === TASK_STATUS.IN_PROGRESS && <FiClock className="w-3 h-3 mr-1 animate-spin" />}
              {task.status}
            </span>

            {/* Priority Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityBadgeStyle(task.priority)}`}>
              {task.priority === 'High' && <FiAlertTriangle className="w-3 h-3 mr-1 text-rose-400" />}
              {task.priority} Priority
            </span>
          </div>

          {/* Cloudant ID tag */}
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[80px]" title={`ID: ${taskId}`}>
            #{taskId ? taskId.slice(-6) : 'id'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-1 mb-2">
          <Link to={`/tasks/${taskId}`}>
            {task.title}
          </Link>
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {truncateText(task.description || 'No description provided.', 120)}
        </p>
      </div>

      <div>
        {/* Due Date & Overdue Indicator */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 mb-4">
          <div className="flex items-center space-x-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {overdue && (
            <span className="inline-flex items-center text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <FiAlertTriangle className="w-3 h-3 mr-1" /> Overdue
            </span>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-2">
          {/* Quick status change button */}
          <button
            onClick={() => onQuickStatusChange(task)}
            className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center space-x-1"
            title="Cycle task status"
          >
            <span>Next Status</span>
            <FiArrowRight className="w-3 h-3 text-brand-400" />
          </button>

          {/* Icon Buttons: View, Edit, Delete */}
          <div className="flex items-center space-x-1">
            <Link
              to={`/tasks/${taskId}`}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
              title="View Task Details"
            >
              <FiEye className="w-4 h-4" />
            </Link>

            <Link
              to={`/tasks/edit/${taskId}`}
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
              title="Edit Task"
            >
              <FiEdit2 className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onDeleteClick(task)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Delete Task"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskCard;
