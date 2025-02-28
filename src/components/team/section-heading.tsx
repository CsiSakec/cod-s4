interface SectionHeadingProps {
    title: string
    subtitle?: string
  }
  
  export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    )
  }
  
  