"use client";

import { useState, useCallback } from "react";
import type { ParsedDocument } from "@/types";
import { parseFile } from "@/lib/document";

export function useDocument() {
  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setIsParsing(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setDocument(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse document");
      setDocument(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const clearDocument = useCallback(() => {
    setDocument(null);
    setError(null);
  }, []);

  return { document, isParsing, error, loadFile, clearDocument };
}
