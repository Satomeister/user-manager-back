const UserModel = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("../core/passport");

class AuthController {
  async create(req, res) {
    try {
      const errorsData = validationResult(req);
      if (!errorsData.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: errorsData.errors[0].msg,
        });
      }

      const data = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
      };

      const candidate = await UserModel.findOne({
        email: data.email,
      });

      if (candidate) {
        return res.status(400).json({
          status: "error",
          message: "User with this email already exists",
        });
      }

      let user = await UserModel.create(data);

      const userData = user.toJSON();

      res.json({
        status: "success",
        data: {
          user: userData,
          token: jwt.sign({ userId: user._id }, `'${process.env.JWT_SECRET}'`, {
            expiresIn: process.env.EXPIRES_IN,
          }),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async login(req, res, next) {
    passport.authenticate("local", async function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).json({ message: info.message });
      }

      const userData = user.toJSON();

      return res.json({
        status: "success",
        data: {
          user: userData,
          token: jwt.sign({ userId: user._id }, `'${process.env.JWT_SECRET}'`, {
            expiresIn: process.env.EXPIRES_IN,
          }),
        },
      });
    })(req, res, next);
  }

  async logout(req, res) {
    try {
      req.user = null;
      res.json({
        status: "success",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async refresh(req, res) {
    try {
      const token = req.headers.token;
      const decoded = jwt.verify(token, `'${process.env.JWT_SECRET}'`, {
        ignoreExpiration: true,
      });

      const refreshedToken = jwt.sign(
        { userId: decoded.userId },
        `'${process.env.JWT_SECRET}'`,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      res.json({
        status: "success",
        data: refreshedToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }
}

module.exports = new AuthController();
