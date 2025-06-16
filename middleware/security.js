const rateLimit = require("express-rate-limit")
const helmet = require("helmet")

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// General API rate limit
const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests from this IP, please try again later.",
)

// Strict rate limit for auth endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later.",
)

// AI endpoint rate limit
const aiLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // limit each IP to 10 AI requests per minute
  "Too many AI requests, please slow down.",
)

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
  securityHeaders,
}
