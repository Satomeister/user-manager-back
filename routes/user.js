const { Router } = require("express");
const userController = require("../controllers/user");
const passport = require("../core/passport");
const isAdmin = require("../middleware/isAdmin");
const { register: registerValidation } = require("../utils/validation");

const route = Router();

route.get("/", passport.authenticate("jwt"), isAdmin, userController.getUsers);
route.get(
  "/count",
  passport.authenticate("jwt"),
  isAdmin,
  userController.getTotalUsersCount
);
route.get(
  "/data",
  passport.authenticate("jwt"),
  isAdmin,
  userController.getUsersData
);
route.put(
  "/:userId",
  passport.authenticate("jwt"),
  registerValidation,
  isAdmin,
  userController.edit
);
route.get("/me", passport.authenticate("jwt"), userController.getMe);
route.delete(
  "/:userId",
  passport.authenticate("jwt"),
  isAdmin,
  userController.delete
);
route.get(
  "/:userId",
  passport.authenticate("jwt"),
  isAdmin,
  userController.getById
);
route.put(
  "/:userId",
  passport.authenticate("jwt"),
  isAdmin,
  userController.accessToAdmin
);

module.exports = route;
