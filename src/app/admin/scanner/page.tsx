"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"
import jsQR from "jsqr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, CheckCircle2, XCircle, AlertCircle, Camera, Upload } from "lucide-react"
import { verifyAndCheckin } from "@/lib/qr-utils"
import { Toaster, toast } from "sonner"

interface ScanResult {
  name: string
  status: "success" | "error" | "already-checked"
  message: string
  timestamp: string
}

export default function AdminScanPage() {
  const router = useRouter()
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInitializedRef = useRef(false)

  const handleScanSuccess = async (decodedText: string) => {
    // Extract token from URL
    const urlMatch = decodedText.match(/\/checkin\/([a-f0-9]+)/)
    const token = urlMatch ? urlMatch[1] : decodedText

    // Verify and check-in
    const result = await verifyAndCheckin(token)

    const scanResult: ScanResult = {
      name: result.participantName || "Unknown",
      status: result.success ? "success" : result.alreadyCheckedIn ? "already-checked" : "error",
      message: result.message,
      timestamp: new Date().toLocaleString(),
    }

    setRecentScans((prev) => [scanResult, ...prev.slice(0, 9)])

    // Show toast notification
    if (result.success) {
      toast.success(`✓ ${result.participantName} checked in successfully!`)
    } else if (result.alreadyCheckedIn) {
      toast.warning(`⚠ ${result.participantName} already checked in`)
    } else {
      toast.error(`✗ ${result.message}`)
    }
  }

  const startCameraScanning = async () => {
    if (!html5QrCodeRef.current) return
    
    // Check if already scanning
    if (isScanning) {
      console.log("Already scanning")
      return
    }

    try {
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        () => {
          // Ignore scan errors
        }
      )
      setIsScanning(true)
    } catch (error) {
      console.error("Error starting camera:", error)
      toast.error("Failed to start camera")
    }
  }

  const stopScanning = async () => {
    if (!html5QrCodeRef.current) return
    
    // Check if actually scanning
    if (!isScanning) {
      console.log("Not currently scanning")
      return
    }

    try {
      await html5QrCodeRef.current.stop()
      html5QrCodeRef.current.clear()
      setIsScanning(false)
    } catch (error) {
      console.error("Error stopping scanner:", error)
      // Force update state even if stop fails
      setIsScanning(false)
    }
  }

  const scanImageWithJsQR = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          })

          if (code) {
            resolve(code.data)
          } else {
            reject(new Error('No QR code found in image'))
          }
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Stop camera if running
    if (isScanning) {
      await stopScanning()
      // Wait a bit for camera to fully stop
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    try {
      // First try with jsQR (more reliable for images)
      let decodedText: string
      
      try {
        decodedText = await scanImageWithJsQR(file)
      } catch (jsQRError) {
        // If jsQR fails, try html5-qrcode as fallback
        if (html5QrCodeRef.current) {
          decodedText = await html5QrCodeRef.current.scanFile(file, true)
        } else {
          throw jsQRError
        }
      }

      await handleScanSuccess(decodedText)
      toast.success("QR code scanned successfully!")
    } catch (error) {
      console.error("Error scanning file:", error)
      toast.error("Failed to scan QR code. Please ensure the image is clear and contains a valid QR code.")
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    // Initialize Html5Qrcode instance only once
    if (!isInitializedRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("qr-reader")
      isInitializedRef.current = true
      
      // Start camera after initialization
      setTimeout(() => {
        startCameraScanning()
      }, 100)
    }

    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(console.error)
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">QR Scanner</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Scan Participant QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div id="qr-reader" className="w-full min-h-[300px] bg-gray-100 rounded-lg" />
              
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button
                    onClick={startCameraScanning}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <Button
                    onClick={stopScanning}
                    variant="destructive"
                    className="flex-1"
                  >
                    Stop Camera
                  </Button>
                )}
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <p className="text-sm text-gray-500 text-center">
                {isScanning ? "Camera is active - point at QR code" : "Start camera or upload an image"}
              </p>
            </CardContent>
          </Card>

          {/* Recent Scans Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              {recentScans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No scans yet</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 border rounded-lg bg-white"
                    >
                      <div className="flex items-start gap-3">
                        {scan.status === "success" && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        )}
                        {scan.status === "already-checked" && (
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        )}
                        {scan.status === "error" && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}

                        <div>
                          <p className="font-semibold">{scan.name}</p>
                          <p className="text-sm text-gray-600">{scan.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{scan.timestamp}</p>
                        </div>
                      </div>

                      <Badge
                        variant={
                          scan.status === "success"
                            ? "default"
                            : scan.status === "already-checked"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {scan.status === "success"
                          ? "Success"
                          : scan.status === "already-checked"
                            ? "Duplicate"
                            : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
