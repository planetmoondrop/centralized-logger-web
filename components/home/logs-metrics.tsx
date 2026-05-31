"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ─────────────────────────────────── */
interface Counters { logs: number; metrics: number; events: number; errors: number }
interface DbState { total: number; errors: number; successRate: number; bars: number[]; logs: LogRow[] }
interface LogRow { id: number; time: string; svc: string; msg: string; status: string }
interface Packet { id: number; svcIdx: number; color: string; key: string; progress: number; speed: number }
interface OutPacket { id: number; progress: number; speed: number }

/* ─── Constants ─────────────────────────────── */
const PACKET_TYPES = [
  { color: "#60a5fa", key: "logs" },
  { color: "#4ade80", key: "metrics" },
  { color: "#a78bfa", key: "events" },
  { color: "#f87171", key: "errors" },
  { color: "#22d3ee", key: "traces" },
];
const SVCS = [
  { id: 0, color: "#60a5fa", name: "auth-svc", tagBg: "#172554", tagColor: "#93c5fd" },
  { id: 1, color: "#a78bfa", name: "backend-svc", tagBg: "#1e1b4b", tagColor: "#c4b5fd" },
  { id: 2, color: "#34d399", name: "payments-svc", tagBg: "#064e3b", tagColor: "#6ee7b7" },
];
const SVC_CARDS = [
  { name: "Auth service", sub: "jwt · sessions · otp · tokens", port: ":3001", svcKey: 0 },
  { name: "Backend service", sub: "api · queue · cache · workers", port: ":3002", svcKey: 1 },
  { name: "Payments service", sub: "stripe · ledger · fraud · fx", port: ":3003", svcKey: 2 },
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
  "200": { bg: "#064e3b", color: "#6ee7b7" },
  "201": { bg: "#064e3b", color: "#6ee7b7" },
  "204": { bg: "#064e3b", color: "#6ee7b7" },
  "304": { bg: "#3b2d05", color: "#fbbf24" },
  "400": { bg: "#4e0f0f", color: "#fca5a5" },
  "404": { bg: "#4e0f0f", color: "#fca5a5" },
};
const LEGEND = [
  { color: "#60a5fa", label: "Logs" },
  { color: "#4ade80", label: "Metrics" },
  { color: "#a78bfa", label: "Events" },
  { color: "#f87171", label: "Errors" },
  { color: "#22d3ee", label: "Traces" },
];
let _logId = 0;

/* ─── Grid background ─────────────────────────── */
function GridBg({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0,
        backgroundImage:
          `linear-gradient(rgba(200,111,36,${opacity}) 1px,transparent 1px),` +
          `linear-gradient(90deg,rgba(200,111,36,${opacity}) 1px,transparent 1px)`,
        backgroundSize: "30px 30px",
        pointerEvents: "none",
      }}
    />
  );
}


/* ─── Animated counter ────────────────────────── */
function AnimCounter({ value, color }: { value: number; color?: string }) {
  const prev = useRef(value);
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    if (value !== prev.current) { setAnim(true); prev.current = value; }
    const t = setTimeout(() => setAnim(false), 220);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <span style={{
      fontSize: 15, fontWeight: 500, color: color ?? "#f0e8d0",
      fontFamily: "monospace", display: "block",
      transform: anim ? "translateY(-2px)" : "translateY(0)",
      transition: "transform .22s ease",
    }}>
      {value.toLocaleString()}
    </span>
  );
}

