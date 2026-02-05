"use client";

import Image from "next/image";
import { useState, useRef } from "react";

/* ──── 3D Tilt wrapper ──── */
function Tilt3D({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -8, y: x * 8 });
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
      style={{ perspective: 1000 }}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transition: hovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(.22,1,.36,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function DescriptionSection() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .glow-button {
          position: relative;
          overflow: hidden;
        }

        .glow-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          padding: 2px;
          background: linear-gradient(135deg, #7c5cfc, #a78bfa, #7c5cfc);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: glowPulse 3s ease-in-out infinite;
        }

        .section-badge {
          background: rgba(124,92,252,0.12);
          border: 1px solid rgba(124,92,252,0.25);
          color: #a78bfa;
        }
      `}</style>

      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0a0a14 0%, #0e0e1a 50%, #0a0a14 100%)",
        }}
      >
        {/* Background effects */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,92,252,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image with 3D tilt */}
            <div className="animate-fade-in-up">
              <Tilt3D>
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(18,18,30,0.85), rgba(12,12,22,0.92))",
                    border: "1px solid rgba(124,92,252,0.3)",
                    padding: "16px",
                    boxShadow:
                      "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/CODS5.jpeg"
                      alt="Code off Duty - SEASON 5"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Accent line */}
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
                </div>
              </Tilt3D>
            </div>

            {/* Description */}
            <div
              className="space-y-6 text-center lg:text-left animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 section-badge rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider">
                <span>✦</span> Season 5
              </div>

              <h2
                className="text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CODE OFF DUTY 🧑‍💻
              </h2>

              <div className="space-y-4">
                <p
                  className="text-base lg:text-lg"
                  style={{ color: "rgba(190,190,220,0.8)", lineHeight: 1.7 }}
                >
                  Join the ultimate coding showdown of the year! CSI-SAKEC, in
                  collaboration with AURUM, presents Code off Duty: Season
                  5—where only the sharpest minds survive. Compete in intense
                  problem-solving battles, optimize algorithms, and prove your
                  coding prowess in the arena of Competitive Programming.
                </p>
                <p
                  className="text-base lg:text-lg"
                  style={{ color: "rgba(190,190,220,0.8)", lineHeight: 1.7 }}
                >
                  The event features thrilling DSA challenges and competitive
                  programming contests with categories for all skill
                  levels—Rookie, Open. With prizes worth{" "}
                  <span
                    className="font-bold text-xl"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹30,000
                  </span>{" "}
                  and exciting goodies for all participants, this is your chance
                  to sharpen your skills, push your limits, and emerge
                  victorious!
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  role="button"
                  className="glow-button group relative inline-flex items-center justify-center text-base rounded-xl px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                    boxShadow: "0 4px 20px rgba(124,92,252,0.3)",
                  }}
                  title="Register Now"
                  href="/registration"
                >
                  Register Now!
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="transition opacity-0 group-hover:opacity-100"
                    />
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    />
                  </svg>
                </a>

                <a
                  role="button"
                  className="group relative inline-flex items-center justify-center text-base rounded-xl px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(18,18,30,0.9), rgba(12,12,22,0.95))",
                    border: "1px solid rgba(124,92,252,0.4)",
                    color: "#c4b5fd",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                  title="Rules and Regulations"
                  href="/rulesandregulation"
                >
                  Rules & Regulations
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="mt-0.5 ml-2 -mr-1 stroke-current stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="transition opacity-0 group-hover:opacity-100"
                    />
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
