"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const DESKTOP_MQ = "(min-width: 1024px)";

function subscribeDesktopMq(onStoreChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getDesktopMqSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getDesktopMqServerSnapshot() {
  return false;
}

interface CreatorCard {
  id: number;
  avatar: string;
  description: string;
  supporters: string;
  footerIcon: "check" | "plug" | "chart" | "flow" | "bolt" | "unlock";
  side: "left" | "right";
  rotation: number;
  topPercent: number;
  peekPx: number;
}

const FOOTER_ICON_PATHS: Record<CreatorCard["footerIcon"], string> = {
  check: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  plug: "M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-1.1 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z",
  chart: "M18 20V10h2v10h-2zM12 20V4h2v16h-2zM6 20v-6h2v6H6z",
  flow: "M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z",
  bolt: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 12 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z",
  unlock:
    "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z",
};

function FooterIcon({ type }: { type: CreatorCard["footerIcon"] }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.55)" aria-hidden>
      <path d={FOOTER_ICON_PATHS[type]} />
    </svg>
  );
}

const CARDS: CreatorCard[] = [
  {
    id: 1,
    avatar: "LOG",
    description: "Scattered logs? One traceId links calls, queries & logs.",
    supporters: "no more grep hell",
    footerIcon: "check",
    side: "left",
    rotation: 8,
    topPercent: 5,
    peekPx: 150,
  },
  {
    id: 2,
    avatar: "CTX",
    description: "Tracing by hand? Context auto-follows every downstream call.",
    supporters: "one module drop-in",
    footerIcon: "plug",
    side: "left",
    rotation: -4,
    topPercent: 24,
    peekPx: 220,
  },
  {
    id: 3,
    avatar: "MET",
    description: "Blind to bottlenecks? /metrics ships on day one.",
    supporters: "no custom metrics",
    footerIcon: "chart",
    side: "left",
    rotation: 10,
    topPercent: 50,
    peekPx: 140,
  },
  {
    id: 4,
    avatar: "WEB",
    description: "Browser loses context? Trace ID flows from click to API.",
    supporters: "UI-to-API tracing",
    footerIcon: "flow",
    side: "right",
    rotation: 9,
    topPercent: 4,
    peekPx: 250,
  },
  {
    id: 5,
    avatar: "DBG",
    description: "Grafana too heavy? /_trace maps flows in-browser.",
    supporters: "debug in seconds",
    footerIcon: "bolt",
    side: "right",
    rotation: 8,
    topPercent: 28,
    peekPx: 160,
  },
  {
    id: 6,
    avatar: "MIT",
    description: "APM too pricey? MIT — self-host Loki, Tempo & Prometheus.",
    supporters: "$0 · no lock-in",
    footerIcon: "unlock",
    side: "right",
    rotation: -12,
    topPercent: 54,
    peekPx: 210,
  },
];

const CARD_W = 148;
const SCROLL_EXIT_DISTANCE = 300;

function Card({
  card,
  visible,
  index,
  scrollProgress,
  entryDone,
}: {
  card: CreatorCard;
  visible: boolean;
  index: number;
  scrollProgress: number;
  entryDone: boolean;
}) {
  const isLeft = card.side === "left";
  const visibleOffset = -(CARD_W - card.peekPx);
  const hiddenOffset = -CARD_W - 20;
  const currentOffset = visible
    ? visibleOffset + (hiddenOffset - visibleOffset) * scrollProgress
    : hiddenOffset;

  return (
    <div
      style={{
        position: "absolute",
        top: `${card.topPercent}%`,
        ...(isLeft ? { left: `${currentOffset}px` } : { right: `${currentOffset}px` }),
        transform: `rotate(${card.rotation}deg)`,
        transition: entryDone
          ? "none"
          : `left 0.72s cubic-bezier(0.34,1.28,0.64,1) ${index * 120}ms,
                       right 0.72s cubic-bezier(0.34,1.28,0.64,1) ${index * 120}ms`,
        opacity: 1 - scrollProgress * 0.65,
        width: `${CARD_W}px`,
        willChange: "left, right, opacity",
      }}
    >
      <div
        style={{
          background: "rgba(250,165,108,0.10)",
          border: "1px solid rgba(250,165,108,0.25)",
          borderRadius: "12px",
          padding: "12px",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "rgba(250,165,108,0.18)",
            border: "1px solid rgba(250,165,108,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "8px",
            fontFamily: "monospace",
          }}
        >
          {card.avatar}
        </div>
        <p
          style={{
            fontSize: "11px",
            lineHeight: 1.45,
            margin: "0 0 8px 0",
            color: "#ffffff",
            fontWeight: 500,
            fontFamily: "monospace",
          }}
        >
          {card.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <FooterIcon type={card.footerIcon} />
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "monospace",
            }}
          >
            {card.supporters}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CreatorCardsOverlay({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const showCards = useSyncExternalStore(
    subscribeDesktopMq,
    getDesktopMqSnapshot,
    getDesktopMqServerSnapshot
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const entryTimer = setTimeout(() => setVisible(true), 150);
    const entryDuration = 150 + CARDS.length * 120 + 800;
    const doneTimer = setTimeout(() => setEntryDone(true), entryDuration);

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const raw = window.scrollY / SCROLL_EXIT_DISTANCE;
        setScrollProgress(Math.min(1, Math.max(0, raw)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const leftCards = CARDS.filter((c) => c.side === "left");
  const rightCards = CARDS.filter((c) => c.side === "right");

  return (
    // No overflow style here — <main> owns overflow-x-clip now
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {showCards && (
        <>
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 h-full"
            style={{ width: `${CARD_W}px`, pointerEvents: "none" }}
          >
            {leftCards.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                visible={visible}
                index={i}
                scrollProgress={entryDone ? scrollProgress : 0}
                entryDone={entryDone}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 h-full"
            style={{ width: `${CARD_W}px`, pointerEvents: "none" }}
          >
            {rightCards.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                visible={visible}
                index={i}
                scrollProgress={entryDone ? scrollProgress : 0}
                entryDone={entryDone}
              />
            ))}
          </div>
        </>
      )}
      <div className="relative flex w-full flex-col items-center lg:z-20">{children}</div>
    </div>
  );
}
