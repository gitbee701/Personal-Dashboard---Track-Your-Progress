import { NextResponse } from "next/server"
import { getUserAchievements, checkAndUnlockAchievements } from "@/lib/database"

export async function GET() {
  try {
    const achievements = await getUserAchievements(1) // Default user ID
    return NextResponse.json(achievements)
  } catch (error) {
    console.error("Failed to fetch achievements:", error)
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const newAchievements = await checkAndUnlockAchievements(1)
    return NextResponse.json({
      success: true,
      newAchievements,
    })
  } catch (error) {
    console.error("Failed to check achievements:", error)
    return NextResponse.json({ error: "Failed to check achievements" }, { status: 500 })
  }
}
