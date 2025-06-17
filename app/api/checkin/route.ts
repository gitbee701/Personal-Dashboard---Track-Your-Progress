import { type NextRequest, NextResponse } from "next/server"
import { createCheckIn, updateUserStats } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood, energy, productivity, notes, goals } = body

    // Validate required fields
    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    // Create check-in record
    const checkInId = await createCheckIn({
      userId: 1, // Default user ID
      mood,
      energy,
      productivity,
      notes,
      goals: JSON.stringify(goals),
    })

    // Update user stats (XP, streak, etc.)
    const updatedUser = await updateUserStats(1)

    return NextResponse.json({
      success: true,
      checkInId,
      user: updatedUser,
      xpGained: 25,
      message: "Check-in completed successfully!",
    })
  } catch (error) {
    console.error("Failed to create check-in:", error)
    return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 })
  }
}
