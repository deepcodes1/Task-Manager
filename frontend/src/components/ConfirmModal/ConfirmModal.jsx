import { FiAlertTriangle, FiTrash2, FiX, FiLoader } from 'react-icons/fi';

export const ConfirmModal = ({
  isOpen,
  title = 'Delete Task Confirmation',
  message = 'Are you sure you want to delete this task? This operation cannot be undone.',
  taskTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      <div className="glass-panel w-full max-w-md rounded-2xl border border-rose-500/20 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-rose-500/5">
          <div className="flex items-center space-x-3 text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            disabled={isDeleting}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            {message}
          </p>

          {taskTitle && (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-brand-300 truncate">
              "{taskTitle}"
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 p-5 border-t border-slate-800 bg-slate-900/60">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 active:scale-95 transition flex items-center"
          >
            {isDeleting ? (
              <>
                <FiLoader className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="w-3.5 h-3.5 mr-1.5" />
                Confirm Delete
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;
