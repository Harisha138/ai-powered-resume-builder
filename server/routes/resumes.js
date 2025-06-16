const express = require("express")
const Resume = require("../models/Resume")
const { requireAuth } = require("../middleware/auth")
const { validateResume } = require("../middleware/validation")
const PDFDocument = require("pdfkit")

const router = express.Router()

// Get all user resumes
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

// Get single resume
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

// Create new resume
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

// Update resume
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

// Delete resume
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

// Export resume as PDF
router.post("/:id/export", requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    const buffers = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="${resume.title}.pdf"`)
      res.send(pdfData)
    })

    // Header with name and contact info
    doc.fontSize(24).font("Helvetica-Bold")
    doc.text(resume.personalInfo.fullName, { align: "center" })

    doc.fontSize(10).font("Helvetica")
    const contactInfo = [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
      .filter(Boolean)
      .join(" | ")

    doc.text(contactInfo, { align: "center" })
    doc.moveDown()

    // Add line separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Professional Summary
    if (resume.personalInfo.summary) {
      doc.fontSize(14).font("Helvetica-Bold")
      doc.text("PROFESSIONAL SUMMARY")
      doc.fontSize(10).font("Helvetica")
      doc.text(resume.personalInfo.summary, { align: "justify" })
      doc.moveDown()
    }

    // Experience Section
    if (resume.experience && resume.experience.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold")
      doc.text("PROFESSIONAL EXPERIENCE")
      doc.moveDown(0.5)

      resume.experience.forEach((exp, index) => {
        doc.fontSize(12).font("Helvetica-Bold")
        doc.text(exp.position)

        doc.fontSize(11).font("Helvetica")
        doc.text(`${exp.company} | ${exp.startDate} - ${exp.endDate || "Present"}`)

        doc.fontSize(10).font("Helvetica")
        doc.text(exp.description, { align: "justify" })

        if (index < resume.experience.length - 1) {
          doc.moveDown()
        }
      })
      doc.moveDown()
    }

    // Education Section
    if (resume.education && resume.education.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold")
      doc.text("EDUCATION")
      doc.moveDown(0.5)

      resume.education.forEach((edu, index) => {
        doc.fontSize(12).font("Helvetica-Bold")
        doc.text(edu.degree)

        doc.fontSize(11).font("Helvetica")
        doc.text(`${edu.school} | ${edu.graduationDate}`)

        if (index < resume.education.length - 1) {
          doc.moveDown(0.5)
        }
      })
      doc.moveDown()
    }

    // Skills Section
    if (resume.skills && resume.skills.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold")
      doc.text("SKILLS")
      doc.moveDown(0.5)

      doc.fontSize(10).font("Helvetica")
      doc.text(resume.skills.join(", "))
    }

    // Update download count
    await Resume.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 },
      lastDownloaded: new Date(),
    })

    doc.end()
  } catch (error) {
    console.error("Export PDF error:", error)
    res.status(500).json({ message: "Server error exporting PDF" })
  }
})

module.exports = router
