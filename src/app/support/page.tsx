import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Event Support</h1>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Need Help with Registration?
              </h2>

              <p className="text-lg text-muted-foreground mb-4">
                If you are facing any issues during registration, payment, or
                submission of details, don’t worry — we’re here to help you.
              </p>

              <p className="text-lg text-muted-foreground mb-6">
                Please join our official WhatsApp support group and share your
                issue along with your name and registered email ID. Our team
                will assist you as soon as possible.
              </p>

              {/* WhatsApp Button */}
              <a
                href="https://chat.whatsapp.com/JNRLhoXG5XF7lHCfKbIG41?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg">
                  Join WhatsApp Support Group
                </Button>
              </a>

              <p className="text-sm text-muted-foreground mt-4">
                ⏰ Support hours: 24/7
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Image
                src="/whatsapp-qr.png"
                alt="Join WhatsApp Group QR Code"
                width={260}
                height={260}
                className="rounded-lg border shadow-md"
              />
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Scan this QR code to join the WhatsApp support group
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
