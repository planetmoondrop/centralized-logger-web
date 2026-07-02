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
  side: "left" | "right";
  rotation: number;
  topPercent: number;
  peekPx: number;
}

const CARDS: CreatorCard[] = [
  {
    id: 1,
    avatar: "C",
    description: "Cara is building a new platform for artists",
    supporters: "8,780 supporters",
    side: "left",
    rotation: 8,
    topPercent: 5,
    peekPx: 150,
  },
  {
    id: 2,
    avatar: "KC",
    description:
      "Kaleigh Cohen is creating indoor cycling and strength workouts on YouTube!",
    supporters: "4,488 supporters",
    side: "left",
    rotation: -4,
    topPercent: 24,
    peekPx: 220,
  },
  {
    id: 3,
    avatar: "TS",
    description: "Teacher Stefano is creating YouTube videos and Podcast",
    supporters: "641 supporters",
    side: "left",
    rotation: 10,
    topPercent: 50,
    peekPx: 140,
  },
  {
    id: 4,
    avatar: "TT",
    description: "The Thrill Of The Thrift is creating thrifting videos",
    supporters: "7.1K supporters",
    side: "right",
    rotation: 9,
    topPercent: 4,
    peekPx: 250,
  },
  {
    id: 5,
    avatar: "BTR",
    description: "Beach Talk Radio is a dinky little Podcast",
    supporters: "1,604 supporters",
    side: "right",
    rotation: 8,
    topPercent: 28,
    peekPx: 160,
  },
  {
    id: 6,
    avatar: "SP",
    description:
      "Simple Politics is helping people have better conversations about politics",
    supporters: "2,891 supporters",
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
          <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.55)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
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
