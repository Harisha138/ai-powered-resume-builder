const express = require("express")
const passport = require("passport")
const User = require("../models/User")
const { validateRegistration, validateLogin } = require("../middleware/validation")

const router = express.Router()

// Register
router.post("/register", validateRegistration, async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      isEmailVerified: true,
    })

    await user.save()

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        subscription: user.subscription,
        aiCreditsUsed: user.aiCreditsUsed,
        aiCreditsLimit: user.aiCreditsLimit,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", validateLogin, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Server error during login" })
    }

    if (!user) {
      return res.status(401).json({ message: info.message || "Invalid credentials" })
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Server error during login" })
      }

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          isEmailVerified: user.isEmailVerified,
          subscription: user.subscription,
          aiCreditsUsed: user.aiCreditsUsed,
          aiCreditsLimit: user.aiCreditsLimit,
        },
      })
    })
  })(req, res, next)
})

// Google OAuth routes
router.get("/google", (req, res, next) => {
  console.log("Initiating Google OAuth...")
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next)
})

router.get("/google/callback", (req, res, next) => {
  console.log("Google OAuth callback received")
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth_failed`,
    successRedirect: `${process.env.CLIENT_URL}/dashboard`,
  })(req, res, next)
})

// Add a route to handle OAuth errors
router.get("/oauth/error", (req, res) => {
  console.log("OAuth error:", req.query.error)
  res.redirect(`${process.env.CLIENT_URL}/auth?error=${req.query.error || "oauth_failed"}`)
})

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error destroying session" })
      }
      res.clearCookie("connect.sid")
      res.json({ message: "Logout successful" })
    })
  })
})

// Get current user
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        isEmailVerified: req.user.isEmailVerified,
        subscription: req.user.subscription,
        aiCreditsUsed: req.user.aiCreditsUsed,
        aiCreditsLimit: req.user.aiCreditsLimit,
      },
    })
  } else {
    res.status(401).json({ message: "Not authenticated" })
  }
})

module.exports = router
