import Image from "next/image"

interface TeamCardProps {
  name: string
  role?: string
  imageSrc: string
}

export default function TeamCard({ name, role, imageSrc }: TeamCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full border-4 border-primary">
        <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-bold text-center">{name}</h3>
      {role && <p className="text-sm text-muted-foreground text-center">{role}</p>}
    </div>
  )
}

