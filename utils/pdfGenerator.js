const PDFDocument = require("pdfkit")

const generatePDF = async (resume) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const buffers = []

      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
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
          doc.text(
            `${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}`,
          )

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
          doc.text(`${edu.school} | ${formatDate(edu.graduationDate)}`)

          if (index < resume.education.length - 1) {
            doc.moveDown(0.5)
          }
        })
        doc.moveDown()
      }

      // Skills Section
      if (resume.skills && (resume.skills.technical.length > 0 || resume.skills.soft.length > 0)) {
        doc.fontSize(14).font("Helvetica-Bold")
        doc.text("SKILLS")
        doc.moveDown(0.5)

        if (resume.skills.technical.length > 0) {
          doc.fontSize(11).font("Helvetica-Bold")
          doc.text("Technical Skills:")
          doc.fontSize(10).font("Helvetica")
          doc.text(resume.skills.technical.join(", "))
          doc.moveDown(0.5)
        }

        if (resume.skills.soft.length > 0) {
          doc.fontSize(11).font("Helvetica-Bold")
          doc.text("Soft Skills:")
          doc.fontSize(10).font("Helvetica")
          doc.text(resume.skills.soft.join(", "))
        }
        doc.moveDown()
      }

      // Projects Section
      if (resume.projects && resume.projects.length > 0) {
        doc.fontSize(14).font("Helvetica-Bold")
        doc.text("PROJECTS")
        doc.moveDown(0.5)

        resume.projects.forEach((project, index) => {
          doc.fontSize(12).font("Helvetica-Bold")
          doc.text(project.title)

          doc.fontSize(10).font("Helvetica")
          doc.text(project.description, { align: "justify" })

          if (project.technologies && project.technologies.length > 0) {
            doc.text(`Technologies: ${project.technologies.join(", ")}`)
          }

          if (index < resume.projects.length - 1) {
            doc.moveDown()
          }
        })
        doc.moveDown()
      }

      // Certifications Section
      if (resume.certifications && resume.certifications.length > 0) {
        doc.fontSize(14).font("Helvetica-Bold")
        doc.text("CERTIFICATIONS")
        doc.moveDown(0.5)

        resume.certifications.forEach((cert, index) => {
          doc.fontSize(11).font("Helvetica-Bold")
          doc.text(cert.name)

          doc.fontSize(10).font("Helvetica")
          doc.text(`${cert.issuer} | ${formatDate(cert.issueDate)}`)

          if (index < resume.certifications.length - 1) {
            doc.moveDown(0.5)
          }
        })
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

const formatDate = (date) => {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

module.exports = { generatePDF }
