"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, File, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACCEPTED_TYPES, formatFileSize } from "@/lib/document";
import type { ParsedDocument } from "@/types";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isParsing: boolean;
  document: ParsedDocument | null;
  error: string | null;
  onClear: () => void;
}

export function DropZone({ onFileAccepted, isParsing, document, error, onClear }: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFileAccepted(accepted[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
    disabled: isParsing,
  });

  if (document) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-violet-500/40 bg-violet-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{document.name}</p>
            <p className="text-xs text-zinc-400">
              {formatFileSize(document.size)} · {document.content.length.toLocaleString()} characters
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="min-h-[44px] px-3 text-xs text-zinc-500 transition-colors hover:text-red-400 touch-manipulation"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "group cursor-pointer rounded-xl border-2 border-dashed p-5 sm:p-8 text-center transition-all duration-200",
          isDragActive
            ? "border-violet-500 bg-violet-500/10"
            : "border-surface-600 hover:border-violet-500/50 hover:bg-surface-800/50",
          isParsing && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {isParsing ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
              <p className="text-sm font-medium text-zinc-300">Parsing document…</p>
            </>
          ) : (
            <>
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-700 transition-all", isDragActive && "bg-violet-600/20")}>
                {isDragActive ? (
                  <File className="h-7 w-7 text-violet-400" />
                ) : (
                  <Upload className="h-7 w-7 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {isDragActive ? "Drop it here!" : "Drag & drop your document"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  or <span className="text-violet-400">browse files</span> · PDF, TXT, DOCX · max 20MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
