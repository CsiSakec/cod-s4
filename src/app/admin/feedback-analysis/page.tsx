"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { database } from "@/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  MessageSquare,
  Download,
  BarChart3,
  TableIcon,
  Search,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FeedbackEntry {
  id: string;
  submittedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    contact?: string;
    isCsiMember: string;
    participantType: string;
  };
  academicInfo: {
    branch: string;
    year: string;
    division?: string;
    rollNo?: string;
    prn?: string;
    college?: string;
  };
  feedbackResponses: {
    q1_engineeringKnowledge: string;
    q2_technicalTools: string;
    q3_problemSolving: string;
    q4_teamwork: string;
    q5_modernTools: string;
    q6_lifelongLearning: string;
    q7_ethicalPractices: string;
    q8_entrepreneurship: string;
    q9_skillsEquipped: string;
    q10_futureParticipation: string;
  };
  remarks: string;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const Q_LABELS = [
  {
    key: "q1_engineeringKnowledge",
    short: "Q1",
    label: "Engineering Knowledge",
  },
  { key: "q2_technicalTools", short: "Q2", label: "Technical Tools" },
  { key: "q3_problemSolving", short: "Q3", label: "Problem Solving" },
  { key: "q4_teamwork", short: "Q4", label: "Teamwork" },
  { key: "q5_modernTools", short: "Q5", label: "Modern Tools" },
  { key: "q6_lifelongLearning", short: "Q6", label: "Lifelong Learning" },
  { key: "q7_ethicalPractices", short: "Q7", label: "Ethical Practices" },
  { key: "q8_entrepreneurship", short: "Q8", label: "Entrepreneurship" },
  { key: "q9_skillsEquipped", short: "Q9", label: "Skills Equipped" },
  {
    key: "q10_futureParticipation",
    short: "Q10",
    label: "Future Participation",
  },
];

const SCORE_MAP: Record<string, number> = {
  "Strongly Agree": 5,
  Agree: 4,
  Neutral: 3,
  Disagree: 2,
  "Strongly Disagree": 1,
  "Very Likely": 5,
  Likely: 4,
  Unlikely: 2,
  "Very Unlikely": 1,
};

// Fully explicit solid colors — no CSS vars, no opacity in fill
const C = {
  bars: [
    "#818cf8",
    "#a78bfa",
    "#c084fc",
    "#e879f9",
    "#f472b6",
    "#fb7185",
    "#f97316",
    "#facc15",
    "#4ade80",
    "#22d3ee",
  ],
  pie1: ["#818cf8", "#f472b6", "#4ade80", "#facc15", "#22d3ee"],
  sentiment: {
    Positive: "#4ade80",
    Neutral: "#facc15",
    Negative: "#f87171",
  } as Record<string, string>,
  csi: { Yes: "#818cf8", No: "#f87171" } as Record<string, string>,
  branch: {
    COMPS: "#818cf8",
    IT: "#a78bfa",
    "AI-DS": "#f472b6",
    CYSE: "#facc15",
    ECS: "#4ade80",
    EXTC: "#22d3ee",
    ACT: "#f97316",
    VLSI: "#fb7185",
  } as Record<string, string>,
  year: ["#818cf8", "#e879f9", "#4ade80", "#f97316"],
  radar: "#a78bfa",
};

