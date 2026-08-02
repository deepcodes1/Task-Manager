import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiDatabase, 
  FiTag, 
  FiAlertTriangle,
  FiFileText,
  FiRotateCcw
} from 'react-icons/fi';
import { useTasks } from '../../hooks/useTasks';
import Loader from '../../components/Loader/Loader';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { 
  getTaskId, 
  formatDate, 
  isOverdue, 
  getStatusBadgeStyle, 
  getPriorityBadgeStyle 
} from '../../utils/helpers';
import { TASK_STATUS } from '../../utils/constants';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTaskById, removeTask, editTask } = useTasks();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadTask = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const found = await fetchTaskById(id);
        if (isMounted) {
          if (found) {
            setTask(found);
          } else {
            setErrorMsg(`Task with ID "${id}" was not found.`);
          }
        }
      } catch (err) {
        if (isMounted) setErrorMsg(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTask();
    return () => { isMounted = false; };
  }, [id, fetchTaskById]);

  // Quick Toggle Status
  const handleToggleStatus = async () => {
    if (!task) return;
    const nextStatus =
      task.status === TASK_STATUS.COMPLETED
        ? TASK_STATUS.PENDING
        : TASK_STATUS.COMPLETED;

    try {
      const updated = await editTask(getTaskId(task), { status: nextStatus });
      setTask(updated);
    } catch {
      // Toast handles error
    }
  };

  // Delete Task
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeTask(getTaskId(task));
      navigate('/');
    } catch {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading task details from Cloudant..." />;
  }

  if (errorMsg || !task) {
    return (
      <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-4 my-10 border border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-100">Task Not Found</h2>
        <p className="text-xs text-slate-400">{errorMsg || 'Unable to retrieve task information.'}</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const taskId = getTaskId(task);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <FiArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Link>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleStatus}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center"
          >
            <FiCheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>
              {task.status === TASK_STATUS.COMPLETED ? 'Mark Pending' : 'Mark Complete'}
            </span>
          </button>

          <Link
            to={`/tasks/edit/${taskId}`}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition flex items-center"
          >
            <FiEdit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition flex items-center"
          >
            <FiTrash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </button>
        </div>
      </div>

      {/* Main Task Detail Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusBadgeStyle(task.status)}`}>
              {task.status === TASK_STATUS.COMPLETED && <FiCheckCircle className="w-3.5 h-3.5 mr-1.5" />}
              {task.status === TASK_STATUS.IN_PROGRESS && <FiClock className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              {task.status}
            </span>

            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityBadgeStyle(task.priority)}`}>
              <FiTag className="w-3.5 h-3.5 mr-1.5" />
              {task.priority} Priority
            </span>
          </div>

          {overdue && (
            <span className="inline-flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
              <FiAlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Overdue Task
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
            {task.title}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-brand-400" /> Description
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        {/* Metadata Grid (Dates & Cloudant Attributes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex items-center text-xs text-slate-400">
              <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Due Date
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {formatDate(task.dueDate)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex items-center text-xs text-slate-400">
              <FiClock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Created At
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {formatDate(task.createdAt || new Date())}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex items-center text-xs text-slate-400">
              <FiRotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Last Updated
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {formatDate(task.updatedAt || new Date())}
            </p>
          </div>

        </div>

        {/* Cloudant Technical Metadata */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
            <FiDatabase className="w-4 h-4" />
            <span>IBM Cloudant NoSQL Document Metadata</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500">Document ID (_id):</span>{' '}
              <span className="text-slate-300">{taskId || 'N/A'}</span>
            </div>
            {task._rev && (
              <div className="truncate">
                <span className="text-slate-500">Revision (_rev):</span>{' '}
                <span className="text-slate-300">{task._rev}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        taskTitle={task.title}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default TaskDetails;
