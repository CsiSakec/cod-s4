import SectionHeading from "@/components/team/section-heading"
import TeamCard from "@/components/team/team-card"

const teamData = {
  coreTeam: {
    title: "Core Team",
    subtitle: "The leaders who drive our vision forward",
    members: [
      {
        name: "VAIDEHI PINGALE",
        role: "GENERAL SECRETARY",
        year: "BE",
        imageSrc: "/team/vaidehi.webp",
      },
      {
        name: "KRISH SHAH",
        role: "GENERAL COORDINATOR",
        year: "BE",
        imageSrc: "/team/krish.webp",
      },
      {
        name: "VINAY SAVLA",
        role: "STUDENT COORDINATOR",
        year: "BE",
        imageSrc: "/team/vinay.webp",
      },
    ],
  },
  eventsTeam: {
    title: "Events Team",
    subtitle: "Where imagination meets execution with style!",
    members: [
      { name: "VANSHIKA BEDMUTHA", role: "HEAD", year: "TE", imageSrc: "/team/vanshika.webp" },
      { name: "RESHAB SINGH", role: "HEAD", year: "TE", imageSrc: "/team/reshab.webp" },
      { name: "PRANAV JANI", role: "CO-HEAD", year: "TE", imageSrc: "/team/pranavj.webp" },
    ],
  },
  registrationTeam: {
    title: "Registration Team",
    subtitle: "Where speed meets precision with a dash of flair!",
    members: [
      { name: "POOJA NAHAK", role: "HEAD", year: "TE", imageSrc: "/team/pooja.webp" },
      { name: "SIDDHI SHAH", role: "HEAD", year: "TE", imageSrc: "/team/siddhi.webp" },
      { name: "YASHAS MORE", role: "CO-HEAD", year: "SE", imageSrc: "/team/yashas.webp" },
      { name: "ARYAN MISHRA", role: "CO-HEAD", year: "SE", imageSrc: "/team/aryan.webp" },
    ],
  },
  treasurerTeam: {
    title: "Treasurer Team",
    subtitle: "The financial experts managing our resources",
    members: [
      { name: "DILIPKUMAR TELI", role: "TREASURER", year: "TE", imageSrc: "/team/dilip.webp" },
      { name: "SHREYASI GHORBAND", role: "TREASURER", year: "SE", imageSrc: "/team/shreyasi.webp" },
    ],
  },
  documentationTeam: {
    title: "Documentation Team",
    subtitle: "The detail-oriented team maintaining our records",
    members: [
      { name: "JANVI GULATI", role: "HEAD", year: "TE", imageSrc: "/team/janvi.webp" },
      { name: "HARSH SOLANKI", role: "CO-HEAD", year: "SE", imageSrc: "/team/harsh.webp" },
      { name: "NEEL KAMLESH GANGAR", role: "CO-HEAD", year: "TE", imageSrc: "/team/neel.webp" },
    ],
  },
  technicalTeam: {
    title: "Technical Team",
    subtitle: "The tech wizards powering our initiatives",
    members: [
      { name: "SAHAS PRAJAPATI", role: "HEAD", year: "TE", imageSrc: "/team/sahas.webp" },
      { name: "ARYAAN GALA", role: "HEAD", year: "TE", imageSrc: "/team/aryaan.webp" },
      { name: "DEEP ADAK", role: "CO-HEAD", year: "TE", imageSrc: "/team/deep.webp" },
      { name: "SUDARSHAN DATE", role: "CO-HEAD", year: "TE", imageSrc: "/team/sudarshan.webp" },
      { name: "HARSHIL SHETTY", role: "CO-HEAD", year: "SE", imageSrc: "/team/harshil.webp" },
      { name: "MONARCH VAKANI", role: "CO-HEAD", year: "SE", imageSrc: "/team/monarch.webp" },
    ],
  },
  socialMediaTeam: {
    title: "Social Media Team",
    subtitle: "The voices that amplify our message",
    members: [
      { name: "SAMIKSHA THAKUR", role: "HEAD", year: "TE", imageSrc: "/team/samiksha.webp" },
      { name: "PRATHAM DUPTE", role: "CO-HEAD", year: "SE", imageSrc: "/team/pratham.webp" },
      { name: "VEDANTI DABHOLKAR", role: "CO-HEAD", year: "TE", imageSrc: "/team/vedanti.webp" },
    ],
  },
  designTeam: {
    title: "Designer Team",
    subtitle: "The creative artists behind our visual identity",
    members: [
      { name: "AACHAL BAFNA", role: "HEAD", year: "TE", imageSrc: "/team/aachal.webp" },
      { name: "OM MITHIYA", role: "HEAD", year: "TE", imageSrc: "/team/om.webp" },
      { name: "PRANAV GHADGE", role: "CO-HEAD", year: "SE", imageSrc: "/team/pranav.webp" },
      { name: "DEVASHREE PAWAR", role: "CO-HEAD", year: "SE", imageSrc: "/team/devashree.webp" },
    ],
  },
}

const teamOrder = [
  "coreTeam",
  "eventsTeam",
  "registrationTeam",
  "treasurerTeam",
  "documentationTeam",
  "technicalTeam",
  "socialMediaTeam",
  "designTeam",
  // "magazineTeam",
]

export default function TeamPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Our Team</h1>
          <div className="h-1.5 w-32 bg-primary mx-auto rounded-full mb-6"></div>
          <h2 className="text-2xl text-gray-600">COMMITTEE 2024-2025</h2>
        </div>

        {teamOrder.map((teamKey) => {
          const team = teamData[teamKey as keyof typeof teamData]
          const headMembers = team.members.filter(
            (m) =>
              (m.role.includes("HEAD") && !m.role.includes("CO-HEAD")) ||
              m.role.includes("SECRETARY") ||
              m.role.includes("COORDINATOR") ||
              (m.role.includes("TREASURER") && !m.role.includes("CO-TREASURER")),
          )
          const coHeadMembers = team.members.filter(
            (m) => m.role.includes("CO-HEAD") || m.role.includes("CO-TREASURER"),
          )

          return (
            <section key={team.title} className="mb-32">
              <SectionHeading title={team.title} subtitle={team.subtitle} />

              {/* HEAD Members */}
              {headMembers.length > 0 && (
                <div className="mb-12">
                  <div className="flex flex-wrap justify-center gap-8">
                    {headMembers.map((member) => (
                      <TeamCard
                        key={member.name}
                        name={member.name}
                        role={member.role}
                        imageSrc={member.imageSrc}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CO-HEAD Members */}
              {coHeadMembers.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap justify-center gap-8">
                    {coHeadMembers.map((member) => (
                      <TeamCard
                        key={member.name}
                        name={member.name}
                        role={member.role}
                        imageSrc={member.imageSrc}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </main>
  )
}