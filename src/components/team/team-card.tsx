import Image from "next/image"

interface TeamCardProps {
  name: string
  role: string
  imageSrc: string
}

export default function TeamCard({ name, role, imageSrc }: TeamCardProps) {
  const isHead = role.includes("HEAD") && !role.includes("CO-HEAD")

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
      <div className="relative h-72 w-full overflow-hidden">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={name}
        fill
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
      />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> */}
      </div>
      <div className="p-2 text-center relative bg-white">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className={`text-sm font-medium text-primary`}>{role}</p>
  
      </div>
    </div>
  )
}

