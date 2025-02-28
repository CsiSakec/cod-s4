import SectionHeading from "@/components/team/section-heading"
import TeamCard from "@/components/team/team-card"

const teamData = {
    coreTeam: {
      title: "Core Team",
      subtitle: "The leaders who drive our vision forward",
      members: [
        { name: "Alex Johnson", role: "President", imageSrc: "/Dilip.webp" },
        { name: "Sarah Williams", role: "Vice President", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Michael Chen", role: "Secretary", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Jessica Lee", role: "Treasurer", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    eventsTeam: {
      title: "Events Team",
      subtitle: "The creative minds behind our amazing events",
      members: [
        { name: "David Park", role: "Events Head", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Emma Wilson", role: "Events Coordinator", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Ryan Garcia", role: "Events Coordinator", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    registrationTeam: {
      title: "Registration Team",
      subtitle: "The organized team handling all registrations",
      members: [
        { name: "Olivia Brown", role: "Registration Head", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Daniel Kim", role: "Registration Coordinator", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    designTeam: {
      title: "Design Team",
      subtitle: "The creative artists behind our visual identity",
      members: [
        { name: "Sophia Martinez", role: "Design Lead", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Ethan Taylor", role: "UI/UX Designer", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Ava Robinson", role: "Graphic Designer", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    technicalTeam: {
      title: "Technical Team",
      subtitle: "The tech wizards powering our initiatives",
      members: [
        { name: "Noah Anderson", role: "Technical Lead", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Mia Thompson", role: "Web Developer", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Lucas Wright", role: "App Developer", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Isabella Scott", role: "Backend Developer", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    socialMediaTeam: {
      title: "Social Media Team",
      subtitle: "The voices that amplify our message",
      members: [
        { name: "James Wilson", role: "Social Media Head", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Charlotte Davis", role: "Content Creator", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Benjamin Moore", role: "Social Media Coordinator", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
    magazineTeam: {
      title: "Magazine Team",
      subtitle: "The storytellers documenting our journey",
      members: [
        { name: "Amelia Clark", role: "Editor-in-Chief", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Henry Lewis", role: "Content Writer", imageSrc: "/placeholder.svg?height=300&width=300" },
        { name: "Lily Walker", role: "Photographer", imageSrc: "/placeholder.svg?height=300&width=300" },
      ],
    },
  };
  

export default function TeamPage() {
    return (
        <main className="min-h-screen py-12 px-4 md:px-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">Our Team</h1>

                {Object.values(teamData).map((team) => (
                    <section key={team.title} className="mb-20">
                        <SectionHeading title={team.title} subtitle={team.subtitle} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                            {team.members.map((member) => (
                                <TeamCard
                                    key={member.name}
                                    name={member.name}
                                    role={member.role}
                                    imageSrc={member.imageSrc}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    )
}
