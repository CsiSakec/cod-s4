"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(180deg); } }
        @keyframes float2 { 0%,100% { transform:translateY(0) translateX(0); } 33% { transform:translateY(-12px) translateX(8px); } 66% { transform:translateY(6px) translateX(-6px); } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
      `}</style>

      <footer
        style={{
          background:
            "linear-gradient(180deg, #0a0a14 0%, #0e0e1a 60%, #0a0a14 100%)",
          color: "white",
          paddingTop: 80,
          paddingBottom: 32,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* Background grid */}
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

        {/* Ambient blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
            animation: "glowPulse 4s ease-in-out infinite",
          }}
        />

        {/* Ambient blob bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,60,180,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Floating particles */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "8%",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(124,92,252,0.5)",
            animation: "float1 6s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "35%",
            right: "12%",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(167,139,250,0.4)",
            animation: "float2 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 48,
            }}
          >
            {/* Logo and About */}
            <div>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Image
                  src="/CSI-SAKEC-logo.png"
                  alt="CSI-SAKEC"
                  width={120}
                  height={40}
                  style={{ height: 60, width: "auto" }}
                />
              </Link>
              <p
                style={{
                  color: "rgba(190,190,220,0.7)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Code off Duty: SEASON 5 – The ultimate coding showdown where
                logic, speed, and strategy reign supreme. Compete, conquer, and
                claim your victory!
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <Link
                  href="https://www.instagram.com/csi.sakec"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(124,92,252,0.12)",
                    border: "1px solid rgba(124,92,252,0.25)",
                    color: "#a78bfa",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(124,92,252,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(124,92,252,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(124,92,252,0.12)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Instagram size={18} />
                  <span
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  >
                    Instagram
                  </span>
                </Link>
                <Link
                  href="https://www.linkedin.com/showcase/csi-sakec"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(124,92,252,0.12)",
                    border: "1px solid rgba(124,92,252,0.25)",
                    color: "#a78bfa",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(124,92,252,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(124,92,252,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(124,92,252,0.12)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Linkedin size={18} />
                  <span
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  >
                    LinkedIn
                  </span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 24,
                  background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quick Links
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/team", label: "Team" },
                  { href: "/registration", label: "Registration" },
                  { href: "/rulesandregulation", label: "Rules & Regulations" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(190,190,220,0.7)",
                        fontSize: 14,
                        transition: "all 0.3s ease",
                        display: "inline-block",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#a78bfa";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(190,190,220,0.7)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 24,
                  background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Contact Us
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
                  <MapPin
                    size={18}
                    style={{ color: "#a78bfa", flexShrink: 0, marginTop: 2 }}
                  />
                  <Link
                    href="https://maps.app.goo.gl/i3YC7kxjui9WhYgS6"
                    target="_blank"
                    style={{
                      color: "rgba(190,190,220,0.7)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      transition: "color 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#a78bfa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(190,190,220,0.7)";
                    }}
                  >
                    Mahavir Education Trust Chowk, W.T Patil Marg, D P Rd, next
                    to Duke's Company, Chembur, Mumbai, Maharashtra 400088
                  </Link>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Mail size={18} style={{ color: "#a78bfa", flexShrink: 0 }} />
                  <Link
                    href="mailto:csi@sakec.ac.in"
                    target="_blank"
                    style={{
                      color: "rgba(190,190,220,0.7)",
                      fontSize: 14,
                      transition: "color 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#a78bfa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(190,190,220,0.7)";
                    }}
                  >
                    csi@sakec.ac.in
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar with gradient divider */}
          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              position: "relative",
            }}
          >
            {/* Gradient line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(124,92,252,0.3) 20%, rgba(167,139,250,0.3) 80%, transparent)",
              }}
            />
            <p
              style={{
                textAlign: "center",
                color: "rgba(190,190,220,0.5)",
                fontSize: 13,
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} COD-S5. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
