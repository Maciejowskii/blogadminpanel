"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextValue {
  addToast: (type: Toast["type"], message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5" style={{ color: "var(--success)" }} />,
    error: <AlertCircle className="w-5 h-5" style={{ color: "var(--danger)" }} />,
    info: <Info className="w-5 h-5" style={{ color: "var(--accent)" }} />,
  };

  const borderColorMap = {
    success: "rgba(34, 197, 94, 0.3)",
    error: "rgba(239, 68, 68, 0.3)",
    info: "rgba(99, 102, 241, 0.3)",
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-enter flex items-center gap-3 px-4 py-3 rounded-xl text-sm min-w-[300px] max-w-[420px]"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: `1px solid ${borderColorMap[toast.type]}`,
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
              color: "var(--text-primary)",
            }}
          >
            {iconMap[toast.type]}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
