import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/CSI-SAKEC-logo.png"
                alt="CSI-SAKEC"
                width={120}
                height={40}
                className="h-15 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm">
            Code off Duty: Season 4 – The ultimate coding showdown where logic, speed, and strategy reign supreme. Compete, conquer, and claim your victory!
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/csi.sakec" target='_blank' className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/showcase/csi-sakec" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-400 hover:text-white transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-gray-400 hover:text-white transition-colors">
                  Registration
                </Link>
              </li>
              <li>
                <Link href="/rulesandregulation" className="text-gray-400 hover:text-white transition-colors">
                  Rules & Regulations
                </Link>
              </li>
            </ul>
          </div>

          

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <Link href="https://maps.app.goo.gl/i3YC7kxjui9WhYgS6" target="_blank" className="text-gray-400">
                <span className="text-gray-400">Mahavir Education Trust Chowk, W.T Patil Marg, D P Rd, next to Duke's Company, Chembur, Mumbai, Maharashtra 400088</span>
                </Link>
              </li>
              
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-400" />
                <Link href="mailto:csi@sakec.ac.in" target="_blank" className="text-gray-400">
                <span className="text-gray-400">csi@sakec.ac.in</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} COD-S4. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

