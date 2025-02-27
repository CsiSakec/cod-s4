"use client"

import type React from "react"

import { useState } from "react"
import { Toaster, toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileDown, MoreVertical, Edit, Trash2, Eye, LogOut, Moon } from "lucide-react"

// Mock data - replace with your actual data fetching logic
const mockData: Participant[] = [
  {
    id: 1,
    year: "FE",
    name: "John Doe",
    email: "john@example.com",
    round: "Round 1",
    type: "Inter",
    paymentScreenshot: "/placeholder.svg?height=400&width=300",
    phoneNo: "1234567890",
    status: "pending",
  },
  // Add more mock data as needed
]

type Participant = {
  id: number
  year: string
  name: string
  email: string
  round: string
  type: string
  paymentScreenshot: string
  phoneNo: string
  status: "pending" | "approved" | "rejected"
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [participants, setParticipants] = useState<Participant[]>(mockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Replace with your actual password check
    if (password === "admin123") {
      setIsAuthenticated(true)
      toast.success("Successfully logged in")
    } else {
      toast.error("Invalid password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    toast.success("Logged out successfully")
  }

  const handleStatusChange = (participantId: number, newStatus: string) => {
    setParticipants(
      participants.map((p) =>
        p.id === participantId ? { ...p, status: newStatus as "pending" | "approved" | "rejected" } : p,
      ),
    )
    toast.success(`Status updated to ${newStatus}`)
  }

  const handleDelete = (participantId: number) => {
    if (confirm("Are you sure you want to delete this participant?")) {
      setParticipants(participants.filter((p) => p.id !== participantId))
      toast.success("Participant deleted successfully")
    }
  }

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant)
  }

  const handleExportCSV = () => {
    const headers = ["Year", "Name", "Email", "Round", "Type", "Phone No", "Status"]
    const csvData = participants.map((p) => [p.year, p.name, p.email, p.round, p.type, p.phoneNo, p.status].join(","))

    const csv = [headers.join(","), ...csvData].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "participants.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("CSV exported successfully")
  }

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Participant Dashboard</h1>
          <div className="flex items-center gap-4">
            <Moon className="text-foreground" />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleExportCSV}>
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Phone No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.year}</TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.round}</TableCell>
                  <TableCell>{participant.type}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedImage(participant.paymentScreenshot)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{participant.phoneNo}</TableCell>
                  <TableCell>
                    <Select
                      value={participant.status}
                      onValueChange={(value) => handleStatusChange(participant.id, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(participant)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(participant.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
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

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="aspect-video relative">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Payment Screenshot"
                  className="rounded-lg object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Participant Dialog */}
        <Dialog open={!!editingParticipant} onOpenChange={() => setEditingParticipant(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Participant</DialogTitle>
              <DialogDescription>Make changes to the participant&apos;s information below.</DialogDescription>
            </DialogHeader>
            {editingParticipant && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingParticipant.name}
                      onChange={(e) =>
                        setEditingParticipant({
                          ...editingParticipant,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingParticipant.email}
                      onChange={(e) =>
                        setEditingParticipant({
                          ...editingParticipant,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingParticipant.phoneNo}
                      onChange={(e) =>
                        setEditingParticipant({
                          ...editingParticipant,
                          phoneNo: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-year">Year</Label>
                    <Select
                      value={editingParticipant.year}
                      onValueChange={(value) =>
                        setEditingParticipant({
                          ...editingParticipant,
                          year: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FE">First Year</SelectItem>
                        <SelectItem value="SE">Second Year</SelectItem>
                        <SelectItem value="TE">Third Year</SelectItem>
                        <SelectItem value="BE">Final Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setEditingParticipant(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setParticipants(
                        participants.map((p) => (p.id === editingParticipant.id ? editingParticipant : p)),
                      )
                      setEditingParticipant(null)
                      toast.success("Participant updated successfully")
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  )
}

