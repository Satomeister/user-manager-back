const { Router } = require("express");
const authController = require("../controllers/auth");
const { register: registerValidation } = require("../utils/validation");

const route = Router();

route.post("/signup", registerValidation, authController.create);
route.post("/signin", authController.login);
route.get("/logout", authController.logout);
route.get('/refresh', authController.refresh)

module.exports = route;
