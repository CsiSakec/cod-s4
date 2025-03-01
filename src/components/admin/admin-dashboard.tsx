"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { database } from "@/firebaseConfig"
import { ref, onValue, update, remove } from "firebase/database"
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
import { LogOut, FileDown, MoreVertical, Edit, Trash2, Eye, Search, X } from "lucide-react"

// Type definition for registration data
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
  }
  participationDetails: {
    isFromSakec: "yes" | "no"
    participantTypes: string[]
    isCsiMember: "yes" | "no"
    selectedRounds: string[]
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

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const registrationRef = ref(database, `registrations/${id}`)
      await update(registrationRef, { status })
      toast.success(`Status updated to ${status}`)
    } catch (error) {
      toast.error("Failed to update status")
      console.error("Error updating status:", error)
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

  const exportToCSV = () => {
    // Create CSV header
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Branch",
      "PRN",
      "SAKEC Student",
      "Participant Type",
      "CSI Member",
      "Selected Rounds",
      "Total Price",
      "Status",
      "Arrived",
      "Created At",
    ]

    // Create CSV rows
    const csvRows = filteredRegistrations.map((reg) => [
      reg.id,
      reg.personalInfo.name,
      reg.personalInfo.email,
      reg.personalInfo.phone,
      reg.personalInfo.college,
      reg.personalInfo.year,
      reg.personalInfo.branch,
      reg.personalInfo.prn || "N/A",
      reg.participationDetails.isFromSakec,
      reg.participationDetails.participantTypes.join(", "),
      reg.participationDetails.isCsiMember,
      reg.participationDetails.selectedRounds.join(", "),
      reg.participationDetails.totalPrice,
      reg.status,
      reg.arrived || "no",
      reg.createdAt,
    ])

    // Combine header and rows
    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    // Create a blob and download link
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

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registration Management</CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Total Registrations</span>
              <span className="text-2xl font-bold">{registrations.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Coders Arrived</span>
              <span className="text-2xl font-bold">{registrations.filter((reg) => reg.arrived === "yes").length}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToCSV}>
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
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
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
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

      {/* View Registration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Participation Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">SAKEC Student:</span>{" "}
                      {selectedRegistration.participationDetails.isFromSakec}
                    </p>
                    <p>
                      <span className="font-medium">Participant Type:</span>{" "}
                      {selectedRegistration.participationDetails.participantTypes.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">CSI Member:</span>{" "}
                      {selectedRegistration.participationDetails.isCsiMember}
                    </p>
                    <p>
                      <span className="font-medium">Selected Rounds:</span>{" "}
                      {selectedRegistration.participationDetails.selectedRounds.length > 0
                        ? selectedRegistration.participationDetails.selectedRounds.join(", ")
                        : "None"}
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

      {/* Edit Registration Dialog */}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedRegistration && <p>Transaction ID: {selectedRegistration.participationDetails.transactionID}</p>}
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="flex flex-col items-center justify-center max-h-[70vh] overflow-y-auto">
              <img
                src={selectedRegistration.documents.paymentProof || "/placeholder.svg"}
                alt="Payment Proof"
                className="w-full h-auto max-h-[500px] object-contain border rounded-md mt-7"
              />
              {selectedRegistration.participationDetails.isCsiMember === "yes" &&
                selectedRegistration.documents.csiProof && (
                  <div className="mt-4 w-full">
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
          <DialogFooter>
            <Button onClick={() => setIsProofDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

