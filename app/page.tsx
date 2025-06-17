"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard-stats"
import { AchievementBadge } from "@/components/achievement-badge"
import { MotivationalPopup } from "@/components/motivational-popup"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, Target, Zap, Star } from "lucide-react"
import Link from "next/link"

interface UserData {
  id: number
  username: string
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  mood: string
  lastCheckin: string
  achievements: Achievement[]
}

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  unlockedAt: string
}

export default function DashboardHome() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showMotivation, setShowMotivation] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      const data = await response.json()
      setUserData(data)

      // Show motivational popup if user has made progress
      if (data.currentStreak > 0 && data.currentStreak % 5 === 0) {
        setShowMotivation(true)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!userData) return null

  const xpToNextLevel = userData.level * 100 - (userData.xp % 100)
  const currentLevelXP = userData.xp % 100
  const progressPercentage = (currentLevelXP / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {userData.username}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Keep up the great work! 🚀</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Level & XP Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Level {userData.level}</CardTitle>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span className="font-bold">{userData.xp} XP</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm opacity-90">
                <span>{currentLevelXP} / 100 XP</span>
                <span>{xpToNextLevel} to next level</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <DashboardStats
          currentStreak={userData.currentStreak}
          longestStreak={userData.longestStreak}
          mood={userData.mood}
          lastCheckin={userData.lastCheckin}
        />

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData.achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userData.achievements.slice(0, 4).map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Complete your first check-in to earn achievements! 🏆
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/checkin">
            <Button className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Check In</span>
              </div>
            </Button>
          </Link>

          <Button variant="outline" className="w-full h-16" onClick={() => setShowMotivation(true)}>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="font-semibold">Motivation</span>
            </div>
          </Button>
        </div>

        {/* Motivational Popup */}
        <MotivationalPopup
          isOpen={showMotivation}
          onClose={() => setShowMotivation(false)}
          streak={userData.currentStreak}
          level={userData.level}
        />
      </div>
    </div>
  )
}
