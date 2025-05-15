/**
 * Custom hook for managing modal open/close state and optional payload.
 *
 * Features:
 * - Controls whether a modal is open or closed.
 * - Optionally stores a payload (e.g., data to edit or delete).
 * - Provides open and close functions for modal control.
 *
 * @template T - Type of the payload data (default: undefined).
 * @returns {object} Modal state and control functions:
 *   - isOpen: Boolean indicating if the modal is open.
 *   - payload: The payload data or null.
 *   - open: Function to open the modal (optionally with payload).
 *   - close: Function to close the modal and clear payload.
 */
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