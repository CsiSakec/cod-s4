import { ref, get, update } from "firebase/database"
import { database } from "@/firebaseConfig"

/**
 * Generate a secure QR token for participant check-in
 */
export function generateQRToken(): string {
  // Generate a cryptographically secure random token
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Verify and process QR token for check-in
 */
export async function verifyAndCheckin(token: string): Promise<{
  success: boolean
  message: string
  participantName?: string
  alreadyCheckedIn?: boolean
}> {
  try {
    // Search for participant with this QR token
    const registrationsRef = ref(database, "registrations")
    const snapshot = await get(registrationsRef)

    if (!snapshot.exists()) {
      return { success: false, message: "No registrations found" }
    }

    const registrations = snapshot.val()
    let participantId: string | null = null
    let participant: any = null

    // Find participant by QR token
    for (const [id, reg] of Object.entries(registrations)) {
      if ((reg as any).qrToken === token) {
        participantId = id
        participant = reg
        break
      }
    }

    if (!participantId || !participant) {
      return { success: false, message: "Invalid QR code" }
    }

    // Check if participant is approved
    if (participant.status !== "approved") {
      return { 
        success: false, 
        message: "Registration not approved yet" 
      }
    }

    // Check if already checked in
    if (participant.arrived === "yes") {
      return {
        success: false,
        message: "Already checked in",
        participantName: participant.personalInfo.name,
        alreadyCheckedIn: true,
      }
    }

    // Mark as arrived
    const participantRef = ref(database, `registrations/${participantId}`)
    await update(participantRef, {
      arrived: "yes",
      arrivedAt: new Date().toISOString(),
    })

    return {
      success: true,
      message: "Check-in successful",
      participantName: participant.personalInfo.name,
    }
  } catch (error) {
    console.error("Check-in error:", error)
    return { 
      success: false, 
      message: "An error occurred during check-in" 
    }
  }
}

/**
 * Generate QR code data URL
 */
export async function generateQRCodeDataURL(token: string): Promise<string> {
  const QRCode = (await import("qrcode")).default
  const checkinUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkin/${token}`
  
  return await QRCode.toDataURL(checkinUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  })
}
