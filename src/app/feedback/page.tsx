"use client";

import { useState, useEffect } from "react";
import { database } from "@/firebaseConfig";
import { ref, set } from "firebase/database";

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

/* ──── Radio Group ──── */
function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${selected ? "rgba(167,139,250,0.7)" : "rgba(124,92,252,0.2)"}`,
              background: selected
                ? "rgba(124,92,252,0.18)"
                : "rgba(255,255,255,0.03)",
              color: selected ? "#c4b5fd" : "rgba(200,200,230,0.75)",
              fontSize: 13,
              fontWeight: selected ? 600 : 400,
              transition: "all 0.2s ease",
              userSelect: "none",
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              style={{ display: "none" }}
            />
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `2px solid ${selected ? "#a78bfa" : "rgba(124,92,252,0.4)"}`,
                background: selected ? "#a78bfa" : "transparent",
                display: "inline-block",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

/* ──── Field Wrapper ──── */
function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(196,181,253,0.85)",
          marginBottom: 7,
          letterSpacing: 0.3,
        }}
      >
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: "#f87171", fontSize: 12, marginTop: 5 }}>{error}</p>
      )}
    </div>
  );
}

/* ──── Shared input/select styles ──── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(124,92,252,0.25)",
  borderRadius: 10,
  color: "#e2e2f0",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 36,
};

/* ──── Feedback question data ──── */
const SCALE_OPTIONS = [
  "Strongly Agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly Disagree",
];
const LIKELIHOOD_OPTIONS = [
  "Very Likely",
  "Likely",
  "Neutral",
  "Unlikely",
  "Very Unlikely",
];

const FEEDBACK_QUESTIONS = [
  {
    id: "q1",
    text: "Did the event enhance your knowledge of core engineering concepts and their practical applications?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q2",
    text: "Were the technical tools and methods demonstrated during the event relevant and useful?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q3",
    text: "Did the event help you in analyzing and solving real-world engineering problems?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q4",
    text: "Did you find opportunities to work collaboratively and enhance your teamwork skills during the event?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q5",
    text: "Were you able to apply modern engineering tools or techniques effectively during the event?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q6",
    text: "Did the event inspire you to pursue lifelong learning in the context of technological advancements?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q7",
    text: "Did the event address ethical practices and social responsibilities in engineering?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q8",
    text: "Did the event motivate you to explore entrepreneurial or research-oriented opportunities?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q9",
    text: "Do you feel that the event has equipped you with the skills and knowledge to solve real-world problems effectively?",
    options: SCALE_OPTIONS,
  },
  {
    id: "q10",
    text: "How likely are you to participate in similar technical events in the future?",
    options: LIKELIHOOD_OPTIONS,
  },
];

/* ──── Email HTML builder ──── */
function buildEmailHtml(params: {
  name: string;
  feedbackId: string;
  participantType: string;
  branch: string;
  year: string;
  division?: string;
  rollNo?: string;
  prn?: string;
  college?: string;
  isCsiMember: string;
  feedbackResponses: Record<string, string>;
  remarks: string;
}) {
  const {
    name,
    feedbackId,
    participantType,
    branch,
    year,
    division,
    rollNo,
    prn,
    college,
    isCsiMember,
    feedbackResponses,
    remarks,
  } = params;

  const isIntra = participantType === "Intra";

  const responseRows = FEEDBACK_QUESTIONS.map(
    (q, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8f9fa" : "#ffffff"};">
      <td style="padding:10px 14px;font-size:13px;color:#444;border-bottom:1px solid #eee;width:72%;">${i + 1}. ${q.text}</td>
      <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#7c5cfc;border-bottom:1px solid #eee;white-space:nowrap;">${feedbackResponses[`q${i + 1}`] || "—"}</td>
    </tr>
  `,
  ).join("");

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f8;border-radius:12px;">

  <!-- Card -->

  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">


<!-- Header -->
<div style="background:linear-gradient(135deg,#7c5cfc,#a78bfa);padding:30px;text-align:center;">
  <div style="font-size:42px;margin-bottom:10px;">🎉</div>
  <h1 style="color:#fff;margin:0;font-size:22px;">Feedback Submitted Successfully</h1>
