"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  AlertCircle,
  School,
  User,
  CreditCard,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { database } from "@/firebaseConfig";
import { ref, set } from "firebase/database";
import imageCompression from "browser-image-compression";

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[rgba(18,18,30,0.95)] border-[rgba(124,92,252,0.3)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <span className="text-white">Registration Successful!</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-[rgba(190,190,220,0.8)]">
            Thank you for registering! Your registration has been submitted
            successfully.
          </p>
          <p className="text-sm text-[rgba(190,190,220,0.7)]">
            You will receive a confirmation email shortly.
          </p>
          <a
            href="https://chat.whatsapp.com/JNRLhoXG5XF7lHCfKbIG41?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700 mb-2">
              Join WhatsApp Group
            </Button>
          </a>
          <Button
            onClick={onClose}
            className="w-full bg-[rgba(124,92,252,0.8)] hover:bg-[rgba(124,92,252,1)]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ParticipantType {
  inter: "inter";
  intra: "intra";
}

interface EducationType {
  diploma: "diploma";
  bachelors: "bachelors";
}

interface FormValues {
  isFromSakec: "yes" | "no";
  educationType?: keyof EducationType;
  participantType?: Array<keyof ParticipantType>;
  name: string;
  year: string;
  branch: string;
  otherBranch?: string;
  email: string;
  phone: string;
  prn?: string;
  college: string;
  isCsiMember?: "yes" | "no";
  rounds?: string[];
  transactionID: string;
  paymentProof?: File;
  csiProof?: File;
}

