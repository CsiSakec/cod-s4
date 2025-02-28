interface SectionHeadingProps {
  title: string
  subtitle: string
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-3 relative inline-block">
        {title}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full"></div>
      </h2>
      <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}

