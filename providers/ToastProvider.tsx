import ToastViewport from '@/components/ui/Toast';
import {ToastContext} from '@/contexts/toastContext';
import {ToastItem, ToastOptions} from '@/types/global';
import React, {useCallback, useMemo, useRef, useState} from 'react';

export default function ToastProvider({children}: {children: React.ReactNode}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const hide = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const duration = opts.duration ?? 2800;
      setToasts(prev => [{id, opts}, ...prev]);
      timers.current[id] = setTimeout(() => hide(id), duration);
      return id;
    },
    [hide],
  );

  const value = useMemo(() => ({show, hide}), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={toasts} onClose={hide} />
    </ToastContext.Provider>
  );
}
