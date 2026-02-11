import { useCallback, useRef, useState } from 'react';

export type ToastState = {
  message: string | null;
};

export function useToast(timeoutMs: number = 1200) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const toast = useCallback(
    (msg: string) => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
      setMessage(msg);
      timerRef.current = window.setTimeout(() => setMessage(null), timeoutMs);
    },
    [timeoutMs],
  );

  const state: ToastState = { message };
  return { state, toast };
}
