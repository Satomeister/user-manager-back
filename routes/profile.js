const { Router } = require("express");
const passport = require("../core/passport");
const profileController = require("../controllers/profile");
const { profile: profileValidation } = require("../utils/validation");

const route = Router();

route.post("/", passport.authenticate("jwt"), profileValidation, profileController.create);
route.delete('/:profileId', passport.authenticate('jwt'), profileController.delete)
route.put('/edit/:profileId', passport.authenticate('jwt'), profileController.edit)

module.exports = route;
