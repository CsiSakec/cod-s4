"use client"

import { useState } from "react"
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

const formSchema = z.object({
  isFromSakec: z.enum(["yes", "no"]),
  participantType: z.enum(["inter", "intra"]).optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  year: z.string().min(1, { message: "Please select your year." }),
  branch: z.string().min(1, { message: "Please select your branch." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  college: z.string().min(2, { message: "College name must be at least 2 characters." }),
  isCsiMember: z.enum(["yes", "no"]),
  paymentProof: z.any().optional(),
  csiProof: z.any().optional(),
  round: z.string().optional(),
})

export default function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [isFromSakec, setIsFromSakec] = useState<"yes" | "no" | null>(null)
  const [participantType, setParticipantType] = useState<"inter" | "intra" | null>(null)
  const [isCsiMember, setIsCsiMember] = useState<"yes" | "no" | null>(null)
  const [year, setYear] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFromSakec: undefined,
      participantType: undefined,
      name: "",
      year: "",
      branch: "",
      email: "",
      phone: "",
      college: "",
      isCsiMember: undefined,
      round: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success("Registration Successful! 🎉", {
      description: "Your registration has been submitted successfully.",
    })
    console.log(values)
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSakecChange = (value: "yes" | "no") => {
    setIsFromSakec(value)
    form.setValue("isFromSakec", value)

    if (value === "no") {
      setParticipantType("inter")
      form.setValue("participantType", "inter")
    } else {
      setParticipantType(null)
      form.setValue("participantType", undefined)
    }
  }

  const handleCsiMemberChange = (value: "yes" | "no") => {
    setIsCsiMember(value)
    form.setValue("isCsiMember", value)
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    form.setValue("year", value)
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${step >= stepNumber ? "text-primary" : "text-gray-300"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= stepNumber ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {stepNumber}
              </div>
              <span className="text-xs hidden md:block">
                {stepNumber === 1 && "College Info"}
                {stepNumber === 2 && "Personal Details"}
                {stepNumber === 3 && "Membership"}
                {stepNumber === 4 && "Round Selection"}
              </span>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">
                    College Information <School className="inline ml-1" />
                  </h2>
                  <p className="text-gray-500">Let's start with your college details</p>
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

                {isFromSakec === "yes" && (
                  <FormField
                    control={form.control}
                    name="participantType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Participant Type 🏆</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value: "inter" | "intra") => {
                              setParticipantType(value as "inter" | "intra")
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="inter" />
                              </FormControl>
                              <FormLabel className="font-normal">Inter-College Participant</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="intra" />
                              </FormControl>
                              <FormLabel className="font-normal">Intra-College Participant</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      !form.getValues().isFromSakec || (isFromSakec === "yes" && !form.getValues().participantType)
                    }
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Personal Details <User className="inline ml-1" />
                  </h2>
                  <p className="text-gray-500">Tell us about yourself</p>
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
                            // defaultValue={isFromSakec === "yes" ? "Shah & Anchor Kutchhi Engineering College" : ""}
                            // readOnly={isFromSakec === "yes"}
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
                            <SelectItem value="FE">First Year (FE)</SelectItem>
                            <SelectItem value="SE">Second Year (SE)</SelectItem>
                            <SelectItem value="TE">Third Year (TE)</SelectItem>
                            <SelectItem value="BE">Final Year (BE)</SelectItem>
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
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      !form.getValues().name ||
                      !form.getValues().email ||
                      !form.getValues().phone ||
                      !form.getValues().college ||
                      !form.getValues().year ||
                      !form.getValues().branch
                    }
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Membership & Payment <CreditCard className="inline ml-1" />
                  </h2>
                  <p className="text-gray-500">Provide your membership details and payment proof</p>
                </div>

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

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <h3 className="font-semibold flex items-center text-blue-800 mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" /> Payment Information
                  </h3>
                  <p className="text-blue-700 mb-4">Please scan the QR code below to make your payment:</p>
                  <div className="flex justify-center mb-4">
                    <img
                      src="/placeholder.svg?height=200&width=200"
                      alt="Payment QR Code"
                      className="border-2 border-blue-300 rounded-lg"
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> After payment, please take a screenshot of the payment confirmation to upload
                    below.
                  </p>
                </div>

                <div className="space-y-6">
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
                          />
                        </FormControl>
                        <FormDescription>Upload a screenshot or PDF of your payment confirmation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isCsiMember === "yes" && (
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
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      !form.getValues().isCsiMember ||
                      !form.getValues().paymentProof ||
                      (isCsiMember === "yes" && !form.getValues().csiProof)
                    }
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Round Selection 🎯</h2>
                  <p className="text-gray-500">Select your preferred round</p>
                </div>

                {participantType === "intra" ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                    <div className="flex items-center text-green-800 mb-2">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold">Intra-College Participation</h3>
                    </div>
                    <p className="text-green-700">
                      For intra-college participants, there is only one round available. You are automatically
                      registered for this round.
                    </p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="round"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Round 🔄</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred round" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(year === "FE" || year === "SE") && <SelectItem value="round1">Round 1</SelectItem>}
                            <SelectItem value="round2">Round 2</SelectItem>
                            <SelectItem value="round3">Round 3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {year === "FE" || year === "SE"
                            ? "First and Second year students can choose from rounds 1, 2, or 3"
                            : "Third and Final year students can choose from rounds 2 or 3 only"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={participantType === "inter" && !form.getValues().round}>
                    Submit Registration 🚀
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <Toaster />
    </Card>
  )
}

