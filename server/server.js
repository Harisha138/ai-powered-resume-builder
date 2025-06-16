require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const resumeRoutes = require("./routes/resumes")
const aiRoutes = require("./routes/ai")
const atsRoutes = require("./routes/ats")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "https://accounts.google.com", "https://apis.google.com"],
        imgSrc: ["'self'", "data:", "https:", "https://lh3.googleusercontent.com"],
        connectSrc: ["'self'", "https://accounts.google.com", "https://oauth2.googleapis.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  }),
)
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Passport configuration
require("./config/passport")(passport)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/resumes", resumeRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/ats", atsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Resume Builder API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "API route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📱 Environment: ${process.env.NODE_ENV}`)
})

module.exports = app
