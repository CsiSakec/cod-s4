"use client";

import { useState, useEffect, useRef } from "react";

/* ──── Floating Particle ──── */
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ──── Countdown Timer ──── */
function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  function getTimeLeft(t: Date) {
    const diff = t.getTime() - Date.now();
    if (diff <= 0) return null;
    const s = Math.floor(diff / 1000);
    return {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { label: "D", val: timeLeft.d },
    { label: "H", val: timeLeft.h },
    { label: "M", val: timeLeft.m },
    { label: "S", val: timeLeft.s },
  ];

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {units.map(({ label, val }, i) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <div
            style={{
              background: "rgba(124,92,252,0.15)",
              border: "1px solid rgba(124,92,252,0.3)",
              borderRadius: 8,
              padding: "4px 8px",
              minWidth: 38,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#c4b5fd",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pad(val)}
            </span>
            <div
              style={{
                fontSize: 8,
                color: "rgba(167,139,250,0.6)",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          </div>
          {i < 3 && (
            <span
              style={{
                color: "rgba(124,92,252,0.6)",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ──── Status Badge ──── */
function StatusBadge({ status }: { status: "upcoming" | "live" | "ended" }) {
  const config = {
    upcoming: {
      color: "#a78bfa",
      bg: "rgba(124,92,252,0.12)",
      dot: "#7c5cfc",
      label: "Upcoming",
    },
    live: {
      color: "#4ade80",
      bg: "rgba(74,222,128,0.1)",
      dot: "#4ade80",
      label: "Live Now",
    },
    ended: {
      color: "rgba(190,190,220,0.4)",
      bg: "rgba(255,255,255,0.05)",
      dot: "rgba(190,190,220,0.3)",
      label: "Ended",
    },
  }[status];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.5,
        color: config.color,
        textTransform: "uppercase",
        background: config.bg,
        border: `1px solid ${config.color}30`,
        borderRadius: 20,
        padding: "4px 10px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: config.dot,
          boxShadow: status === "live" ? `0 0 8px ${config.dot}` : "none",
          animation:
            status === "live" ? "glowPulse 1.5s ease-in-out infinite" : "none",
        }}
      />
      {config.label}
    </div>
  );
}

/* ──── Contest Card ──── */
function ContestCard({ contest, index }: { contest: Contest; index: number }) {
  const [hovered, setHovered] = useState(false);
  const now = Date.now();
  const start = contest.startTime.getTime();
  const end = contest.endTime.getTime();

  const status: "upcoming" | "live" | "ended" =
    now < start ? "upcoming" : now <= end ? "live" : "ended";

  const isClickable = status === "live";

  const roundColors: Record<string, string> = {
    "Inter College Rookie (Round 1)": "#7c5cfc",
    "Inter College Advance (Round 2)": "#a855f7",
    "Intra College Rookie (Round 3)": "#6366f1",
    "Intra College Advance (Round 4)": "#8b5cf6",
  };
  const accentColor = roundColors[contest.name] || "#7c5cfc";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        animation: `slideUp 0.7s cubic-bezier(.22,1,.36,1) ${index * 0.12}s both`,
        opacity: 0,
      }}
    >
      {/* Outer glow on hover */}
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${accentColor}30, transparent, ${accentColor}20)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
          pointerEvents: "none",
          filter: "blur(1px)",
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,30,0.85), rgba(12,12,22,0.92))",
          border: `1px solid ${hovered ? accentColor + "45" : "rgba(124,92,252,0.18)"}`,
          borderRadius: 24,
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.45), 0 0 40px ${accentColor}15`
            : "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}
        />

        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top row: platform + status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: accentColor,
                textTransform: "uppercase",
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}35`,
                borderRadius: 20,
                padding: "4px 12px",
              }}
            >
              ◆ {contest.platform}
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Title */}
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.2,
              color: status === "ended" ? "rgba(190,190,220,0.45)" : "#fff",
              transition: "color 0.3s",
            }}
          >
            {contest.name}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13.5,
              lineHeight: 1.6,
              color:
                status === "ended"
                  ? "rgba(190,190,220,0.3)"
                  : "rgba(190,190,220,0.65)",
            }}
          >
            {contest.description}
          </p>

          {/* Time info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 20,
              padding: "14px 16px",
              background: "rgba(124,92,252,0.06)",
              border: "1px solid rgba(124,92,252,0.12)",
              borderRadius: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(167,139,250,0.6)",
                  fontWeight: 600,
                  minWidth: 42,
                }}
              >
                START
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(220,220,240,0.8)",
                  fontWeight: 600,
                }}
              >
                {contest.startTime.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(124,92,252,0.1)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(167,139,250,0.6)",
                  fontWeight: 600,
                  minWidth: 42,
                }}
              >
                END
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(220,220,240,0.8)",
                  fontWeight: 600,
                }}
              >
                {contest.endTime.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(124,92,252,0.1)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(167,139,250,0.6)",
                  fontWeight: 600,
                  minWidth: 42,
                }}
              >
                DUR
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(220,220,240,0.8)",
                  fontWeight: 600,
                }}
              >
                {contest.duration}
              </span>
            </div>
          </div>

          {/* Countdown (only if upcoming) */}
          {status === "upcoming" && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(167,139,250,0.6)",
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Starts In
              </div>
              <Countdown target={contest.startTime} />
            </div>
          )}

          {/* CTA Button */}
          <ContestButton
            status={status}
            href={contest.link}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}

