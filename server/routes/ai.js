const express = require("express")
const OpenAI = require("openai")
const User = require("../models/User")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const checkAICredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (user.aiCreditsUsed >= user.aiCreditsLimit) {
      return res.status(429).json({
        message: "AI credits limit reached. Please upgrade your plan.",
        creditsUsed: user.aiCreditsUsed,
        creditsLimit: user.aiCreditsLimit,
      })
    }

    req.userCredits = {
      used: user.aiCreditsUsed,
      limit: user.aiCreditsLimit,
    }

    next()
  } catch (error) {
    console.error("Check AI credits error:", error)
    res.status(500).json({ message: "Server error checking AI credits" })
  }
}

// Generate professional summary
router.post("/generate-summary", requireAuth, checkAICredits, async (req, res) => {
  try {
    const { jobTitle, experience, skills, industry } = req.body

    const prompt = `Generate a professional resume summary for a ${jobTitle} with ${experience} years of experience in ${industry}. 
    Key skills include: ${skills.join(", ")}. 
    The summary should be 2-3 sentences, highlight key achievements, and be ATS-friendly with relevant keywords.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer with expertise in creating compelling resume summaries that pass ATS systems and attract recruiters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const summary = completion.choices[0].message.content.trim()

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { aiCreditsUsed: 1 },
    })

    res.json({
      summary,
      creditsUsed: req.userCredits.used + 1,
      creditsRemaining: req.userCredits.limit - req.userCredits.used - 1,
    })
  } catch (error) {
    console.error("Generate summary error:", error)
    res.status(500).json({ message: "Server error generating summary" })
  }
})

// Improve job description
router.post("/improve-description", requireAuth, checkAICredits, async (req, res) => {
  try {
    const { jobTitle, company, description } = req.body

    const prompt = `Improve this job description for a ${jobTitle} at ${company}:
    
    Current description: "${description}"
    
    Please rewrite this to be more impactful, quantifiable, and achievement-focused. Use action verbs and include metrics where possible. Format as bullet points. Make it ATS-friendly with relevant keywords.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer who specializes in creating impactful job descriptions with quantifiable achievements and strong action verbs.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const improvedDescription = completion.choices[0].message.content.trim()

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { aiCreditsUsed: 1 },
    })

    res.json({
      improvedDescription,
      creditsUsed: req.userCredits.used + 1,
      creditsRemaining: req.userCredits.limit - req.userCredits.used - 1,
    })
  } catch (error) {
    console.error("Improve description error:", error)
    res.status(500).json({ message: "Server error improving description" })
  }
})

// Suggest skills
router.post("/suggest-skills", requireAuth, checkAICredits, async (req, res) => {
  try {
    const { jobTitle, industry, currentSkills } = req.body

    const prompt = `Suggest 10-15 relevant skills for a ${jobTitle} in the ${industry} industry. 
    Current skills: ${currentSkills ? currentSkills.join(", ") : "None"}
    
    Focus on both technical and soft skills that are in high demand and ATS-friendly. Avoid duplicating current skills. 
    Return the skills as a simple comma-separated list.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor who knows the latest skill requirements for various job roles across different industries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.6,
    })

    const skillsText = completion.choices[0].message.content.trim()
    const suggestedSkills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { aiCreditsUsed: 1 },
    })

    res.json({
      suggestedSkills,
      creditsUsed: req.userCredits.used + 1,
      creditsRemaining: req.userCredits.limit - req.userCredits.used - 1,
    })
  } catch (error) {
    console.error("Suggest skills error:", error)
    res.status(500).json({ message: "Server error suggesting skills" })
  }
})

// Get AI usage statistics
router.get("/usage", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("aiCreditsUsed aiCreditsLimit subscription")

    res.json({
      creditsUsed: user.aiCreditsUsed,
      creditsLimit: user.aiCreditsLimit,
      creditsRemaining: user.aiCreditsLimit - user.aiCreditsUsed,
      subscription: user.subscription,
    })
  } catch (error) {
    console.error("Get AI usage error:", error)
    res.status(500).json({ message: "Server error fetching AI usage" })
  }
})

module.exports = router
