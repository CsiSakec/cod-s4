"use client";

import { useState, useEffect, useRef } from "react";

const teamData = {
  coreTeam: {
    title: "Core Team",
    subtitle: "The leaders who drive our vision forward",
    icon: "◆",
    members: [
      {
        name: "RESHAB SINGH",
        role: "GENERAL SECRETARY",
        imageSrc: "/team/reshab GS.png",
      },
      {
        name: "ARYAAN GALA",
        role: "GENERAL COORDINATOR",
        imageSrc: "/team/aryaan gala GC.png",
      },
    ],
  },
  eventsTeam: {
    title: "Events Team",
    subtitle: "Where imagination meets execution with style!",
    icon: "★",
    members: [
      {
        name: "PRANAV JANI",
        role: "HEAD",
        imageSrc: "/team/pranav jani events head.png",
      },
      {
        name: "SHREYASI GHORBAND",
        role: "CO-HEAD",
        imageSrc: "/team/shreyasi ghorband events co head.png",
      },
      {
        name: "HARSH SOLANKI",
        role: "CO-HEAD",
        imageSrc: "/team/harsh solanki events co head.png",
      },
      {
        name: "MONARCH VAKANI",
        role: "CO-HEAD",
        imageSrc: "/team/monarch vakani events co head.png",
      },
    ],
  },
  registrationTeam: {
    title: "Registration Team",
    subtitle: "Where speed meets precision with a dash of flair!",
    icon: "●",
    members: [
      {
        name: "YASHAS MORE",
        role: "HEAD",
        imageSrc: "/team/yashas more REG HEAD.png",
      },
      {
        name: "CHAITANYA YADAV",
        role: "CO-HEAD",
        imageSrc: "/team/chaitanya yadav reg co head.png",
      },
      {
        name: "YASH BHEDA",
        role: "CO-HEAD",
        imageSrc: "/team/yash bheda reg co head.png",
      },
    ],
  },
  treasurerTeam: {
    title: "Treasurer Team",
    subtitle: "The financial experts managing our resources",
    icon: "◇",
    members: [
      {
        name: "RISHI POKHARNA",
        role: "TREASURER",
        imageSrc: "/team/rishi pokharna treasury HEAD.png",
      },
    ],
  },
  documentationTeam: {
    title: "Documentation Team",
    subtitle: "The detail-oriented team maintaining our records",
    icon: "▲",
    members: [
      {
        name: "SIDDHI SHAH",
        role: "HEAD",
        imageSrc: "/team/siddhi shah DOC HEAD.png",
      },
      {
        name: "RUCHITA MANDLIK",
        role: "CO-HEAD",
        imageSrc: "/team/ruchita mandlik doc co head.png",
      },
      {
        name: "SAYLI KATKAR",
        role: "CO-HEAD",
        imageSrc: "/team/sayli katkar doc co head.png",
      },
    ],
  },
  technicalTeam: {
    title: "Technical Team",
    subtitle: "The tech wizards powering our initiatives",
    icon: "⬡",
    members: [
      {
        name: "SUDARSHAN DATE",
        role: "HEAD",
        imageSrc: "/team/sudarshan date tech head.png",
      },
      {
        name: "SAHAS PRAJAPATI",
        role: "HEAD",
        imageSrc: "/team/sahas prajapati tech head.png",
      },
      {
        name: "SAI SONAWANE",
        role: "CO-HEAD",
        imageSrc: "/team/sai sonawane tech co head.png",
      },
      {
        name: "HASHIM BHAGAD",
        role: "CO-HEAD",
        imageSrc: "/team/hashim bhagad tech co head.png",
      },
      {
        name: "NEHA PALVI",
        role: "CO-HEAD",
        imageSrc: "/team/neha palvi tech co head.png",
      },
      {
        name: "SHUBHANGI SAINDANE",
        role: "CO-HEAD",
        imageSrc: "/team/Shubhangi saindane tech co head.png",
      },
    ],
  },
  socialMediaTeam: {
    title: "Social Media Team",
    subtitle: "The voices that amplify our message",
    icon: "◈",
    members: [
      {
        name: "YASH TEREDESAI",
        role: "HEAD",
        imageSrc: "/team/yash teredesai SM HEAD.png",
      },
      {
        name: "BINISHA KHOKHANI",
        role: "CO-HEAD",
        imageSrc: "/team/binisha khokhani SM co head.png",
      },
      {
        name: "HARSHWARDHAN PATIL",
        role: "CO-HEAD",
        imageSrc: "/team/harshwardhan patil SM head.png",
      },
    ],
  },
  designTeam: {
    title: "Design Team",
    subtitle: "The creative artists behind our visual identity",
    icon: "✦",
    members: [
      {
        name: "AACHAL BAFNA",
        role: "HEAD",
        imageSrc: "/team/aanchal bafna design head.png",
      },
      {
        name: "OM MITHIYA",
        role: "HEAD",
        imageSrc: "/team/om mithiya design head.png",
      },
      {
        name: "HARDI JAIN",
        role: "CO-HEAD",
        imageSrc: "/team/hardi jain design co head.png",
      },
      {
        name: "JINANG MEHTA",
        role: "CO-HEAD",
        imageSrc: "/team/jinang mehta design co head.png",
      },
      {
        name: "KUNAL GOPALKAR",
        role: "CO-HEAD",
        imageSrc: "/team/kunal gopalkar design co head.png",
      },
    ],
  },
  PR: {
    title: "Public Relations",
    subtitle: "Connecting Purpose to People",
    icon: "◀",
    members: [
      {
        name: "ASAD ALI KHAN",
        role: "HEAD",
        imageSrc: "/team/asad ali khan PR head.png",
      },
      {
        name: "PURVA HADAWLE",
        role: "CO-HEAD",
        imageSrc: "/team/purva hadawle PR co head.png",
      },
      {
        name: "AKSHATA NAIK",
        role: "CO-HEAD",
        imageSrc: "/team/akshata naik pr co head.png",
      },
    ],
  },
  developerTeam: {
    title: "Developer's Team",
    subtitle: "Your Web, Our Expertise.",
    icon: "⟡",
    members: [
      {
        name: "SUDARSHAN DATE",
        role: "HEAD",
        imageSrc: "/team/sudarshan date tech head.png",
      },
    ],
  },
};

