import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-5 top-5 z-9999 flex w-[calc(100%-2.5rem)] max-w-md items-center gap-3 rounded-xl border bg-white p-4 shadow-xl transition-all duration-300 ${
        isSuccess ? "border-green-200" : "border-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={22} className="shrink-0 text-green-600" />
      ) : (
        <XCircle size={22} className="shrink-0 text-red-600" />
      )}

      <p className="flex-1 text-sm font-semibold text-slate-800">{message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;
