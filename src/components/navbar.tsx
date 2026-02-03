"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Event Support", href: "/support" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    onResize();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes navGlow { 0%,100% { opacity:.45; } 50% { opacity:.75; } }
        @keyframes lineSweep { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(10,10,20,0.82)" : "rgba(10,10,20,0.6)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(124,92,252,0.18)",
          transition: "background 0.4s ease, border-color 0.4s ease",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ── background grid (same as TeamPage) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `
              linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── animated sweep line at very bottom ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.55) 50%, transparent 100%)",
              animation: "lineSweep 3.5s linear infinite",
            }}
          />
        </div>

        {/* ── ambient purple glow blob ── */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-80px",
            width: 260,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(124,92,252,0.12) 0%, transparent 70%)",
            filter: "blur(24px)",
            pointerEvents: "none",
            animation: "navGlow 4s ease-in-out infinite",
          }}
        />

        {/* ── main row ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo with white filter */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={52}
              style={{
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </Link>

          {/* ── Desktop links ── */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
              <RegisterBtn />
            </div>
          )}

          {/* ── Mobile hamburger ── */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid rgba(124,92,252,0.25)",
                background: "rgba(124,92,252,0.08)",
                color: "#a78bfa",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(124,92,252,0.18)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(124,92,252,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(124,92,252,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(124,92,252,0.25)";
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* ── Mobile drawer ── */}
        {isMobile && isMenuOpen && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              animation: "slideDown 0.28s cubic-bezier(.22,1,.36,1) forwards",
              borderTop: "1px solid rgba(124,92,252,0.12)",
              padding: "12px 20px 18px",
            }}
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "11px 14px",
                  marginBottom: 4,
                  borderRadius: 10,
                  color: "rgba(200,200,220,0.85)",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  textDecoration: "none",
                  border: "1px solid transparent",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                  animation: `fadeIn 0.35s ease ${i * 0.06}s both`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(124,92,252,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(124,92,252,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(200,200,220,0.85)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}

            <div
              style={{
                marginTop: 10,
                animation: `fadeIn 0.4s ease 0.28s both`,
              }}
            >
              <RegisterBtn onClick={() => setIsMenuOpen(false)} fullWidth />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ── single desktop nav link ── */
function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        color: hovered ? "#fff" : "rgba(200,200,220,0.8)",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 0.4,
        textDecoration: "none",
        padding: "6px 0",
        transition: "color 0.25s",
      }}
    >
      {label}
      {/* underline that slides in from center */}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: hovered ? "100%" : 0,
          height: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, #7c5cfc, #a78bfa)",
          transition: "width 0.3s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </Link>
  );
}

/* ── glowing Register button ── */
function RegisterBtn({
  onClick,
  fullWidth,
}: {
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {/* outer glow */}
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: 14,
          background: "linear-gradient(135deg, #7c5cfc, #a78bfa, #7c5cfc)",
          filter: "blur(10px)",
          opacity: hovered ? 0.7 : 0.35,
          transition: "opacity 0.35s",
          pointerEvents: "none",
        }}
      />

      <Link
        href="/registration"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: fullWidth ? "100%" : "auto",
          padding: "10px 26px",
          borderRadius: 12,
          background: hovered
            ? "linear-gradient(135deg, #6d4edc, #7c5cfc)"
            : "linear-gradient(135deg, #1a1a2e, #141428)",
          border: "1px solid rgba(124,92,252,0.45)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 0.5,
          textDecoration: "none",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 6px 28px rgba(124,92,252,0.4)"
            : "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        Register Now
        {/* arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <path
            d="M3 8h8M8 4l4 4-4 4"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
