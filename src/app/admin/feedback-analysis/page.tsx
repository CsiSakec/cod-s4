"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "@/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  MessageSquare,
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
  Legend,
} from "recharts";

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
interface FeedbackEntry {
  id: string;
  submittedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    participantType: string;
    isCsiMember: string;
  };
  academicInfo: {
    branch: string;
    year: string;
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

/* ──────────────────────────────────────────────
   Constants
────────────────────────────────────────────── */
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

const QUESTION_LABELS = [
  {
    key: "q1_engineeringKnowledge",
    short: "Engineering\nKnowledge",
    full: "Q1: Engineering Knowledge",
  },
  {
    key: "q2_technicalTools",
    short: "Technical\nTools",
    full: "Q2: Technical Tools",
  },
  {
    key: "q3_problemSolving",
    short: "Problem\nSolving",
    full: "Q3: Problem Solving",
  },
  { key: "q4_teamwork", short: "Teamwork", full: "Q4: Teamwork" },
  { key: "q5_modernTools", short: "Modern\nTools", full: "Q5: Modern Tools" },
  {
    key: "q6_lifelongLearning",
    short: "Lifelong\nLearning",
    full: "Q6: Lifelong Learning",
  },
  {
    key: "q7_ethicalPractices",
    short: "Ethics",
    full: "Q7: Ethical Practices",
  },
  {
    key: "q8_entrepreneurship",
    short: "Entrepreneur-\nship",
    full: "Q8: Entrepreneurship",
  },
  {
    key: "q9_skillsEquipped",
    short: "Skills\nEquipped",
    full: "Q9: Skills Equipped",
  },
  {
    key: "q10_futureParticipation",
    short: "Future\nParticipation",
    full: "Q10: Future Participation",
  },
];

/* Map response → numeric score (5=best, 1=worst) */
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

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];
const BAR_GRADIENT_START = "#6366f1";
const BAR_GRADIENT_END = "#a78bfa";

