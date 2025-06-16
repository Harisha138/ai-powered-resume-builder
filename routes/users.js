const express = require("express")
const User = require("../models/User")
const Resume = require("../models/Resume")
const { requireAuth } = require("../middleware/auth")
const { validateProfileUpdate } = require("../middleware/validation")

const router = express.Router()

// Get user profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error fetching profile" })
  }
})

// Update user profile
router.put("/profile", requireAuth, validateProfileUpdate, async (req, res) => {
  try {
    const { name, email, picture } = req.body

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user._id },
      })

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email: email.toLowerCase(),
        picture,
        // Reset email verification if email changed
        ...(email !== req.user.email && { isEmailVerified: false }),
      },
      { new: true, runValidators: true },
    ).select("-password")

    res.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error updating profile" })
  }
})

// Change password
router.put("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" })
    }

    const user = await User.findById(req.user._id)

    // Check if user has a password (not OAuth only)
    if (!user.password) {
      return res.status(400).json({ message: "Cannot change password for OAuth-only accounts" })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Server error changing password" })
  }
})

// Get user dashboard statistics
router.get("/dashboard-stats", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id

    // Get resume statistics
    const totalResumes = await Resume.countDocuments({ user: userId })
    const completedResumes = await Resume.countDocuments({ user: userId, status: "completed" })
    const draftResumes = await Resume.countDocuments({ user: userId, status: "draft" })

    // Get total downloads
    const downloadStats = await Resume.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } },
    ])

    const totalDownloads = downloadStats.length > 0 ? downloadStats[0].totalDownloads : 0

    // Get recent activity (last 5 resumes)
    const recentResumes = await Resume.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status updatedAt")

    // Get AI usage
    const user = await User.findById(userId).select("aiCreditsUsed aiCreditsLimit subscription")

    res.json({
      resumes: {
        total: totalResumes,
        completed: completedResumes,
        drafts: draftResumes,
      },
      downloads: {
        total: totalDownloads,
      },
      aiUsage: {
        creditsUsed: user.aiCreditsUsed,
        creditsLimit: user.aiCreditsLimit,
        creditsRemaining: user.aiCreditsLimit - user.aiCreditsUsed,
      },
      subscription: user.subscription,
      recentActivity: recentResumes,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ message: "Server error fetching dashboard statistics" })
  }
})

// Delete user account
router.delete("/account", requireAuth, async (req, res) => {
  try {
    const { password } = req.body

    const user = await User.findById(req.user._id)

    // Verify password for non-OAuth users
    if (user.password && password) {
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Password is incorrect" })
      }
    }

    // Delete all user's resumes
    await Resume.deleteMany({ user: req.user._id })

    // Delete user account
    await User.findByIdAndDelete(req.user._id)

    // Logout user
    req.logout((err) => {
      if (err) {
        console.error("Logout error during account deletion:", err)
      }
    })

    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Delete account error:", error)
    res.status(500).json({ message: "Server error deleting account" })
  }
})

// Upgrade subscription
router.post("/upgrade-subscription", requireAuth, async (req, res) => {
  try {
    const { plan } = req.body

    if (!["premium", "enterprise"].includes(plan)) {
      return res.status(400).json({ message: "Invalid subscription plan" })
    }

    // Update user subscription and AI credits
    const creditLimits = {
      free: 10,
      premium: 100,
      enterprise: 1000,
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscription: plan,
        aiCreditsLimit: creditLimits[plan],
      },
      { new: true },
    ).select("-password")

    res.json({
      message: `Successfully upgraded to ${plan} plan`,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Upgrade subscription error:", error)
    res.status(500).json({ message: "Server error upgrading subscription" })
  }
})

module.exports = router
