import { useState, useCallback } from "react";

export function useModal<T = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<T | null>(null);

  const open = useCallback((data?: T) => {
    setPayload(data ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setPayload(null);
    setIsOpen(false);
  }, []);

  return { isOpen, payload, open, close };
}