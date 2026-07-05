"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";

const WIDE_MQ = "(min-width: 1024px)";

function subscribeWideMq(onStoreChange: () => void) {
  const mq = window.matchMedia(WIDE_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getWideMqSnapshot() {
  return window.matchMedia(WIDE_MQ).matches;
}

function getWideMqServerSnapshot() {
  return false;
}

/* ─── Types ─────────────────────────────────── */
type ArchMode = "microservices" | "monolith";
interface Counters { logs: number; metrics: number; events: number; errors: number }
interface DbState { total: number; errors: number; successRate: number; bars: number[]; logs: LogRow[] }
interface LogRow { id: number; time: string; svc: string; msg: string; status: string }
interface Packet { id: number; svcIdx: number; color: string; key: string; progress: number; speed: number }
interface OutPacket { id: number; progress: number; speed: number }
interface SvcDef { id: number; color: string; name: string; tagBg: string; tagColor: string }
interface SvcCard { name: string; sub: string; port: string; svcKey: number }

/* ─── Constants ─────────────────────────────── */
const ARCH_SWITCH_MS = 14_000;
const ACCENT = "#faa56c";
const ACCENT_RGB = "250,165,108";
const PACKET_TYPES = [
  { color: "#60a5fa", key: "logs" },
  { color: "#4ade80", key: "metrics" },
  { color: "#a78bfa", key: "events" },
  { color: "#f87171", key: "errors" },
  { color: "#22d3ee", key: "traces" },
];
const SVCS: SvcDef[] = [
  { id: 0, color: "#60a5fa", name: "auth-svc", tagBg: "#172554", tagColor: "#93c5fd" },
  { id: 1, color: "#a78bfa", name: "backend-svc", tagBg: "#1e1b4b", tagColor: "#c4b5fd" },
  { id: 2, color: "#34d399", name: "payments-svc", tagBg: "#064e3b", tagColor: "#6ee7b7" },
];
const MONOLITH_SVC: SvcDef = {
  id: 0, color: ACCENT, name: "monolith", tagBg: `rgba(${ACCENT_RGB},0.12)`, tagColor: ACCENT,
};
const SVC_CARDS: SvcCard[] = [
  { name: "Auth service", sub: "jwt · sessions · otp · tokens", port: ":3001", svcKey: 0 },
  { name: "Backend service", sub: "api · queue · cache · workers", port: ":3002", svcKey: 1 },
  { name: "Payments service", sub: "stripe · ledger · fraud · fx", port: ":3003", svcKey: 2 },
];
const MONOLITH_CARD: SvcCard = {
  name: "Monolith app", sub: "api · auth · payments · workers", port: ":3000", svcKey: 0,
};
const MONO_LOG_MSGS = [
  "GET /api/orders 200 4ms",
  "POST /api/checkout 201 11ms",
  "GET /api/users/me 200 3ms",
  "POST /api/auth/login 201 7ms",
  "GET /api/inventory 200 5ms",
  "DELETE /api/cart/item 204 2ms",
  "POST /api/refund 400 5ms",
  "GET /health 200 1ms",
];
const LOG_MSGS = [
  "GET /api/auth/verify 200 3ms",
  "POST /api/payments/charge 201 12ms",
  "GET /api/products 200 5ms",
  "POST /api/auth/otp 201 8ms",
  "GET /api/user/profile 200 4ms",
  "DELETE /api/session 204 2ms",
  "POST /api/payments/refund 400 6ms",
  "GET /api/metrics 200 1ms",
];
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "200": { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
  "201": { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
  "204": { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
  "304": { bg: `rgba(${ACCENT_RGB},0.12)`, color: ACCENT },
  "400": { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  "404": { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
};
const LEGEND = [
  { color: "#60a5fa", label: "Logs" },
  { color: "#4ade80", label: "Metrics" },
  { color: "#a78bfa", label: "Events" },
  { color: "#f87171", label: "Errors" },
  { color: "#22d3ee", label: "Traces" },
];
let _logId = 0;

function emptyCounters(): Counters {
  return { logs: 0, metrics: 0, events: 0, errors: 0 };
}

function emptyDbState(): DbState {
  return { total: 0, errors: 0, successRate: 100, bars: Array(12).fill(0), logs: [] };
}

function emptyStateRef() {
  return {
    counters: emptyCounters(),
    db: { total: 0, errors: 0, bars: Array(12).fill(0) as number[], barTick: 0, tickVol: 0, logs: [] as LogRow[] },
  };
}

/* ─── Grid background ─────────────────────────── */
function GridBg({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          `linear-gradient(rgba(${ACCENT_RGB},${opacity}) 1px,transparent 1px),` +
          `linear-gradient(90deg,rgba(${ACCENT_RGB},${opacity}) 1px,transparent 1px)`,
        backgroundSize: "30px 30px",
      }}
    />
  );
}


/* ─── Animated counter ────────────────────────── */
function AnimCounter({ value, color }: { value: number; color?: string }) {
  const prev = useRef(value);
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value !== prev.current) { setAnim(true); prev.current = value; }
    const t = setTimeout(() => setAnim(false), 220);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <span
      className="block font-mono text-[15px] font-medium text-foreground transition-transform duration-200"
      style={{
        color: color ?? undefined,
        transform: anim ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {value.toLocaleString()}
    </span>
  );
}

/* ─── Section 2: Flow viz ─────────────────────── */
function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [archMode, setArchMode] = useState<ArchMode>("microservices");
  const [cycleKey, setCycleKey] = useState(0);
  const [counters, setCounters] = useState<Counters>(emptyCounters);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [outPackets, setOutPackets] = useState<OutPacket[]>([]);
  const [db, setDb] = useState<DbState>(emptyDbState);

  const pktIdRef = useRef(0);
  const animRef = useRef<number>(0);
  const archModeRef = useRef<ArchMode>("microservices");
  const stateRef = useRef(emptyStateRef());
  const lastSpawnRef = useRef(0);
  const lastOutRef = useRef(0);
  const lastBarRef = useRef(0);

  const displayCards = archMode === "microservices" ? SVC_CARDS : [MONOLITH_CARD];
  const connectorLanes = archMode === "microservices" ? 3 : 1;

  useEffect(() => {
    archModeRef.current = archMode;
  }, [archMode]);

  const resetSimulation = useCallback(() => {
    stateRef.current = emptyStateRef();
    pktIdRef.current = 0;
    lastSpawnRef.current = 0;
    lastOutRef.current = 0;
    lastBarRef.current = 0;
    setCounters(emptyCounters());
    setPackets([]);
    setOutPackets([]);
    setDb(emptyDbState());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      resetSimulation();
      setArchMode((m) => {
        const next = m === "microservices" ? "monolith" : "microservices";
        archModeRef.current = next;
        return next;
      });
      setCycleKey((k) => k + 1);
    }, ARCH_SWITCH_MS);
    return () => clearInterval(timer);
  }, [active, resetSimulation]);

  const loop = useCallback((ts: number) => {
    const s = stateRef.current;
    const mode = archModeRef.current;
    const svcPool = mode === "microservices" ? SVCS : [MONOLITH_SVC];

    if (ts - lastSpawnRef.current > 160 + Math.random() * 220) {
      const svc = svcPool[Math.floor(Math.random() * svcPool.length)];
      const type = PACKET_TYPES[Math.floor(Math.random() * PACKET_TYPES.length)];
      const pkt: Packet = {
        id: pktIdRef.current++,
        svcIdx: svc.id, color: type.color, key: type.key,
        progress: 0, speed: 0.018 + Math.random() * 0.014,
      };
      setPackets(prev => [...prev, pkt]);
      lastSpawnRef.current = ts;
    }

    if (ts - lastOutRef.current > 380 + Math.random() * 320) {
      setOutPackets(prev => [...prev, { id: pktIdRef.current++, progress: 0, speed: 0.025 + Math.random() * 0.015 }]);
      lastOutRef.current = ts;
    }

    if (ts - lastBarRef.current > 800) {
      const newBars = [...s.db.bars];
      newBars[s.db.barTick % 12] = s.db.tickVol;
      s.db.bars = newBars;
      s.db.barTick++;
      s.db.tickVol = 0;
      lastBarRef.current = ts;
    }

    animRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!active) return;
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, loop]);

  useEffect(() => {
    if (!active) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      const mode = archModeRef.current;
      const svcPool = mode === "microservices" ? SVCS : [MONOLITH_SVC];
      const msgs = mode === "microservices" ? LOG_MSGS : MONO_LOG_MSGS;
      const svc = svcPool[Math.floor(Math.random() * svcPool.length)];
      const s = stateRef.current;
      const type = PACKET_TYPES[Math.floor(Math.random() * PACKET_TYPES.length)];
      const key = type.key as keyof Counters;
      if (key in s.counters) s.counters[key]++;
      s.db.total++;
      s.db.tickVol++;
      if (key === "errors") s.db.errors++;
      const rate = s.db.total > 0 ? Math.max(0, Math.round((1 - s.db.errors / s.db.total) * 100)) : 100;
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      const statusMatch = msg.match(/\d{3}/);
      const status = statusMatch ? statusMatch[0] : "200";
      const newLog: LogRow = { id: _logId++, time, svc: svc.name, msg, status };
      const newLogs = [newLog, ...s.db.logs].slice(0, 4);
      s.db.logs = newLogs;
      setCounters({ ...s.counters });
      setDb({ total: s.db.total, errors: s.db.errors, successRate: rate, bars: [...s.db.bars], logs: [...newLogs] });
      setTimeout(tick, 150 + Math.random() * 250);
    };
    tick();
    return () => { running = false; };
  }, [active, cycleKey]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPackets(prev => prev.map(p => ({ ...p, progress: p.progress + p.speed })).filter(p => p.progress < 1));
      setOutPackets(prev => prev.map(p => ({ ...p, progress: p.progress + p.speed })).filter(p => p.progress < 1));
    }, 16);
    return () => clearInterval(interval);
  }, [active]);

  const SVC_Y = archMode === "microservices" ? [16, 67, 118] : [75];
  const fade = (p: number) => p < 0.08 ? p / 0.08 : p > 0.88 ? (1 - p) / 0.12 : 1;
  const isWide = useSyncExternalStore(subscribeWideMq, getWideMqSnapshot, getWideMqServerSnapshot);
  const svcLookup = archMode === "microservices" ? SVCS : [MONOLITH_SVC];

  const strokeMuted = "#3a3a3a";
  const strokeFlow = `rgba(${ACCENT_RGB},0.35)`;

  return (
    <section
      ref={ref}
      className="relative mx-auto w-full max-w-[720px] px-4 py-12 sm:px-5 md:py-16"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[#faa56c]/20 bg-[#1b1b1b]/90 p-4 shadow-[0_0_48px_-16px_rgba(250,165,108,0.2)] backdrop-blur-sm sm:p-5"
        style={active ? { boxShadow: `0 0 48px -12px rgba(${ACCENT_RGB},0.22), inset 0 1px 0 rgba(${ACCENT_RGB},0.08)` } : undefined}
      >
        <GridBg opacity={0.035} />
        <div className="relative mb-6 text-center sm:mb-7">
          <p className="mb-4 inline-block rounded-lg border-2 border-[#faa56c]/90 px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.14em] text-[#faa56c]/90 uppercase sm:text-[11px]">
            Live architecture
          </p>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Real-time data flow
          </h2>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#faa56c]/30 bg-[rgba(250,165,108,0.08)] px-2.5 py-1 font-mono text-[9px] tracking-widest text-[#faa56c]/90 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#faa56c] animate-[blink_2s_ease-in-out_infinite]" />
            {archMode === "microservices" ? "Microservices" : "Monolith"}
          </p>
        </div>

        {/* ── Main flow row ── */}
        <div className="relative mx-auto grid w-full max-w-[640px] grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] lg:gap-2">

          {/* Services */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {displayCards.map((c, i) => {
              const svc = svcLookup[c.svcKey] ?? svcLookup[0];
              return (
                <div
                  key={`${archMode}-${c.name}`}
                  className="relative overflow-hidden rounded-lg border border-[#faa56c]/15 bg-[rgba(250,165,108,0.06)] px-3.5 py-3 backdrop-blur-sm transition-colors sm:px-4 sm:py-3.5"
                >
                  <div className="absolute top-0 right-0 left-0 h-px opacity-70" style={{ background: svc.color }} />
                  <div className="mb-0.5 text-[11px] font-semibold text-foreground sm:text-xs">
                    <span
                      className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                      style={{
                        background: svc.color,
                        animation: "blink 2s ease-in-out infinite",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                    {c.name}
                  </div>
                  <div className="mb-2 font-mono text-[9px] text-foreground/45 sm:text-[10px]">{c.sub}</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-medium" style={{ background: svc.tagBg, color: svc.tagColor }}>{svc.name}</span>
                    <span className="rounded border border-[#333] bg-[#1e1e1e] px-1.5 py-0.5 font-mono text-[9px] text-foreground/40">{c.port}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connector — vertical on mobile (top→bottom), horizontal lanes on desktop (left→right) */}
          {isWide ? (
            <div className="relative self-stretch overflow-visible">
              <svg width="44" height="100%" className="block min-h-[120px] overflow-visible" viewBox="0 0 44 150">
                {SVC_Y.map((y, i) => (
                  <g key={i}>
                    <line x1="0" y1={y} x2="44" y2={y} stroke={strokeMuted} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1={y} x2="44" y2={y} stroke={strokeFlow} strokeWidth="1" strokeDasharray="4 4" style={{ animation: `flow ${0.9 + i * 0.15}s linear infinite` }} />
                  </g>
                ))}
                <line x1="0" y1={SVC_Y[0]} x2="0" y2={SVC_Y[SVC_Y.length - 1]} stroke={strokeMuted} strokeWidth="1" />
                <line x1="44" y1={SVC_Y[0]} x2="44" y2={SVC_Y[SVC_Y.length - 1]} stroke={strokeMuted} strokeWidth="1" />
                {packets.map(p => (
                  <circle
                    key={p.id}
                    cx={p.progress * 44}
                    cy={SVC_Y[p.svcIdx] ?? SVC_Y[0]}
                    r={3.5}
                    fill={p.color}
                    opacity={fade(p.progress)}
                    style={{ filter: `drop-shadow(0 0 4px ${p.color}88)` }}
                  />
                ))}
              </svg>
            </div>
          ) : (
            <div className="relative mx-auto h-14 w-10 sm:h-16">
              <svg width="40" height="100%" className="mx-auto block overflow-visible" viewBox="0 0 40 64" preserveAspectRatio="xMidYMid meet">
                {Array.from({ length: connectorLanes }, (_, i) => {
                  const x = connectorLanes === 1 ? 20 : [10, 20, 30][i];
                  return (
                    <g key={i}>
                      <line x1={x} y1="0" x2={x} y2="64" stroke={strokeMuted} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1={x} y1="0" x2={x} y2="64" stroke={strokeFlow} strokeWidth="1" strokeDasharray="4 4" style={{ animation: `flowDown ${0.9 + i * 0.15}s linear infinite` }} />
                    </g>
                  );
                })}
                {packets.map(p => {
                  const x = connectorLanes === 1 ? 20 : [10, 20, 30][p.svcIdx] ?? 20;
                  return (
                    <circle
                      key={p.id}
                      cx={x}
                      cy={p.progress * 64}
                      r={3}
                      fill={p.color}
                      opacity={fade(p.progress)}
                      style={{ filter: `drop-shadow(0 0 4px ${p.color}88)` }}
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {/* Engine */}
          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-[#faa56c]/35 bg-[rgba(250,165,108,0.08)] px-4 py-4 backdrop-blur-md sm:px-4 sm:py-4"
            style={{
              boxShadow: active ? `0 0 40px rgba(${ACCENT_RGB},0.14), inset 0 0 32px rgba(${ACCENT_RGB},0.05)` : undefined,
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-[#faa56c]/20 ring-inset" />
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#faa56c]/30 bg-[rgba(250,165,108,0.1)] px-2 py-1 font-mono text-[9px] tracking-widest text-[#faa56c]/90 uppercase">
                <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden><circle cx="3" cy="3" r="2.5" fill={ACCENT}><animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" /></circle></svg>
                Observability engine
              </div>
              <div className="text-[13px] font-semibold text-foreground">Moondrop Centralized logger</div>
              <div className="mt-0.5 font-mono text-[10px] text-foreground/45">Loki · Tempo · Prometheus</div>
            </div>
            <div className="mx-auto my-3.5 flex h-11 w-11 items-center justify-center rounded-full border border-[#faa56c]/40 bg-[rgba(250,165,108,0.1)] font-mono text-[9px] tracking-wider text-[#faa56c]/90">
              OBS
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "logs", label: "Logs", color: undefined },
                { key: "metrics", label: "Metrics", color: undefined },
                { key: "events", label: "Events", color: undefined },
                { key: "errors", label: "Errors", color: "#f87171" },
              ].map(c => (
                <div key={c.key} className="rounded-md border border-[#333] bg-[#1e1e1e]/80 px-2 py-1.5">
                  <AnimCounter value={counters[c.key as keyof Counters]} color={c.color} />
                  <div className="mt-0.5 font-mono text-[9px] tracking-[0.07em] text-foreground/40 uppercase" style={{ color: c.color }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Down arrow ── */}
        <div className="relative mx-auto flex max-w-[200px] justify-center px-2 py-1 sm:py-1.5">
          <svg width="40" height="40" viewBox="0 0 40 40" className="overflow-visible" aria-hidden>
            <line x1="20" y1="0" x2="20" y2="36" stroke={strokeMuted} strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="0" x2="20" y2="36" stroke={strokeFlow} strokeWidth="1" strokeDasharray="4 4" style={{ animation: "flowDown 1s linear infinite" }} />
            <polygon points="20,38 16,30 24,30" fill={strokeFlow} />
            {outPackets.map(p => (
              <circle key={p.id} cx="20" cy={p.progress * 36} r={3} fill={ACCENT} opacity={fade(p.progress)} style={{ filter: `drop-shadow(0 0 4px rgba(${ACCENT_RGB},0.55))` }} />
            ))}
          </svg>
          <span className="absolute top-1/2 left-full ml-2 hidden -translate-y-1/2 font-mono text-[9px] tracking-widest text-foreground/35 uppercase sm:block">
            forwarding to dashboard
          </span>
        </div>

        {/* ── Dashboard ── */}
        <div className="relative overflow-hidden rounded-lg border border-[#333] bg-[#1e1e1e]/70 p-4 backdrop-blur-sm sm:p-5">
          <div className="absolute top-0 right-0 left-0 h-px bg-[#faa56c]/30" />
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground sm:text-[13px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <rect x=".5" y=".5" width="13" height="13" rx="2.5" stroke={ACCENT} />
                <rect x="2" y="6" width="3" height="6" rx="1" fill={ACCENT} opacity=".7" />
                <rect x="6" y="4" width="3" height="8" rx="1" fill={ACCENT} />
                <rect x="10" y="2" width="3" height="10" rx="1" fill={ACCENT} opacity=".5" />
              </svg>
              Grafana · Analytics dashboard
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#4ade80] uppercase">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-[blink_1.4s_ease-in-out_infinite]" />
              Live
            </div>
          </div>
          <div className="mb-3.5 grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
            {[
              { val: db.total.toLocaleString(), label: "Total requests", color: undefined },
              { val: `${db.successRate}%`, label: "Success rate", color: "#4ade80" },
              { val: archMode === "microservices" ? "3" : "1", label: "Active services", color: undefined },
              { val: db.errors.toString(), label: "5xx errors", color: "#f87171" },
            ].map((s, i) => (
              <div key={i} className="rounded-md border border-[#333] bg-[#1b1b1b] px-2.5 py-2.5 text-center">
                <div className="mb-0.5 font-mono text-sm font-medium leading-none text-foreground sm:text-base" style={{ color: s.color }}>{s.val}</div>
                <div className="font-mono text-[8px] tracking-[0.06em] text-foreground/40 uppercase sm:text-[9px]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mb-2.5 rounded-md border border-[#333] bg-[#1b1b1b] px-3 py-2.5">
            <div className="mb-2 font-mono text-[9px] tracking-[0.07em] text-foreground/40 uppercase">
              Request volume · last 12 ticks
            </div>
            <div className="flex h-10 items-end gap-0.5 sm:h-11">
              {db.bars.map((v, i) => {
                const max = Math.max(...db.bars, 1);
                const h = Math.max(4, Math.round((v / max) * 40));
                const age = (db.bars.length - 1 - i);
                const alpha = Math.max(0.2, 1 - age / 12);
                return (
                  <div key={i} className="flex-1 rounded-t-sm transition-[height] duration-300" style={{ height: h, background: `rgba(${ACCENT_RGB},${alpha.toFixed(2)})` }} />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {db.logs.map(row => {
              const st = STATUS_STYLE[row.status] ?? { bg: `rgba(${ACCENT_RGB},0.1)`, color: ACCENT };
              const svcS = svcLookup.find(s => s.name === row.svc) ?? SVCS.find(s => s.name === row.svc);
              return (
                <div key={row.id} className="flex items-center gap-1.5 rounded-md border border-[#333] bg-[#1b1b1b] px-2 py-1.5 font-mono text-[9px] sm:gap-2 sm:px-2 sm:text-[10px]">
                  <span className="shrink-0 text-[8px] text-foreground/35 sm:text-[9px]">{row.time}</span>
                  <span className="shrink-0 rounded px-1.5 py-px text-[8px] font-medium sm:text-[9px]" style={{ background: svcS?.tagBg ?? `rgba(${ACCENT_RGB},0.1)`, color: svcS?.tagColor ?? ACCENT }}>{row.svc}</span>
                  <span className="min-w-0 flex-1 truncate text-foreground/50">{row.msg}</span>
                  <span className="shrink-0 rounded px-1.5 py-px text-[8px] font-medium sm:text-[9px]" style={{ background: st.bg, color: st.color }}>{row.status}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-[#333] pt-3 sm:mt-3.5 sm:gap-3 sm:pt-3">
            {LEGEND.map(l => (
              <div key={l.label} className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/45">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1.5 font-mono text-[9px] text-foreground/45 sm:text-[10px]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#faa56c]" />
              Engine outflow
            </div>
          </div>
        </div>

        <style>{`
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:.25} }
        @keyframes flow { from{stroke-dashoffset:24} to{stroke-dashoffset:0} }
        @keyframes flowDown { from{stroke-dashoffset:20} to{stroke-dashoffset:0} }
      `}</style>
      </div>
    </section>
  );
}

/* ─── Root export ─────────────────────────────── */
export default function ObservabilityFlow() {
  return (
    <FlowSection />
  );
}