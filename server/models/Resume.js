const mongoose = require("mongoose")

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "" },
  description: { type: String, required: true },
  location: { type: String, trim: true },
  isCurrentJob: { type: Boolean, default: false },
})

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, trim: true },
  graduationDate: { type: String, required: true },
  gpa: { type: String, default: "" },
  location: { type: String, trim: true },
})

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  url: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
})

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    personalInfo: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
      location: { type: String, trim: true },
      website: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      summary: { type: String, trim: true },
    },
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    skills: {
      technical: [{ type: String, trim: true }],
      soft: [{ type: String, trim: true }],
      languages: [
        {
          language: { type: String, trim: true },
          proficiency: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Native"],
            default: "Intermediate",
          },
        },
      ],
    },
    certifications: [
      {
        name: { type: String, required: true, trim: true },
        issuer: { type: String, required: true, trim: true },
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        url: String,
      },
    ],
    template: {
      type: String,
      enum: ["modern", "classic", "creative", "minimal"],
      default: "modern",
    },
    status: {
      type: String,
      enum: ["draft", "completed", "archived"],
      default: "draft",
    },
    atsScore: {
      overall: { type: Number, default: 0 },
      breakdown: {
        keywords: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
        sections: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
      },
      suggestions: [{ type: String }],
      lastAnalyzed: { type: Date, default: Date.now },
    },
    isPublic: { type: Boolean, default: false },
    publicUrl: { type: String, unique: true, sparse: true },
    downloadCount: { type: Number, default: 0 },
    lastDownloaded: Date,
  },
  {
    timestamps: true,
  },
)

resumeSchema.index({ user: 1, createdAt: -1 })
resumeSchema.index({ publicUrl: 1 })

module.exports = mongoose.model("Resume", resumeSchema)
