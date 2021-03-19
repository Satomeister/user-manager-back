const UserModel = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("../core/passport");

class UserController {
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

      const user = await UserModel.create(data);

      const userData = user.toJSON();

      res.json({
        status: "success",
        data: {
          user: userData,
          token: jwt.sign({ data: user }, `'${process.env.JWT_SECRET}'`, {
            expiresIn: "30d",
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
          ...userData,
          token: jwt.sign({ data: user }, `'${process.env.JWT_SECRET}'`, {
            expiresIn: "30d",
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
}

module.exports = new UserController();
