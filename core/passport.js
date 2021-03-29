const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
const UserModel = require("../models/user");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email })
          .populate({
            path: "profiles",
            options: { sort: { createdAt: -1 }, orderBy: -1 },
            limit: +process.env.PAGE_SIZE,
          })
          .exec();

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        done(null, user);
      } catch (error) {
        done(null, false);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: `'${process.env.JWT_SECRET}'`,
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.userId)
          .populate({
            path: "profiles",
            options: { sort: { createdAt: -1 }, orderBy: -1 },
            limit: process.env.PAGE_SIZE,
          })
          .exec();

        if (!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
