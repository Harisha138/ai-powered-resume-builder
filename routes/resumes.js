const express = require("express")
const Resume = require("../models/Resume")
const { requireAuth } = require("../middleware/auth")
const { validateResume } = require("../middleware/validation")

const router = express.Router()

router.get("/", requireAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 }).skip(skip).limit(limit)

    const total = await Resume.countDocuments({ user: req.user._id })

    res.json({
      resumes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get resumes error:", error)
    res.status(500).json({ message: "Server error fetching resumes" })
  }
})

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }

    res.json(resume)
  } catch (error) {
    console.error("Get resume error:", error)
    res.status(500).json({ message: "Server error fetching resume" })
  }
})

router.post("/", requireAuth, validateResume, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id,
    }

    const resume = new Resume(resumeData)
    await resume.save()

    res.status(201).json(resume)
  } catch (error) {
    console.error("Create resume error:", error)
    res.status(500).json({ message: "Server error creating resume" })
  }
})

router.put("/:id", requireAuth, validateResume, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }

    res.json(resume)
  } catch (error) {
    console.error("Update resume error:", error)
    res.status(500).json({ message: "Server error updating resume" })
  }
})

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }

    res.json({ message: "Resume deleted successfully" })
  } catch (error) {
    console.error("Delete resume error:", error)
    res.status(500).json({ message: "Server error deleting resume" })
  }
})

module.exports = router
