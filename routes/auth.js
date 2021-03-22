const { Router } = require("express");
const userController = require("../controllers/user");
const { register: registerValidation } = require("../utils/validation");

const route = Router();

route.post("/signup", registerValidation, userController.create);
route.post("/signin", userController.login);
route.get("/logout", userController.logout);

module.exports = route;
