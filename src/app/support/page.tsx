"use client";

import Image from "next/image";
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

/* ──── 3D Tilt wrapper (reusable) ──── */
function Tilt3D({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -14, y: x * 14 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{ perspective: 1000, ...style }}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
          transition: hovered
            ? "transform 0.08s ease-out"
            : "transform 0.5s cubic-bezier(.22,1,.36,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ──── WhatsApp Glow Button ──── */
function WhatsAppButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {/* outer glow */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 16,
          background: "linear-gradient(135deg, #16a34a, #22c55e, #16a34a)",
          filter: "blur(12px)",
          opacity: hovered ? 0.6 : 0.2,
          transition: "opacity 0.35s",
          pointerEvents: "none",
        }}
      />

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 30px",
          borderRadius: 14,
          background: hovered
            ? "linear-gradient(135deg, #15803d, #16a34a)"
            : "linear-gradient(135deg, #14532d, #166534)",
          border: "1px solid rgba(34,197,94,0.4)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.4,
          textDecoration: "none",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 8px 32px rgba(34,197,94,0.35)"
            : "0 3px 14px rgba(0,0,0,0.35)",
        }}
      >
        {/* WhatsApp icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#4ade80">
          <path d="M20.447 4.553A11 11 0 0 0 12 1C5.373 1 0 6.373 0 13a11.95 11.95 0 0 0 1.743 6.228L0 24l4.86-1.275A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.19-1.243-6.19-3.553-8.447zM12 21.8c-1.94 0-3.74-.52-5.32-1.42l-.38-.23-4.01 1.05 1.08-3.93-.25-.41A9.95 9.95 0 0 1 2.2 13c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.52-7.47c-.3-.15-1.78-.88-2.06--.98-.28-.1-.48-.15-.68.15s-.86 1.08-1.05 1.3c-.2.22-.4.25-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.68.16-.15.35-.4.53-.59.18-.2.24-.34.36-.56s.06-.42-.03-.59c-.09-.17-.68-1.73-.93-2.37-.24-.62-.5-.54-.68-.55-.18-.01-.38-.01-.58-.01s-.59.06-.9.29c-.31.24-1.18.92-1.18 2.25s1.22 2.61 1.39 2.81 2.4 3.67 5.82 5.11c.81.35 1.45.56 1.94.72.82.23 1.57.2 2.16.12.66-.09 2.04-.83 2.33-1.63.28-.8.28-1.49.2-1.63-.09-.14-.33-.22-.67-.37z" />
        </svg>
        Join WhatsApp Support Group
      </a>
    </div>
  );
}

/* ──── Main Page ──── */
export default function EventSupport() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    // trigger entrance
    const t = setTimeout(() => setVisible(true), 80);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const particles = [
    {
      top: "8%",
      left: "4%",
      width: 3,
      height: 3,
      background: "rgba(124,92,252,0.5)",
      animation: "float1 6s ease-in-out infinite",
    },
    {
      top: "18%",
      right: "6%",
      width: 5,
      height: 5,
      background: "rgba(167,139,250,0.3)",
      animation: "float2 8s ease-in-out infinite",
    },
    {
      top: "45%",
      left: "10%",
      width: 2,
      height: 2,
      background: "rgba(100,80,200,0.6)",
      animation: "float3 5s ease-in-out infinite",
    },
    {
      top: "65%",
      right: "12%",
      width: 4,
      height: 4,
      background: "rgba(124,92,252,0.4)",
      animation: "float1 7s ease-in-out infinite 1s",
    },
    {
      top: "82%",
      left: "6%",
      width: 3,
      height: 3,
      background: "rgba(167,139,250,0.35)",
      animation: "float2 9s ease-in-out infinite 2s",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(180deg); } }
        @keyframes float2 { 0%,100% { transform:translateY(0) translateX(0); } 33% { transform:translateY(-12px) translateX(8px); } 66% { transform:translateY(6px) translateX(-6px); } }
        @keyframes float3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(10px,-15px) scale(1.3); } }
        @keyframes titleReveal { from { opacity:0; transform:translateY(28px) scale(0.93); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
        @keyframes lineSweep { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:translateY(0); } }
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
            top: "-180px",
            left: "-180px",
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
            bottom: "-140px",
            right: "-140px",
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

        {/* particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{ ...p, zIndex: 0 }} />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
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
                width: 560,
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
              Event Support
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
              We're here to help
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              animation: visible
                ? "slideUp 0.8s cubic-bezier(.22,1,.36,1) 0.35s forwards"
                : "none",
              opacity: visible ? undefined : 0,
            }}
            // stack on mobile
            className="event-support-grid"
          >
            {/* Left – text + button */}
            <div>
              {/* glass card */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, rgba(18,18,30,0.82), rgba(12,12,22,0.88))",
                  border: "1px solid rgba(124,92,252,0.2)",
                  borderRadius: 24,
                  padding: "36px 32px",
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* top accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
                  }}
                />

                {/* shimmer */}
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
                  {/* section badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 2.5,
                      color: "#a78bfa",
                      textTransform: "uppercase",
                      background: "rgba(124,92,252,0.12)",
                      border: "1px solid rgba(124,92,252,0.25)",
                      borderRadius: 20,
                      padding: "4px 12px",
                      marginBottom: 20,
                    }}
                  >
                    ✦ Registration Help
                  </div>

                  <h2
                    style={{
                      margin: "0 0 16px",
                      fontSize: 24,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Need Help with Registration?
                  </h2>

                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "rgba(190,190,220,0.75)",
                    }}
                  >
                    Facing issues during registration, payment, or submission of
                    details? Don't worry — our team is ready to assist you right
                    away.
                  </p>
                  <p
                    style={{
                      margin: "0 0 28px",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "rgba(190,190,220,0.75)",
                    }}
                  >
                    Join our official WhatsApp support group and share your
                    issue along with your{" "}
                    <strong style={{ color: "rgba(220,220,240,0.9)" }}>
                      name
                    </strong>{" "}
                    and{" "}
                    <strong style={{ color: "rgba(220,220,240,0.9)" }}>
                      registered email ID
                    </strong>
                    .
                  </p>

                  <WhatsAppButton href="https://chat.whatsapp.com/JNRLhoXG5XF7lHCfKbIG41?mode=gi_t" />

                  {/* 24/7 badge */}
                  <div
                    style={{
                      marginTop: 22,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "rgba(167,139,250,0.7)",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#4ade80",
                        boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                        animation: "glowPulse 2s ease-in-out infinite",
                      }}
                    />
                    Support available 24 / 7
                  </div>
                </div>
              </div>
            </div>

            {/* Right – QR card with 3D tilt */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Tilt3D style={{ width: 280 }}>
                <div
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(18,18,30,0.85), rgba(12,12,22,0.92))",
                    border: "1px solid rgba(124,92,252,0.28)",
                    borderRadius: 24,
                    padding: "32px 28px 28px",
                    boxShadow:
                      "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background:
                        "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
                    }}
                  />
                  {/* shimmer */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2,
                        color: "#a78bfa",
                        textTransform: "uppercase",
                        background: "rgba(124,92,252,0.12)",
                        border: "1px solid rgba(124,92,252,0.25)",
                        borderRadius: 20,
                        padding: "4px 12px",
                        marginBottom: 20,
                      }}
                    >
                      ◆ Scan & Join
                    </div>

                    {/* QR wrapper with glow */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(124,92,252,0.18)",
                        borderRadius: 16,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 0 24px rgba(124,92,252,0.15)",
                        }}
                      >
                        <Image
                          src="/whatsapp-qr.png"
                          alt="Join WhatsApp Group QR Code"
                          width={200}
                          height={200}
                          style={{ display: "block", borderRadius: 12 }}
                        />
                      </div>
                    </div>

                    <p
                      style={{
                        margin: "18px 0 0",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "rgba(190,190,220,0.6)",
                      }}
                    >
                      Scan this QR code to join the
                      <br />
                      <strong style={{ color: "rgba(220,220,240,0.85)" }}>
                        WhatsApp Support Group
                      </strong>
                    </p>
                  </div>
                </div>
              </Tilt3D>
            </div>
          </div>
        </div>
      </main>

      {/* ── responsive: stack columns on mobile ── */}
      <style>{`
        @media (max-width: 700px) {
          .event-support-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
