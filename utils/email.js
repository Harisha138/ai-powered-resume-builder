const nodemailer = require("nodemailer")

// Create transporter
const createTransporter = () => {
  // Check if email configuration exists
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    // Gmail configuration
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })
  } else if (process.env.SENDGRID_API_KEY) {
    // SendGrid configuration
    return nodemailer.createTransporter({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  } else if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
    // Ethereal configuration
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    })
  } else {
    // No email configuration - return null
    console.warn("No email configuration found. Email features will be disabled.")
    return null
  }
}

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      console.log("Email sending skipped - no email configuration")
      return { success: false, message: "Email configuration not found" }
    }

    // ... rest of the email sending code remains the same
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.GMAIL_USER || "noreply@resumebuilder.com",
      to: email,
      subject: "Verify Your Email - AI Resume Builder",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Welcome to AI Resume Builder!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Verification email sent to:", email)
    return { success: true }
  } catch (error) {
    console.error("Error sending verification email:", error)
    return { success: false, error: error.message }
  }
}

const sendPasswordResetEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      console.log("Email sending skipped - no email configuration")
      return { success: false, message: "Email configuration not found" }
    }

    // ... rest of the password reset email code remains the same
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.GMAIL_USER || "noreply@resumebuilder.com",
      to: email,
      subject: "Reset Your Password - AI Resume Builder",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            For security reasons, this link will only work once and expires in 1 hour.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Password reset email sent to:", email)
    return { success: true }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
}
