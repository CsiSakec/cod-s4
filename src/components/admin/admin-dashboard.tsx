"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { database } from "@/firebaseConfig"
import { ref, onValue, update, remove, get } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { LogOut, FileDown, MoreVertical, Edit, Trash2, Eye, Search, X } from 'lucide-react'
import { cn } from "@/lib/utils"

// Update the Registration interface to match the new schema
interface Registration {
  id: string
  personalInfo: {
    name: string
    email: string
    phone: string
    college: string
    year: string
    branch: string
    prn: string | null
    educationType?: "diploma" | "bachelors" | null
  }
  participationDetails: {
    isFromSakec: "yes" | "no"
    participantTypes: string[]
    isCsiMember: "yes" | "no" | null
    selectedRounds?: string[]
    totalPrice: number
    transactionID: string
  }
  documents: {
    paymentProof: string
    csiProof: string | null
  }
  status: "pending" | "approved" | "rejected"
  arrived: "yes" | "no"
  createdAt: string
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false)
  const router = useRouter()
  const getParticipantTypeCounts = (registrations: Registration[]) => {
    return {
      rookie: registrations.filter(reg => 
        reg.participationDetails.participantTypes.includes("inter") && 
        reg.participationDetails.selectedRounds?.includes("Rookie(round1)")).length,
      intermediate: registrations.filter(reg => 
        reg.participationDetails.participantTypes.includes("inter") && 
        reg.participationDetails.selectedRounds?.includes("Advanced(round2)")).length,
      open: registrations.filter(reg => 
        reg.participationDetails.participantTypes.includes("inter") && 
        reg.participationDetails.selectedRounds?.includes("Open(round3)")).length,
      intra: registrations.filter(reg => 
        reg.participationDetails.participantTypes.includes("intra")).length
    }
  }
  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/admin")
    } else {
      // Fetch registrations from Firebase
      fetchRegistrations()
    }
  }, [router])

  // Update the fetchRegistrations function to handle the new structure
  const fetchRegistrations = () => {
    setIsLoading(true)
    const registrationsRef = ref(database, "registrations")

    onValue(registrationsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const registrationsList = Object.values(data) as Registration[]
        setRegistrations(registrationsList)
        setFilteredRegistrations(registrationsList)
      } else {
        setRegistrations([])
        setFilteredRegistrations([])
      }
      setIsLoading(false)
    })
  }

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRegistrations(registrations)
    } else {
      const filtered = registrations.filter(
        (reg) =>
          reg.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.personalInfo.phone.includes(searchTerm) ||
          (reg.personalInfo.prn && reg.personalInfo.prn.includes(searchTerm)),
      )
      setFilteredRegistrations(filtered)
    }
  }, [searchTerm, registrations])

  // Update the handleStatusChange function to include the new email template
  const handleStatusChange = async (participantId: string, newStatus: string) => {
    try {
      const participantRef = ref(database, `registrations/${participantId}`)
      await update(participantRef, { status: newStatus })

      // Get participant data
      const participantSnapshot = await get(participantRef)
      const participant = participantSnapshot.val()

      if (newStatus === "pending") {
        toast.success(`Status updated to ${newStatus}`)
        return // Exit early without sending an email
      }

      // Prepare email data based on status
      const emailData = {
        to: participant.personalInfo.email,
        subject: `CSI-COD Registration ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        html:
          newStatus === "approved"
            ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: #28a745; text-align: center; margin-bottom: 20px;">Registration Approved!</h1>
              <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
                Dear ${participant.personalInfo.name},
              </p>
              <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
                Congratulations! Your registration for CSI-SAKEC CALL OF DUTY - SEASON 4 has been approved.
              </p>
              <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #28a745; font-size: 16px; margin-bottom: 10px;">Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Join our Whatsapp group for further updates</li>
                  <li>Check your email regularly for event details</li>
                  <li>Get ready for the competition!</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #5f6368; margin-top: 20px;">
                If you have any questions, feel free to reach out to us.
              </p>
            </div>
          </div>
        `
            : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: #dc3545; text-align: center; margin-bottom: 20px;">Registration Status Update</h1>
              <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
                Dear ${participant.personalInfo.name},
              </p>
              <p style="font-size: 16px; color: #202124; margin-bottom: 15px;">
                We regret to inform you that your registration for CSI-SAKEC CALL OF DUTY - SEASON 4 has been rejected.
              </p>
              <div style="background-color: #fdf3f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #dc3545;">
                  This might be due to:
                  <ul>
                    <li>Incomplete registration details</li>
                    <li>Invalid payment proof</li>
                    <li>Duplicate registration</li>
                  </ul>
                </p>
              </div>
              <p style="font-size: 14px; color: #5f6368; margin-top: 20px;">
                For any queries, please contact our support team.
              </p>
            </div>
          </div>
        `,
      }

      // Send status email
      const response = await fetch("/api/registeremail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        throw new Error("Failed to send status email")
      }

      toast.success(`Status updated to ${newStatus} and email sent`)
    } catch (error) {
      console.error("Status update error:", error)
      toast.error("Failed to update status or send email")
    }
  }

  const handleArrivedChange = async (id: string, arrived: string) => {
    try {
      const registrationRef = ref(database, `registrations/${id}`)
      await update(registrationRef, { arrived })
      toast.success(`Arrival status updated to ${arrived}`)
    } catch (error) {
      toast.error("Failed to update arrival status")
      console.error("Error updating arrival status:", error)
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    try {
      const registrationRef = ref(database, `registrations/${id}`)
      await remove(registrationRef)
      toast.success("Registration deleted successfully")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Failed to delete registration")
      console.error("Error deleting registration:", error)
    }
  }

  const handleEditRegistration = async () => {
    if (!selectedRegistration) return

    try {
      const registrationRef = ref(database, `registrations/${selectedRegistration.id}`)
      await update(registrationRef, selectedRegistration)
      toast.success("Registration updated successfully")
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error("Failed to update registration")
      console.error("Error updating registration:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin")
  }

  // Update the exportToCSV function to include new fields
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Branch",
      "PRN",
      "Education Type",
      "SAKEC Student",
      "Participant Type",
      "CSI Member",
      "Selected Rounds",
      "Total Price",
      "Status",
      "Arrived",
      "Created At",
    ]

    const csvRows = filteredRegistrations.map((reg) => [
      reg.id,
      reg.personalInfo.name,
      reg.personalInfo.email,
      reg.personalInfo.phone,
      reg.personalInfo.college,
      reg.personalInfo.year,
      reg.personalInfo.branch,
      reg.personalInfo.prn || "N/A",
      reg.personalInfo.educationType || "N/A",
      reg.participationDetails.isFromSakec,
      reg.participationDetails.participantTypes.join(", "),
      reg.participationDetails.isCsiMember || "N/A",
      reg.participationDetails.selectedRounds?.join(", "),
      reg.participationDetails.totalPrice,
      reg.status,
      reg.arrived || "no",
      reg.createdAt,
    ])

    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `registrations_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update the render method to include new fields in the table and dialogs
  return (
    <div className="container mx-auto py-6">
      <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
  <CardTitle>Registration Management</CardTitle>
  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
    {/* Registration Type Stats */}
    <div className="flex justify-between sm:flex-col sm:items-center">
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Rookie</span>
          <span className="text-2xl font-bold text-blue-600">
            {getParticipantTypeCounts(registrations).rookie}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Intermediate</span>
          <span className="text-2xl font-bold text-purple-600">
            {getParticipantTypeCounts(registrations).intermediate}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Open</span>
          <span className="text-2xl font-bold text-orange-600">
            {getParticipantTypeCounts(registrations).open}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Intra</span>
          <span className="text-2xl font-bold text-green-600">
            {getParticipantTypeCounts(registrations).intra}
          </span>
        </div>
      </div>
    </div>

    {/* Existing Status Stats */}
    <div className="flex justify-between sm:flex-col sm:items-center">
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold">{registrations.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Approved</span>
          <span className="text-2xl font-bold text-green-600">
            {registrations.filter((reg) => reg.status === "approved").length}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Rejected</span>
          <span className="text-2xl font-bold text-red-600">
            {registrations.filter((reg) => reg.status === "rejected").length}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Arrived</span>
          <span className="text-2xl font-bold">
            {registrations.filter((reg) => reg.arrived === "yes").length}
          </span>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex space-x-2">
      <Button variant="outline" onClick={exportToCSV} className="flex-1 sm:flex-none">
        <FileDown className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="destructive" onClick={handleLogout} className="flex-1 sm:flex-none">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  </div>
</CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone or PRN..."
                className="pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No registrations found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>PRN</TableHead>
                    <TableHead>Participant Type</TableHead>
                    <TableHead>Selected Rounds</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arrived</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.personalInfo.name}</TableCell>
                      <TableCell>{registration.personalInfo.email}</TableCell>
                      <TableCell>{registration.personalInfo.phone}</TableCell>
                      <TableCell>{registration.personalInfo.year}</TableCell>
                      <TableCell>{registration.personalInfo.prn || "N/A"}</TableCell>
                      <TableCell>{registration.participationDetails.participantTypes.join(", ")}</TableCell>
                      <TableCell>
                        {registration.participationDetails.selectedRounds && registration.participationDetails.selectedRounds.length > 0
                          ? registration.participationDetails.selectedRounds.join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{registration.participationDetails.transactionID}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRegistration(registration)
                            setIsProofDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Proof
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={registration.status}
                          onValueChange={(value) => handleStatusChange(registration.id, value)}
                        >
                          <SelectTrigger
                            className={cn("w-[130px]", {
                              "text-green-600": registration.status === "approved",
                              "text-red-600": registration.status === "rejected",
                            })}
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved" className="text-green-600">
                              Approved
                            </SelectItem>
                            <SelectItem value="rejected" className="text-red-600">
                              Rejected
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={registration.arrived || "no"}
                          onValueChange={(value) => handleArrivedChange(registration.id, value)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Arrived" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRegistration(registration)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRegistration(registration)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRegistration(registration)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update View Registration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto mt-7">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {selectedRegistration.personalInfo.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedRegistration.personalInfo.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedRegistration.personalInfo.phone}
                    </p>
                    <p>
                      <span className="font-medium">College:</span> {selectedRegistration.personalInfo.college}
                    </p>
                    <p>
                      <span className="font-medium">Year:</span> {selectedRegistration.personalInfo.year}
                    </p>
                    <p>
                      <span className="font-medium">Branch:</span> {selectedRegistration.personalInfo.branch}
                    </p>
                    {selectedRegistration.personalInfo.prn && (
                      <p>
                        <span className="font-medium">PRN:</span> {selectedRegistration.personalInfo.prn}
                      </p>
                    )}
                    {selectedRegistration.personalInfo.educationType && (
                      <p>
                        <span className="font-medium">Education Type:</span>{" "}
                        {selectedRegistration.personalInfo.educationType}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Participation Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">SAKEC Student:</span>{" "}
                      {selectedRegistration.participationDetails.isFromSakec}
                    </p>
                    <p className="text-red-600">
                      <span className="font-medium">Participant Type:</span>{" "}
                      {selectedRegistration.participationDetails.participantTypes.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">CSI Member:</span>{" "}
                      {selectedRegistration.participationDetails.isCsiMember || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Selected Rounds:</span>{" "}
                      {selectedRegistration?.participationDetails?.isFromSakec &&
  (Array.isArray(selectedRegistration.participationDetails.selectedRounds) &&
  selectedRegistration.participationDetails.selectedRounds.length > 0
    ? selectedRegistration.participationDetails.selectedRounds.join(", ")
    : "None")}



                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span> ₹
                      {selectedRegistration.participationDetails.totalPrice}
                    </p>
                    <p>
                      <span className="font-medium">Transaction ID: </span>{" "}
                      {selectedRegistration.participationDetails.transactionID}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {selectedRegistration.status}
                    </p>
                    <p>
                      <span className="font-medium">Arrived:</span> {selectedRegistration.arrived || "no"}
                    </p>
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {new Date(selectedRegistration.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Payment Proof</p>
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={selectedRegistration.documents.paymentProof || "/placeholder.svg"}
                        alt="Payment Proof"
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  </div>

                  {selectedRegistration.documents.csiProof && (
                    <div>
                      <p className="font-medium mb-2">CSI Membership Proof</p>
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={selectedRegistration.documents.csiProof || "/placeholder.svg"}
                          alt="CSI Membership Proof"
                          className="w-full h-auto max-h-[300px] object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Edit Registration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>Make changes to the registration details</DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedRegistration.personalInfo.name}
                  onChange={(e) =>
                    setSelectedRegistration({
                      ...selectedRegistration,
                      personalInfo: {
                        ...selectedRegistration.personalInfo,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedRegistration.personalInfo.email}
                  onChange={(e) =>
                    setSelectedRegistration({
                      ...selectedRegistration,
                      personalInfo: {
                        ...selectedRegistration.personalInfo,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedRegistration.personalInfo.phone}
                  onChange={(e) =>
                    setSelectedRegistration({
                      ...selectedRegistration,
                      personalInfo: {
                        ...selectedRegistration.personalInfo,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </div>
              {selectedRegistration.personalInfo.prn && (
                <div className="space-y-2">
                  <Label htmlFor="edit-prn">PRN</Label>
                  <Input
                    id="edit-prn"
                    value={selectedRegistration.personalInfo.prn || ""}
                    onChange={(e) =>
                      setSelectedRegistration({
                        ...selectedRegistration,
                        personalInfo: {
                          ...selectedRegistration.personalInfo,
                          prn: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              )}
              {selectedRegistration.personalInfo.educationType && (
                <div className="space-y-2">
                  <Label htmlFor="edit-education-type">Education Type</Label>
                  <Select
                    value={selectedRegistration.personalInfo.educationType}
                    onValueChange={(value: string) =>
                      setSelectedRegistration({
                        ...selectedRegistration,
                        personalInfo: {
                          ...selectedRegistration.personalInfo,
                          educationType: value as "diploma" | "bachelors" | null,
                        },
                      })
                    }
                  >
                    <SelectTrigger id="edit-education-type">
                      <SelectValue placeholder="Select education type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedRegistration.status}
                  onValueChange={(value: "pending" | "approved" | "rejected") =>
                    setSelectedRegistration({
                      ...selectedRegistration,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-arrived">Arrived</Label>
                <Select
                  value={selectedRegistration.arrived || "no"}
                  onValueChange={(value: "yes" | "no") =>
                    setSelectedRegistration({
                      ...selectedRegistration,
                      arrived: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-arrived">
                    <SelectValue placeholder="Select arrived status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRegistration}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRegistration && handleDeleteRegistration(selectedRegistration.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Document Dialog */}
      <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] mt-7 overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-50 pb-4 mb-4 border-b">
            <DialogTitle className="text-xl font-semibold">Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedRegistration && <p>Transaction ID: {selectedRegistration.participationDetails.transactionID}</p>}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedRegistration && (
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="w-full">
                  <img
                    src={selectedRegistration.documents.paymentProof || "/placeholder.svg"}
                    alt="Payment Proof"
                    className="w-full h-auto max-h-[500px] object-contain border rounded-md"
                  />
                </div>

                {selectedRegistration.participationDetails.isCsiMember === "yes" &&
                  selectedRegistration.documents.csiProof && (
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2">CSI Membership Proof</h3>
                      <img
                        src={selectedRegistration.documents.csiProof || "/placeholder.svg"}
                        alt="CSI Membership Proof"
                        className="w-full h-auto max-h-[500px] object-contain border rounded-md"
                      />
                    </div>
                  )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsProofDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