const formSchema: z.ZodType<FormValues> = z.object({
  isFromSakec: z.enum(["yes", "no"]),
  educationType: z.enum(["diploma", "bachelors"]).optional(),
  participantType: z.array(z.enum(["inter", "intra"])).optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  year: z.string().min(1, { message: "Please select your year." }),
  branch: z.string().min(2, { message: "Branch is required" }),
  otherBranch: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digits" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "Please enter only numbers" }),
  prn: z
    .string()
    .optional()
    .refine(
      (val: string | undefined) => !val || /^[a-zA-Z0-9]{1,14}$/.test(val),
      {
        message: "PRN must be alphanumeric and up to 14 characters if provided",
      },
    ),
  college: z
    .string()
    .min(2, { message: "College name must be at least 2 characters." }),
  isCsiMember: z.enum(["yes", "no"]).optional(),
  rounds: z
    .array(z.string())
    .optional()
    .refine((rounds) => {
      return true;
    })
    .superRefine((rounds, ctx) => {
      const participantType = ctx.path[0] as unknown as string[];

      if (
        participantType &&
        participantType.length === 1 &&
        participantType.includes("intra")
      ) {
        return true;
      }

      if (participantType && participantType.includes("inter")) {
        if (!rounds || rounds.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please select at least one round for inter-college participation",
          });
          return false;
        }
      }

      return true;
    }),
  transactionID: z.string().min(2, { message: "Please enter it" }),
  paymentProof: z.any().optional(),
  csiProof: z.any().optional(),
});

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isFromSakec, setIsFromSakec] = useState<"yes" | "no" | null>(null);
  const [educationType, setEducationType] = useState<
    "diploma" | "bachelors" | null
  >(null);
  const [participantTypes, setParticipantTypes] = useState<string[]>([]);
  const [isCsiMember, setIsCsiMember] = useState<"yes" | "no" | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFromSakec: undefined,
      educationType: undefined,
      participantType: [],
      name: "",
      year: "",
      branch: "",
      otherBranch: "",
      email: "",
      phone: "",
      prn: "",
      college: "",
      isCsiMember: undefined,
      transactionID: "",
      rounds: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (!values.isFromSakec) {
        throw new Error("Please select if you are from SAKEC College");
      }

      if (!values.name || !values.email || !values.phone) {
        throw new Error("Personal details are required");
      }

      if (!values.paymentProof) {
        throw new Error("Payment proof is required");
      }

      if (isFromSakec === "yes" && isCsiMember === "yes" && !values.csiProof) {
        throw new Error("CSI membership proof is required");
      }

      let paymentBase64 = null;
      if (values.paymentProof) {
        const compressedPaymentProof = await compressImage(values.paymentProof);
        const paymentReader = new FileReader();
        paymentBase64 = await new Promise((resolve, reject) => {
          paymentReader.onload = () => resolve(paymentReader.result);
          paymentReader.onerror = reject;
          paymentReader.readAsDataURL(compressedPaymentProof);
        });
      }

      let csiBase64 = null;
      if (values.csiProof instanceof File) {
        const compressedCsiProof = await compressImage(values.csiProof);
        const csiReader = new FileReader();
        csiBase64 = await new Promise((resolve, reject) => {
          csiReader.onload = () => resolve(csiReader.result);
          csiReader.onerror = reject;
          csiReader.readAsDataURL(compressedCsiProof);
        });
      }

      const registrationId = Date.now().toString();
      const registrationData = {
        id: registrationId,
        personalInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          college: values.college,
          year: values.year,
          branch:
            values.branch === "OTHER" ? values.otherBranch : values.branch,
          prn: isFromSakec === "yes" ? values.prn : null,
          educationType: isFromSakec === "no" ? educationType : null,
        },
        participationDetails: {
          isFromSakec: values.isFromSakec,
          participantTypes,
          isCsiMember: isFromSakec === "yes" ? isCsiMember : null,
          selectedRounds,
          totalPrice,
          transactionID: values.transactionID,
        },
        documents: {
          paymentProof: paymentBase64,
          csiProof: csiBase64,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const registrationRef = ref(database, `registrations/${registrationId}`);
      await set(registrationRef, registrationData);

      try {
        const emailData = {
          to: values.email,
          subject: "CSI-SAKEC COD5 Registration Confirmation",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h1 style="color: #1a73e8; text-align: center; margin-bottom: 20px;">Registration Successful!</h1>
    <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
      Dear ${values.name},
    </p>
    <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
      Thank you for registering for CSI-SAKEC CALL OF DUTY - SEASON 5! Your registration has been successfully received.
    </p>
    
    <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h2 style="color: #1a73e8; font-size: 18px; margin-bottom: 15px;">Registration Details:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 10px;"><strong>Registration ID:</strong> ${registrationId}</li>
        <li style="margin-bottom: 10px;"><strong>Name:</strong> ${
          values.name
        }</li>
        <li style="margin-bottom: 10px;"><strong>Email:</strong> ${
          values.email
        }</li>
        <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${
          values.phone
        }</li>
        <li style="margin-bottom: 10px;"><strong>College:</strong> ${
          values.college
        }</li>
        <li style="margin-bottom: 10px;"><strong>Year:</strong> ${
          values.year
        }</li>
        <li style="margin-bottom: 10px;"><strong>Branch:</strong> ${
          values.branch
        }</li>
        <li style="margin-bottom: 10px;"><strong>Total Amount Paid:</strong> ₹${totalPrice}</li>
        <li style="margin-bottom: 10px;"><strong>Transaction ID:</strong> ${
          values.transactionID
        }</li>
      </ul>
    </div>

    <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #1a73e8; font-size: 16px; margin-bottom: 10px;">Selected Rounds:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${selectedRounds.map((round) => `<li>${round}</li>`).join("")}
      </ul>
    </div>

    ${
      values.participantType?.includes("intra")
        ? `
    <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #155724; font-size: 16px; margin-bottom: 10px;">Intra-College Participation</h3>
      <p style="font-size: 14px; color: #155724;">You have  registered as an <strong>Intra-College</strong> participant.</p>
    </div>`
        : ""
    }

    <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #1a73e8; font-size: 16px; margin-bottom: 10px;">Join the WhatsApp Group:</h3>
      <p style="font-size: 14px; margin-bottom: 10px;">Stay updated with event details and announcements:</p>
      <p style="text-align: center;">
        <a href="https://chat.whatsapp.com/JNRLhoXG5XF7lHCfKbIG41?mode=gi_t" target="_blank" 
           style="display: inline-block; padding: 10px 15px; background-color: #25d366; 
                  color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Join WhatsApp Group
        </a>
      </p>
    </div>

    <p style="font-size: 14px; color: #5f6368; margin-top: 20px;">
      <strong>Note:</strong> Please keep this email for future reference. You'll receive further instructions
      and updates about the event on this email address.
    </p>

    <div style="margin-top: 30px; text-align: center; color: #5f6368; font-size: 14px;">
      <p>Best regards,<br>CSI-SAKEC Team</p>
    </div>
  </div>
</div>
          `,
        };

        await fetch("/api/registeremail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });

        toast.success(
          "Registration successful! Check your email for confirmation.",
        );
        setShowSuccessModal(true);
        form.reset();
        setStep(1);

        setParticipantTypes([]);
        setSelectedRounds([]);
        setIsFromSakec(null);
        setEducationType(null);
        setIsCsiMember(null);
        setYear(null);
        setTotalPrice(0);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        toast.error(
          "Registration successful but failed to send confirmation email.",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    setIsLoading(true);
    try {
      if (step === 1) {
        if (!isFromSakec) {
          toast.error("Please select if you are from SAKEC College");
          return;
        }

        if (isFromSakec === "no" && !educationType) {
          toast.error("Please select your education type");
          return;
        }

        if (isFromSakec === "yes" && participantTypes.length === 0) {
          toast.error("Please select at least one participant type");
          return;
        }
      }

      if (step === 2) {
        const requiredFields = [
          "name",
          "email",
          "phone",
          "college",
          "year",
          "branch",
        ];
        const missingFields = requiredFields.filter(
          (field) => !form.getValues(field as keyof z.infer<typeof formSchema>),
        );

        if (missingFields.length > 0) {
          toast.error(
            `Please fill in all required fields: ${missingFields.join(", ")}`,
          );
          return;
        }
        const phone = form.getValues("phone");
        if (!/^\d{10}$/.test(phone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return;
        }
      }

      if (step === 3) {
        if (isFromSakec === "yes" && !isCsiMember) {
          toast.error("Please indicate if you are a CSI SAKEC member");
          return;
        }

        if (
          participantTypes.includes("inter") &&
          !(
            isFromSakec === "yes" &&
            participantTypes.length === 1 &&
            participantTypes.includes("intra")
          ) &&
          selectedRounds.length === 0
        ) {
          toast.error(
            "Please select at least one round for inter-college participation",
          );
          return;
        }
      }

      if (step === 4) {
        if (!form.getValues().paymentProof) {
          toast.error("Please upload payment proof");
          return;
        }

        if (
          isFromSakec === "yes" &&
          isCsiMember === "yes" &&
          !form.getValues().csiProof
        ) {
          toast.error("Please upload CSI membership proof");
          return;
        }
      }

      setStep(step + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSakecChange = (value: "yes" | "no") => {
    setIsFromSakec(value);
    form.setValue("isFromSakec", value);

    if (value === "no") {
      setParticipantTypes(["inter"]);
      form.setValue("participantType", ["inter"]);
      setIsCsiMember(null);
      form.setValue("isCsiMember", undefined);
    } else {
      setParticipantTypes([]);
      form.setValue("participantType", []);
      setEducationType(null);
      form.setValue("educationType", undefined);
    }
  };

  const handleEducationTypeChange = (value: "diploma" | "bachelors") => {
    setEducationType(value);
    form.setValue("educationType", value);
    setSelectedRounds([]);
    form.setValue("rounds", []);
  };

  const handleParticipantTypeChange = (type: string) => {
    setParticipantTypes((prev) => {
      const isSelected = prev.includes(type);
      let updated: string[];

      if (isSelected) {
        updated = prev.filter((t) => t !== type);
      } else {
        updated = [...prev, type];
      }

      form.setValue("participantType", updated as ["inter", "intra"]);
      return updated;
    });
  };

  const handleCsiMemberChange = (value: "yes" | "no") => {
    setIsCsiMember(value);
    form.setValue("isCsiMember", value);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    form.setValue("year", value);
    setSelectedRounds([]);
    form.setValue("rounds", []);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    const isCSI = isCsiMember === "yes";

    selectedRounds.forEach(() => {
      if (participantTypes.includes("inter")) {
        if (isFromSakec === "yes") {
          total += isCSI ? 50 : 100;
        } else {
          total += 150;
        }
      }

      if (participantTypes.includes("intra")) {
        total += isCSI ? 50 : 100;
      }
    });

    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [
    participantTypes,
    isCsiMember,
    selectedRounds,
    isFromSakec,
    calculateTotalPrice,
  ]);

  const handleRoundSelection = (round: string) => {
    setSelectedRounds((prev) => {
      const isSelected = prev.includes(round);

      if (isSelected) {
        const updated = prev.filter((r) => r !== round);
        form.setValue("rounds", updated);
        return updated;
      } else {
        const updated = [...prev, round];
        form.setValue("rounds", updated);
        return updated;
      }
    });
  };

  const getAvailableRounds = () => {
    const isJunior =
      year === "FE" ||
      year === "SE" ||
      year === "FY" ||
      year === "SY" ||
      educationType === "diploma";

    if (isJunior) {
      return ["Rookie(round1)", "Open(round2)"];
    }

    return ["Open(round2)"];
  };

  useEffect(() => {
    if (isFromSakec === "yes") {
      form.setValue("college", "Shah & Anchor Kutchhi Engineering College");
    } else if (isFromSakec === "no") {
      form.setValue("college", "");
    }
  }, [isFromSakec, form]);

  return (
    <div className="min-h-screen">
      <style>{`
        /* Custom styles for glass-morphism theme */
        .registration-card {
          background: linear-gradient(145deg, rgba(18,18,30,0.82), rgba(12,12,22,0.88));
          border: 1px solid rgba(124,92,252,0.2);
          backdrop-filter: blur(20px);
        }
        
        .step-active {
          background: linear-gradient(135deg, #7c5cfc, #a78bfa);
          color: white;
        }
        
        .step-inactive {
          background: rgba(30,30,45,0.6);
          color: rgba(167,139,250,0.6);
          border: 1px solid rgba(124,92,252,0.2);
        }
        
        .section-header {
          background: linear-gradient(135deg, #ffffff 30%, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .info-badge {
          background: rgba(124,92,252,0.12);
          border: 1px solid rgba(124,92,252,0.25);
          color: #a78bfa;
        }
        
        .price-card {
          background: linear-gradient(145deg, rgba(124,92,252,0.08), rgba(167,139,250,0.05));
          border: 1px solid rgba(124,92,252,0.25);
        }
      `}</style>

      <Card className="w-full shadow-2xl registration-card border-[rgba(124,92,252,0.2)] overflow-hidden">
        <CardContent className="p-6">
          {/* Step Progress Bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step >= stepNumber
                      ? "step-active shadow-lg shadow-purple-500/50"
                      : "step-inactive"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`text-xs hidden md:block ${
                    step >= stepNumber
                      ? "text-[rgba(220,220,240,0.9)]"
                      : "text-[rgba(167,139,250,0.6)]"
                  }`}
                >
                  {stepNumber === 1 && "College Info"}
                  {stepNumber === 2 && "Personal Details"}
                  {stepNumber === 3 && "Round Selection"}
                  {stepNumber === 4 && "Payment"}
                </span>
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold section-header mb-2">
                      College Information{" "}
                      <School className="inline ml-1 text-[#a78bfa]" />
                    </h2>
                    <p className="text-[rgba(190,190,220,0.7)]">
                      Let's start with your college details
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="isFromSakec"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[rgba(220,220,240,0.9)]">
                          Are you from SAKEC College? 🏫
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value: "yes" | "no") =>
                              handleSakecChange(value)
                            }
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="yes"
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                Yes, I am from SAKEC College
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="no"
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                No, I am from another college
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isFromSakec === "no" && (
                    <FormField
                      control={form.control}
                      name="educationType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Education Type 🎓
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value: "diploma" | "bachelors") =>
                                handleEducationTypeChange(value)
                              }
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="diploma"
                                    className="border-[rgba(124,92,252,0.4)]"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                  Diploma
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="bachelors"
                                    className="border-[rgba(124,92,252,0.4)]"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                  Bachelors
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {isFromSakec === "yes" && (
                    <FormField
                      control={form.control}
                      name="participantType"
                      render={() => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Participant Type 🏆
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="inter"
                                  checked={participantTypes.includes("inter")}
                                  onCheckedChange={() =>
                                    handleParticipantTypeChange("inter")
                                  }
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                                <label
                                  htmlFor="inter"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[rgba(190,190,220,0.8)]"
                                >
                                  Inter-College Participant
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="intra"
                                  checked={participantTypes.includes("intra")}
                                  onCheckedChange={() =>
                                    handleParticipantTypeChange("intra")
                                  }
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                                <label
                                  htmlFor="intra"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[rgba(190,190,220,0.8)]"
                                >
                                  Intra-College Participant
                                </label>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-[rgba(167,139,250,0.7)]">
                            You can select both options if you wish to
                            participate in both.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] hover:from-[#6b4ce0] hover:to-[#9570e8]"
                    >
                      {isLoading ? (
                        <span className="mr-2">Loading...</span>
                      ) : (
                        "Next Step"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold section-header mb-2">
                      Personal Details{" "}
                      <User className="inline ml-1 text-[#a78bfa]" />
                    </h2>
                    <p className="text-[rgba(190,190,220,0.7)]">
                      Tell us about yourself
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Full Name 👤
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Email Address 📧
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Phone Number 📱
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                              className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isFromSakec === "yes" && (
                      <FormField
                        control={form.control}
                        name="prn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(220,220,240,0.9)]">
                              PRN Number 🔢
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your PRN number"
                                {...field}
                                className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            College Name 🏫
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your college name"
                              {...field}
                              readOnly={isFromSakec === "yes"}
                              className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Year of Study 📚
                          </FormLabel>
                          <Select
                            onValueChange={(value) => handleYearChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white">
                                <SelectValue placeholder="Select your year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[rgba(18,18,30,0.95)] border-[rgba(124,92,252,0.3)] text-white">
                              {educationType === "diploma" ? (
                                <>
                                  <SelectItem value="FY">First Year</SelectItem>
                                  <SelectItem value="SY">
                                    Second Year
                                  </SelectItem>
                                  <SelectItem value="TY">Third Year</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="FE">
                                    First Year (FE)
                                  </SelectItem>
                                  <SelectItem value="SE">
                                    Second Year (SE)
                                  </SelectItem>
                                  <SelectItem value="TE">
                                    Third Year (TE)
                                  </SelectItem>
                                  <SelectItem value="BE">
                                    Final Year (BE)
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Branch 🔍
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white">
                                <SelectValue placeholder="Select your branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[rgba(18,18,30,0.95)] border-[rgba(124,92,252,0.3)] text-white">
                              <SelectItem value="COMPS">
                                Computer Engineering
                              </SelectItem>
                              <SelectItem value="IT">
                                Information Technology
                              </SelectItem>
                              <SelectItem value="EXTC">
                                Electronics & Telecommunication
                              </SelectItem>
                              <SelectItem value="ETRX">Electronics</SelectItem>
                              <SelectItem value="AI&DS">
                                AI & Data Science
                              </SelectItem>
                              <SelectItem value="AI&ML">
                                AI & Machine Learning
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("branch") === "OTHER" && (
                      <FormField
                        control={form.control}
                        name="otherBranch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(220,220,240,0.9)]">
                              Specify Branch 🔍
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your branch name"
                                {...field}
                                className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-[rgba(124,92,252,0.4)] text-[rgba(220,220,240,0.9)] hover:bg-[rgba(124,92,252,0.1)]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] hover:from-[#6b4ce0] hover:to-[#9570e8]"
                    >
                      {isLoading ? (
                        <span className="mr-2">Loading...</span>
                      ) : (
                        "Next Step"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold section-header mb-2">
                      Membership & Round Selection 🎯
                    </h2>
                    <p className="text-[rgba(190,190,220,0.7)]">
                      Select rounds and provide your membership details
                    </p>
                  </div>

                  {isFromSakec === "yes" && (
                    <FormField
                      control={form.control}
                      name="isCsiMember"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Are you a CSI SAKEC member? 🎖️
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value: "yes" | "no") =>
                                handleCsiMemberChange(value)
                              }
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="yes"
                                    className="border-[rgba(124,92,252,0.4)]"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                  Yes, I am a CSI SAKEC member
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="no"
                                    className="border-[rgba(124,92,252,0.4)]"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-[rgba(190,190,220,0.8)]">
                                  No, I am not a CSI SAKEC member
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {participantTypes.includes("intra") && (
                    <FormField
                      control={form.control}
                      name="rounds"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Select Intra-College Round(s) 🎯
                          </FormLabel>

                          <div className="space-y-3">
                            {getAvailableRounds().includes(
                              "Rookie(round1)",
                            ) && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={selectedRounds.includes(
                                    "Rookie(round1)",
                                  )}
                                  onCheckedChange={() =>
                                    handleRoundSelection("Rookie(round1)")
                                  }
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                                <label className="text-[rgba(190,190,220,0.8)]">
                                  Rookie (Round 1)
                                </label>
                              </div>
                            )}

                            {getAvailableRounds().includes("Open(round2)") && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={selectedRounds.includes(
                                    "Open(round2)",
                                  )}
                                  onCheckedChange={() =>
                                    handleRoundSelection("Open(round2)")
                                  }
                                  className="border-[rgba(124,92,252,0.4)]"
                                />
                                <label className="text-[rgba(190,190,220,0.8)]">
                                  Open (Round 2)
                                </label>
                              </div>
                            )}
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {participantTypes.includes("inter") &&
                    !(
                      isFromSakec === "yes" &&
                      participantTypes.length === 1 &&
                      participantTypes.includes("intra")
                    ) && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="rounds"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-[rgba(220,220,240,0.9)]">
                                Select Inter-College Round(s) 🔄
                              </FormLabel>
                              <div className="space-y-3">
                                {getAvailableRounds().includes(
                                  "Rookie(round1)",
                                ) && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="round1"
                                      checked={selectedRounds.includes(
                                        "Rookie(round1)",
                                      )}
                                      onCheckedChange={() =>
                                        handleRoundSelection("Rookie(round1)")
                                      }
                                      className="border-[rgba(124,92,252,0.4)]"
                                    />
                                    <label
                                      htmlFor="round1"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[rgba(190,190,220,0.8)]"
                                    >
                                      Rookie (Round 1)
                                    </label>
                                  </div>
                                )}
                                {getAvailableRounds().includes(
                                  "Open(round2)",
                                ) && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="round2"
                                      checked={selectedRounds.includes(
                                        "Open(round2)",
                                      )}
                                      onCheckedChange={() =>
                                        handleRoundSelection("Open(round2)")
                                      }
                                      className="border-[rgba(124,92,252,0.4)]"
                                    />
                                    <label
                                      htmlFor="round2"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[rgba(190,190,220,0.8)]"
                                    >
                                      Open (Round 2)
                                    </label>
                                  </div>
                                )}
                              </div>
                              <FormDescription className="text-[rgba(167,139,250,0.7)]">
                                {isFromSakec === "yes"
                                  ? year === "FE" || year === "SE"
                                    ? "First and Second year students can choose any of the rounds"
                                    : "Third and Final year students can choose from rounds 2 or 3 only"
                                  : educationType === "bachelors" &&
                                      (year === "TE" || year === "BE")
                                    ? "Third and Final year bachelor's students can choose from rounds 2 or 4 only"
                                    : "You can choose from the available rounds"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="mt-4 p-4 price-card rounded-lg">
                          <h3 className="font-semibold text-[#a78bfa] mb-2">
                            Inter-College Price Calculation
                          </h3>
                          <p className="text-[rgba(190,190,220,0.8)] mb-2">
                            <span className="font-medium">
                              Price per round:
                            </span>{" "}
                            ₹
                            {isFromSakec === "yes"
                              ? "100"
                              : isCsiMember
                                ? "50"
                                : "150"}
                            <span className="text-sm ml-2 text-[rgba(167,139,250,0.7)]">
                              {isFromSakec === "yes"
                                ? "(Fixed Price for SAKEC students)"
                                : isCsiMember
                                  ? "(CSI Member Price)"
                                  : "(Standard Price)"}
                            </span>
                          </p>
                          <p className="text-[rgba(190,190,220,0.8)] mb-2">
                            <span className="font-medium">
                              Selected rounds:
                            </span>{" "}
                            {selectedRounds.length}
                          </p>
                        </div>
                      </div>
                    )}

                  {(participantTypes.includes("inter") ||
                    participantTypes.includes("intra")) && (
                    <div className="mt-4 p-4 price-card rounded-lg border-2 border-[rgba(124,92,252,0.4)]">
                      <h3 className="font-semibold text-[#a78bfa] mb-2">
                        Total Registration Cost
                      </h3>
                      <p className="text-2xl font-bold text-white">
                        Total Amount: ₹{totalPrice}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-[rgba(124,92,252,0.4)] text-[rgba(220,220,240,0.9)] hover:bg-[rgba(124,92,252,0.1)]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] hover:from-[#6b4ce0] hover:to-[#9570e8]"
                    >
                      {isLoading ? (
                        <span className="mr-2">Loading...</span>
                      ) : (
                        "Next Step"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold section-header mb-2">
                      Payment Details{" "}
                      <CreditCard className="inline ml-1 text-[#a78bfa]" />
                    </h2>
                    <p className="text-[rgba(190,190,220,0.7)]">
                      Make payment and upload proof
                    </p>
                  </div>

                  <div className="price-card p-4 rounded-lg mb-6">
                    <h3 className="font-semibold flex items-center text-[#a78bfa] mb-2">
                      <AlertCircle className="w-5 h-5 mr-2" /> Payment
                      Information
                    </h3>

                    <div className="p-4 bg-[rgba(30,30,45,0.6)] rounded-lg border border-[rgba(124,92,252,0.25)] mb-4">
                      <h4 className="font-semibold text-[#a78bfa] mb-2">
                        Amount to Pay
                      </h4>
                      <p className="text-2xl font-bold text-white">
                        ₹{totalPrice}
                      </p>
                      <p className="text-sm text-[rgba(190,190,220,0.7)] mt-2">
                        <strong>Note:</strong> Please include your name and
                        email in the payment reference.
                      </p>
                    </div>

                    <div className="p-4 bg-[rgba(30,30,45,0.6)] rounded-lg border border-[rgba(124,92,252,0.25)] mb-4">
                      <h4 className="font-semibold text-[#a78bfa] mb-2">
                        Bank Transfer Details
                      </h4>
                      <p className="text-[rgba(190,190,220,0.8)] mb-1">
                        <span className="font-medium">Account Name:</span> CSI
                        SAKE
                      </p>
                      <p className="text-[rgba(190,190,220,0.8)] mb-1">
                        <span className="font-medium">Account Number:</span>{" "}
                        8678101300391
                      </p>
                      <p className="text-[rgba(190,190,220,0.8)] mb-1">
                        <span className="font-medium">IFSC Code:</span>{" "}
                        CNRB0000105
                      </p>
                      <p className="text-[rgba(190,190,220,0.8)] mb-1">
                        <span className="font-medium">Bank:</span> Canara Bank
                      </p>
                      <p className="text-[rgba(190,190,220,0.8)]">
                        <span className="font-medium">Branch:</span> MUMBAI
                        CHEMBUR MAIN
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="transactionID"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Transaction ID 👤
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your Transaction ID"
                              {...field}
                              className="bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white placeholder:text-[rgba(167,139,250,0.5)]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentProof"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(220,220,240,0.9)]">
                            Upload Payment Proof 📄
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                if (!file.type.startsWith("image/")) {
                                  toast.error(
                                    "Please upload only image files (PNG, JPG, JPEG)",
                                  );
                                  e.target.value = "";
                                  return;
                                }

                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error(
                                    "File size should be less than 5MB",
                                  );
                                  e.target.value = "";
                                  return;
                                }

                                field.onChange(file);
                              }}
                              className="cursor-pointer bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white file:bg-[rgba(124,92,252,0.3)] file:text-white file:border-0 file:rounded-md"
                            />
                          </FormControl>
                          <FormDescription className="text-[rgba(167,139,250,0.7)]">
                            Upload a screenshot of your payment confirmation
                            (PNG, JPG only)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isFromSakec === "yes" && isCsiMember === "yes" && (
                      <FormField
                        control={form.control}
                        name="csiProof"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(220,220,240,0.9)]">
                              Upload CSI SAKEC Membership Proof 🆔
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  if (!file.type.startsWith("image/")) {
                                    toast.error(
                                      "Please upload only image files (PNG, JPG, JPEG)",
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error(
                                      "File size should be less than 5MB",
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  field.onChange(file);
                                }}
                                className="cursor-pointer bg-[rgba(30,30,45,0.5)] border-[rgba(124,92,252,0.3)] text-white file:bg-[rgba(124,92,252,0.3)] file:text-white file:border-0 file:rounded-md"
                              />
                            </FormControl>
                            <FormDescription className="text-[rgba(167,139,250,0.7)]">
                              Upload a screenshot of your CSI SAKEC membership
                              card (PNG, JPG only)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-[rgba(124,92,252,0.4)] text-[rgba(220,220,240,0.9)] hover:bg-[rgba(124,92,252,0.1)]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] hover:from-[#6b4ce0] hover:to-[#9570e8]"
                    >
                      {isLoading ? (
                        <span className="mr-2">Submitting...</span>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <SuccessModal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
        <Toaster />
      </Card>
    </div>
  );
}
