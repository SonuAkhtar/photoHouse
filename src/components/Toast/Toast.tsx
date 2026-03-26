import "./Toast.css";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

export default function ToastStack() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.type}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            layout
          >
            <span className="toast_icon" aria-hidden="true">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="toast_msg">{t.message}</span>
            <button
              className="toast_close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
