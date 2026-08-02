import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiX, 
  FiAlertCircle, 
  FiLoader, 
  FiCalendar, 
  FiFileText, 
  FiTag, 
  FiCheckCircle 
} from 'react-icons/fi';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';
import { taskValidationRules } from '../../utils/validation';
import { formatDateForInput } from '../../utils/helpers';

export const TaskForm = ({ initialValues, onSubmit, isSubmitting, mode = 'create' }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: formatDateForInput(new Date(Date.now() + 86400000 * 2)),
    },
  });

  const descriptionValue = watch('description') || '';

  // Pre-fill form if editing
  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || '',
        description: initialValues.description || '',
        status: initialValues.status || 'Pending',
        priority: initialValues.priority || 'Medium',
        dueDate: formatDateForInput(initialValues.dueDate),
      });
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
          <span className="flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-brand-400" /> Task Title <span className="text-rose-400 ml-1">*</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="e.g. Build Cloudant NoSQL Express REST API"
          {...register('title', taskValidationRules.title)}
          className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
            errors.title
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center">
            <FiAlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.title.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
          <span className="flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-brand-400" /> Description
          </span>
          <span className="text-xs text-slate-500">
            {descriptionValue.length}/500 chars
          </span>
        </label>
        <textarea
          rows={4}
          placeholder="Provide detailed instructions, context, API specs, or notes..."
          {...register('description', taskValidationRules.description)}
          className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition resize-none ${
            errors.description
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center">
            <FiAlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.description.message}
          </p>
        )}
      </div>

      {/* Grid: Status, Priority, Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
            <FiCheckCircle className="w-4 h-4 mr-2 text-brand-400" /> Status <span className="text-rose-400 ml-1">*</span>
          </label>
          <select
            {...register('status', taskValidationRules.status)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-slate-900 text-slate-100">
                {status}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center">
              <FiAlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.status.message}
            </p>
          )}
        </div>

        {/* Priority Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
            <FiTag className="w-4 h-4 mr-2 text-brand-400" /> Priority <span className="text-rose-400 ml-1">*</span>
          </label>
          <select
            {...register('priority', taskValidationRules.priority)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority} className="bg-slate-900 text-slate-100">
                {priority} Priority
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center">
              <FiAlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.priority.message}
            </p>
          )}
        </div>

        {/* Due Date Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
            <FiCalendar className="w-4 h-4 mr-2 text-brand-400" /> Due Date <span className="text-rose-400 ml-1">*</span>
          </label>
          <input
            type="date"
            {...register('dueDate', taskValidationRules.dueDate)}
            className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border text-slate-100 focus:outline-none focus:ring-2 transition ${
              errors.dueDate
                ? 'border-rose-500/80 focus:ring-rose-500/30'
                : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
            }`}
          />
          {errors.dueDate && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center">
              <FiAlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.dueDate.message}
            </p>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/70 transition flex items-center"
          disabled={isSubmitting}
        >
          <FiX className="w-4 h-4 mr-2" /> Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="w-4 h-4 mr-2 animate-spin" /> Saving Task...
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default TaskForm;
