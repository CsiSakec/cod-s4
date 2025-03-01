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
        <TabsList className="grid w-[400px] grid-cols-2 md:grid-cols-3 mx-auto mb-8">
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
                  <p className="text-muted-foreground">March 15 - April 10, 2025</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Qualification Round</h3>
                  <p className="text-muted-foreground">April 15 - April 20, 2025</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Semi-Finals</h3>
                  <p className="text-muted-foreground">May 1 - May 5, 2025</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Grand Finale</h3>
                  <p className="text-muted-foreground">May 15, 2025</p>
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
              <CardDescription>What you can win</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-gradient-to-b from-amber-50 to-transparent border-amber-200">
                  <h3 className="font-medium mb-2 text-amber-600">1st Place</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>$10,000 Cash Prize</li>
                    <li>Internship Opportunity</li>
                    <li>Pro Developer Pack</li>
                    <li>Trophy & Certificate</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-gradient-to-b from-slate-50 to-transparent border-slate-200">
                  <h3 className="font-medium mb-2 text-slate-600">2nd Place</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>$5,000 Cash Prize</li>
                    <li>Pro Developer Pack</li>
                    <li>Trophy & Certificate</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 bg-gradient-to-b from-orange-50 to-transparent border-orange-200">
                  <h3 className="font-medium mb-2 text-orange-600">3rd Place</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>$2,500 Cash Prize</li>
                    <li>Developer Pack</li>
                    <li>Trophy & Certificate</li>
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
                  <span>Open to all students enrolled in an accredited educational institution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Participants must be at least 16 years of age</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Both individual participants and teams of up to 3 members are allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Previous winners may participate but are subject to different evaluation criteria</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Employees of sponsoring organizations and their immediate family members are not eligible</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Competition Format
              </CardTitle>
              <CardDescription>How the competition works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Qualification Round</h3>
                  <p className="text-muted-foreground">
                    Online round with algorithmic problems to be solved within a 48-hour window. Top 100 participants
                    advance to the semi-finals.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Semi-Finals</h3>
                  <p className="text-muted-foreground">
                    Project-based challenge where participants build a solution to a real-world problem within 5 days.
                    Top 10 advance to the finals.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Grand Finale</h3>
                  <p className="text-muted-foreground">
                    Live 8-hour hackathon where finalists build and present their solutions to a panel of industry
                    experts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Submission Guidelines
              </CardTitle>
              <CardDescription>Requirements for your submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All code must be original and created during the competition period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Open-source libraries and frameworks are allowed, but must be properly attributed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Submissions must include source code and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Code must be submitted through the official competition platform before the deadline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Late submissions will not be accepted under any circumstances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>For the final round, participants must prepare a 5-minute presentation of their solution</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Constraints
              </CardTitle>
              <CardDescription>Time limits for each round</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Qualification Round: 48 hours to solve algorithmic problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Semi-Finals: 5 days to complete the project challenge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Grand Finale: 8-hour live hackathon followed by presentations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All deadlines are based on Coordinated Universal Time (UTC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Extensions will not be granted except in cases of major technical issues affecting all participants
                  </span>
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
                  <span>Collaborate respectfully with team members and other participants</span>
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

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
              <CardDescription>Ownership of submitted code and ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Participants retain ownership of their intellectual property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    By participating, you grant the organizers a non-exclusive license to showcase your submission for
                    promotional purposes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Sponsoring organizations may offer separate agreements for projects they wish to develop further
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    All participants are responsible for ensuring their submissions do not infringe on others'
                    intellectual property rights
                  </span>
                </li>
              </ul>
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

