/**
 * Custom hook for importing checklists from a JSON file.
 *
 * Features:
 * - Provides a file input ref for triggering file selection.
 * - Handles file selection and calls the global importLists function.
 * - Resets the file input after import to allow re-importing the same file.
 *
 * @returns {object} fileInputRef and handleImport function.
 *   - fileInputRef: Ref to be attached to a hidden file input element.
 *   - handleImport: Callback to handle file selection and import logic.
 */
import { useRef, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useLists } from "../contexts/ListContext";

export function useFileImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importLists } = useLists();

  const handleImport = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      importLists(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [importLists]
  );

  return { fileInputRef, handleImport };
}