import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlusCircle } from 'react-icons/fi';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm/TaskForm';

export const AddTask = () => {
  const navigate = useNavigate();
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await addTask(formData);
      navigate('/');
    } catch {
      // Error handles in context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header with Back button */}
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
          <div className="w-10 h-10 rounded-xl bg-brand-600/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <FiPlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Create New Task</h1>
            <p className="text-xs text-slate-400">
              Add a new task to your Cloudant NoSQL database store.
            </p>
          </div>
        </div>

        {/* Task Form */}
        <TaskForm onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="create" />

      </div>

    </div>
  );
};

export default AddTask;
