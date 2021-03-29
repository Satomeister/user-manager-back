const ProfileModel = require("../models/profile");
const UserModel = require("../models/user");
const { validationResult } = require("express-validator");

class ProfileController {
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
        owner: req.user._id,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        city: req.body.city,
      };

      const candidate = await ProfileModel.findOne({
        owner: data.owner,
        name: data.name,
      });

      if (candidate) {
        return res.status(400).json({
          status: "error",
          message: "Profile with such name already exists",
        });
      }

      const profile = await ProfileModel.create(data);

      const user = await UserModel.findById(data.owner);

      user.profiles.push(profile);
      user.profilesCount += 1;

      await user.save();

      if (!profile) {
        return res.status(400).send();
      }

      res.json({
        status: "success",
        data: profile,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async getNewChunk(req, res) {
    try {
      let user;

      if (req.user.isAdmin) {
        user = await UserModel.findById(req.params.userId).populate({
          path: "profiles",
          options: { sort: { createdAt: -1 }, orderBy: -1 },
          skip: (+req.query.page - 1) * process.env.PAGE_SIZE,
          limit: +process.env.PAGE_SIZE,
        });
      } else {
        user = await UserModel.findById(req.params.userId).populate({
          path: "profiles",
          options: { sort: { createdAt: -1 }, orderBy: -1 },
          skip: (+req.query.page - 1) * process.env.PAGE_SIZE,
          limit: +process.env.PAGE_SIZE,
        });
      }

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "User was not fount",
        });
      }

      res.json({
        status: "success",
        data: user.profiles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async edit(req, res) {
    try {
      const errorsData = validationResult(req);

      if (!errorsData.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: errorsData.errors[0].msg,
        });
      }

      const data = {
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        city: req.body.city,
      };

      let profile;

      if (req.user.isAdmin) {
        profile = await ProfileModel.findOneAndUpdate(
          { _id: req.params.profileId },
          data,
          { new: true }
        );
      } else {
        profile = await ProfileModel.findOneAndUpdate(
          { _id: req.params.profileId, owner: req.user },
          data,
          { new: true }
        );
      }

      if (!profile) {
        return res.status(404).json({
          status: "error",
          message: "Profile was not found",
        });
      }

      res.json({
        status: "success",
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async delete(req, res) {
    try {
      let profile;

      if (req.user.isAdmin) {
        profile = await ProfileModel.findOneAndDelete({
          _id: req.params.profileId,
        });
      } else {
        profile = await ProfileModel.findOneAndDelete({
          _id: req.params.profileId,
          owner: req.user,
        });
      }

      if (!profile) {
        return res.status(404).json({
          status: "error",
          message: "Profile was not found",
        });
      }

      const owner = await UserModel.findById(profile.owner);

      if (!owner) {
        return res.status(400).send();
      }

      owner.profiles = owner.profiles.filter(
        (id) => id.toString() !== profile._id.toString()
      );
      owner.profilesCount -= 1;

      await owner.save();

      res.status(204).json({ status: "success" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }
}

module.exports = new ProfileController();
