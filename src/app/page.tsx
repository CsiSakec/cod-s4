"use client";

import { useEffect, useState } from "react";

const SITE_LIVE = false;

import HeroCarousel from "@/components/hero-carousel";
import DescriptionSection from "@/components/description-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  if (!SITE_LIVE) {
    return <PostponedScreen />;
  }
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <DescriptionSection />
      <ContactSection />
    </main>
  );
}

function PostponedScreen() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function scheduleGlitch() {
      const delay = 2500 + Math.random() * 3000;
      setTimeout(() => {
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchActive(false);
          scheduleGlitch();
        }, 160);
      }, delay);
    }
    scheduleGlitch();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  const tickerText =
    "  ⬛  COD SEASON 5  ·  LAUNCH DATE POSTPONED  ·  NEW DATES TO BE ANNOUNCED  ·  STAY TUNED FOR UPDATES  ·  FOLLOW @CALLOFDUTY  ·  ";
  const repeated = tickerText.repeat(6);
  const offset = (tick * 1.2) % (tickerText.length * 10);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        html, body { margin:0; padding:0; overflow:hidden; background:#050505; }

        .cod-wrap {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #060605;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Share Tech Mono', monospace;
          color: #ddd5bb;
          z-index: 9999;
          cursor: default;
          user-select: none;
        }

        /* ── Grid ── */
        .cod-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(190,145,35,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(190,145,35,0.055) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* ── Scanlines ── */
        .cod-scan {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.09) 3px,
            rgba(0,0,0,0.09) 4px
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ── Vignette ── */
        .cod-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(0,0,0,0.92) 100%);
          pointer-events: none;
          z-index: 3;
        }

        /* ── Corner decorations ── */
        .cod-corner {
          position: absolute;
          width: 48px;
          height: 48px;
          border-color: rgba(200,165,55,0.35);
          border-style: solid;
          z-index: 4;
        }
        .cod-corner.tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
        .cod-corner.tr { top: 24px; right: 24px; border-width: 2px 2px 0 0; }
        .cod-corner.bl { bottom: 60px; left: 24px; border-width: 0 0 2px 2px; }
        .cod-corner.br { bottom: 60px; right: 24px; border-width: 0 2px 2px 0; }

        /* ── Main content ── */
        .cod-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 1.5rem;
          max-width: 680px;
          width: 100%;
          animation: cod-fadein 0.8s ease both;
        }

        @keyframes cod-fadein {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* ── Alert badge ── */
        .cod-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: #c8a437;
          border: 1px solid rgba(200,164,55,0.4);
          padding: 5px 14px;
          background: rgba(200,164,55,0.05);
          animation: cod-fadein 0.6s 0.1s ease both;
        }

        .cod-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #ff3535;
          box-shadow: 0 0 8px #ff3535, 0 0 16px rgba(255,53,53,0.4);
          animation: cod-blink 0.9s ease-in-out infinite;
        }
        @keyframes cod-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }

        /* ── COD Logo ── */
        .cod-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          animation: cod-fadein 0.6s 0.2s ease both;
        }

        .cod-logo {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(72px, 16vw, 120px);
          line-height: 0.88;
          color: #fff;
          letter-spacing: 0.06em;
          text-shadow:
            0 0 24px rgba(200,164,55,0.55),
            0 0 70px rgba(200,164,55,0.18),
            5px 5px 0 rgba(200,164,55,0.12);
          position: relative;
          transition: color 0.05s;
        }

        .cod-logo.glitch {
          animation: cod-glitch 0.16s steps(3) forwards;
        }

        @keyframes cod-glitch {
          0%   { transform:translate(-5px,0) skewX(-3deg); color:#ff3535; text-shadow: 5px 0 #00ffe0, -5px 0 #ff3535; }
          33%  { transform:translate(5px,0)  skewX(2deg);  color:#00ffe0; text-shadow:-5px 0 #ff3535, 5px 0 #00ffe0; }
          66%  { transform:translate(-2px,0) skewX(-1deg); color:#fff; }
          100% { transform:translate(0,0); color:#fff; text-shadow:0 0 24px rgba(200,164,55,0.55); }
        }

        .cod-s5 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.55em;
          color: #c8a437;
          text-transform: uppercase;
        }

        /* ── Status panel ── */
        .cod-status {
          width: 100%;
          border: 1px solid rgba(200,164,55,0.22);
          background: rgba(200,164,55,0.035);
          padding: 14px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: cod-fadein 0.6s 0.35s ease both;
        }

        .cod-row {
          display: flex;
          align-items: center;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: #6e6558;
          gap: 10px;
        }

        .cod-pill {
          margin-left: auto;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          padding: 3px 12px;
          border: 1px solid;
          font-weight: bold;
        }

        .cod-pill.red {
          color: #ff3535;
          border-color: rgba(255,53,53,0.5);
          background: rgba(255,53,53,0.07);
          text-shadow: 0 0 8px rgba(255,53,53,0.6);
          box-shadow: inset 0 0 8px rgba(255,53,53,0.05);
          animation: cod-pulse-red 2.2s ease-in-out infinite;
        }
        @keyframes cod-pulse-red { 0%,100%{box-shadow:0 0 0 rgba(255,53,53,0)} 50%{box-shadow:0 0 14px rgba(255,53,53,0.28)} }

        .cod-pill.gold {
          color: #c8a437;
          border-color: rgba(200,164,55,0.5);
          background: rgba(200,164,55,0.07);
          text-shadow: 0 0 8px rgba(200,164,55,0.5);
        }

        .cod-hr { height: 1px; background: rgba(200,164,55,0.13); }

        /* ── Headline ── */
        .cod-headline {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(36px, 9vw, 72px);
          line-height: 1.0;
          text-align: center;
          color: #ddd5bb;
          letter-spacing: 0.05em;
          animation: cod-fadein 0.6s 0.45s ease both;
        }

        .cod-headline span {
          color: #c8a437;
          text-shadow: 0 0 28px rgba(200,164,55,0.45);
        }

        /* ── Sub ── */
        .cod-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.95rem;
          color: #524e44;
          letter-spacing: 0.06em;
          line-height: 1.65;
          text-align: center;
          max-width: 440px;
          animation: cod-fadein 0.6s 0.55s ease both;
        }

        /* ── Intel box ── */
        .cod-intel {
          width: 100%;
          border-left: 3px solid #c8a437;
          background: rgba(200,164,55,0.05);
          padding: 12px 16px;
          text-align: left;
          animation: cod-fadein 0.6s 0.65s ease both;
        }

        .cod-intel-head {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          color: #c8a437;
          margin-bottom: 6px;
        }

        .cod-intel-body {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.88rem;
          color: #6e6558;
          line-height: 1.55;
        }

        .cod-intel-body b { color: #c8a437; }

        /* ── Ticker ── */
        .cod-ticker-wrap {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 36px;
          background: rgba(200,164,55,0.07);
          border-top: 1px solid rgba(200,164,55,0.2);
          overflow: hidden;
          z-index: 20;
          display: flex;
          align-items: center;
        }

        .cod-ticker {
          white-space: nowrap;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          color: rgba(200,164,55,0.6);
          will-change: transform;
        }

        /* ── Error code ── */
        .cod-errcode {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: #2c2a25;
          animation: cod-fadein 0.6s 0.9s ease both;
        }
      `}</style>

      <div className="cod-wrap">
        {/* Layers */}
        <div className="cod-grid" />
        <div className="cod-scan" />
        <div className="cod-vignette" />

        {/* Corner brackets */}
        <div className="cod-corner tl" />
        <div className="cod-corner tr" />
        <div className="cod-corner bl" />
        <div className="cod-corner br" />

        {/* Main content */}
        <div className="cod-content">
          {/* Badge */}
          <div className="cod-badge">
            <span className="cod-dot" />
            BROADCAST INTERRUPTION
          </div>

          {/* Logo */}
          <div className="cod-logo-wrap">
            <div className={`cod-logo${glitchActive ? " glitch" : ""}`}>
              COD
            </div>
            <div className="cod-s5">SEASON 05</div>
          </div>

          {/* Status */}
          <div className="cod-status">
            <div className="cod-row">
              ⬛ OPERATION STATUS
              <span className="cod-pill red">POSTPONED</span>
            </div>
            <div className="cod-hr" />
            <div className="cod-row">
              📅 DEPLOYMENT DATE
              <span className="cod-pill gold">TO BE ANNOUNCED</span>
            </div>
          </div>

          <h1 className="cod-headline">
            SEASON 5 LAUNCH
            <br />
            <span>DATES TO BE ANNOUNCED</span>
          </h1>

          <p className="cod-sub">
            Season 5 deployment has been delayed. All units stand by. Official
            launch dates will be transmitted shortly.
          </p>

          <div className="cod-intel">
            <div className="cod-intel-head">⚠ FIELD INTEL</div>
            <p className="cod-intel-body">
              Monitor <b>@CallofDuty</b> on all channels for real-time
              deployment orders. New dates will be announced across official
              platforms as soon as they are confirmed.
            </p>
          </div>

          {/* Error code */}
          <div className="cod-errcode">
            ERR · S05_DEPLOY_HOLD · STANDBY FOR REBROADCAST
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="cod-ticker-wrap">
          <div
            className="cod-ticker"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {repeated}
          </div>
        </div>
      </div>
    </>
  );
}
