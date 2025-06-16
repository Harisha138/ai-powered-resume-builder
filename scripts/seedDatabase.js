const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const User = require("../models/User")
const Resume = require("../models/Resume")

dotenv.config()

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Resume.deleteMany({})
    console.log("Cleared existing data")

    // Create sample users
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        isEmailVerified: true,
        subscription: "premium",
        aiCreditsLimit: 100,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "Password123!",
        isEmailVerified: true,
        subscription: "free",
        aiCreditsLimit: 10,
      },
    ]

    const users = await User.create(sampleUsers)
    console.log("Created sample users")

    // Create sample resumes
    const sampleResumes = [
      {
        user: users[0]._id,
        title: "Software Engineer Resume",
        personalInfo: {
          fullName: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary:
            "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
        },
        experience: [
          {
            company: "Tech Corp",
            position: "Senior Software Engineer",
            startDate: new Date("2021-01-01"),
            endDate: null,
            description:
              "Led development of scalable web applications using React and Node.js. Improved system performance by 40% and mentored junior developers.",
            isCurrentJob: true,
          },
          {
            company: "StartupXYZ",
            position: "Full Stack Developer",
            startDate: new Date("2019-06-01"),
            endDate: new Date("2020-12-31"),
            description:
              "Built responsive web applications and RESTful APIs. Collaborated with cross-functional teams to deliver features on time.",
            isCurrentJob: false,
          },
        ],
        education: [
          {
            school: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            graduationDate: new Date("2019-05-01"),
          },
        ],
        skills: {
          technical: ["JavaScript", "React", "Node.js", "Python", "AWS", "MongoDB", "PostgreSQL"],
          soft: ["Leadership", "Problem Solving", "Communication", "Team Collaboration"],
        },
        status: "completed",
        template: "modern",
      },
      {
        user: users[1]._id,
        title: "Marketing Manager Resume",
        personalInfo: {
          fullName: "Jane Smith",
          email: "jane@example.com",
          phone: "+1 (555) 987-6543",
          location: "New York, NY",
          summary:
            "Results-driven marketing manager with 7+ years of experience in digital marketing, brand management, and campaign optimization.",
        },
        experience: [
          {
            company: "Marketing Agency Inc",
            position: "Marketing Manager",
            startDate: new Date("2020-03-01"),
            endDate: null,
            description:
              "Managed marketing campaigns for 15+ clients, increasing average ROI by 35%. Led a team of 5 marketing specialists.",
            isCurrentJob: true,
          },
        ],
        education: [
          {
            school: "New York University",
            degree: "Master of Business Administration",
            graduationDate: new Date("2017-05-01"),
          },
        ],
        skills: {
          technical: ["Google Analytics", "Facebook Ads", "HubSpot", "Salesforce", "Adobe Creative Suite"],
          soft: ["Strategic Planning", "Team Leadership", "Creative Thinking", "Data Analysis"],
        },
        status: "draft",
        template: "classic",
      },
    ]

    await Resume.create(sampleResumes)
    console.log("Created sample resumes")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
