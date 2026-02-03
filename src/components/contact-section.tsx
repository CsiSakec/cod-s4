"use client";

import type React from "react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const emailData = {
        subject: `Contact Form Submission from ${formData.name}`,
        text: `
          Name: ${formData.name}
          Email: ${formData.email}
          Message: ${formData.message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${formData.message.replace(/\n/g, "<br>")}
            </p>
          </div>
        `,
      };

      const response = await fetch("/api/contactEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .contact-input {
          background: rgba(30,30,45,0.5);
          border: 1px solid rgba(124,92,252,0.3);
          color: white;
          transition: all 0.3s ease;
        }

        .contact-input:focus {
          border-color: rgba(124,92,252,0.6);
          box-shadow: 0 0 0 3px rgba(124,92,252,0.1);
          outline: none;
        }

        .contact-input::placeholder {
          color: rgba(167,139,250,0.5);
        }

        .map-container {
          border: 1px solid rgba(124,92,252,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
      `}</style>

      <section
        id="contact"
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0a0a14 0%, #0e0e1a 50%, #0a0a14 100%)",
        }}
      >
        {/* Background effects */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient glows */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,60,180,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4"
              style={{
                background: "rgba(124,92,252,0.12)",
                border: "1px solid rgba(124,92,252,0.25)",
                color: "#a78bfa",
              }}
            >
              <span>📞</span> Get in Touch
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Contact Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div
                className="rounded-2xl p-8"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(18,18,30,0.82), rgba(12,12,22,0.88))",
                  border: "1px solid rgba(124,92,252,0.2)",
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-[rgba(220,220,240,0.9)] font-medium"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[rgba(220,220,240,0.9)] font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[rgba(220,220,240,0.9)] font-medium"
                    >
                      Message or Issue
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your issue or message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-input resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold text-base py-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    disabled={isLoading}
                    style={{
                      background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                      boxShadow: "0 4px 20px rgba(124,92,252,0.3)",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Map */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div
                className="h-[520px] rounded-2xl overflow-hidden map-container p-4"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(18,18,30,0.82), rgba(12,12,22,0.88))",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #7c5cfc, #a78bfa, #7c5cfc, transparent)",
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div className="h-full rounded-lg overflow-hidden relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4267.317479943942!2d72.90900817563053!3d19.04851155283403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c5f39a7d77d1%3A0x9ebbdeaea9ec24ae!2sShah%20%26%20Anchor%20Kutchhi%20Engineering%20College!5e1!3m2!1sen!2sin!4v1740839930632!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </section>
    </>
  );
}
