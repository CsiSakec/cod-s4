interface SectionHeadingProps {
  title: string
  subtitle: string
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="relative inline-block text-4xl font-bold mb-3 px-6">
        <span className="relative z-10 text-black">{title}</span>
        <span
          className="absolute inset-0  left-1/2 transform -translate-x-1/2 w-[300px] h-[150px] bg-no-repeat bg-contain bg-center"
          style={{ top:"-50px",backgroundImage: "url('/image.png')" }}
        ></span>
      </h2>
      <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}


