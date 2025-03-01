"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    image: "/banner1.png",
    title: "Welcome to COD Tournament",
    description: "Join the biggest gaming event of the year",
  },
  {
    id: 2,
    image: "/banner1.png",
    title: "Compete with the Best",
    description: "Show your skills and win amazing prizes",
  },
  {
    id: 3,
    image: "/banner1.png",
    title: "Register Now",
    description: "Limited spots available. Don't miss out!",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, []) // Removed nextSlide from dependencies

  return (
    <div className="relative w-full h-[30vh] overflow-hidden sm:h-[90vh]">
      {slides.map((slide, index) => (
  <div
    key={slide.id}
    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
      index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="relative w-full h-full">
      <Image
        src={slide.image || "/placeholder.svg"}
        alt={slide.title}
        fill
        className="object-fill"
        priority={index === 0}
        sizes="100vw"
      />
    </div>
  </div>
))}

      {/* Navigation buttons */}
      {/* <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button> */}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 ">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

