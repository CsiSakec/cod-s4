
import HeroCarousel from "@/components/hero-carousel"
import DescriptionSection from "@/components/description-section"
import ContactSection from "@/components/contact-section"


export default function Home() {
  return (
    <main className="min-h-screen">
      
      <HeroCarousel />
      <DescriptionSection />
      <ContactSection />
     
    </main>
  )
}