/* ─── Section 2: Flow viz ─────────────────────── */
function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [counters, setCounters] = useState<Counters>({ logs: 0, metrics: 0, events: 0, errors: 0 });
  const [packets, setPackets] = useState<Packet[]>([]);
  const [outPackets, setOutPackets] = useState<OutPacket[]>([]);
  const [db, setDb] = useState<DbState>({
    total: 0, errors: 0, successRate: 100, bars: Array(12).fill(0), logs: [],
  });

  const pktIdRef = useRef(0);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ counters: { logs: 0, metrics: 0, events: 0, errors: 0 }, db: { total: 0, errors: 0, bars: Array(12).fill(0) as number[], barTick: 0, tickVol: 0, logs: [] as LogRow[] } });
  const lastSpawnRef = useRef(0);
  const lastOutRef = useRef(0);
  const lastBarRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loop = useCallback((ts: number) => {
    const s = stateRef.current;

    if (ts - lastSpawnRef.current > 160 + Math.random() * 220) {
      const svc = SVCS[Math.floor(Math.random() * 3)];
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
      const svc = SVCS[Math.floor(Math.random() * 3)];
      const s = stateRef.current;
      s.counters[("logs" in s.counters ? "logs" : "logs") as keyof Counters];
      const type = PACKET_TYPES[Math.floor(Math.random() * PACKET_TYPES.length)];
      const key = type.key as keyof Counters;
      if (key in s.counters) s.counters[key]++;
      s.db.total++;
      s.db.tickVol++;
      if (key === "errors") s.db.errors++;
      const rate = Math.max(0, Math.round((1 - s.db.errors / s.db.total) * 100));
      const msg = LOG_MSGS[Math.floor(Math.random() * LOG_MSGS.length)];
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
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPackets(prev => prev.map(p => ({ ...p, progress: p.progress + p.speed })).filter(p => p.progress < 1));
      setOutPackets(prev => prev.map(p => ({ ...p, progress: p.progress + p.speed })).filter(p => p.progress < 1));
    }, 16);
    return () => clearInterval(interval);
  }, [active]);

  const SVC_Y = [16, 67, 118];
  const fade = (p: number) => p < 0.08 ? p / 0.08 : p > 0.88 ? (1 - p) / 0.12 : 1;

  return (
    <div style={{ padding: "44px 28px 52px", position: "relative" }} ref={ref}>
      <GridBg opacity={0.03} />
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 9, color: "#c86f24", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>
          Live architecture
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#f0e8d8", letterSpacing: "-.01em" }}>
          Real-time data flow
        </h2>
      </div>

      {/* ── Main flow row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, marginBottom: 0, alignItems: "center" }}>

        {/* Services */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SVC_CARDS.map((c, i) => (
            <div key={i} style={{
              background: "#111008", border: "1px solid #252010", borderRadius: 12,
              padding: "13px 15px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: SVCS[c.svcKey].color, opacity: .5 }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e0d4c0", marginBottom: 2 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: SVCS[c.svcKey].color, marginRight: 7, verticalAlign: "middle", animation: "blink 2s ease-in-out infinite", animationDelay: `${i * 0.3}s` }} />
                {c.name}
              </div>
              <div style={{ fontSize: 10, color: "#5a5040", marginBottom: 8 }}>{c.sub}</div>
              <div style={{ display: "flex", gap: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 4, background: SVCS[c.svcKey].tagBg, color: SVCS[c.svcKey].tagColor }}>{SVCS[c.svcKey].name}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#0d0a05", color: "#3a3020" }}>{c.port}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Connector SVG */}
        <div style={{ position: "relative", alignSelf: "stretch", overflow: "visible" }}>
          <svg width="60" height="100%" style={{ display: "block", overflow: "visible", minHeight: 150 }} viewBox="0 0 60 150">
            {[16, 67, 118].map((y, i) => (
              <g key={i}>
                <line x1="60" y1={y} x2="0" y2={y} stroke="#2a2010" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="60" y1={y} x2="0" y2={y} stroke="#2a2010" strokeWidth="1" strokeDasharray="4 4" style={{ animation: `flow ${0.9 + i * 0.15}s linear infinite` }} />
              </g>
            ))}
            <line x1="60" y1="16" x2="60" y2="118" stroke="#1a1510" strokeWidth="1" />
            <line x1="0" y1="16" x2="0" y2="118" stroke="#1a1510" strokeWidth="1" />
            {packets.map(p => (
              <circle
                key={p.id}
                cx={60 - p.progress * 60}
                cy={SVC_Y[p.svcIdx] ?? 75}
                r={3.5}
                fill={p.color}
                opacity={fade(p.progress)}
                style={{ filter: `drop-shadow(0 0 4px ${p.color}88)` }}
              />
            ))}
          </svg>
        </div>

        {/* Engine */}
        <div style={{
          background: "#13100a", border: "1px solid #3d2810", borderRadius: 14,
          padding: "18px 16px", position: "relative", overflow: "hidden",
          boxShadow: active ? "0 0 50px rgba(200,111,36,.08), inset 0 0 30px rgba(200,111,36,.04)" : "none",
          alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ position: "absolute", inset: -1, borderRadius: 14, boxShadow: "0 0 0 1px rgba(200,111,36,.18),inset 0 0 40px rgba(200,111,36,.04)", pointerEvents: "none" }} />
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9, color: "#c86f24", border: "1px solid #3d2010", borderRadius: 5, padding: "3px 8px", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
              <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden><circle cx="3" cy="3" r="2.5" fill="#c86f24"><animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" /></circle></svg>
              Observability engine
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0e0c0", marginBottom: 2 }}>Centralized logger</div>
            <div style={{ fontSize: 10, color: "#5a4e3a", marginBottom: 14 }}>Loki · Tempo · Prometheus</div>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(200,111,36,.35)", background: "#1e1508", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 9, color: "#c86f24", letterSpacing: ".06em" }}>
            OBS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {[
              { key: "logs", label: "Logs", color: undefined },
              { key: "metrics", label: "Metrics", color: undefined },
              { key: "events", label: "Events", color: undefined },
              { key: "errors", label: "Errors", color: "#f87171" },
            ].map(c => (
              <div key={c.key} style={{ background: "#0e0c07", border: "1px solid #1e1a10", borderRadius: 8, padding: "7px 9px" }}>
                <AnimCounter value={counters[c.key as keyof Counters]} color={c.color} />
                <div style={{ fontSize: 9, letterSpacing: ".07em", textTransform: "uppercase", color: c.color ?? "#5a5040", marginTop: 2 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Down arrow ── */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0", position: "relative" }}>
        <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none" style={{ overflow: "visible" }} aria-hidden>
          <line x1="200" y1="0" x2="200" y2="36" stroke="#2a2010" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2="36" stroke="#2a2010" strokeWidth="1" strokeDasharray="4 4" style={{ animation: "flowDown 1s linear infinite" }} />
          <polygon points="200,38 196,30 204,30" fill="#2a2010" />
          {outPackets.map(p => (
            <circle key={p.id} cx="200" cy={p.progress * 38} r={3} fill="#c86f24" opacity={fade(p.progress)} style={{ filter: "drop-shadow(0 0 4px #c86f2488)" }} />
          ))}
        </svg>
        <span style={{ position: "absolute", right: "calc(50% - 110px)", top: "50%", transform: "translateY(-50%)", fontSize: 9, color: "#3a2e20", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          forwarding to dashboard
        </span>
      </div>

      {/* ── Dashboard ── */}
      <div style={{
        background: "#0e0c07", border: "1px solid #252015", borderRadius: 16,
        padding: "20px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(200,111,36,.3)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f0e0c0", display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x=".5" y=".5" width="13" height="13" rx="2.5" stroke="#c86f24" />
              <rect x="2" y="6" width="3" height="6" rx="1" fill="#c86f24" opacity=".7" />
              <rect x="6" y="4" width="3" height="8" rx="1" fill="#c86f24" />
              <rect x="10" y="2" width="3" height="10" rx="1" fill="#c86f24" opacity=".5" />
            </svg>
            Grafana · Analytics dashboard
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#4ade80", letterSpacing: ".08em", textTransform: "uppercase" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "blink 1.4s ease-in-out infinite" }} />
            Live
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { val: db.total.toLocaleString(), label: "Total requests", color: "#f0e8d0" },
            { val: `${db.successRate}%`, label: "Success rate", color: "#4ade80" },
            { val: "3", label: "Active services", color: "#f0e8d0" },
            { val: db.errors.toString(), label: "5xx errors", color: "#f87171" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0b0905", border: "1px solid #1e1a10", borderRadius: 9, padding: "10px 10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: 3 }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#5a5040", letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0b0905", border: "1px solid #1e1a10", borderRadius: 9, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "#5a5040", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>
            Request volume · last 12 ticks
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 46 }}>
            {db.bars.map((v, i) => {
              const max = Math.max(...db.bars, 1);
              const h = Math.max(4, Math.round((v / max) * 40));
              const age = (db.bars.length - 1 - i);
              const alpha = Math.max(0.2, 1 - age / 12);
              return (
                <div key={i} style={{ flex: 1, height: h, background: `rgba(200,111,36,${alpha.toFixed(2)})`, borderRadius: "2px 2px 0 0", transition: "height .3s ease" }} />
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {db.logs.map(row => {
            const st = STATUS_STYLE[row.status] ?? { bg: "#1a1408", color: "#c86f24" };
            const svcS = SVCS.find(s => s.name === row.svc);
            return (
              <div key={row.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, padding: "5px 8px", background: "#0b0905", border: "1px solid #161208", borderRadius: 6 }}>
                <span style={{ color: "#3a3020", flexShrink: 0, fontSize: 9, fontFamily: "monospace" }}>{row.time}</span>
                <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: svcS?.tagBg ?? "#1a1408", color: svcS?.tagColor ?? "#c86f24", flexShrink: 0, fontWeight: 500 }}>{row.svc}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#5a5040", fontFamily: "monospace" }}>{row.msg}</span>
                <span style={{ flexShrink: 0, fontSize: 9, padding: "1px 6px", borderRadius: 3, background: st.bg, color: st.color, fontWeight: 500 }}>{row.status}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid #1a1610" }}>
          {LEGEND.map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#5a5040" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, display: "inline-block" }} />
              {l.label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#5a5040" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c86f24", display: "inline-block" }} />
            Engine outflow
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:.25} }
        @keyframes flow { to{stroke-dashoffset:-24} }
        @keyframes flowDown { to{stroke-dashoffset:-20} }
      `}</style>
    </div>
  );
}

/* ─── Root export ─────────────────────────────── */
export default function ObservabilityFlow() {
  return (
    <FlowSection />
  );
}