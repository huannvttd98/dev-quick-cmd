import { useEffect, useState } from "react";

interface Props {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 1500 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), duration);
    const close = setTimeout(onClose, duration + 200);
    return () => {
      clearTimeout(hide);
      clearTimeout(close);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded bg-slate-900 px-3 py-2 text-xs text-white shadow-lg transition-opacity duration-200 dark:bg-slate-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
