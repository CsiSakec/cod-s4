"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Clock,
  Code,
  Medal,
  ShieldAlert,
  Users,
} from "lucide-react";

export function Rules() {
  return (
    <div
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
      <style>{`
        @keyframes float1 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(180deg); } }
        @keyframes float2 { 0%,100% { transform:translateY(0) translateX(0); } 33% { transform:translateY(-12px) translateX(8px); } 66% { transform:translateY(6px) translateX(-6px); } }
        @keyframes glowPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
        @keyframes titleReveal { from { opacity:0; transform:translateY(28px) scale(0.93); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes lineSweep { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }

        .rules-card {
          background: linear-gradient(145deg, rgba(18,18,30,0.82), rgba(12,12,22,0.88));
          border: 1px solid rgba(124,92,252,0.2);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .section-header {
          background: linear-gradient(135deg, #ffffff 30%, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prize-card-gold {
          background: linear-gradient(145deg, rgba(251,191,36,0.08), rgba(245,158,11,0.05));
          border: 1px solid rgba(251,191,36,0.25);
        }

        .prize-card-silver {
          background: linear-gradient(145deg, rgba(124,92,252,0.08), rgba(167,139,250,0.05));
          border: 1px solid rgba(124,92,252,0.25);
        }

        .prize-card-bronze {
          background: linear-gradient(145deg, rgba(249,115,22,0.08), rgba(234,88,12,0.05));
          border: 1px solid rgba(249,115,22,0.25);
        }

        .schedule-card {
          background: linear-gradient(145deg, rgba(30,30,45,0.6), rgba(20,20,35,0.7));
          border: 1px solid rgba(124,92,252,0.2);
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Background grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient blobs */}
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
          animation: "glowPulse 4s ease-in-out infinite",
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

      {/* Floating particles */}
      <div
        style={{
          position: "fixed",
          top: "8%",
          left: "4%",
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
          position: "fixed",
          top: "35%",
          right: "10%",
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
          position: "fixed",
          bottom: "20%",
          left: "15%",
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "rgba(124,92,252,0.6)",
          animation: "float1 7s ease-in-out infinite 1s",
          zIndex: 0,
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge
            className="mb-4 bg-[rgba(124,92,252,0.12)] border-[rgba(124,92,252,0.25)] text-[#a78bfa] hover:bg-[rgba(124,92,252,0.2)]"
            variant="outline"
          >
            SEASON 5
          </Badge>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 section-header"
            style={{
              animation: "titleReveal 0.9s cubic-bezier(.22,1,.36,1) forwards",
            }}
          >
            Code off Duty
          </h1>

          {/* Sweep line */}
          <div
            style={{
              position: "relative",
              height: 2,
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
            className="text-xl max-w-2xl mt-6"
            style={{ color: "rgba(190,190,220,0.7)" }}
          >
            Official Rules & Regulations for the ultimate coding competition
          </p>
        </div>

        <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3 mx-auto mb-8 bg-[rgba(30,30,45,0.6)] border border-[rgba(124,92,252,0.2)]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c5cfc] data-[state=active]:to-[#a78bfa] data-[state=active]:text-white text-[rgba(190,190,220,0.7)]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c5cfc] data-[state=active]:to-[#a78bfa] data-[state=active]:text-white text-[rgba(190,190,220,0.7)]"
            >
              Rules
            </TabsTrigger>
            <TabsTrigger
              value="conduct"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c5cfc] data-[state=active]:to-[#a78bfa] data-[state=active]:text-white text-[rgba(190,190,220,0.7)]"
            >
              Conduct
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="rules-card">
              {/* Top accent line */}
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <Calendar className="h-5 w-5 text-[#a78bfa]" />
                  Competition Schedule
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  Important dates and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="schedule-card rounded-lg p-4 md:col-span-2">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Registration Period
                    </h3>
                    <p style={{ color: "rgba(190,190,220,0.8)" }}>
                      Feb 01 - Feb 18, 2026
                    </p>
                  </div>
                  <div className="schedule-card rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Rookie Round
                    </h3>
                    <p style={{ color: "rgba(190,190,220,0.8)" }}>
                      Feb 18, 2026 10:30am to 11:45am
                    </p>
                  </div>
                  <div className="schedule-card rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Open Round
                    </h3>
                    <p style={{ color: "rgba(190,190,220,0.8)" }}>
                      Feb 18, 2026 12:00pm to 01:15pm
                    </p>
                  </div>
                  <div className="schedule-card rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Intra Rookie
                    </h3>
                    <p style={{ color: "rgba(190,190,220,0.8)" }}>
                      Feb 18, 2026 01:45pm to 03:00pm
                    </p>
                  </div>
                  <div className="schedule-card rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Intra Open
                    </h3>
                    <p style={{ color: "rgba(190,190,220,0.8)" }}>
                      Feb 18, 2026 03:15pm to 04:30pm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rules-card">
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <Medal className="h-5 w-5 text-[#a78bfa]" />
                  Prizes & Rewards
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  What you can win
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="prize-card-gold rounded-lg p-4">
                    <h3
                      className="font-medium mb-2"
                      style={{ color: "#f59e0b" }}
                    >
                      Prize Worth
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: "rgba(190,190,220,0.8)" }}
                    >
                      <li>
                        Prize Worth <b>₹30,000</b>
                      </li>
                    </ul>
                  </div>
                  <div className="prize-card-silver rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#a78bfa]">
                      Winner's & Certificate
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: "rgba(190,190,220,0.8)" }}
                    >
                      <li>Each Round has 2 winner's</li>
                      <li>Cash prize for winner</li>
                      <li>Certificate</li>
                    </ul>
                  </div>
                  <div className="prize-card-bronze rounded-lg p-4">
                    <h3
                      className="font-medium mb-2"
                      style={{ color: "#f97316" }}
                    >
                      Goodie's
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: "rgba(190,190,220,0.8)" }}
                    >
                      <li>All participant will get some perk's.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rules-card">
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <Users className="h-5 w-5 text-[#a78bfa]" />
                  Eligibility
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  Who can participate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Open to students pursuing B.E., B.Tech, B.Sc, or Diploma
                      in engineering or related fields.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Participants must be at least 16 years of age.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Ideal for individuals passionate about coding, Data
                      Structures & Algorithms (DSA), or competitive programming.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Only individual participation is allowed, team entries are
                      not permitted.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card className="rules-card">
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <AlertCircle className="h-5 w-5 text-[#a78bfa]" />
                  Submission Guidelines & Rules
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  Ensure compliance with these rules to participate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      All code must be original and created during the
                      competition period.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Open-source libraries and frameworks are allowed but must
                      be properly attributed.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Submissions must include source code and documentation.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Code must be submitted through the official competition
                      platform before the deadline.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Late submissions will not be accepted under any
                      circumstances.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Participants must wear their current academic year ID
                      cards throughout the contest.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Participants must register on the official website of CODE
                      OFF DUTY: SEASON 5 to compete.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      The contest will run for 1 hour, and participants must
                      submit their solutions within the given time frame.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Participants can compete in the level corresponding to
                      their year of study or higher:
                      <ul className="pl-4 mt-1 list-disc space-y-1">
                        <li>
                          <span className="font-semibold text-[#a78bfa]">
                            Rookie:
                          </span>{" "}
                          (Diploma, 1st & 2nd Year students.)
                        </li>
                        <li>
                          <span className="font-semibold text-[#a78bfa]">
                            Open:
                          </span>{" "}
                          (Open for All)
                        </li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Participants cannot compete in a level lower than their
                      year of study (e.g., a TE student cannot compete in the
                      Rookie level).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Supported programming languages include:
                      <ul className="pl-4 mt-1 list-disc space-y-1">
                        <li>
                          C, C++, Java, Python, JavaScript (Node.js), TypeScript
                        </li>
                        <li>Go, Rust, PHP, Kotlin, Ruby, Swift</li>
                        <li>C#, Scala, Lua, Perl, Haskell, Shell</li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1" style={{ color: "#ef4444" }}>
                      •
                    </span>
                    <span style={{ color: "#ef4444" }}>
                      <strong>Strictly Prohibited:</strong> Any form of
                      plagiarism or cheating will result in immediate
                      disqualification.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conduct" className="space-y-6">
            <Card className="rules-card">
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <ShieldAlert className="h-5 w-5 text-[#a78bfa]" />
                  Code of Conduct
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  Expected behavior from all participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4" style={{ color: "rgba(190,190,220,0.8)" }}>
                  All participants are expected to adhere to the following code
                  of conduct:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Treat all participants, organizers, and judges with
                      respect and courtesy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Do not engage in any form of harassment, discrimination,
                      or offensive behavior
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Maintain academic integrity and avoid any form of cheating
                      or plagiarism
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Collaborate respectfully with other participants
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Follow all competition rules and guidelines
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Report any violations or concerns to the competition
                      organizers
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rules-card">
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

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgba(220,220,240,0.9)]">
                  <AlertCircle className="h-5 w-5 text-[#a78bfa]" />
                  Disqualification
                </CardTitle>
                <CardDescription style={{ color: "rgba(167,139,250,0.7)" }}>
                  Actions that may result in disqualification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4" style={{ color: "rgba(190,190,220,0.8)" }}>
                  The following actions may result in immediate
                  disqualification:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Submitting code that was not created during the
                      competition period
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Plagiarism or unauthorized use of others' code
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Sharing solutions with other participants during the
                      competition
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Attempting to interfere with other participants'
                      submissions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Violating the code of conduct
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#a78bfa]">•</span>
                    <span style={{ color: "rgba(190,190,220,0.8)" }}>
                      Providing false information during registration
                    </span>
                  </li>
                </ul>
                <p className="mt-4" style={{ color: "rgba(167,139,250,0.7)" }}>
                  The competition organizers reserve the right to disqualify any
                  participant at their discretion.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p style={{ color: "rgba(190,190,220,0.7)" }}>
            For any questions or clarifications, please contact{" "}
            <a
              href="mailto:csi@sakec.ac.in"
              className="hover:underline"
              style={{ color: "#a78bfa" }}
            >
              csi@sakec.ac.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
