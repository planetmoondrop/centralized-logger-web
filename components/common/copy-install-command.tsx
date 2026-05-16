"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useCallback, useId, useState } from "react";

const COMMAND =
  "pnpx -p @planetmoondrop/centralized-logger planetmoondrop init";

export function CopyInstallCommand() {
  const [copied, setCopied] = useState(false);
  const labelId = useId();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; ignore
    }
  }, []);

  return (
    <figure
      className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#faa56c]/35 bg-[#121212] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)]"
      aria-labelledby={labelId}
    >
      <figcaption className="sr-only">Install with pnpx</figcaption>
      <div className="flex items-center justify-between gap-3 border-b border-[#faa56c]/20 bg-[#1a1a1a] px-3 py-2.5 sm:px-4">
        <span
          id={labelId}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#faa56c]/75"
        >
          bash
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
          className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-md text-[#faa56c] transition-[background-color,transform] duration-200 hover:bg-[#faa56c]/12 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#faa56c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {copied ? (
            <Check className="h-5 w-5" weight="bold" aria-hidden />
          ) : (
            <Copy className="h-5 w-5" weight="bold" aria-hidden />
          )}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 sm:p-5">
        <code className="font-mono text-[13px] leading-relaxed text-[#e8e8e8] sm:text-sm">
          {COMMAND}
        </code>
      </pre>
    </figure>
  );
}
