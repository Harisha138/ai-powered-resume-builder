"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Brain,
  FileText,
  Plus,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  LogOut,
  User,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Resume {
  id: string
  title: string
  lastModified: string
  status: "draft" | "completed"
  atsScore?: {
    overall: number
    breakdown: {
      keywords: number
      formatting: number
      sections: number
      experience: number
      skills: number
    }
  }
}

export default function DashboardPage() {
  const { user, logout, isConnected } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [stats, setStats] = useState({
    totalResumes: 0,
    completedResumes: 0,
    averageAtsScore: 0,
    totalDownloads: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Load mock data or fetch from API
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    if (isConnected) {
      try {
        // Fetch real data from API
        const resumesResponse = await fetch("/api/resumes", { credentials: "include" })
        if (resumesResponse.ok) {
          const data = await resumesResponse.json()
          setResumes(data.resumes || [])
        }
      } catch (error) {
        console.error("Failed to load resumes:", error)
        loadMockData()
      }
    } else {
      loadMockData()
    }
  }

  const loadMockData = () => {
    const mockResumes: Resume[] = [
      {
        id: "1",
        title: "Software Engineer Resume",
        lastModified: "2 hours ago",
        status: "completed",
        atsScore: {
          overall: 87,
          breakdown: {
            keywords: 85,
            formatting: 92,
            sections: 88,
            experience: 90,
            skills: 80,
          },
        },
      },
      {
        id: "2",
        title: "Frontend Developer Resume",
        lastModified: "1 day ago",
        status: "draft",
        atsScore: {
          overall: 65,
          breakdown: {
            keywords: 60,
            formatting: 75,
            sections: 70,
            experience: 65,
            skills: 55,
          },
        },
      },
      {
        id: "3",
        title: "Full Stack Developer Resume",
        lastModified: "3 days ago",
        status: "completed",
        atsScore: {
          overall: 92,
          breakdown: {
            keywords: 95,
            formatting: 90,
            sections: 95,
            experience: 88,
            skills: 92,
          },
        },
      },
    ]

    setResumes(mockResumes)
    setStats({
      totalResumes: mockResumes.length,
      completedResumes: mockResumes.filter((r) => r.status === "completed").length,
      averageAtsScore: Math.round(
        mockResumes.reduce((sum, r) => sum + (r.atsScore?.overall || 0), 0) / mockResumes.length,
      ),
      totalDownloads: 12,
    })
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const deleteResume = (id: string) => {
    setResumes(resumes.filter((resume) => resume.id !== id))
    toast({
      title: "Resume Deleted",
      description: "Resume has been successfully deleted.",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold gradient-text">AI Resume Builder</span>
            </div>

            <div className="flex items-center space-x-4">
              {!isConnected && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Demo Mode
                </Badge>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4" />
                <span>
                  {user.aiCreditsUsed || 0}/{user.aiCreditsLimit || 50} AI Credits
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600">Manage your resumes and track your ATS performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResumes}</div>
              <p className="text-xs text-muted-foreground">{stats.completedResumes} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average ATS Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageAtsScore)}`}>
                {stats.averageAtsScore}%
              </div>
              <Progress value={stats.averageAtsScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(user.aiCreditsLimit || 50) - (user.aiCreditsUsed || 0)}</div>
              <p className="text-xs text-muted-foreground">Remaining this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
          <Link href="/builder">
            <Button className="gradient-bg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{resume.title}</CardTitle>
                    <CardDescription>Last modified {resume.lastModified}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteResume(resume.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* ATS Score */}
                  {resume.atsScore && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ATS Score</span>
                        <Badge variant={getScoreBadgeVariant(resume.atsScore.overall)}>
                          {resume.atsScore.overall}%
                        </Badge>
                      </div>
                      <Progress value={resume.atsScore.overall} className="h-2" />

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>Keywords: {resume.atsScore.breakdown.keywords}%</div>
                        <div>Format: {resume.atsScore.breakdown.formatting}%</div>
                        <div>Sections: {resume.atsScore.breakdown.sections}%</div>
                        <div>Experience: {resume.atsScore.breakdown.experience}%</div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Badge variant={resume.status === "completed" ? "default" : "secondary"}>{resume.status}</Badge>
                    <div className="space-x-2">
                      <Link href={`/builder/${resume.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {resumes.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4">Create your first resume to get started</p>
                <Link href="/builder">
                  <Button className="gradient-bg">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Analyze All Resumes</CardTitle>
                <CardDescription>
                  Run ATS analysis on all your resumes to identify improvement opportunities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Optimization Tips</CardTitle>
                <CardDescription>
                  Get personalized suggestions to improve your resume's ATS compatibility
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <Award className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Upgrade Plan</CardTitle>
                <CardDescription>Unlock unlimited AI credits and premium templates</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