/* ──── Contest Button ──── */
function ContestButton({
  status,
  href,
  accentColor,
}: {
  status: "upcoming" | "live" | "ended";
  href: string;
  accentColor: string;
}) {
  const [hov, setHov] = useState(false);

  if (status === "ended") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(190,190,220,0.3)",
          fontSize: 14,
          fontWeight: 700,
          cursor: "not-allowed",
          letterSpacing: 0.4,
        }}
      >
        <LockIcon />
        Contest Ended
      </div>
    );
  }

  if (status === "upcoming") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 14,
          background: "rgba(124,92,252,0.08)",
          border: "1px solid rgba(124,92,252,0.25)",
          color: "rgba(167,139,250,0.6)",
          fontSize: 14,
          fontWeight: 700,
          cursor: "not-allowed",
          letterSpacing: 0.4,
        }}
      >
        <ClockIcon />
        Link Opens at Start Time
      </div>
    );
  }

  // Live
  return (
    <div style={{ position: "relative", display: "flex" }}>
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${accentColor}, #4ade80, ${accentColor})`,
          filter: "blur(10px)",
          opacity: hov ? 0.65 : 0.3,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          animation: "glowPulse 2.5s ease-in-out infinite",
        }}
      />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "13px 24px",
          borderRadius: 14,
          background: hov
            ? `linear-gradient(135deg, ${accentColor}dd, ${accentColor})`
            : `linear-gradient(135deg, ${accentColor}99, ${accentColor}bb)`,
          border: `1px solid ${accentColor}60`,
          color: "#fff",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 0.4,
          textDecoration: "none",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
          transform: hov ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hov
            ? `0 8px 28px ${accentColor}40`
            : `0 3px 14px rgba(0,0,0,0.35)`,
        }}
      >
        <ExternalIcon />
        Join Contest Now
      </a>
    </div>
  );
}

/* ──── Inline SVG Icons ──── */
const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ──── Types ──── */
interface Contest {
  name: string;
  platform: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  link: string;
}

/* ──── Contest Data — edit these! ──── */
const contests: Contest[] = [
  {
    name: "Inter College Rookie (Round 1)",
    platform: "HackerRank",
    description:
      "Inter-college rookie level coding challenge. Open to first and second year students competing across colleges.",
    startTime: new Date("2026-03-25T10:30:00"),
    endTime: new Date("2026-03-25T11:45:00"),
    duration: "1 Hr 15 Min",
    link: "https://www.hackerrank.com/csi-sakec-code-off-duty-season-5-inter-rookie",
  },
  {
    name: "Inter College Advance (Round 2)",
    platform: "HackerRank",
    description:
      "Advanced inter-college round with harder problems. Requires strong problem-solving and algorithmic skills.",
    startTime: new Date("2026-03-25T12:00:00"),
    endTime: new Date("2026-03-25T13:15:00"),
    duration: "1 Hr 15 Min",
    link: "https://www.hackerrank.com/csi-sakec-code-off-duty-season5-inter-open",
  },
  {
    name: "Intra College Rookie (Round 3)",
    platform: "HackerRank",
    description:
      "Intra-college rookie round for beginners within the college. A great starting point for new competitive coders.",
    startTime: new Date("2026-03-25T13:45:00"),
    endTime: new Date("2026-03-25T15:00:00"),
    duration: "1 Hr 15 Min",
    link: "https://www.hackerrank.com/csi-sakec-code-off-duty-season-5-intra-rookie",
  },
  {
    name: "Intra College Advance (Round 4)",
    platform: "HackerRank",
    description:
      "Final advanced intra-college round. Challenging problems designed to test the best coders within the college.",
    startTime: new Date("2026-03-25T15:15:00"),
    endTime: new Date("2026-03-25T16:30:00"),
    duration: "1 Hr 15 Min",
    link: "https://www.hackerrank.com/csi-sakec-code-off-duty-season-5-intra-open",
  },
];