const BRANCHES = ["COMPS", "IT", "AI-DS", "CYSE", "ECS", "EXTC", "ACT", "VLSI"];
const YEARS = ["FE", "SE", "TE", "BTech"];
const LIKELIHOOD = [
  "Very Likely",
  "Likely",
  "Neutral",
  "Unlikely",
  "Very Unlikely",
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const avg = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
const countBy = <T,>(
  arr: T[],
  key: (item: T) => string,
): Record<string, number> =>
  arr.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

/* ─────────────────────────────────────────────
   Custom Tooltip
───────────────────────────────────────────── */
const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e1b4b",
        border: "1px solid #4c1d95",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
      }}
    >
      {label && (
        <p style={{ color: "#c4b5fd", fontWeight: 700, marginBottom: 4 }}>
          {label}
        </p>
      )}
      {payload.map((p: any) => (
        <p
          key={p.name}
          style={{
            color: typeof p.fill === "string" ? p.fill : "#e2e8f0",
            margin: "2px 0",
          }}
        >
          {p.name}:{" "}
          <strong style={{ color: "#fff" }}>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: "rgba(30,27,75,0.7)",
        border: "1px solid rgba(129,140,248,0.25)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "#94a3b8",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 22,
            fontWeight: 800,
            color: "#f1f5f9",
          }}
        >
          {value}
        </p>
        {sub && (
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#818cf8" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Chart Card
───────────────────────────────────────────── */
function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(30,27,75,0.65)",
        border: "1px solid rgba(129,140,248,0.2)",
        borderRadius: 16,
        padding: "20px 22px",
        backdropFilter: "blur(12px)",
      }}
    >
      <p
        style={{
          margin: "0 0 2px",
          fontSize: 14,
          fontWeight: 700,
          color: "#c4b5fd",
        }}
      >
        {title}
      </p>
      {sub && (
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b" }}>
          {sub}
        </p>
      )}
      {!sub && <div style={{ marginBottom: 14 }} />}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Legend Dot
───────────────────────────────────────────── */
function LegendDot({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "#94a3b8",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span>{label}:</span>
      <strong style={{ color: "#f1f5f9" }}>{value}</strong>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Score Badge
───────────────────────────────────────────── */
function ScoreBadge({ value }: { value: string }) {
  const score = SCORE_MAP[value];
  const palette: Record<number, { text: string; bg: string; border: string }> =
    {
      5: {
        text: "#4ade80",
        bg: "rgba(74,222,128,0.12)",
        border: "rgba(74,222,128,0.35)",
      },
      4: {
        text: "#a78bfa",
        bg: "rgba(167,139,250,0.12)",
        border: "rgba(167,139,250,0.35)",
      },
      3: {
        text: "#facc15",
        bg: "rgba(250,204,21,0.12)",
        border: "rgba(250,204,21,0.35)",
      },
      2: {
        text: "#f97316",
        bg: "rgba(249,115,22,0.12)",
        border: "rgba(249,115,22,0.35)",
      },
      1: {
        text: "#f87171",
        bg: "rgba(248,113,113,0.12)",
        border: "rgba(248,113,113,0.35)",
      },
    };
  if (!score) return <span style={{ color: "#64748b" }}>—</span>;
  const p = palette[score];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 20,
        background: p.bg,
        border: `1px solid ${p.border}`,
        color: p.text,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function FeedbackAnalysis() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"charts" | "table">("charts");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  useEffect(() => {
    const ok = localStorage.getItem("adminAuthenticated") === "true";
    if (!ok) {
      router.push("/admin");
      return;
    }
    const unsub = onValue(ref(database, "eventFeedback"), (snap) => {
      setFeedbacks(
        snap.val() ? (Object.values(snap.val()) as FeedbackEntry[]) : [],
      );
      setIsLoading(false);
    });
    return () => unsub();
  }, [router]);

  /* ── Derived Chart Data ── */
  const avgScores = Q_LABELS.map((q) => {
    const scores = feedbacks
      .map((f) => SCORE_MAP[(f.feedbackResponses as any)[q.key]])
      .filter(Boolean);
    return {
      name: `${q.short}: ${q.label}`,
      shortName: q.short,
      avg: parseFloat(avg(scores).toFixed(2)),
    };
  });

  const allResponses = feedbacks.flatMap((f) =>
    Object.values(f.feedbackResponses),
  );
  const sentimentData = (() => {
    const cnt = countBy(allResponses, (r) => {
      const s = SCORE_MAP[r];
      if (!s) return "Unknown";
      return s >= 4 ? "Positive" : s === 3 ? "Neutral" : "Negative";
    });
    return ["Positive", "Neutral", "Negative"]
      .map((k) => ({ name: k, value: cnt[k] || 0 }))
      .filter((d) => d.value > 0);
  })();

  const participantData = Object.entries(
    countBy(feedbacks, (f) => f.personalInfo.participantType || "Unknown"),
  ).map(([name, value]) => ({ name, value }));

  const csiData = Object.entries(
    countBy(feedbacks, (f) => f.personalInfo.isCsiMember || "Unknown"),
  ).map(([name, value]) => ({ name, value }));

  const branchData = BRANCHES.map((b) => ({
    branch: b,
    count: feedbacks.filter((f) => f.academicInfo?.branch === b).length,
  })).filter((d) => d.count > 0);
  const yearData = YEARS.map((y) => ({
    year: y,
    count: feedbacks.filter((f) => f.academicInfo?.year === y).length,
  })).filter((d) => d.count > 0);
  const q10Data = LIKELIHOOD.map((l) => ({
    label: l,
    count: feedbacks.filter(
      (f) => f.feedbackResponses.q10_futureParticipation === l,
    ).length,
  }));

  const radarData = Q_LABELS.map((q) => {
    const scores = feedbacks
      .map((f) => SCORE_MAP[(f.feedbackResponses as any)[q.key]])
      .filter(Boolean);
    return {
      subject: q.short,
      score: parseFloat(((avg(scores) / 5) * 100).toFixed(1)),
      fullMark: 100,
    };
  });

  const allScores = feedbacks.flatMap((f) =>
    Object.values(f.feedbackResponses)
      .map((v) => SCORE_MAP[v])
      .filter(Boolean),
  );
  const overallAvg = avg(allScores);
  const satisfactionPct = Math.round(((overallAvg - 1) / 4) * 100);

  /* ── TanStack Table ── */
  type Row = FeedbackEntry & { avgScore: number };
  const tableData: Row[] = useMemo(
    () =>
      feedbacks.map((f) => ({
        ...f,
        avgScore: parseFloat(
          avg(
            Object.values(f.feedbackResponses)
              .map((v) => SCORE_MAP[v])
              .filter(Boolean),
          ).toFixed(2),
        ),
      })),
    [feedbacks],
  );

  const ch = createColumnHelper<Row>();
  const columns = useMemo(
    () => [
      ch.accessor((r) => r.personalInfo.fullName, {
        id: "name",
        header: "Name",
        cell: (i) => (
          <span style={{ fontWeight: 600, color: "#c4b5fd" }}>
            {i.getValue()}
          </span>
        ),
      }),
      ch.accessor((r) => r.personalInfo.email, {
        id: "email",
        header: "Email",
        cell: (i) => (
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{i.getValue()}</span>
        ),
      }),
      ch.accessor((r) => r.personalInfo.participantType, {
        id: "type",
        header: "Type",
        cell: (i) => {
          const v = i.getValue();
          return (
            <span
              style={{
                padding: "2px 10px",
                borderRadius: 20,
                background:
                  v === "Intra"
                    ? "rgba(129,140,248,0.15)"
                    : "rgba(244,114,182,0.15)",
                color: v === "Intra" ? "#818cf8" : "#f472b6",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {v}
            </span>
          );
        },
      }),
      ch.accessor((r) => r.academicInfo?.branch, {
        id: "branch",
        header: "Branch",
        cell: (i) => (
          <span style={{ color: "#e2e8f0" }}>{i.getValue() || "—"}</span>
        ),
      }),
      ch.accessor((r) => r.academicInfo?.year, {
        id: "year",
        header: "Year",
        cell: (i) => (
          <span style={{ color: "#e2e8f0" }}>{i.getValue() || "—"}</span>
        ),
      }),
      ch.accessor((r) => r.personalInfo.isCsiMember, {
        id: "csi",
        header: "CSI",
        cell: (i) => {
          const v = i.getValue();
          return (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 20,
                background:
                  v === "Yes"
                    ? "rgba(74,222,128,0.12)"
                    : "rgba(248,113,113,0.12)",
                color: v === "Yes" ? "#4ade80" : "#f87171",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {v}
            </span>
          );
        },
      }),
      ch.accessor((r) => r.feedbackResponses.q1_engineeringKnowledge, {
        id: "q1",
        header: "Q1",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q2_technicalTools, {
        id: "q2",
        header: "Q2",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q3_problemSolving, {
        id: "q3",
        header: "Q3",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q4_teamwork, {
        id: "q4",
        header: "Q4",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q5_modernTools, {
        id: "q5",
        header: "Q5",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q6_lifelongLearning, {
        id: "q6",
        header: "Q6",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q7_ethicalPractices, {
        id: "q7",
        header: "Q7",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q8_entrepreneurship, {
        id: "q8",
        header: "Q8",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q9_skillsEquipped, {
        id: "q9",
        header: "Q9",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor((r) => r.feedbackResponses.q10_futureParticipation, {
        id: "q10",
        header: "Q10",
        cell: (i) => <ScoreBadge value={i.getValue()} />,
      }),
      ch.accessor("avgScore", {
        header: "Avg",
        cell: (i) => {
          const v = i.getValue();
          const pct = Math.round(((v - 1) / 4) * 100);
          const color =
            pct >= 70 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171";
          return (
            <span style={{ color, fontWeight: 700 }}>
              {v}
              <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 3 }}>
                ({pct}%)
              </span>
            </span>
          );
        },
      }),
      ch.accessor("remarks", {
        header: "Remarks",
        cell: (i) => (
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              maxWidth: 180,
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={i.getValue()}
          >
            {i.getValue() || "—"}
          </span>
        ),
      }),
      ch.accessor("submittedAt", {
        header: "Date",
        cell: (i) => (
          <span style={{ fontSize: 11, color: "#64748b" }}>
            {new Date(i.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  /* ── Excel Export ── */
  const exportExcel = () => {
    const rows = feedbacks.map((f) => ({
      Name: f.personalInfo.fullName,
      Email: f.personalInfo.email,
      Contact: f.personalInfo.contact || "",
      "Participant Type": f.personalInfo.participantType,
      "CSI Member": f.personalInfo.isCsiMember,
      Branch: f.academicInfo?.branch || "",
      Year: f.academicInfo?.year || "",
      Division: f.academicInfo?.division || "",
      "Roll No": f.academicInfo?.rollNo || "",
      PRN: f.academicInfo?.prn || "",
      College: f.academicInfo?.college || "",
      "Q1 - Engineering Knowledge": f.feedbackResponses.q1_engineeringKnowledge,
      "Q2 - Technical Tools": f.feedbackResponses.q2_technicalTools,
      "Q3 - Problem Solving": f.feedbackResponses.q3_problemSolving,
      "Q4 - Teamwork": f.feedbackResponses.q4_teamwork,
      "Q5 - Modern Tools": f.feedbackResponses.q5_modernTools,
      "Q6 - Lifelong Learning": f.feedbackResponses.q6_lifelongLearning,
      "Q7 - Ethical Practices": f.feedbackResponses.q7_ethicalPractices,
      "Q8 - Entrepreneurship": f.feedbackResponses.q8_entrepreneurship,
      "Q9 - Skills Equipped": f.feedbackResponses.q9_skillsEquipped,
      "Q10 - Future Participation": f.feedbackResponses.q10_futureParticipation,
      "Avg Score": parseFloat(
        avg(
          Object.values(f.feedbackResponses)
            .map((v) => SCORE_MAP[v])
            .filter(Boolean),
        ).toFixed(2),
      ),
      Remarks: f.remarks,
      "Submitted At": new Date(f.submittedAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Object.keys(rows[0] || {}).map(() => ({ wch: 22 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedback");
    XLSX.writeFile(
      wb,
      `CSI_Feedback_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  if (isLoading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid rgba(129,140,248,0.3)",
              borderTop: "3px solid #818cf8",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#818cf8", fontSize: 14 }}>
            Loading feedback data…
          </p>
        </div>
      </div>
    );

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s",
    background: active ? "rgba(129,140,248,0.22)" : "transparent",
    color: active ? "#818cf8" : "#64748b",
  });

  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    textAlign: "left",
    borderBottom: "1px solid rgba(129,140,248,0.12)",
    whiteSpace: "nowrap",
    cursor: "pointer",
    background: "rgba(15,12,40,0.9)",
    userSelect: "none",
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(129,140,248,0.08)",
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#0a0a1a 0%,#0d0b23 50%,#0a0a1a 100%)",
        color: "#f1f5f9",
      }}
    >
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:rgba(129,140,248,0.05)}
        ::-webkit-scrollbar-thumb{background:rgba(129,140,248,0.3);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(129,140,248,0.5)}
        input::placeholder{color:#475569}
      `}</style>

      {/* ── Sticky Header ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(10,10,26,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(129,140,248,0.18)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard")}
            style={{
              color: "#818cf8",
              gap: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={15} /> Back
          </Button>
          <div
            style={{
              width: 1,
              height: 22,
              background: "rgba(129,140,248,0.25)",
            }}
          />
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              background: "linear-gradient(90deg,#fff,#c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Feedback Analytics
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#64748b",
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 20,
              padding: "2px 10px",
            }}
          >
            {feedbacks.length} responses
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              background: "rgba(129,140,248,0.08)",
              border: "1px solid rgba(129,140,248,0.15)",
              borderRadius: 12,
              padding: 4,
              gap: 2,
            }}
          >
            <button
              style={tabBtnStyle(tab === "charts")}
              onClick={() => setTab("charts")}
            >
              <BarChart3 size={14} />
              Charts
            </button>
            <button
              style={tabBtnStyle(tab === "table")}
              onClick={() => setTab("table")}
            >
              <TableIcon size={14} />
              Grid View
            </button>
          </div>
          <button
            onClick={exportExcel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              borderRadius: 10,
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              color: "#4ade80",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      <div
        style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 20px 60px" }}
      >
        {/* Stat Cards — always visible */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <StatCard
            icon={<Users size={20} color="#818cf8" />}
            label="Total Responses"
            value={feedbacks.length}
            sub="All submissions"
            bg="rgba(129,140,248,0.18)"
          />
          <StatCard
            icon={<TrendingUp size={20} color="#a78bfa" />}
            label="Avg Score"
            value={`${overallAvg.toFixed(2)} / 5`}
            sub="Across all questions"
            bg="rgba(167,139,250,0.18)"
          />
          <StatCard
            icon={<Award size={20} color="#4ade80" />}
            label="Satisfaction"
            value={`${satisfactionPct}%`}
            sub="Overall satisfaction rate"
            bg="rgba(74,222,128,0.18)"
          />
          <StatCard
            icon={<MessageSquare size={20} color="#f472b6" />}
            label="With Remarks"
            value={feedbacks.filter((f) => f.remarks?.trim()).length}
            sub="Written comments"
            bg="rgba(244,114,182,0.18)"
          />
        </div>

        {/* ════ CHARTS TAB ════ */}
        {tab === "charts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Row 1: Avg Score Bar + Sentiment Donut */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
            >
              <ChartCard
                title="📊 Average Score per Question"
                sub="Score out of 5 — higher is better"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={avgScores}
                    margin={{ top: 4, right: 8, left: -20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#c084fc"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(129,140,248,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="shortName"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<Tip />}
                      cursor={{ fill: "rgba(129,140,248,0.07)" }}
                    />
                    <Bar
                      dataKey="avg"
                      name="Avg Score"
                      fill="url(#grad1)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="🎯 Overall Sentiment"
                sub="Positive / Neutral / Negative"
              >
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sentimentData.map((e) => (
                        <Cell
                          key={e.name}
                          fill={C.sentiment[e.name] || "#818cf8"}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 8,
                  }}
                >
                  {sentimentData.map((e) => (
                    <LegendDot
                      key={e.name}
                      color={C.sentiment[e.name] || "#818cf8"}
                      label={e.name}
                      value={e.value}
                    />
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Row 2: Radar + Q10 horizontal bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <ChartCard
                title="🕸️ Competency Radar"
                sub="Normalized 0–100 score across dimensions"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={radarData}
                  >
                    <PolarGrid stroke="rgba(129,140,248,0.12)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#64748b", fontSize: 9 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke={C.radar}
                      fill={C.radar}
                      fillOpacity={0.22}
                      strokeWidth={2}
                    />
                    <Tooltip content={<Tip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="🔮 Future Participation Intent"
                sub="Q10: Likelihood to participate again"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={q10Data}
                    layout="vertical"
                    margin={{ left: 8, right: 28, top: 4, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(129,140,248,0.08)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      width={90}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<Tip />}
                      cursor={{ fill: "rgba(129,140,248,0.07)" }}
                    />
                    <Bar
                      dataKey="count"
                      name="Responses"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={28}
                    >
                      {q10Data.map((_, i) => (
                        <Cell key={i} fill={C.bars[i % C.bars.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 3: Branch bar + two mini pies */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
            >
              <ChartCard
                title="🏛️ Responses by Branch"
                sub="Submissions per engineering branch"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={branchData}
                    margin={{ top: 4, right: 8, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(129,140,248,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="branch"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<Tip />}
                      cursor={{ fill: "rgba(129,140,248,0.07)" }}
                    />
                    <Bar
                      dataKey="count"
                      name="Responses"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    >
                      {branchData.map((e) => (
                        <Cell
                          key={e.branch}
                          fill={C.branch[e.branch] || "#818cf8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <ChartCard title="👥 Participant Type">
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie
                        data={participantData}
                        cx="50%"
                        cy="50%"
                        innerRadius={34}
                        outerRadius={55}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {participantData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={C.pie1[i % C.pie1.length]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<Tip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {participantData.map((e, i) => (
                      <LegendDot
                        key={e.name}
                        color={C.pie1[i % C.pie1.length]}
                        label={e.name}
                        value={e.value}
                      />
                    ))}
                  </div>
                </ChartCard>

                <ChartCard title="🪪 CSI Members">
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie
                        data={csiData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={48}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {csiData.map((e) => (
                          <Cell
                            key={e.name}
                            fill={C.csi[e.name] || "#818cf8"}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<Tip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {csiData.map((e) => (
                      <LegendDot
                        key={e.name}
                        color={C.csi[e.name] || "#818cf8"}
                        label={e.name}
                        value={e.value}
                      />
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>

            {/* Row 4: Year */}
            <ChartCard
              title="🎓 Responses by Year"
              sub="Academic year-wise distribution"
            >
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={yearData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(129,140,248,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#94a3b8", fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<Tip />}
                    cursor={{ fill: "rgba(129,140,248,0.07)" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Responses"
                    fill="url(#grad2)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Remarks */}
            {feedbacks.filter((f) => f.remarks?.trim()).length > 0 && (
              <ChartCard
                title="💬 Recent Remarks"
                sub="Latest written feedback from participants"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                    gap: 12,
                    maxHeight: 280,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {feedbacks
                    .filter((f) => f.remarks?.trim())
                    .slice(-10)
                    .reverse()
                    .map((f) => (
                      <div
                        key={f.id}
                        style={{
                          background: "rgba(129,140,248,0.06)",
                          border: "1px solid rgba(129,140,248,0.12)",
                          borderRadius: 12,
                          padding: "12px 14px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 13,
                            color: "#cbd5e1",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          "{f.remarks}"
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: "#818cf8",
                            fontWeight: 600,
                          }}
                        >
                          — {f.personalInfo.fullName} · {f.academicInfo?.branch}{" "}
                          {f.academicInfo?.year}
                        </p>
                      </div>
                    ))}
                </div>
              </ChartCard>
            )}
          </div>
        )}

        {/* ════ TABLE / GRID VIEW TAB ════ */}
        {tab === "table" && (
          <div>
            {/* Search bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#475569",
                  }}
                />
                <input
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search name, email, branch…"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    background: "rgba(129,140,248,0.08)",
                    border: "1px solid rgba(129,140,248,0.2)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {globalFilter && (
                  <button
                    onClick={() => setGlobalFilter("")}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <span
                style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}
              >
                {table.getFilteredRowModel().rows.length} of {feedbacks.length}{" "}
                entries
              </span>
            </div>

            {/* Q key reference */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {Q_LABELS.map((q) => (
                <span
                  key={q.key}
                  style={{
                    fontSize: 11,
                    color: "#818cf8",
                    background: "rgba(129,140,248,0.1)",
                    border: "1px solid rgba(129,140,248,0.18)",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  {q.short}: {q.label}
                </span>
              ))}
            </div>

            {/* Table */}
            <div
              style={{
                overflowX: "auto",
                borderRadius: 14,
                border: "1px solid rgba(129,140,248,0.15)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => (
                        <th
                          key={h.id}
                          style={thStyle}
                          onClick={h.column.getToggleSortingHandler()}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            {flexRender(
                              h.column.columnDef.header,
                              h.getContext(),
                            )}
                            {h.column.getIsSorted() === "asc" && (
                              <span style={{ color: "#818cf8", fontSize: 10 }}>
                                ▲
                              </span>
                            )}
                            {h.column.getIsSorted() === "desc" && (
                              <span style={{ color: "#818cf8", fontSize: 10 }}>
                                ▼
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, ri) => (
                    <tr
                      key={row.id}
                      style={{
                        background:
                          ri % 2 === 0
                            ? "rgba(15,12,40,0.5)"
                            : "rgba(129,140,248,0.03)",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={tdStyle}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                          color: "#64748b",
                          padding: "40px 0",
                        }}
                      >
                        No entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 14,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount() || 1}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  {
                    l: "«",
                    fn: () => table.setPageIndex(0),
                    d: !table.getCanPreviousPage(),
                  },
                  {
                    l: "‹",
                    fn: () => table.previousPage(),
                    d: !table.getCanPreviousPage(),
                  },
                  {
                    l: "›",
                    fn: () => table.nextPage(),
                    d: !table.getCanNextPage(),
                  },
                  {
                    l: "»",
                    fn: () => table.setPageIndex(table.getPageCount() - 1),
                    d: !table.getCanNextPage(),
                  },
                ].map((b) => (
                  <button
                    key={b.l}
                    onClick={b.fn}
                    disabled={b.d}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1px solid rgba(129,140,248,0.2)",
                      background: b.d ? "transparent" : "rgba(129,140,248,0.1)",
                      color: b.d ? "#334155" : "#818cf8",
                      cursor: b.d ? "not-allowed" : "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {b.l}
                  </button>
                ))}
              </div>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(129,140,248,0.2)",
                  background: "rgba(15,12,40,0.8)",
                  color: "#94a3b8",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {[10, 15, 25, 50].map((s) => (
                  <option key={s} value={s}>
                    {s} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
