const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
      details: errors
        .array()
        .map((err) => `${err.path}: ${err.msg}`)
        .join(", "),
    })
  }
  next()
}

const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  handleValidationErrors,
]

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
]

const validateResume = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and must be less than 100 characters"),
  body("personalInfo.fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name is required and must be between 2 and 100 characters"),
  body("personalInfo.email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  handleValidationErrors,
]

const validateProfileUpdate = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  handleValidationErrors,
]

module.exports = {
  validateRegistration,
  validateLogin,
  validateResume,
  validateProfileUpdate,
}
