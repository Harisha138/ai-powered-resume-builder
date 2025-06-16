const express = require("express")
const passport = require("passport")
const crypto = require("crypto")
const User = require("../models/User")
const { validateRegistration, validateLogin } = require("../middleware/validation")

const router = express.Router()

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
      isEmailVerified: true, // Auto-verify for demo
    })

    await user.save()

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

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
        },
      })
    })
  })(req, res, next)
})

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth_failed` }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`)
  },
)

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
