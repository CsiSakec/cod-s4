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

/* ──── Main About Page ──── */
export default function AboutPage() {
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
      top: "35%",
      left: "8%",
      width: 2,
      height: 2,
      background: "rgba(100,80,200,0.6)",
      animation: "float3 5s ease-in-out infinite",
    },
    {
      top: "55%",
      right: "10%",
      width: 4,
      height: 4,
      background: "rgba(124,92,252,0.4)",
      animation: "float1 7s ease-in-out infinite 1s",
    },
    {
      top: "75%",
      left: "6%",
      width: 3,
      height: 3,
      background: "rgba(167,139,250,0.35)",
      animation: "float2 9s ease-in-out infinite 2s",
    },
    {
      top: "88%",
      right: "8%",
      width: 4,
      height: 4,
      background: "rgba(100,80,200,0.5)",
      animation: "float3 6s ease-in-out infinite 1.5s",
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
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
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
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(100,80,200,0.04) 0%, transparent 70%)",
            filter: "blur(50px)",
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
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* ── Hero Title ── */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
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
              About Us
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
              Empowering Future Technologists
            </p>
          </div>

          {/* ── CSI Section ── */}
          <div
            style={{
              marginBottom: 80,
              animation: visible
                ? "slideUp 0.8s cubic-bezier(.22,1,.36,1) 0.35s forwards"
                : "none",
              opacity: visible ? undefined : 0,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "center",
              }}
              className="about-grid"
            >
              {/* Left – text content */}
              <div>
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
                      ✦ Since 1965
                    </div>

                    <h2
                      style={{
                        margin: "0 0 16px",
                        fontSize: 28,
                        fontWeight: 800,
                        lineHeight: 1.2,
                        background:
                          "linear-gradient(135deg, #fff 30%, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Computer Society of India (CSI)
                    </h2>

                    <p
                      style={{
                        margin: "0 0 14px",
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "rgba(190,190,220,0.75)",
                      }}
                    >
                      The Computer Society of India (CSI) is the first and
                      largest body of computer professionals in India. Formed in
                      1965, CSI has been instrumental in guiding the Indian IT
                      industry down the right path since its formative years.
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "rgba(190,190,220,0.75)",
                      }}
                    >
                      Our student chapter focuses on bridging the gap between
                      academia and industry by organizing workshops, seminars,
                      coding competitions, and technical events that enhance
                      students' knowledge and skills in the field of computing.
                    </p>

                    {/* stats / highlights */}
                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          color: "rgba(167,139,250,0.8)",
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#a78bfa",
                            boxShadow: "0 0 8px rgba(167,139,250,0.5)",
                          }}
                        />
                        Largest IT Body in India
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          color: "rgba(167,139,250,0.8)",
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#c4b5fd",
                            boxShadow: "0 0 8px rgba(196,181,253,0.5)",
                          }}
                        />
                        60+ Years of Excellence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right – Logo with 3D tilt */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Tilt3D style={{ width: "100%", maxWidth: 400 }}>
                  <div
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(18,18,30,0.85), rgba(12,12,22,0.92))",
                      border: "1px solid rgba(124,92,252,0.28)",
                      borderRadius: 24,
                      padding: 40,
                      boxShadow:
                        "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
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

                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(124,92,252,0.18)",
                        borderRadius: 16,
                        padding: 32,
                      }}
                    >
                      <Image
                        src="/CSI-LOGO.png"
                        alt="CSI Logo"
                        width={400}
                        height={200}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          filter: "drop-shadow(0 0 20px rgba(124,92,252,0.2))",
                        }}
                      />
                    </div>
                  </div>
                </Tilt3D>
              </div>
            </div>
          </div>

          {/* ── Optional COD Section (commented out in original) ── */}
          {/* You can uncomment and style this similarly if needed */}
        </div>
      </main>

      {/* ── responsive: stack columns on mobile ── */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
