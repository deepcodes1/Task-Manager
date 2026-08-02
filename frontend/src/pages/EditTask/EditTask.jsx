import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiAlertCircle } from 'react-icons/fi';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm/TaskForm';
import Loader from '../../components/Loader/Loader';

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTaskById, editTask } = useTasks();

  const [taskData, setTaskData] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadTask = async () => {
      setLoadingTask(true);
      setFetchError(null);
      try {
        const task = await fetchTaskById(id);
        if (isMounted) {
          if (task) {
            setTaskData(task);
          } else {
            setFetchError(`Task with ID "${id}" could not be found.`);
          }
        }
      } catch (err) {
        if (isMounted) setFetchError(err.message);
      } finally {
        if (isMounted) setLoadingTask(false);
      }
    };
    loadTask();
    return () => { isMounted = false; };
  }, [id, fetchTaskById]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await editTask(id, formData);
      navigate(`/tasks/${id}`);
    } catch {
      // Toast handles error in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <FiArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Title */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FiEdit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Edit Task</h1>
            <p className="text-xs text-slate-400">
              Update task fields and sync changes with Cloudant NoSQL database.
            </p>
          </div>
        </div>

        {/* Content */}
        {loadingTask ? (
          <Loader message="Fetching task details..." />
        ) : fetchError ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-rose-400">{fetchError}</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <TaskForm
            initialValues={taskData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            mode="edit"
          />
        )}

      </div>

    </div>
  );
};

export default EditTask;
