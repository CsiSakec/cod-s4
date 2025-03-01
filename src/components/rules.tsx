import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, Clock, Code, Medal, ShieldAlert, Users } from "lucide-react"

export function Rules() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <Badge className="mb-4" variant="outline">
          SEASON 4
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Code off Duty</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Official Rules & Regulations for the ultimate coding competition
        </p>
      </div>

      <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
        <TabsList className="grid w-[400px] grid-cols-3 md:grid-cols-3 mx-auto mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          {/* <TabsTrigger value="judging">Judging</TabsTrigger> */}
          <TabsTrigger value="conduct">Conduct</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Competition Schedule
              </CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Registration Period</h3>
                  <p className="text-muted-foreground">March 01 - March 20, 2025</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Rookie Round</h3>
                  <p className="text-muted-foreground">March 21,2025 10:30am to 11:30am</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Advanced Round</h3>
                  <p className="text-muted-foreground">March 21,2025 12:00pm to 01:00pm</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Open Round</h3>
                  <p className="text-muted-foreground">March 21,2025 02:00pm to 03:00pm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Prizes & Rewards
              </CardTitle>
              <CardDescription>What you can win </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-gradient-to-b from-amber-50 to-transparent border-amber-200">
                  <h3 className="font-medium mb-2 text-amber-600">Prize Worth</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Prize Worth <b>30,000</b></li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-gradient-to-b from-slate-50 to-transparent border-slate-200">
                  <h3 className="font-medium mb-2 text-slate-600">Winner's & Certificate</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Each Round has 2 winner's</li>
                    <li>Cash prize for winner</li>
                    <li>Certificate</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-gradient-to-b from-orange-50 to-transparent border-orange-200">
                  <h3 className="font-medium mb-2 text-orange-600">Goodie's</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>All participant will get some perk's.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Eligibility
              </CardTitle>
              <CardDescription>Who can participate</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Open to students pursuing B.E., B.Tech, B.Sc, or Diploma in engineering or related fields.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Participants must be at least 16 years of age.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ideal for individuals passionate about coding, Data Structures & Algorithms (DSA), or competitive programming.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Only individual participation is allowed, team entries are not permitted.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
        <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      Submission Guidelines & Rules
    </CardTitle>
    <CardDescription>Ensure compliance with these rules to participate</CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      {/* Submission Guidelines */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>All code must be original and created during the competition period.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Open-source libraries and frameworks are allowed but must be properly attributed.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Submissions must include source code and documentation.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Code must be submitted through the official competition platform before the deadline.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Late submissions will not be accepted under any circumstances.</span>
      </li>

      {/* ID Cards */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Participants must wear their current academic year ID cards throughout the contest.</span>
      </li>

      {/* Registration */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Participants must register on the official website of CODE OFF DUTY: SEASON 4 to compete.</span>
      </li>

      {/* Contest Duration */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>The contest will run for 1 hour, and participants must submit their solutions within the given time frame.</span>
      </li>

      {/* Levels of Participation */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>
          Participants can compete in the level corresponding to their year of study or higher:
          <ul className="pl-4 mt-1 list-disc space-y-1">
            <li><span className="font-semibold">Rookie:</span> (FE/SE – 1st & 2nd Year Students)</li>
            <li><span className="font-semibold">Advanced:</span> (TE/BE – 3rd & 4th Year Students)</li>
            <li><span className="font-semibold">Open:</span> (Open for All)</li>
          </ul>
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>Participants cannot compete in a level lower than their year of study (e.g., a TE student cannot compete in the Rookie level).</span>
      </li>

      {/* Programming Languages */}
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        <span>
          Supported programming languages include:
          <ul className="pl-4 mt-1 list-disc space-y-1">
            <li>C, C++, Java, Python, JavaScript (Node.js), TypeScript</li>
            <li>Go, Rust, PHP, Kotlin, Ruby, Swift</li>
            <li>C#, Scala, Lua, Perl, Haskell, Shell</li>
          </ul>
        </span>
      </li>

      {/* Plagiarism Policy */}
      <li className="flex items-start gap-2 text-red-600">
        <span className="text-primary mt-1">•</span>
        <span><strong>Strictly Prohibited:</strong> Any form of plagiarism or cheating will result in immediate disqualification.</span>
      </li>
    </ul>
  </CardContent>
</Card>

        </TabsContent>

        <TabsContent value="conduct" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Code of Conduct
              </CardTitle>
              <CardDescription>Expected behavior from all participants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">All participants are expected to adhere to the following code of conduct:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Treat all participants, organizers, and judges with respect and courtesy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Do not engage in any form of harassment, discrimination, or offensive behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Maintain academic integrity and avoid any form of cheating or plagiarism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Collaborate respectfully with other participants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Follow all competition rules and guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Report any violations or concerns to the competition organizers</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Disqualification
              </CardTitle>
              <CardDescription>Actions that may result in disqualification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The following actions may result in immediate disqualification:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Submitting code that was not created during the competition period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Plagiarism or unauthorized use of others' code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sharing solutions with other participants during the competition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Attempting to interfere with other participants' submissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Violating the code of conduct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Providing false information during registration</span>
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                The competition organizers reserve the right to disqualify any participant at their discretion.
              </p>
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          For any questions or clarifications, please contact{" "}
          <a href="mailto:csi@sakec.ac.in" className="text-primary hover:underline">
            csi@sakec.ac.in
          </a>
        </p>
      </div>
    </div>
  )
}

