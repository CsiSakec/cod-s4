import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/connectDB'
import Registration from '@/model/registration'

// Get all registrations
export async function GET() {
  try {
    await connectDB()
    const registrations = await Registration.find({}).sort({ createdAt: -1 })
    return NextResponse.json(registrations, { status: 200 })
  } catch (error: any) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

// Create new registration
export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    // Enhanced validation
    const requiredFields = ['name', 'email', 'phone', 'college', 'year', 'branch', 'isFromSakec', 'isCsiMember']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        fields: missingFields
      }, { status: 400 })
    }

    // Validate phone number
    if (!/^\d{10}$/.test(data.phone)) {
      return NextResponse.json({
        error: 'Phone number must be 10 digits',
        field: 'phone'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({
        error: 'Invalid email format',
        field: 'email'
      }, { status: 400 })
    }

    // Check for existing registration
    const existingRegistration = await Registration.findOne({ 
      email: data.email.toLowerCase() 
    })
    
    if (existingRegistration) {
      return NextResponse.json({
        error: 'Email already registered',
        field: 'email'
      }, { status: 409 })
    }

    // Create registration with sanitized data
    const registration = await Registration.create({
      ...data,
      email: data.email.toLowerCase(),
      participantType: data.participantTypes || [],
      selectedRounds: data.selectedRounds || [],
      totalAmount: data.totalPrice || 0,
      status: 'pending',
      createdAt: new Date()
    })

    return NextResponse.json({
      message: 'Registration successful',
      registrationId: registration.registrationId,
      data: registration
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({
      error: 'Failed to process registration',
      details: error.message
    }, { status: 500 })
  }
}