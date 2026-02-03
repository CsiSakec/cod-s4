import Image from "next/image";

interface TeamCardProps {
  name: string;
  role: string;
  imageSrc: string;
}

export default function TeamCard({ name, role, imageSrc }: TeamCardProps) {
  const isHead = role.includes("HEAD") && !role.includes("CO-HEAD");

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="288px"
          className="object-cover object-[center_50%]"
        />
      </div>

      <div className="p-2 text-center relative bg-white">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className={`text-sm font-medium text-primary`}>{role}</p>
      </div>
    </div>
  );
}
