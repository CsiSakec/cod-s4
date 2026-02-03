"use client";

import { useState, useEffect } from "react";
import RegistrationForm from "@/components/registration-form";

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

export default function Home() {
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
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* ── Hero Title ── */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
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
                fontSize: "clamp(42px, 8vw, 68px)",
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
              Event Registration 🎉
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
                fontSize: 15,
                color: "rgba(190,190,220,0.7)",
                letterSpacing: 0.5,
                fontWeight: 500,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) 0.2s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              Fill out the form below to register for the event
            </p>
          </div>

          {/* ── Registration Form ── */}
          <div
            style={{
              animation: visible
                ? "slideUp 0.8s cubic-bezier(.22,1,.36,1) 0.35s forwards"
                : "none",
              opacity: visible ? undefined : 0,
            }}
          >
            <RegistrationForm />
          </div>
        </div>
      </main>
    </>
  );
}
