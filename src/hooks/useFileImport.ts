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