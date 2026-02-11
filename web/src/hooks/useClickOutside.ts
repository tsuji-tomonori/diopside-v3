import { useEffect, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function onDocClick(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target && el.contains(e.target as Node)) return;
      onOutside();
    }

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [ref, onOutside, enabled]);
}
