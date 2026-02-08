"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "/banner.png",
    title: "Compete with the Best",
    description: "Show your skills and win amazing prizes",
  },
  {
    id: 2,
    image: "/banner2.png",
    title: "Register Now",
    description: "Limited spots available. Don't miss out!",
  },
  {
    id: 3,
    image: "/banner4.jpg",
    title: "Register Now",
    description: "Limited spots available. Don't miss out!",
  },
  {
    id: 4,
    image: "/banner5.jpg",
    title: "Register Now",
    description: "Limited spots available. Don't miss out!",
  },
  {
    id: 5,
    image: "/events.png",
    title: "Compete with the Best",
    description: "Show your skills and win amazing prizes",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .slide-active {
          animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-button {
          background: linear-gradient(145deg, rgba(18,18,30,0.7), rgba(12,12,22,0.8));
          border: 1px solid rgba(124,92,252,0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: linear-gradient(145deg, rgba(124,92,252,0.4), rgba(167,139,250,0.3));
          border-color: rgba(124,92,252,0.6);
          box-shadow: 0 8px 24px rgba(124,92,252,0.3);
        }

        .indicator {
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.3);
          backdrop-filter: blur(4px);
        }

        .indicator-active {
          background: linear-gradient(135deg, #7c5cfc, #a78bfa);
          box-shadow: 0 0 12px rgba(124,92,252,0.6);
        }
      `}</style>

      <div className="relative w-full h-[30vh] sm:h-[90vh] overflow-hidden">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,10,20,0.3)] z-10 pointer-events-none" />

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 slide-active"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover object-top"
                priority={index === 0}
              />
              {/* Vignette effect */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[rgba(10,10,20,0.4)]" />
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="nav-button absolute left-4 top-1/2 -translate-y-1/2 rounded-full z-20"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="nav-button absolute right-4 top-1/2 -translate-y-1/2 rounded-full z-20"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6 text-white" />
          <span className="sr-only">Next slide</span>
        </Button>

        {/* Enhanced indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full indicator ${
                index === currentSlide ? "indicator-active w-8" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