const BRANCH_COLORS: Record<string, string> = {
  COMPS: "#6366f1",
  IT: "#8b5cf6",
  "AI-DS": "#ec4899",
  CYSE: "#f59e0b",
  ECS: "#10b981",
  EXTC: "#3b82f6",
  ACT: "#ef4444",
  VLSI: "#14b8a6",
};

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function countBy<T>(arr: T[], key: (item: T) => string) {
  return arr.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

/* ──────────────────────────────────────────────
   Custom Tooltip
────────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-purple-500/30 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-purple-300 font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}:{" "}
            <span className="font-bold">
              {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ──────────────────────────────────────────────
   Stat Card
────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-purple-500/20 bg-gray-900/60 backdrop-blur p-5 flex items-center gap-4`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-purple-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
export default function FeedbackAnalysis() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      router.push("/admin");
      return;
    }

    const fbRef = ref(database, "eventFeedback");
    const unsub = onValue(fbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFeedbacks(Object.values(data) as FeedbackEntry[]);
      } else {
        setFeedbacks([]);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* ── Derived data ── */

  // Average score per question
  const avgScoresData = QUESTION_LABELS.map((q) => {
    const scores = feedbacks
      .map((f) => SCORE_MAP[(f.feedbackResponses as any)[q.key]] ?? 0)
      .filter(Boolean);
    return {
      name: q.full,
      shortName: q.short,
      avg: parseFloat(avg(scores).toFixed(2)),
    };
  });

  // Overall sentiment distribution (all responses combined)
  const allResponses = feedbacks.flatMap((f) =>
    Object.values(f.feedbackResponses),
  );
  const sentimentCounts = countBy(allResponses, (r) => {
    const score = SCORE_MAP[r];
    if (!score) return "Unknown";
    if (score >= 4) return "Positive";
    if (score === 3) return "Neutral";
    return "Negative";
  });
  const sentimentPieData = Object.entries(sentimentCounts)
    .filter(([k]) => k !== "Unknown")
    .map(([name, value]) => ({ name, value }));

  // Participant type breakdown
  const participantTypeCounts = countBy(
    feedbacks,
    (f) => f.personalInfo.participantType || "Unknown",
  );
  const participantPieData = Object.entries(participantTypeCounts).map(
    ([name, value]) => ({ name, value }),
  );

  // CSI member breakdown
  const csiCounts = countBy(
    feedbacks,
    (f) => f.personalInfo.isCsiMember || "Unknown",
  );
  const csiPieData = Object.entries(csiCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Branch distribution
  const branchCounts = countBy(
    feedbacks,
    (f) => f.academicInfo?.branch || "Unknown",
  );
  const branchBarData = Object.entries(branchCounts)
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count);

  // Year distribution
  const yearCounts = countBy(
    feedbacks,
    (f) => f.academicInfo?.year || "Unknown",
  );
  const yearBarData = Object.entries(yearCounts).map(([year, count]) => ({
    year,
    count,
  }));

  // Radar data (average score per question, normalized 0–100)
  const radarData = QUESTION_LABELS.map((q) => {
    const scores = feedbacks
      .map((f) => SCORE_MAP[(f.feedbackResponses as any)[q.key]] ?? 0)
      .filter(Boolean);
    return {
      subject: q.short.replace("\n", " "),
      score: parseFloat(((avg(scores) / 5) * 100).toFixed(1)),
      fullMark: 100,
    };
  });

  // Q10 future participation distribution
  const q10Counts = countBy(
    feedbacks,
    (f) => f.feedbackResponses.q10_futureParticipation || "Unknown",
  );
  const q10Data = LIKELIHOOD_OPTIONS.map((opt) => ({
    label: opt,
    count: q10Counts[opt] || 0,
  }));

  // Overall average score
  const allScores = feedbacks.flatMap((f) =>
    Object.values(f.feedbackResponses)
      .map((v) => SCORE_MAP[v])
      .filter(Boolean),
  );
  const overallAvg = avg(allScores);
  const satisfactionPct = Math.round(((overallAvg - 1) / 4) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-purple-300 text-sm">Loading feedback data…</p>
        </div>
      </div>
    );
  }

  const SENTIMENT_COLORS: Record<string, string> = {
    Positive: "#6366f1",
    Neutral: "#a78bfa",
    Negative: "#f87171",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-purple-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard")}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="w-px h-6 bg-purple-500/30" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Feedback Analytics
          </h1>
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          {feedbacks.length} responses
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-indigo-300" />}
            label="Total Responses"
            value={feedbacks.length}
            sub="All submissions"
            color="bg-indigo-500/20"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-purple-300" />}
            label="Avg Score"
            value={overallAvg.toFixed(2) + " / 5"}
            sub="Across all questions"
            color="bg-purple-500/20"
          />
          <StatCard
            icon={<Award className="h-5 w-5 text-pink-300" />}
            label="Satisfaction"
            value={satisfactionPct + "%"}
            sub="Overall satisfaction rate"
            color="bg-pink-500/20"
          />
          <StatCard
            icon={<MessageSquare className="h-5 w-5 text-violet-300" />}
            label="With Remarks"
            value={feedbacks.filter((f) => f.remarks?.trim()).length}
            sub="Written responses"
            color="bg-violet-500/20"
          />
        </div>

        {/* Row 1: Avg Score Bar + Sentiment Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Average Score per Question — Bar Chart */}
          <Card className="lg:col-span-2 bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                📊 Average Score per Question
              </CardTitle>
              <p className="text-xs text-gray-400">
                Score out of 5 — higher is better
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={avgScoresData}
                  margin={{ top: 4, right: 16, left: -16, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BAR_GRADIENT_START} />
                      <stop offset="100%" stopColor={BAR_GRADIENT_END} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="full"
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                    tickFormatter={(v: string) =>
                      v.replace("Q", "").split(":")[0]
                    }
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[0, 5]}
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="avg"
                    name="Avg Score"
                    fill="url(#barGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sentiment Pie */}
          <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                🎯 Overall Sentiment
              </CardTitle>
              <p className="text-xs text-gray-400">
                Positive / Neutral / Negative
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={SENTIMENT_COLORS[entry.name] || "#6366f1"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomBarTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {sentimentPieData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-1.5 text-xs text-gray-300"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: SENTIMENT_COLORS[entry.name] }}
                    />
                    {entry.name}:{" "}
                    <span className="font-semibold text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Radar + Q10 Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                🕸️ Competency Radar
              </CardTitle>
              <p className="text-xs text-gray-400">
                Normalized score (0–100) across learning dimensions
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={radarData}
                >
                  <PolarGrid stroke="rgba(255,255,255,0.07)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280", fontSize: 9 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Q10 — Future Participation */}
          <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                🔮 Future Participation Intent
              </CardTitle>
              <p className="text-xs text-gray-400">
                How likely are participants to join again?
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={q10Data}
                  layout="vertical"
                  margin={{ left: 16, right: 24, top: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fill: "#d1d5db", fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Responses"
                    fill="#6366f1"
                    radius={[0, 6, 6, 0]}
                  >
                    {q10Data.map((entry, index) => (
                      <Cell
                        key={entry.label}
                        fill={`hsl(${250 + index * 18}, 70%, ${60 - index * 5}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Branch Bar + Participant Pie + CSI Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Branch distribution */}
          <Card className="lg:col-span-2 bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                🏛️ Responses by Branch
              </CardTitle>
              <p className="text-xs text-gray-400">
                Number of feedback submissions per engineering branch
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart
                  data={branchBarData}
                  margin={{ top: 4, right: 16, left: -16, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="branch"
                    tick={{ fill: "#d1d5db", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" name="Responses" radius={[6, 6, 0, 0]}>
                    {branchBarData.map((entry) => (
                      <Cell
                        key={entry.branch}
                        fill={BRANCH_COLORS[entry.branch] || "#6366f1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Participant Type Pie */}
          <div className="space-y-6 flex flex-col">
            <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur flex-1">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold text-purple-200">
                  👥 Participant Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={participantPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {participantPieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomBarTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {participantPieData.map((entry, i) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-1 text-xs text-gray-300"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      {entry.name}:{" "}
                      <span className="font-bold text-white">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CSI Member Pie */}
            <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur flex-1">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold text-purple-200">
                  🪪 CSI Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={csiPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {csiPieData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.name === "Yes" ? "#6366f1" : "#f87171"}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomBarTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {csiPieData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-1 text-xs text-gray-300"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            entry.name === "Yes" ? "#6366f1" : "#f87171",
                        }}
                      />
                      {entry.name}:{" "}
                      <span className="font-bold text-white">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 4: Year distribution */}
        <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-purple-200">
              🎓 Responses by Year
            </CardTitle>
            <p className="text-xs text-gray-400">
              Academic year-wise breakdown of feedback submissions
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={yearBarData}
                margin={{ top: 4, right: 16, left: -16, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#d1d5db", fontSize: 13 }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="count"
                  name="Responses"
                  fill="url(#yearGrad)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Remarks */}
        {feedbacks.filter((f) => f.remarks?.trim()).length > 0 && (
          <Card className="bg-gray-900/60 border-purple-500/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-purple-200">
                💬 Recent Remarks
              </CardTitle>
              <p className="text-xs text-gray-400">
                Latest written feedback from participants
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {feedbacks
                  .filter((f) => f.remarks?.trim())
                  .slice(-8)
                  .reverse()
                  .map((f) => (
                    <div
                      key={f.id}
                      className="bg-gray-800/60 border border-purple-500/10 rounded-xl p-3"
                    >
                      <p className="text-sm text-gray-200 leading-relaxed line-clamp-3">
                        &ldquo;{f.remarks}&rdquo;
                      </p>
                      <p className="text-xs text-purple-400 mt-2 font-medium">
                        — {f.personalInfo.fullName} · {f.academicInfo?.branch}{" "}
                        {f.academicInfo?.year}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