/* ──── Main Page ──── */
export default function ContestPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setVisible(true), 80);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const particles = [
    {
      top: "6%",
      left: "3%",
      width: 3,
      height: 3,
      background: "rgba(124,92,252,0.5)",
      animation: "float1 6s ease-in-out infinite",
    },
    {
      top: "15%",
      right: "5%",
      width: 5,
      height: 5,
      background: "rgba(167,139,250,0.3)",
      animation: "float2 8s ease-in-out infinite",
    },
    {
      top: "42%",
      left: "8%",
      width: 2,
      height: 2,
      background: "rgba(100,80,200,0.6)",
      animation: "float3 5s ease-in-out infinite",
    },
    {
      top: "62%",
      right: "10%",
      width: 4,
      height: 4,
      background: "rgba(124,92,252,0.4)",
      animation: "float1 7s ease-in-out infinite 1s",
    },
    {
      top: "80%",
      left: "5%",
      width: 3,
      height: 3,
      background: "rgba(167,139,250,0.35)",
      animation: "float2 9s ease-in-out infinite 2s",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        @keyframes float1 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(180deg); } }
        @keyframes float2 { 0%,100% { transform:translateY(0) translateX(0); } 33% { transform:translateY(-12px) translateX(8px); } 66% { transform:translateY(6px) translateX(-6px); } }
        @keyframes float3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(10px,-15px) scale(1.3); } }
        @keyframes titleReveal { from { opacity:0; transform:translateY(28px) scale(0.93); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.75; } }
        @keyframes lineSweep { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 900px) {
          .contests-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1200px) {
          .contests-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0a0a14 0%, #0e0e1a 40%, #0a0a14 100%)",
          padding: "80px 20px 100px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* bg grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />

        {/* ambient blobs */}
        <div
          style={{
            position: "fixed",
            top: -180,
            left: -180,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,60,180,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {particles.map((p, i) => (
          <Particle
            key={i}
            style={{ ...p, zIndex: 0 } as React.CSSProperties}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* ── Hero Title ── */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 600,
                height: 180,
                background:
                  "radial-gradient(ellipse, rgba(124,92,252,0.11) 0%, transparent 70%)",
                filter: "blur(28px)",
                top: -30,
                animation: "glowPulse 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            <h1
              style={{
                position: "relative",
                margin: 0,
                fontSize: "clamp(42px, 8vw, 72px)",
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) forwards"
                  : "none",
                opacity: visible ? undefined : 0,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Contests
            </h1>

            {/* sweep line */}
            <div
              style={{
                position: "relative",
                height: 2,
                marginTop: 20,
                overflow: "hidden",
                maxWidth: 300,
                margin: "20px auto 0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(124,92,252,0.15), transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.6) 50%, transparent 100%)",
                  animation: "lineSweep 3s linear infinite",
                }}
              />
            </div>

            <p
              style={{
                marginTop: 16,
                fontSize: 14,
                color: "rgba(167,139,250,0.7)",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 600,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) 0.2s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              Compete · Win · Level Up
            </p>

            {/* live indicator */}
            <div
              style={{
                marginTop: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "rgba(74,222,128,0.8)",
                fontWeight: 600,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) 0.35s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px rgba(74,222,128,0.6)",
                  animation: "glowPulse 1.5s ease-in-out infinite",
                }}
              />
              Links auto-activate at contest start time
            </div>
          </div>

          {/* ── 4-Contest Grid ── */}
          <div
            className="contests-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 28,
            }}
          >
            {contests.map((c, i) => (
              <ContestCard key={i} contest={c} index={i} />
            ))}
          </div>

          {/* ── Footer note ── */}
          <div
            style={{
              textAlign: "center",
              marginTop: 56,
              animation: "slideUp 0.8s cubic-bezier(.22,1,.36,1) 0.6s both",
              opacity: 0,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "rgba(167,139,250,0.55)",
                background: "rgba(124,92,252,0.07)",
                border: "1px solid rgba(124,92,252,0.15)",
                borderRadius: 20,
                padding: "10px 20px",
              }}
            >
              <span style={{ fontSize: 16 }}>🔒</span>
              Contest links are locked until the scheduled start time and expire
              after the contest ends.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
