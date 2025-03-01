import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DescriptionSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-black">
              CODE OFF DUTY - SEASON 4 🧑‍💻
            </h2>
            <p className="text-lg text-gray-600">
              Join the ultimate coding showdown of the year! CSI-SAKEC, in
              collaboration with AURUM, presents Code off Duty: Season 4—where
              only the sharpest minds survive. Compete in intense
              problem-solving battles, optimize algorithms, and prove your
              coding prowess in the arena of Competitive Programming.
            </p>
            <p className="text-lg text-gray-600">
              The event features thrilling DSA challenges and competitive
              programming contests with categories for all skill levels—Rookie,
              Advanced, and Open. With prizes worth ₹30,000 and exciting goodies
              for all participants, this is your chance to sharpen your skills,
              push your limits, and emerge victorious!
            </p>

            <div className="pt-4">
              <div className="relative inline-flex items-center justify-center gap-4 group">
                <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <a
                  role="button"
                  className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                  title="payment"
                  href="/registration"
                >
                  Register Now
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="transition opacity-0 group-hover:opacity-100"
                    ></path>
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </a>
                <a
                  role="button"
                  className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                  title="payment"
                  href="/rulesandregulation"
                >
                  Rules & Regulations
                  
            
                </a>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/banner1.png"
              alt="Code off Duty - Season 4"
              fill
              className="object-fit"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
