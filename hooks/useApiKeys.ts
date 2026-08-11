"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiKeys, AiProvider } from "@/types";

const STORAGE_KEY = "keydrop_api_keys";

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKeys>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setKeys(JSON.parse(stored));
      }
    } catch {
      /* ignore */
    }
    setIsLoaded(true);
  }, []);

  const saveKey = useCallback((provider: AiProvider, key: string) => {
    setKeys((prev) => {
      const updated = { ...prev, [provider]: key.trim() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const removeKey = useCallback((provider: AiProvider) => {
    setKeys((prev) => {
      const updated = { ...prev };
      delete updated[provider];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const getKey = useCallback(
    (provider: AiProvider) => keys[provider] ?? "",
    [keys]
  );

  const hasKey = useCallback(
    (provider: AiProvider) => Boolean(keys[provider]?.trim()),
    [keys]
  );

  return { keys, isLoaded, saveKey, removeKey, getKey, hasKey };
}