</div>

<!-- Body -->
<div style="padding:30px 24px;text-align:center;">
  
  <p style="font-size:16px;color:#333;margin:0 0 12px;">
    Dear <strong>${name}</strong>,
  </p>

  <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
    Thank you for taking the time to share your feedback with us.  
    Your thoughts truly help us improve and create better experiences in the future.
  </p>

  <p style="font-size:14px;color:#555;line-height:1.7;margin:0;">
    We appreciate your support and look forward to seeing you again soon! 💜
  </p>

</div>

<!-- Footer -->
<div style="text-align:center;padding:18px;border-top:1px solid #eee;">
  <p style="font-size:13px;color:#888;margin:0;">
    Warm regards,<br/>
    <strong style="color:#7c5cfc;">CSI-SAKEC Team</strong>
  </p>
</div>


  </div>
</div>
`;
}

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════ */
export default function FeedbackPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Slide 1 fields ── */
  const [details, setDetails] = useState({
    fullName: "",
    email: "",
    contact: "",
    csiMember: "",
    participantType: "", // "Intra" | "Inter"
    college: "", // Inter only
    branch: "",
    year: "",
    division: "", // Intra only
    rollNo: "", // Intra only
    prn: "", // Intra only
  });

  /* ── Slide 2 fields ── */
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState("");

  const isIntra = details.participantType === "Intra";
  const isInter = details.participantType === "Inter";

  const setDetail = (key: keyof typeof details, val: string) =>
    setDetails((p) => ({ ...p, [key]: val }));

  /* ── scroll / mount ── */
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

  /* ══ VALIDATION ══ */
  const validateSlide1 = () => {
    const e: Record<string, string> = {};
    if (!details.fullName.trim()) e.fullName = "Full name is required";
    if (!details.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(details.email))
      e.email = "Enter a valid email";
    if (!details.contact.trim()) e.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(details.contact))
      e.contact = "Enter a valid 10-digit number";
    if (!details.csiMember) e.csiMember = "Please select an option";
    if (!details.participantType)
      e.participantType = "Please select participant type";
    if (isInter && !details.college.trim())
      e.college = "College name is required";
    if (!details.branch) e.branch = "Branch is required";
    if (!details.year) e.year = "Year is required";
    if (isIntra) {
      if (!details.division.trim()) e.division = "Division is required";
      if (!details.rollNo.trim()) e.rollNo = "Roll No is required";
      if (!details.prn.trim()) e.prn = "PRN is required";
      else if (!/^[A-Za-z0-9]{14}$/.test(details.prn))
        e.prn = "PRN must be exactly 14 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSlide2 = () => {
    const e: Record<string, string> = {};
    FEEDBACK_QUESTIONS.forEach((q) => {
      if (!feedback[q.id]) e[q.id] = "Please select an option";
    });
    if (!remarks.trim()) e.remarks = "Remarks are required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateSlide1()) {
      setErrors({});
      setSlide(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ══ SUBMIT: Firebase + Email ══ */
  const handleSubmit = async () => {
    if (!validateSlide2()) return;

    setIsLoading(true);
    try {
      const feedbackId = Date.now().toString();

      /* ── Firebase payload ── */
      const feedbackData = {
        id: feedbackId,
        submittedAt: new Date().toISOString(),
        status: "submitted",

        personalInfo: {
          fullName: details.fullName,
          email: details.email,
          contact: details.contact,
          isCsiMember: details.csiMember,
          participantType: details.participantType,
        },

        academicInfo: {
          branch: details.branch,
          year: details.year,
          // Intra-only fields
          ...(isIntra && {
            division: details.division,
            rollNo: details.rollNo,
            prn: details.prn,
          }),
          // Inter-only fields
          ...(isInter && {
            college: details.college,
          }),
        },

        feedbackResponses: {
          q1_engineeringKnowledge: feedback["q1"] || "",
          q2_technicalTools: feedback["q2"] || "",
          q3_problemSolving: feedback["q3"] || "",
          q4_teamwork: feedback["q4"] || "",
          q5_modernTools: feedback["q5"] || "",
          q6_lifelongLearning: feedback["q6"] || "",
          q7_ethicalPractices: feedback["q7"] || "",
          q8_entrepreneurship: feedback["q8"] || "",
          q9_skillsEquipped: feedback["q9"] || "",
          q10_futureParticipation: feedback["q10"] || "",
        },
        remarks,
      };

      /* ── Save to Firebase Realtime DB ── */
      const feedbackRef = ref(database, `eventFeedback/${feedbackId}`);
      await set(feedbackRef, feedbackData);

      /* ── Send confirmation email (mirrors /api/registeremail pattern) ── */
      try {
        await fetch("/api/registeremail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: details.email,
            subject: "CSI-SAKEC Event Feedback – Submission Confirmed",
            html: buildEmailHtml({
              name: details.fullName,
              feedbackId,
              participantType: details.participantType,
              branch: details.branch,
              year: details.year,
              division: details.division,
              rollNo: details.rollNo,
              prn: details.prn,
              college: details.college,
              isCsiMember: details.csiMember,
              feedbackResponses: feedback,
              remarks,
            }),
          }),
        });
      } catch (emailErr) {
        // Email failure is non-blocking; data is already saved
        console.error("Confirmation email failed:", emailErr);
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Feedback submission error:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ──────────────────────────── RENDER ──────────────────────────── */
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(124,92,252,0.18)",
    borderRadius: 16,
    padding: "28px 30px",
    backdropFilter: "blur(12px)",
    marginBottom: 20,
  };

  return (
    <>
      <style>{`
        @keyframes float1      { 0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-18px) rotate(180deg);} }
        @keyframes float2      { 0%,100%{transform:translateY(0) translateX(0);}33%{transform:translateY(-12px) translateX(8px);}66%{transform:translateY(6px) translateX(-6px);} }
        @keyframes float3      { 0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(10px,-15px) scale(1.3);} }
        @keyframes titleReveal { from{opacity:0;transform:translateY(28px) scale(0.93);}to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes glowPulse   { 0%,100%{opacity:0.4;}50%{opacity:0.7;} }
        @keyframes lineSweep   { 0%{transform:translateX(-100%);}100%{transform:translateX(100%);} }
        @keyframes slideUp     { from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);} }
        @keyframes checkPop    { 0%{transform:scale(0);}60%{transform:scale(1.2);}100%{transform:scale(1);} }
        @keyframes spin        { to{transform:rotate(360deg);} }

        input:focus, select:focus, textarea:focus {
          border-color:rgba(167,139,250,0.6)!important;
          box-shadow:0 0 0 3px rgba(124,92,252,0.12)!important;
        }
        input::placeholder, textarea::placeholder { color:rgba(150,150,180,0.5); }
        select option { background:#0e0e1a; color:#e2e2f0; }
        .hover-btn:hover  { opacity:0.9; transform:translateY(-1px); }
        .hover-btn:active { transform:translateY(0); }
        .q-card { transition:border-color 0.2s, background 0.2s; }
        .q-card:hover { border-color:rgba(124,92,252,0.3)!important; background:rgba(255,255,255,0.045)!important; }
        .pt-tile {
          flex:1; display:flex; align-items:center; gap:12px; cursor:pointer;
          padding:14px 16px; border-radius:12px;
          border:1px solid rgba(124,92,252,0.22);
          background:rgba(255,255,255,0.03);
          transition:all 0.2s;
        }
        .pt-tile:hover  { border-color:rgba(167,139,250,0.45); background:rgba(124,92,252,0.08); }
        .pt-tile.active { border-color:rgba(167,139,250,0.7); background:rgba(124,92,252,0.2); }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#0a0a14 0%,#0e0e1a 40%,#0a0a14 100%)",
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
            backgroundImage: `linear-gradient(rgba(124,92,252,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,252,0.03) 1px,transparent 1px)`,
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
              "radial-gradient(circle,rgba(124,92,252,0.08) 0%,transparent 70%)",
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
              "radial-gradient(circle,rgba(80,60,180,0.07) 0%,transparent 70%)",
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
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(100,80,200,0.04) 0%,transparent 70%)",
            filter: "blur(50px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {particles.map((p, i) => (
          <Particle key={i} style={{ ...p, zIndex: 0 }} />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 760,
            margin: "0 auto",
          }}
        >
          {/* ── Hero ── */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 520,
                height: 160,
                background:
                  "radial-gradient(ellipse,rgba(124,92,252,0.11) 0%,transparent 70%)",
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
                fontSize: "clamp(36px,7vw,58px)",
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) forwards"
                  : "none",
                opacity: visible ? undefined : 0,
                background:
                  "linear-gradient(135deg,#ffffff 0%,#c4b5fd 45%,#a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Event Feedback 📋
            </h1>
            <div
              style={{
                position: "relative",
                height: 2,
                marginTop: 18,
                overflow: "hidden",
                maxWidth: 280,
                margin: "18px auto 0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg,transparent,rgba(124,92,252,0.15),transparent)",
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
                    "linear-gradient(90deg,transparent 0%,rgba(167,139,250,0.6) 50%,transparent 100%)",
                  animation: "lineSweep 3s linear infinite",
                }}
              />
            </div>
            <p
              style={{
                marginTop: 14,
                fontSize: 14,
                color: "rgba(190,190,220,0.7)",
                letterSpacing: 0.5,
                fontWeight: 500,
                animation: visible
                  ? "titleReveal 0.9s cubic-bezier(.22,1,.36,1) 0.2s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              Share your experience and help us improve future events
            </p>
          </div>

          {/* ── Progress Stepper ── */}
          {!submitted && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 36,
                animation: visible
                  ? "slideUp 0.7s cubic-bezier(.22,1,.36,1) 0.3s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              {[
                { n: 1, label: "Your Details" },
                { n: 2, label: "Feedback" },
              ].map((step, i) => {
                const active = slide === step.n;
                const done = slide > step.n;
                return (
                  <div
                    key={step.n}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          border: `2px solid ${active ? "#a78bfa" : done ? "#a78bfa" : "rgba(124,92,252,0.3)"}`,
                          background: active
                            ? "rgba(124,92,252,0.25)"
                            : done
                              ? "rgba(124,92,252,0.35)"
                              : "transparent",
                          color:
                            active || done
                              ? "#c4b5fd"
                              : "rgba(150,150,180,0.5)",
                          transition: "all 0.3s",
                        }}
                      >
                        {done ? "✓" : step.n}
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: active
                            ? "#c4b5fd"
                            : done
                              ? "rgba(196,181,253,0.7)"
                              : "rgba(150,150,180,0.5)",
                          fontWeight: active ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i === 0 && (
                      <div
                        style={{
                          width: 80,
                          height: 2,
                          margin: "0 8px",
                          marginBottom: 22,
                          background:
                            slide > 1
                              ? "rgba(167,139,250,0.5)"
                              : "rgba(124,92,252,0.15)",
                          transition: "background 0.3s",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ SUCCESS ══ */}
          {submitted && (
            <div
              style={{
                ...cardStyle,
                textAlign: "center",
                padding: "60px 40px",
                animation: "slideUp 0.6s cubic-bezier(.22,1,.36,1) forwards",
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  marginBottom: 20,
                  animation: "checkPop 0.5s cubic-bezier(.22,1,.36,1) forwards",
                }}
              >
                🎉
              </div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#c4b5fd",
                  margin: "0 0 12px",
                }}
              >
                Thank You!
              </h2>
              <p
                style={{
                  color: "rgba(190,190,220,0.7)",
                  fontSize: 15,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Your feedback has been submitted successfully.
                <br />A confirmation email has been sent to{" "}
                <strong style={{ color: "#c4b5fd" }}>{details.email}</strong>.
                <br />
                We appreciate your time and valuable response.
              </p>
            </div>
          )}

          {/* ══ SLIDE 1: DETAILS ══ */}
          {!submitted && slide === 1 && (
            <div
              style={{
                animation: visible
                  ? "slideUp 0.8s cubic-bezier(.22,1,.36,1) 0.4s forwards"
                  : "none",
                opacity: visible ? undefined : 0,
              }}
            >
              {/* ── Personal Info card ── */}
              <div style={cardStyle}>
                <h3
                  style={{
                    margin: "0 0 22px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#c4b5fd",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(124,92,252,0.2)",
                      border: "1px solid rgba(124,92,252,0.3)",
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: 12,
                    }}
                  >
                    01
                  </span>
                  Personal Information
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0 20px",
                  }}
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Field label="Full Name" required error={errors.fullName}>
                      <input
                        style={inputStyle}
                        placeholder="Enter your full name"
                        value={details.fullName}
                        onChange={(e) => setDetail("fullName", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Email Address" required error={errors.email}>
                    <input
                      style={inputStyle}
                      type="email"
                      placeholder="you@example.com"
                      value={details.email}
                      onChange={(e) => setDetail("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Contact Number" required error={errors.contact}>
                    <input
                      style={inputStyle}
                      placeholder="10-digit mobile number"
                      value={details.contact}
                      onChange={(e) =>
                        setDetail(
                          "contact",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                    />
                  </Field>
                </div>

                <Field
                  label="Are you a CSI Member?"
                  required
                  error={errors.csiMember}
                >
                  <RadioGroup
                    name="csiMember"
                    options={["Yes", "No"]}
                    value={details.csiMember}
                    onChange={(v) => setDetail("csiMember", v)}
                  />
                </Field>

                {/* ── Participant Type ── */}
                <Field
                  label="Participant Type"
                  required
                  error={errors.participantType}
                >
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    {(["Intra", "Inter"] as const).map((type) => {
                      const active = details.participantType === type;
                      return (
                        <div
                          key={type}
                          className={`pt-tile${active ? " active" : ""}`}
                          onClick={() => {
                            if (type === "Inter") {
                              setDetails((p) => ({
                                ...p,
                                participantType: type,
                                division: "",
                                rollNo: "",
                                prn: "",
                              }));
                            } else {
                              setDetails((p) => ({
                                ...p,
                                participantType: type,
                                college: "",
                              }));
                            }
                          }}
                        >
                          <span style={{ fontSize: 22 }}>
                            {type === "Intra" ? "🏫" : "🌐"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                fontWeight: 700,
                                color: active
                                  ? "#c4b5fd"
                                  : "rgba(200,200,230,0.8)",
                              }}
                            >
                              {type}-College
                            </p>
                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: 12,
                                color: "rgba(167,139,250,0.55)",
                              }}
                            >
                              {type === "Intra"
                                ? "SAKEC College student"
                                : "Student from another college"}
                            </p>
                          </div>
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              border: `2px solid ${active ? "#a78bfa" : "rgba(124,92,252,0.35)"}`,
                              background: active ? "#a78bfa" : "transparent",
                              flexShrink: 0,
                              transition: "all 0.2s",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Field>

                {/* Inter-only: College name */}
                {isInter && (
                  <Field label="College Name" required error={errors.college}>
                    <input
                      style={inputStyle}
                      placeholder="Enter your college name"
                      value={details.college}
                      onChange={(e) => setDetail("college", e.target.value)}
                    />
                  </Field>
                )}
              </div>

              {/* ── Academic Details card ── */}
              <div style={cardStyle}>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#c4b5fd",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(124,92,252,0.2)",
                      border: "1px solid rgba(124,92,252,0.3)",
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: 12,
                    }}
                  >
                    02
                  </span>
                  Academic Details
                  {isInter && (
                    <span
                      style={{
                        fontSize: 11,
                        background: "rgba(167,139,250,0.1)",
                        border: "1px solid rgba(167,139,250,0.22)",
                        borderRadius: 6,
                        padding: "3px 10px",
                        color: "rgba(167,139,250,0.65)",
                        fontWeight: 500,
                      }}
                    >
                      Division / Roll No / PRN not required for Inter-College
                    </span>
                  )}
                </h3>
                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: 12,
                    color: "rgba(167,139,250,0.5)",
                  }}
                >
                  {isIntra
                    ? "All fields are required for intra-college participants."
                    : isInter
                      ? "Enter branch and year from your college."
                      : "Select participant type above to see all required fields."}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0 20px",
                  }}
                >
                  <Field label="Branch" required error={errors.branch}>
                    <select
                      style={selectStyle}
                      value={details.branch}
                      onChange={(e) => setDetail("branch", e.target.value)}
                    >
                      <option value="">Select branch</option>
                      {[
                        "COMPS",
                        "IT",
                        "AI-DS",
                        "CYSE",
                        "ECS",
                        "EXTC",
                        "ACT",
                        "VLSI",
                      ].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Year" required error={errors.year}>
                    <select
                      style={selectStyle}
                      value={details.year}
                      onChange={(e) => setDetail("year", e.target.value)}
                    >
                      <option value="">Select year</option>
                      {["FE", "SE", "TE", "BTech"].map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Intra-only fields — hidden for Inter */}
                  {isIntra && (
                    <>
                      <Field label="Division" required error={errors.division}>
                        <input
                          style={inputStyle}
                          placeholder="e.g. 3, 4, 9"
                          value={details.division}
                          onChange={(e) =>
                            setDetail("division", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Roll No" required error={errors.rollNo}>
                        <input
                          style={inputStyle}
                          placeholder="Enter roll number"
                          value={details.rollNo}
                          onChange={(e) => setDetail("rollNo", e.target.value)}
                        />
                      </Field>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <Field
                          label="PRN (14-digit Permanent Roll No.)"
                          required
                          error={errors.prn}
                        >
                          <input
                            style={inputStyle}
                            placeholder="14-digit PRN"
                            value={details.prn}
                            onChange={(e) =>
                              setDetail(
                                "prn",
                                e.target.value
                                  .replace(/[^A-Za-z0-9]/g, "")
                                  .toUpperCase()
                                  .slice(0, 14),
                              )
                            }
                            maxLength={14}
                          />
                        </Field>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                className="hover-btn"
                onClick={handleNext}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: "linear-gradient(135deg,#7c5cfc,#a78bfa)",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 0.5,
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 24px rgba(124,92,252,0.3)",
                }}
              >
                Continue to Feedback →
              </button>
            </div>
          )}

          {/* ══ SLIDE 2: FEEDBACK ══ */}
          {!submitted && slide === 2 && (
            <div
              style={{
                animation: "slideUp 0.5s cubic-bezier(.22,1,.36,1) forwards",
              }}
            >
              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "rgba(190,190,220,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  Please rate the following statements about the event. Your
                  honest feedback helps us improve.
                </p>
              </div>

              {FEEDBACK_QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  className="q-card"
                  style={{
                    ...cardStyle,
                    marginBottom: 16,
                    borderLeft: "3px solid rgba(124,92,252,0.4)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 12,
                      color: "rgba(167,139,250,0.6)",
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Question {i + 1}
                  </p>
                  <p
                    style={{
                      margin: "0 0 12px",
                      fontSize: 14,
                      color: "rgba(220,220,240,0.9)",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {q.text}
                    <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>
                  </p>
                  <RadioGroup
                    name={q.id}
                    options={q.options}
                    value={feedback[q.id] || ""}
                    onChange={(v) => setFeedback((p) => ({ ...p, [q.id]: v }))}
                  />
                  {errors[q.id] && (
                    <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>
                      {errors[q.id]}
                    </p>
                  )}
                </div>
              ))}

              {/* Remarks */}
              <div style={cardStyle}>
                <Field label="Any Remarks" required error={errors.remarks}>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: 100,
                      resize: "vertical" as const,
                      lineHeight: 1.6,
                    }}
                    placeholder="Share any additional thoughts, suggestions, or feedback about the event..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="hover-btn"
                  onClick={() => {
                    setSlide(1);
                    setErrors({});
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    flex: 1,
                    padding: "14px 0",
                    background: "transparent",
                    border: "1px solid rgba(124,92,252,0.35)",
                    borderRadius: 12,
                    color: "#a78bfa",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  ← Back
                </button>
                <button
                  className="hover-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{
                    flex: 3,
                    padding: "14px 0",
                    background: isLoading
                      ? "rgba(124,92,252,0.5)"
                      : "linear-gradient(135deg,#7c5cfc,#a78bfa)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    letterSpacing: 0.5,
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 24px rgba(124,92,252,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid #fff",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback 🚀"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
