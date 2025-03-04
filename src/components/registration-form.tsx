"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle, School, User, CreditCard } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { database } from "@/firebaseConfig"
import { ref, set } from "firebase/database"

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            Registration Successful!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for registering! Your registration has been submitted successfully.
          </p>
          <p className="text-sm text-muted-foreground">You will receive a confirmation email shortly.</p>
          <a
            href="https://chat.whatsapp.com/JVIRx7jbgVS8LWwEXZAjGK"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700 mb-2">Join WhatsApp Group</Button>
          </a>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Modified schema to include new fields for education type
interface ParticipantType {
  inter: 'inter'
  intra: 'intra'
}

interface EducationType {
  diploma: 'diploma'
  bachelors: 'bachelors'
}

interface FormValues {
  isFromSakec: 'yes' | 'no'
  educationType?: keyof EducationType
  participantType?: Array<keyof ParticipantType>
  name: string
  year: string
  branch: string
  otherBranch?: string
  email: string
  phone: string
  prn?: string
  college: string
  isCsiMember?: 'yes' | 'no'
  rounds?: string[]
  transactionID: string
  paymentProof?: File
  csiProof?: File
}

// Define interfaces for validation schema
interface ParticipantType {
  inter: 'inter'
  intra: 'intra'
}

interface EducationType {
  diploma: 'diploma'
  bachelors: 'bachelors'
}

interface FormValues {
  isFromSakec: 'yes' | 'no'
  educationType?: keyof EducationType
  participantType?: Array<keyof ParticipantType>
  name: string
  year: string
  branch: string
  otherBranch?: string
  email: string
  phone: string
  prn?: string
  college: string
  isCsiMember?: 'yes' | 'no'
  rounds?: string[]
  transactionID: string
  paymentProof?: File
  csiProof?: File
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
    .refine((val: string | undefined) => !val || /^[a-zA-Z0-9]{1,14}$/.test(val), {
      message: "PRN must be alphanumeric and up to 14 characters if provided",
    }),
  college: z.string().min(2, { message: "College name must be at least 2 characters." }),
  isCsiMember: z.enum(["yes", "no"]).optional(),
  rounds: z.array(z.string())
    .optional()
    .refine(
      (rounds) => {
        return true; // Initial validation always passes
      }
    )
    .superRefine((rounds, ctx) => {
      const participantType = ctx.path[0] as unknown as string[];

      if (participantType && participantType.length === 1 && participantType.includes("intra")) {
        return true;
      }

      if (participantType && participantType.includes("inter")) {
        if (!rounds || rounds.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select at least one round for inter-college participation",
          });
          return false;
        }
      }

