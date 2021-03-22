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

      const dateParts = req.body.birthdate.split("/");

      const data = {
        owner: req.user,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
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

      await user.save();

      if (!profile) {
        return res.status(400).send();
      }

      res.json({
        status: "success",
        data: profile,
      });
    } catch (error) {
      console.log(error)
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

      const dateParts = req.body.birthdate.split("/");

      const data = {
        owner: req.user,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
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
        return res.status(400).json({
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
      const data = {
        profileId: req.params.profileId,
      };

      let profile;

      if (req.user.isAdmin) {
        profile = await ProfileModel.findOneAndDelete({ _id: data.profileId });
      } else {
        profile = await ProfileModel.findOneAndDelete({
          _id: data.profileId,
          owner: req.user,
        });
      }

      if (!profile) {
        return res.status(400).json({
          status: "error",
          message: "Profile was not found",
        });
      }

      const owner = await UserModel.findById(profile.owner);

      if (!owner) {
        return res.status(400).send();
      }

      owner.profiles = owner.profiles.filter((id) => id.toString() !== profile._id.toString());

      await owner.save();

      res.json({ status: "success" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }
}

module.exports = new ProfileController();
