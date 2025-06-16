const GoogleStrategy = require("passport-google-oauth20").Strategy
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User")

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            return done(null, user)
          }

          user = await User.findOne({ email: profile.emails[0].value })

          if (user) {
            user.googleId = profile.id
            user.picture = profile.photos[0].value
            user.isEmailVerified = true
            await user.save()
            return done(null, user)
          }

          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            isEmailVerified: true,
          })

          await user.save()
          done(null, user)
        } catch (error) {
          console.error("Google OAuth error:", error)
          done(error, null)
        }
      },
    ),
  )

  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
          return done(null, false, { message: "Invalid email or password" })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}