      return true;
    }),
  transactionID: z.string().min(2, { message: "Please enter it" }),
  paymentProof: z.any().optional(),
  csiProof: z.any().optional(),
})

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [isFromSakec, setIsFromSakec] = useState<"yes" | "no" | null>(null)
  const [educationType, setEducationType] = useState<"diploma" | "bachelors" | null>(null)
  const [participantTypes, setParticipantTypes] = useState<string[]>([])
  const [isCsiMember, setIsCsiMember] = useState<"yes" | "no" | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [selectedRounds, setSelectedRounds] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Basic validation
      if (!values.isFromSakec) {
        throw new Error("Please select if you are from SAKEC College")
      }

      if (!values.name || !values.email || !values.phone) {
        throw new Error("Personal details are required")
      }

      if (!values.paymentProof) {
        throw new Error("Payment proof is required")
      }

      if (isFromSakec === "yes" && isCsiMember === "yes" && !values.csiProof) {
        throw new Error("CSI membership proof is required")
      }

      // Handle payment proof file
      const paymentFile = values.paymentProof
      const paymentReader = new FileReader()

      const paymentBase64 = await new Promise((resolve, reject) => {
        paymentReader.onload = () => resolve(paymentReader.result)
        paymentReader.onerror = reject
        paymentReader.readAsDataURL(paymentFile)
      })

      // Handle CSI proof file if exists
      let csiBase64 = null
      if (values.csiProof instanceof File) {
        const csiReader = new FileReader()
        csiBase64 = await new Promise((resolve, reject) => {
          csiReader.onload = () => resolve(csiReader.result)
          csiReader.onerror = reject
          csiReader.readAsDataURL(values.csiProof as File)
        })
      }

      // Create registration data object
      const registrationId = Date.now().toString()
      const registrationData = {
        id: registrationId,
        personalInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          college: values.college,
          year: values.year,
          branch: values.branch === "OTHER" ? values.otherBranch : values.branch,
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
      }

      // Save to Firebase Realtime Database
      const registrationRef = ref(database, `registrations/${registrationId}`)
      await set(registrationRef, registrationData)

      // Send confirmation email
      try {
        const emailData = {
          to: values.email,
          subject: "CSI-SAKEC COD4 Registration Confirmation",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h1 style="color: #1a73e8; text-align: center; margin-bottom: 20px;">Registration Successful!</h1>
    <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
      Dear ${values.name},
    </p>
    <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
      Thank you for registering for CSI-SAKEC CALL OF DUTY - SEASON 4! Your registration has been successfully received.
    </p>
    
    <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h2 style="color: #1a73e8; font-size: 18px; margin-bottom: 15px;">Registration Details:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 10px;"><strong>Registration ID:</strong> ${registrationId}</li>
        <li style="margin-bottom: 10px;"><strong>Name:</strong> ${values.name}</li>
        <li style="margin-bottom: 10px;"><strong>Email:</strong> ${values.email}</li>
        <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${values.phone}</li>
        <li style="margin-bottom: 10px;"><strong>College:</strong> ${values.college}</li>
        <li style="margin-bottom: 10px;"><strong>Year:</strong> ${values.year}</li>
        <li style="margin-bottom: 10px;"><strong>Branch:</strong> ${values.branch}</li>
        <li style="margin-bottom: 10px;"><strong>Total Amount Paid:</strong> ₹${totalPrice}</li>
        <li style="margin-bottom: 10px;"><strong>Transaction ID:</strong> ${values.transactionID}</li>
      </ul>
    </div>

    <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #1a73e8; font-size: 16px; margin-bottom: 10px;">Selected Rounds:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${selectedRounds.map(round => `<li>${round}</li>`).join('')}
      </ul>
    </div>

    ${values.participantType?.includes("intra") ? `
    <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #155724; font-size: 16px; margin-bottom: 10px;">Intra-College Participation</h3>
      <p style="font-size: 14px; color: #155724;">You have  registered as an <strong>Intra-College</strong> participant.</p>
    </div>` : ''}

    <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #1a73e8; font-size: 16px; margin-bottom: 10px;">Join the WhatsApp Group:</h3>
      <p style="font-size: 14px; margin-bottom: 10px;">Stay updated with event details and announcements:</p>
      <p style="text-align: center;">
        <a href="https://chat.whatsapp.com/ISvgEsspRn27IiuUDNPtYH" target="_blank" 
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
        }

        await fetch("/api/registeremail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        })

        // Show success message and reset form
        toast.success("Registration successful! Check your email for confirmation.")
        setShowSuccessModal(true)
        form.reset()
        setStep(1)

        // Reset all state
        setParticipantTypes([])
        setSelectedRounds([])
        setIsFromSakec(null)
        setEducationType(null)
        setIsCsiMember(null)
        setYear(null)
        setTotalPrice(0)
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        toast.error("Registration successful but failed to send confirmation email.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = async () => {
    setIsLoading(true)
    try {
      // Handle form validation before proceeding to next step
      if (step === 1) {
        if (!isFromSakec) {
          toast.error("Please select if you are from SAKEC College")
          return
        }

        if (isFromSakec === "no" && !educationType) {
          toast.error("Please select your education type")
          return
        }

        if (isFromSakec === "yes" && participantTypes.length === 0) {
          toast.error("Please select at least one participant type")
          return
        }
      }

      if (step === 2) {
        const requiredFields = ["name", "email", "phone", "college", "year", "branch"]
        const missingFields = requiredFields.filter(
          (field) => !form.getValues(field as keyof z.infer<typeof formSchema>),
        )

        if (missingFields.length > 0) {
          toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`)
          return
        }
        const phone = form.getValues("phone")
        if (!/^\d{10}$/.test(phone)) {
          toast.error("Please enter a valid 10-digit phone number")
          return
        }
      }

      if (step === 3) {
        // Validate CSI membership selection for SAKEC students
        if (isFromSakec === "yes" && !isCsiMember) {
          toast.error("Please indicate if you are a CSI SAKEC member")
          return
        }

        // Only validate round selection if inter-college is selected AND it's not a SAKEC student with only intra selected
        if (
          participantTypes.includes("inter") &&
          !(isFromSakec === "yes" && participantTypes.length === 1 && participantTypes.includes("intra")) &&
          selectedRounds.length === 0
        ) {
          toast.error("Please select at least one round for inter-college participation")
          return
        }
      }

      if (step === 4) {
        if (!form.getValues().paymentProof) {
          toast.error("Please upload payment proof")
          return
        }

        if (isFromSakec === "yes" && isCsiMember === "yes" && !form.getValues().csiProof) {
          toast.error("Please upload CSI membership proof")
          return
        }
      }

      setStep(step + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSakecChange = (value: "yes" | "no") => {
    setIsFromSakec(value)
    form.setValue("isFromSakec", value)

    if (value === "no") {
      // For non-SAKEC, only inter-college is available
      setParticipantTypes(["inter"])
      form.setValue("participantType", ["inter"])
      setIsCsiMember(null) // Reset CSI member as it's not applicable
      form.setValue("isCsiMember", undefined)
    } else {
      // Reset for SAKEC students
      setParticipantTypes([])
      form.setValue("participantType", [])
      setEducationType(null) // Reset education type as it's not applicable
      form.setValue("educationType", undefined)
    }
  }

  const handleEducationTypeChange = (value: "diploma" | "bachelors") => {
    setEducationType(value)
    form.setValue("educationType", value)
    // Reset round selection when education type changes
    setSelectedRounds([])
    form.setValue("rounds", [])
  }

  const handleParticipantTypeChange = (type: string) => {
    setParticipantTypes((prev) => {
      const isSelected = prev.includes(type)
      let updated: string[]

      if (isSelected) {
        // Remove if already selected
        updated = prev.filter((t) => t !== type)
      } else {
        // Add if not selected
        updated = [...prev, type]
      }

      form.setValue("participantType", updated as ["inter", "intra"])
      return updated
    })
  }

  const handleCsiMemberChange = (value: "yes" | "no") => {
    setIsCsiMember(value)
    form.setValue("isCsiMember", value)
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    form.setValue("year", value)
    // Reset round selection when year changes
    setSelectedRounds([])
    form.setValue("rounds", [])
  }

  const calculateTotalPrice = () => {
    let totalCost = 0
    const isCSIMember = isCsiMember === "yes"

    // Calculate intra-college cost immediately when selected
    if (participantTypes.includes("intra")) {
      const intraPrice = isCSIMember ? 30 : 50
      totalCost += intraPrice
    }

    // Calculate inter-college cost only if rounds are selected
    if (participantTypes.includes("inter")) {
      if (selectedRounds.length > 0) {
        const pricePerRound = isFromSakec === "yes" && isCSIMember ? 100 : 150
        totalCost += selectedRounds.length * pricePerRound
      } else {
        // If inter is selected but no rounds are chosen, only show intra cost if applicable
        totalCost = participantTypes.includes("intra") ? totalCost : 0
      }
    }

    setTotalPrice(totalCost)
  }

  // Update useEffect to recalculate price when participant types change
  useEffect(() => {
    calculateTotalPrice()
  }, [participantTypes, isCsiMember, selectedRounds, isFromSakec, calculateTotalPrice]) //Corrected useEffect dependencies

  const handleRoundSelection = (round: string) => {
    setSelectedRounds((prev) => {
      const isSelected = prev.includes(round)

      if (isSelected) {
        // Remove the round if already selected
        const updated = prev.filter((r) => r !== round)
        form.setValue("rounds", updated)
        return updated
      } else {
        // Add the round if not selected
        const updated = [...prev, round]
        form.setValue("rounds", updated)
        return updated
      }
    })
  }

  // Update the getAvailableRounds function
  const getAvailableRounds = () => {
    if (isFromSakec === "yes") {
      // For SAKEC students, use updated round names
      return year === "FE" || year === "SE"
        ? ["Rookie(round1)", "Advanced(round2)", "Open(round3)"]
        : ["Advanced(round2)", "Open(round3)"]
    } else if (isFromSakec === "no") {
      if (educationType === "diploma") {
        // All diploma students can access all rounds
        return ["Rookie(round1)", "Advanced(round2)", "Open(round3)"]
      } else if (educationType === "bachelors") {
        // Bachelors year logic
        return year === "FE" || year === "SE"
          ? ["Rookie(round1)", "Advanced(round2)", "Open(round3)"]
          : ["Advanced(round2)", "Open(round3)"]
      }
    }
    return []
  }

  // Set default college name for SAKEC students
  useEffect(() => {
    if (isFromSakec === "yes") {
      form.setValue("college", "Shah & Anchor Kutchhi Engineering College")
    } else if (isFromSakec === "no") {
      form.setValue("college", "")
    }
  }, [isFromSakec, form])

  return (
    <div className={`min-h-screen`}>
      <div className="p-4 md:p-8 bg-background  min-h-screen">
        <Card className="w-full shadow-lg bg-card ">
          <CardContent className="p-6">
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex flex-col items-center ${step >= stepNumber ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-xs hidden md:block">
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
                      <h2 className="text-2xl font-bold text-foreground">
                        College Information <School className="inline ml-1" />
                      </h2>
                      <p className="text-muted-foreground">Let's start with your college details</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="isFromSakec"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Are you from SAKEC College? 🏫</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value: "yes" | "no") => handleSakecChange(value)}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes, I am from SAKEC College</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">No, I am from another college</FormLabel>
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
                            <FormLabel>Education Type 🎓</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value: "diploma" | "bachelors") => handleEducationTypeChange(value)}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="diploma" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Diploma</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="bachelors" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Bachelors</FormLabel>
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
                            <FormLabel>Participant Type 🏆</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="inter"
                                    checked={participantTypes.includes("inter")}
                                    onCheckedChange={() => handleParticipantTypeChange("inter")}
                                  />
                                  <label
                                    htmlFor="inter"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Inter-College Participant
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="intra"
                                    checked={participantTypes.includes("intra")}
                                    onCheckedChange={() => handleParticipantTypeChange("intra")}
                                  />
                                  <label
                                    htmlFor="intra"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Intra-College Participant
                                  </label>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              You can select both options if you wish to participate in both.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={nextStep} disabled={isLoading}>
                        {isLoading ? <span className="mr-2">Loading...</span> : "Next Step"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground">
                        Personal Details <User className="inline ml-1" />
                      </h2>
                      <p className="text-muted-foreground">Tell us about yourself</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name 👤</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
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
                            <FormLabel>Email Address 📧</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
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
                            <FormLabel>Phone Number 📱</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
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
                              <FormLabel>PRN Number 🔢</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your PRN number" {...field} />
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
                            <FormLabel>College Name 🏫</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your college name"
                                {...field}
                                readOnly={isFromSakec === "yes"}
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
                            <FormLabel>Year of Study 📚</FormLabel>
                            <Select onValueChange={(value) => handleYearChange(value)} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {educationType === "diploma" ? (
                                  // For diploma, show 3 years
                                  <>
                                    <SelectItem value="FY">First Year</SelectItem>
                                    <SelectItem value="SY">Second Year</SelectItem>
                                    <SelectItem value="TY">Third Year</SelectItem>
                                  </>
                                ) : (
                                  // For bachelors or SAKEC students, show 4 years
                                  <>
                                    <SelectItem value="FE">First Year (FE)</SelectItem>
                                    <SelectItem value="SE">Second Year (SE)</SelectItem>
                                    <SelectItem value="TE">Third Year (TE)</SelectItem>
                                    <SelectItem value="BE">Final Year (BE)</SelectItem>
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
                            <FormLabel>Branch 🔍</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="COMPS">Computer Engineering</SelectItem>
                                <SelectItem value="IT">Information Technology</SelectItem>
                                <SelectItem value="EXTC">Electronics & Telecommunication</SelectItem>
                                <SelectItem value="ETRX">Electronics</SelectItem>
                                <SelectItem value="AI&DS">AI & Data Science</SelectItem>
                                <SelectItem value="AI&ML">AI & Machine Learning</SelectItem>
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
                              <FormLabel>Specify Branch 🔍</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your branch name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Previous
                      </Button>
                      <Button type="button" onClick={nextStep} disabled={isLoading}>
                        {isLoading ? <span className="mr-2">Loading...</span> : "Next Step"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground">Membership & Round Selection 🎯</h2>
                      <p className="text-muted-foreground">Select rounds and provide your membership details</p>
                    </div>

                    {isFromSakec === "yes" && (
                      <FormField
                        control={form.control}
                        name="isCsiMember"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Are you a CSI SAKEC member? 🎖️</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value: "yes" | "no") => handleCsiMemberChange(value)}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Yes, I am a CSI SAKEC member</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal">No, I am not a CSI SAKEC member</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Show intra-college section if intra is selected */}
                    {participantTypes.includes("intra") && (
                      <div className="bg-green-50  p-4 rounded-lg border border-green-200  mb-6">
                        <div className="flex items-center text-green-800  mb-2">
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          <h3 className="font-semibold">Intra-College Participation</h3>
                        </div>
                        <p className="text-green-700 0">
                          For intra-college participants, there is only one round available. You are automatically
                          registered for this round.
                        </p>
                        <div className="mt-4 p-3 bg-white  rounded-md border border-green-200 ">
                          <p className="font-medium text-green-800 ">
                            Registration Fee: ₹{isCsiMember === "yes" ? "30" : "50"}
                          </p>
                          <p className="text-sm text-green-700 ">
                            {isCsiMember === "yes" ? "CSI Member Price" : "Non-CSI Member Price"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show inter-college section if inter is selected AND it's not a SAKEC student with only intra selected */}
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
                                <FormLabel>Select Inter-College Round(s) 🔄</FormLabel>
                                <div className="space-y-3">
                                  {getAvailableRounds().includes("Rookie(round1)") && (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="round1"
                                        checked={selectedRounds.includes("Rookie(round1)")}
                                        onCheckedChange={() => handleRoundSelection("Rookie(round1)")}
                                      />
                                      <label
                                        htmlFor="round1"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Rookie (Round 1)
                                      </label>
                                    </div>
                                  )}
                                  {getAvailableRounds().includes("Advanced(round2)") && (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="round2"
                                        checked={selectedRounds.includes("Advanced(round2)")}
                                        onCheckedChange={() => handleRoundSelection("Advanced(round2)")}
                                      />
                                      <label
                                        htmlFor="round2"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Advanced (Round 2)
                                      </label>
                                    </div>
                                  )}
                                  {getAvailableRounds().includes("Open(round3)") && (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="round3"
                                        checked={selectedRounds.includes("Open(round3)")}
                                        onCheckedChange={() => handleRoundSelection("Open(round3)")}
                                      />
                                      <label
                                        htmlFor="round3"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Open (Round 3)
                                      </label>
                                    </div>
                                  )}
                                </div>
                                <FormDescription>
                                  {isFromSakec === "yes"
                                    ? year === "FE" || year === "SE"
                                      ? "First and Second year students can choose any of the rounds"
                                      : "Third and Final year students can choose from rounds 2 or 3 only"
                                    : educationType === "bachelors" && (year === "TE" || year === "BE")
                                      ? "Third and Final year bachelor's students can choose from rounds 2 or 4 only"
                                      : "You can choose from the available rounds"}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="mt-4 p-4 bg-blue-50  rounded-md border border-blue-200 ">
                            <h3 className="font-semibold text-blue-800  mb-2">Inter-College Price Calculation</h3>
                            <p className="text-blue-700  mb-2">
                              <span className="font-medium">Price per round:</span> ₹
                              {isFromSakec === "yes" && isCsiMember === "yes" ? "100" : "150"}
                              <span className="text-sm ml-2">
                                {isFromSakec === "yes" && isCsiMember === "yes"
                                  ? "(CSI Member Price)"
                                  : "(Standard Price)"}
                              </span>
                            </p>
                            <p className="text-blue-700  mb-2">
                              <span className="font-medium">Selected rounds:</span> {selectedRounds.length}
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Show total price calculation if any participant type is selected */}
                    {(participantTypes.includes("inter") || participantTypes.includes("intra")) && (
                      <div className="mt-4 p-4 bg-purple-50  rounded-md border border-purple-200 ">
                        <h3 className="font-semibold text-purple-800  mb-2">Total Registration Cost</h3>
                        <p className="text-lg font-bold text-purple-800 ">Total Amount: ₹{totalPrice}</p>
                      </div>
                    )}

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Previous
                      </Button>
                      <Button type="button" onClick={nextStep} disabled={isLoading}>
                        {isLoading ? <span className="mr-2">Loading...</span> : "Next Step"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground">
                        Payment Details <CreditCard className="inline ml-1" />
                      </h2>
                      <p className="text-muted-foreground">Make payment and upload proof</p>
                    </div>

                    <div className="bg-blue-50  p-4 rounded-lg border border-blue-200  mb-6">
                      <h3 className="font-semibold flex items-center text-blue-800  mb-2">
                        <AlertCircle className="w-5 h-5 mr-2" /> Payment Information
                      </h3>

                      {/* Final amount display at the top */}
                      <div className="p-4 bg-white  rounded-lg border border-blue-200   mb-4">
                        <h4 className="font-semibold text-blue-800    mb-2">Amount to Pay</h4>
                        <p className="text-2xl font-bold text-blue-800   ">₹{totalPrice}</p>
                        <p className="text-sm text-blue-700     mt-2">
                          <strong>Note:</strong> Please include your name and email in the payment reference.
                        </p>
                      </div>

                      <div className="p-4 bg-white  rounded-lg border border-blue-200   mb-4">
                        <h4 className="font-semibold text-blue-800    mb-2">Bank Transfer Details</h4>
                        <p className="text-blue-700     mb-1">
                          <span className="font-medium">Account Name:</span> CSI SAKE
                        </p>
                        <p className="text-blue-700     mb-1">
                          <span className="font-medium">Account Number:</span> 8678101300391
                        </p>
                        <p className="text-blue-700     mb-1">
                          <span className="font-medium">IFSC Code:</span> CNRB0000105
                        </p>
                        <p className="text-blue-700     mb-1">
                          <span className="font-medium">Bank:</span> Canara Bank
                        </p>
                        <p className="text-blue-700    ">
                          <span className="font-medium">Branch:</span> MUMBAI CHEMBUR MAIN
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="transactionID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction ID 👤</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your Transaction ID" {...field} />
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
                            <FormLabel>Upload Payment Proof 📄</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                className="cursor-pointer"
                              />
                            </FormControl>
                            <FormDescription>Upload a screenshot or PDF of your payment confirmation</FormDescription>
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
                              <FormLabel>Upload CSI SAKEC Membership Proof 🆔</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                  className="cursor-pointer"
                                />
                              </FormControl>
                              <FormDescription>
                                Upload a screenshot or PDF of your CSI SAKEC membership card or receipt
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Previous
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <span className="mr-2">Submitting...</span> : "Submit Registration"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
          <Toaster />
        </Card>
      </div>
    </div>
  )
}

