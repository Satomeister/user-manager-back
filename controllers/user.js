const UserModel = require("../models/user");
const ProfileModel = require("../models/profile");

class UserController {
  async getUsers(req, res) {
    try {
      const users = await UserModel.find({ _id: { $ne: req.user._id } })
        .sort({ createdAt: -1 })
        .skip((+req.query.page - 1) * process.env.PAGE_SIZE)
        .limit(+process.env.PAGE_SIZE);

      res.json({
        status: "success",
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async getTotalUsersCount(req, res) {
    try {
      const usersCount = await UserModel.countDocuments({});

      res.json({
        status: "success",
        data: usersCount,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async getMe(req, res) {
    try {
      res.json({
        status: "success",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async edit(req, res) {
    try {
      const data = {
        fullname: req.body.fullname,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
      };

      const user = await UserModel.findByIdAndUpdate(req.params.userId, data, {
        new: true,
      }).populate("profiles");

      res.json({
        status: "success",
        data: user,
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
      const user = await UserModel.findById(req.params.userId);

      await ProfileModel.deleteMany({
        _id: { $in: user.profiles },
      });

      if (!user || user._id.toString() === req.user._id.toString()) {
        return res.status(404).json({
          status: "error",
          message: "User was not found",
        });
      }

      await user.remove();

      res.status(204).json({ status: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async getById(req, res) {
    try {
      const user = await UserModel.findById(req.params.userId).populate({
        path: "profiles",
        options: { sort: { createdAt: -1 }, orderBy: -1 },
        skip: (+req.query.page - 1) * process.env.PAGE_SIZE,
        limit: +process.env.PAGE_SIZE,
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User was not found",
        });
      }

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async accessToAdmin(req, res) {
    try {
      const user = await UserModel.findByIdAndUpdate(req.params.userId, {
        isAdmin: true,
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User was not found",
        });
      }

      res.status(204).json({ status: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        error,
      });
    }
  }

  async getUsersData(req, res) {
    try {
      const users = await UserModel.countDocuments({});

      const profiles = await ProfileModel.find({});

      const profilesCount = profiles.length;

      const majorityProfilesCount = profiles.filter(
        (user) => new Date() - new Date(user.birthdate) > 567648000000
      ).length;

      res.json({
        status: "success",
        data: {
          usersCount: users,
          profilesCount,
          majorityProfilesCount,
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
}

module.exports = new UserController();
