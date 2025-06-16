const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    picture: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free",
    },
    aiCreditsUsed: {
      type: Number,
      default: 0,
    },
    aiCreditsLimit: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model("User", userSchema)
