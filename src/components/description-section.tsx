import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DescriptionSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Call of Duty Tournament 2025</h2>
            <p className="text-lg text-gray-600">
              Join the most exciting Call of Duty tournament of the year. Compete against players from around the world
              and show your skills in various game modes including Team Deathmatch, Search and Destroy, and Domination.
            </p>
            <p className="text-lg text-gray-600">
              The tournament will feature both individual and team competitions with amazing prizes for the winners.
              Whether you're a casual player or a professional gamer, this tournament has categories for everyone.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/registration">Register Now</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Call of Duty Tournament"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

