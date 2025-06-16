const express = require("express")
const OpenAI = require("openai")
const Resume = require("../models/Resume")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ATS Keywords database
const ATS_KEYWORDS = {
  technical: [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "API",
    "REST",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "TypeScript",
    "Vue.js",
    "Angular",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "Machine Learning",
    "Data Analysis",
    "Cloud Computing",
    "DevOps",
    "CI/CD",
  ],
  soft: [
    "Leadership",
    "Communication",
    "Problem Solving",
    "Team Collaboration",
    "Project Management",
    "Critical Thinking",
    "Adaptability",
    "Time Management",
    "Analytical Skills",
    "Customer Service",
    "Presentation Skills",
    "Negotiation",
  ],
  action: [
    "Achieved",
    "Implemented",
    "Developed",
    "Led",
    "Managed",
    "Created",
    "Improved",
    "Increased",
    "Reduced",
    "Optimized",
    "Designed",
    "Built",
    "Delivered",
    "Launched",
  ],
}

// Calculate ATS Score
const calculateATSScore = (resume) => {
  const scores = {
    keywords: 0,
    formatting: 0,
    sections: 0,
    experience: 0,
    skills: 0,
  }

  const suggestions = []

  // Keywords Analysis (30%)
  const resumeText = JSON.stringify(resume).toLowerCase()
  let keywordMatches = 0
  let totalKeywords = 0

  Object.values(ATS_KEYWORDS).forEach((categoryKeywords) => {
    categoryKeywords.forEach((keyword) => {
      totalKeywords++
      if (resumeText.includes(keyword.toLowerCase())) {
        keywordMatches++
      }
    })
  })

  scores.keywords = Math.round((keywordMatches / totalKeywords) * 100)

  if (scores.keywords < 30) {
    suggestions.push("Add more industry-relevant keywords to improve ATS compatibility")
  }

  // Formatting Analysis (20%)
  scores.formatting = 85 // Base score for clean JSON structure

  if (!resume.personalInfo.phone) {
    scores.formatting -= 10
    suggestions.push("Add phone number for better contact information")
  }

  if (!resume.personalInfo.location) {
    scores.formatting -= 5
    suggestions.push("Include location information")
  }

  // Sections Analysis (20%)
  let sectionScore = 0
  const requiredSections = ["personalInfo", "experience", "education", "skills"]

  requiredSections.forEach((section) => {
    if (
      resume[section] &&
      (Array.isArray(resume[section]) ? resume[section].length > 0 : Object.keys(resume[section]).length > 0)
    ) {
      sectionScore += 25
    }
  })

  scores.sections = sectionScore

  if (scores.sections < 100) {
    suggestions.push("Complete all resume sections (Contact, Experience, Education, Skills)")
  }

  // Experience Analysis (20%)
  if (resume.experience && resume.experience.length > 0) {
    let expScore = 0
    resume.experience.forEach((exp) => {
      if (exp.description && exp.description.length > 50) expScore += 20
      if (exp.description && /\d/.test(exp.description)) expScore += 10 // Contains numbers
      if (
        exp.description &&
        ATS_KEYWORDS.action.some((action) => exp.description.toLowerCase().includes(action.toLowerCase()))
      )
        expScore += 20
    })
    scores.experience = Math.min(100, expScore)
  } else {
    suggestions.push("Add work experience with quantifiable achievements")
  }

  // Skills Analysis (10%)
  const totalSkills = (resume.skills?.technical?.length || 0) + (resume.skills?.soft?.length || 0)
  scores.skills = Math.min(100, totalSkills * 10)

  if (scores.skills < 50) {
    suggestions.push("Add more relevant technical and soft skills")
  }

  // Calculate overall score
  const overall = Math.round(
    scores.keywords * 0.3 +
      scores.formatting * 0.2 +
      scores.sections * 0.2 +
      scores.experience * 0.2 +
      scores.skills * 0.1,
  )

  return {
    overall,
    breakdown: scores,
    suggestions,
    lastAnalyzed: new Date(),
  }
}

// Analyze resume ATS score
router.post("/analyze/:resumeId", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user._id,
    })

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }

    // Calculate ATS score
    const atsScore = calculateATSScore(resume)

    // Update resume with ATS score
    resume.atsScore = atsScore
    await resume.save()

    res.json({
      message: "ATS analysis completed",
      atsScore: atsScore,
    })
  } catch (error) {
    console.error("ATS analysis error:", error)
    res.status(500).json({ message: "Server error during ATS analysis" })
  }
})

module.exports = router