/* ──── Image with Fallback ──── */
function ImgWithFallback({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        style={{
          ...style,
          background:
            "linear-gradient(180deg, rgba(30,30,55,0.9), rgba(15,15,30,1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="1.2"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />
  );
}

/* ──── 3D Tilt Card ──── */
function Card3D({
  member,
  index,
  delay,
}: {
  member: { name: string; role: string; imageSrc: string };
  index: number;
  delay: number;
}) {
  // const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -18, y: x * 18 });
  };

  const isHead =
    member.role === "HEAD" ||
    member.role === "TREASURER" ||
    member.role === "GENERAL SECRETARY" ||
    member.role === "GENERAL COORDINATOR" ||
    member.role === "STUDENT COORDINATOR";

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.85)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        style={{
          width: 220,
          perspective: 1000,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.05 : 1})`,
            transition: hovered
              ? "transform 0.08s ease-out"
              : "transform 0.5s cubic-bezier(.22,1,.36,1)",
            transformStyle: "preserve-3d",
            borderRadius: 20,
            background:
              "linear-gradient(145deg, rgba(18,18,30,0.85), rgba(12,12,22,0.9))",
            border: `1px solid ${isHead ? "rgba(120,100,255,0.45)" : "rgba(60,60,90,0.4)"}`,
            boxShadow: hovered
              ? isHead
                ? "0 20px 60px rgba(100,70,255,0.35), 0 0 40px rgba(120,100,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(80,80,160,0.15), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Shimmer overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background: `linear-gradient(${135 + tilt.y * 2}deg, rgba(255,255,255,0.06) 0%, transparent 50%, transparent 100%)`,
              transition: "background 0.15s ease",
            }}
          />

          {/* Top accent line */}
          {isHead && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
                zIndex: 2,
              }}
            />
          )}

          {/* Image container */}
          <div
            style={{
              height: 240,
              position: "relative",
              overflow: "hidden",
              background: "#e8e6e1",
            }}
          >
            <ImgWithFallback
              src={member.imageSrc}
              alt={member.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                display: "block",
              }}
            />
            {/* Dark gradient overlay — blends photo bottom into card body */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(12,12,22,0.7) 75%, rgba(12,12,22,1) 100%)",
              }}
            />
            {/* Subtle purple glow at bottom edge */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                zIndex: 2,
                background: isHead
                  ? "linear-gradient(to top, rgba(124,92,252,0.15), transparent)"
                  : "linear-gradient(to top, rgba(80,80,160,0.08), transparent)",
                pointerEvents: "none",
                transition: "opacity 0.4s",
                opacity: hovered ? 1 : 0.6,
              }}
            />
          </div>

          {/* Info */}
          <div
            style={{
              padding: "18px 16px 20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {isHead && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#a78bfa",
                  background: "rgba(124,92,252,0.15)",
                  border: "1px solid rgba(124,92,252,0.3)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                ✦ Leader
              </div>
            )}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0.5,
                lineHeight: 1.3,
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              {member.name}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                marginTop: 5,
                color: isHead ? "#a78bfa" : "rgba(160,160,200,0.8)",
                textTransform: "uppercase",
              }}
            >
              {member.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

/* ──── Section Header ──── */
function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 48 }}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(-20px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(.22,1,.36,1)",
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Icon orb */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(124,92,252,0.3), rgba(80,60,180,0.15))",
            border: "1px solid rgba(124,92,252,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#a78bfa",
            boxShadow: "0 0 20px rgba(124,92,252,0.2)",
          }}
        >
          {icon}
        </div>

        <div style={{ textAlign: "left" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.5,
              background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "rgba(160,160,200,0.7)",
              letterSpacing: 0.5,
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Animated underline */}
      <div
        style={{
          width: visible ? 100 : 0,
          height: 2,
          margin: "14px auto 0",
          background:
            "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
          borderRadius: 2,
          transition: "width 1s cubic-bezier(.22,1,.36,1) 0.3s",
        }}
      />
    </div>
  );
}

/* ──── Main Page ──── */
export default function TeamPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Floating particles config
  const particles = [
    {
      top: "10%",
      left: "5%",
      width: 3,
      height: 3,
      background: "rgba(124,92,252,0.5)",
      animation: "float1 6s ease-in-out infinite",
    },
    {
      top: "20%",
      right: "8%",
      width: 5,
      height: 5,
      background: "rgba(167,139,250,0.3)",
      animation: "float2 8s ease-in-out infinite",
    },
    {
      top: "40%",
      left: "12%",
      width: 2,
      height: 2,
      background: "rgba(100,80,200,0.6)",
      animation: "float3 5s ease-in-out infinite",
    },
    {
      top: "60%",
      right: "15%",
      width: 4,
      height: 4,
      background: "rgba(124,92,252,0.4)",
      animation: "float1 7s ease-in-out infinite 1s",
    },
    {
      top: "75%",
      left: "7%",
      width: 3,
      height: 3,
      background: "rgba(167,139,250,0.35)",
      animation: "float2 9s ease-in-out infinite 2s",
    },
    {
      top: "85%",
      right: "5%",
      width: 2,
      height: 2,
      background: "rgba(100,80,200,0.5)",
      animation: "float3 6s ease-in-out infinite 0.5s",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(180deg); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-12px) translateX(8px); } 66% { transform: translateY(6px) translateX(-6px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(10px,-15px) scale(1.3); } }
        @keyframes titleReveal { from { opacity:0; transform:translateY(30px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
        @keyframes lineSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; }
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
        {/* Background grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `
            linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />

        {/* Ambient glow blobs */}
        <div
          style={{
            position: "fixed",
            top: "-200px",
            left: "-200px",
            width: 500,
            height: 500,
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
            bottom: "-150px",
            right: "-150px",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,60,180,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Floating particles */}
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
          <div
            style={{ textAlign: "center", marginBottom: 100, paddingTop: 20 }}
          >
            {/* Animated glow behind title */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 600,
                height: 200,
                background:
                  "radial-gradient(ellipse, rgba(124,92,252,0.12) 0%, transparent 70%)",
                filter: "blur(30px)",
                top: -40,
                animation: "glowPulse 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(48px, 10vw, 88px)",
                  fontWeight: 900,
                  letterSpacing: -3,
                  lineHeight: 1.0,
                  animation:
                    "titleReveal 1s cubic-bezier(.22,1,.36,1) forwards",
                  opacity: 0,
                  color: "#fff",
                }}
              >
                <span
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  OUR
                </span>
                <span
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(135deg, #a78bfa 0%, #7c5cfc 40%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation:
                      "titleReveal 1s cubic-bezier(.22,1,.36,1) 0.15s forwards",
                    opacity: 0,
                  }}
                >
                  TEAM
                </span>
              </h1>

              {/* Horizontal shine line */}
              <div
                style={{
                  position: "relative",
                  height: 3,
                  marginTop: 24,
                  overflow: "hidden",
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
            </div>

            <p
              style={{
                marginTop: 24,
                fontSize: 15,
                color: "rgba(167,139,250,0.8)",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 600,
                animation:
                  "titleReveal 1s cubic-bezier(.22,1,.36,1) 0.35s forwards",
                opacity: 0,
              }}
            >
              Committee 2025 – 2026
            </p>
          </div>

          {/* ── Team Sections ── */}
          {Object.entries(teamData).map(([key, team], sectionIdx) => {
            const heads = team.members.filter(
              (m) =>
                !m.role.includes("CO-") &&
                (m.role === "HEAD" ||
                  m.role === "TREASURER" ||
                  m.role === "GENERAL SECRETARY" ||
                  m.role === "GENERAL COORDINATOR" ||
                  m.role === "STUDENT COORDINATOR"),
            );
            const coHeads = team.members.filter((m) => m.role.includes("CO-"));

            return (
              <section key={key} style={{ marginBottom: 90 }}>
                <SectionTitle
                  title={team.title}
                  subtitle={team.subtitle}
                  icon={team.icon}
                />

                {/* Heads row */}
                {heads.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 28,
                      marginBottom: coHeads.length > 0 ? 40 : 0,
                    }}
                  >
                    {heads.map((m, i) => (
                      <Card3D
                        key={m.name}
                        member={m}
                        index={i}
                        delay={sectionIdx * 60 + i * 120}
                      />
                    ))}
                  </div>
                )}

                {/* Divider between heads & co-heads */}
                {heads.length > 0 && coHeads.length > 0 && (
                  <div
                    style={{
                      maxWidth: 300,
                      margin: "0 auto 40px",
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(124,92,252,0.25), transparent)",
                    }}
                  />
                )}

                {/* Co-Heads row */}
                {coHeads.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 28,
                    }}
                  >
                    {coHeads.map((m, i) => (
                      <Card3D
                        key={m.name}
                        member={m}
                        index={i}
                        delay={sectionIdx * 60 + heads.length * 120 + i * 100}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {/* ── Footer tag ── */}
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: "rgba(124,92,252,0.4)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              ◆ Crafted with passion ◆
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
