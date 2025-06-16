"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Save, Download, Plus, Trash2, Sparkles, ArrowLeft, Loader2, Target } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  school: string
  degree: string
  graduationDate: string
}

interface ATSScore {
  overall: number
  breakdown: {
    keywords: number
    formatting: number
    sections: number
    experience: number
    skills: number
  }
  suggestions: string[]
  lastAnalyzed: string
}

interface ResumeData {
  id?: string
  title: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Experience[]
  education: Education[]
  skills: string[]
  atsScore?: ATSScore
  status: "draft" | "completed"
}

export default function ResumeBuilderPage() {
  const { user, isConnected } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "My Resume",
    personalInfo: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    status: "draft",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
  }, [user, router])

  const generateAISummary = async () => {
    setIsAiLoading(true)
    try {
      if (isConnected) {
        const response = await fetch("http://localhost:5000/api/ai/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            jobTitle: "Software Engineer",
            experience: "5",
            skills: resumeData.skills,
            industry: "Technology",
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setResumeData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              summary: data.summary,
            },
          }))
          toast({
            title: "AI Summary Generated!",
            description: "Your professional summary has been created using AI.",
          })
        } else {
          throw new Error("Failed to generate summary")
        }
      } else {
        // Mock AI generation
        setTimeout(() => {
          const aiSummary =
            "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams to achieve business objectives."

          setResumeData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              summary: aiSummary,
            },
          }))

          toast({
            title: "AI Summary Generated!",
            description: "Your professional summary has been created using AI.",
          })
        }, 2000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  const saveResume = async () => {
    setIsSaving(true)
    try {
      if (isConnected) {
        const url = resumeData.id
          ? `http://localhost:5000/api/resumes/${resumeData.id}`
          : "http://localhost:5000/api/resumes"

        const method = resumeData.id ? "PUT" : "POST"

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(resumeData),
        })

        if (response.ok) {
          const data = await response.json()
          setResumeData((prev) => ({ ...prev, id: data._id || data.id }))
          toast({
            title: "Resume Saved!",
            description: "Your resume has been saved successfully.",
          })
        } else {
          throw new Error("Failed to save resume")
        }
      } else {
        // Mock save
        const savedResume = { ...resumeData, id: Date.now().toString() }
        setResumeData(savedResume)
        localStorage.setItem("currentResume", JSON.stringify(savedResume))
        toast({
          title: "Resume Saved!",
          description: "Your resume has been saved locally (Demo Mode).",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const analyzeATS = async () => {
    setIsAnalyzing(true)
    try {
      if (isConnected && resumeData.id) {
        const response = await fetch(`http://localhost:5000/api/ats/analyze/${resumeData.id}`, {
          method: "POST",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setResumeData((prev) => ({ ...prev, atsScore: data.atsScore }))
          toast({
            title: "ATS Analysis Complete!",
            description: `Your resume scored ${data.atsScore.overall}% for ATS compatibility.`,
          })
        } else {
          throw new Error("Failed to analyze ATS score")
        }
      } else {
        // Mock ATS analysis
        setTimeout(() => {
          const mockScore: ATSScore = {
            overall: 85,
            breakdown: {
              keywords: 80,
              formatting: 90,
              sections: 85,
              experience: 88,
              skills: 82,
            },
            suggestions: [
              "Add more industry-specific keywords",
              "Include quantifiable achievements in experience",
              "Add technical skills relevant to your field",
            ],
            lastAnalyzed: new Date().toISOString(),
          }
          setResumeData((prev) => ({ ...prev, atsScore: mockScore }))
          toast({
            title: "ATS Analysis Complete!",
            description: `Your resume scored ${mockScore.overall}% for ATS compatibility.`,
          })
        }, 2000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze ATS score. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      if (isConnected && resumeData.id) {
        const response = await fetch(`http://localhost:5000/api/resumes/${resumeData.id}/export`, {
          method: "POST",
          credentials: "include",
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${resumeData.title.replace(/\s+/g, "_")}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          toast({
            title: "PDF Downloaded!",
            description: "Your resume has been exported as PDF.",
          })
        } else {
          throw new Error("Failed to export PDF")
        }
      } else {
        // Mock PDF export
        setTimeout(() => {
          toast({
            title: "PDF Export Started!",
            description: "Your resume is being converted to PDF... (Demo Mode)",
          })
        }, 1000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      graduationDate: "",
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Resume Builder</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={analyzeATS} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                {isAnalyzing ? "Analyzing..." : "Check ATS Score"}
              </Button>
              <Button variant="outline" onClick={saveResume} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={exportToPDF} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* ATS Score Card */}
            {resumeData.atsScore && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="mr-2 h-5 w-5 text-green-600" />
                      ATS Compatibility Score
                    </CardTitle>
                    <Badge className={`${getScoreColor(resumeData.atsScore.overall)} bg-white`}>
                      {resumeData.atsScore.overall}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={resumeData.atsScore.overall} className="mb-4" />
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>Keywords: {resumeData.atsScore.breakdown.keywords}%</div>
                    <div>Formatting: {resumeData.atsScore.breakdown.formatting}%</div>
                    <div>Sections: {resumeData.atsScore.breakdown.sections}%</div>
                    <div>Experience: {resumeData.atsScore.breakdown.experience}%</div>
                  </div>
                  {resumeData.atsScore.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Suggestions:</h4>
                      <ul className="text-sm space-y-1">
                        {resumeData.atsScore.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic information about yourself</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Resume Title</Label>
                      <Input
                        id="title"
                        value={resumeData.title}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, phone: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, location: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button variant="outline" size="sm" onClick={generateAISummary} disabled={isAiLoading}>
                          {isAiLoading ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-3 w-3" />
                          )}
                          {isAiLoading ? "Generating..." : "AI Generate"}
                        </Button>
                      </div>
                      <Textarea
                        id="summary"
                        rows={4}
                        value={resumeData.personalInfo.summary}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, summary: e.target.value },
                          }))
                        }
                        placeholder="Write a brief summary of your professional background..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>Add your work experience</CardDescription>
                      </div>
                      <Button onClick={addExperience}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Experience Entry</h4>
                          <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                      </div>
                    ))}
                    {resumeData.experience.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No experience added yet. Click "Add Experience" to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>Add your educational background</CardDescription>
                      </div>
                      <Button onClick={addEducation}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Education Entry</h4>
                          <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>School/University</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Graduation Date</Label>
                            <Input
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {resumeData.education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No education added yet. Click "Add Education" to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Add your technical and soft skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="skillInput">Add Skill</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="skillInput"
                          placeholder="e.g., JavaScript, React, Project Management"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addSkill(e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById("skillInput") as HTMLInputElement
                            addSkill(input.value)
                            input.value = ""
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {resumeData.skills.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No skills added yet. Add your skills above.</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
                <CardDescription>Live preview of your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 shadow-sm min-h-[600px]">
                  {/* Resume Preview Content */}
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {resumeData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <div className="text-gray-600 space-y-1">
                        <p>{resumeData.personalInfo.email}</p>
                        <p>{resumeData.personalInfo.phone}</p>
                        <p>{resumeData.personalInfo.location}</p>
                      </div>
                    </div>

                    {resumeData.personalInfo.summary && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                        <p className="text-gray-700 text-sm leading-relaxed">{resumeData.personalInfo.summary}</p>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                              <h3 className="font-medium text-gray-900">{exp.position}</h3>
                              <p className="text-blue-600 text-sm">{exp.company}</p>
                              <p className="text-gray-500 text-xs">
                                {exp.startDate} - {exp.endDate || "Present"}
                              </p>
                              <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id}>
                              <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                              <p className="text-blue-600 text-sm">{edu.school}</p>
                              <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
