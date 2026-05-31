"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const PKG = "@planetmoondrop/centralized-logger";

type PackageManagerId = "npm" | "pnpm" | "yarn" | "bun";

interface PackageManager {
  id: PackageManagerId;
  label: string;
  command: string;
  color: string;
}

const PACKAGE_MANAGERS: PackageManager[] = [
  {
    id: "npm",
    label: "npm",
    command: `npx -p ${PKG} planetmoondrop init`,
    color: "#cc3434",
  },
  {
    id: "pnpm",
    label: "pnpm",
    command: `pnpm dlx ${PKG} planetmoondrop init`,
    color: "#e07b3f",
  },
  {
    id: "yarn",
    label: "yarn",
    command: `yarn dlx ${PKG} planetmoondrop init`,
    color: "#2c8ebb",
  },
  {
    id: "bun",
    label: "bun",
    command: `bunx ${PKG} planetmoondrop init`,
    color: "#f7c17c",
  },
];

interface CopyInstallCommandProps {
  command?: string;
  pkgM?: PackageManagerId[];
  activePkgM?: PackageManagerId;
}

// Each section animates independently with its own delay
const SECTIONS = ["tabs", "command", "footer"];
type Section = (typeof SECTIONS)[number];

const DELAYS: Record<Section, number> = {
  tabs: 0,
  command: 80,
  footer: 160,
};

export function CopyInstallCommand({
  command,
  pkgM,
  activePkgM = "pnpm",
}: CopyInstallCommandProps) {
  const visibleManagers = pkgM
    ? PACKAGE_MANAGERS.filter((pm) => pkgM.includes(pm.id))
    : PACKAGE_MANAGERS;

  const initialPm =
    visibleManagers.find((pm) => pm.id === activePkgM) ?? visibleManagers[0];

  const [activePm, setActivePm] = useState<PackageManager>(initialPm);
  const [copied, setCopied] = useState(false);
  const [inView, setInView] = useState(false);

  const rootRef = useRef<HTMLElement>(null);

  // Fire once when the card scrolls into view, then disconnect
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 } // trigger when 25% of the card is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command ?? activePm.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [command, activePm.command]);

  const [exe, ...args] = activePm.command.split(" ");

  // Shared style factory — each section starts invisible & shifted down,
  // then transitions to full opacity + position once inView flips true.
  const animStyle = (section: Section): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(10px)",
    transition: inView
      ? `opacity 0.55s ease ${DELAYS[section]}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${DELAYS[section]}ms`
      : "none",
  });

  return (
    <figure
      ref={rootRef}
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]"
    >
      {/* Tabs */}
      <div
        style={animStyle("tabs")}
        className="flex items-center border-b border-[#1f1f1f] bg-[#161616] px-1 pt-1"
      >
        {visibleManagers.map((pm) => {
          const isActive = activePm.id === pm.id;
          return (
            <button
              key={pm.id}
              onClick={() => {
                setActivePm(pm);
                setCopied(false);
              }}
              style={isActive ? { color: pm.color, borderBottomColor: pm.color } : {}}
              className={[
                "-mb-px border-b-2 px-4 py-2.5 font-mono text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "border-b-2"
                  : "border-transparent text-[#555] hover:text-[#888]",
              ].join(" ")}
            >
              {pm.label}
            </button>
          );
        })}
      </div>

      {/* Command */}
      <div
        style={animStyle("command")}
        className="flex items-start gap-3 px-3 py-3 sm:items-center sm:justify-between sm:px-5 sm:py-4"
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          <pre className="wrap-break-words m-0 overflow-x-auto font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-[#e2e2e2] sm:text-[13px] sm:whitespace-nowrap">
            <span style={{ color: activePm.color }} className="font-medium">
              {exe}
            </span>
            <span className="text-[#888]"> {args.join(" ")}</span>
          </pre>
        </div>

        <button
          onClick={copy}
          aria-label={copied ? "Copied!" : "Copy command"}
          className={[
            `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 active:scale-95`,
            copied
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
              : "border-[#2a2a2a] text-[#666] hover:border-[#3a3a3a] hover:bg-[#1e1e1e] hover:text-[#ccc]",
          ].join(" ")}
        >
          {copied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Footer */}
      <div
        style={animStyle("footer")}
        className="flex items-center justify-between border-t border-[#1a1a1a] px-5 py-2.5"
      >
        <div className="flex items-center gap-2 text-[11px] text-[#555]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Ready to install
        </div>
        <span className="font-mono text-[11px] text-[#555]">{PKG}</span>
      </div>
    </figure>
  );
}

function CopyIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
