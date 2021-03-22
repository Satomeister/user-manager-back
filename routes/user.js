const { Router } = require("express");
const userController = require("../controllers/user");
const passport = require('../core/passport')
const isAdmin = require('../middleware/isAdmin')

const route = Router();

route.get('/me', passport.authenticate('jwt'), userController.getMe)
route.delete('/:userId', passport.authenticate('jwt'), isAdmin, userController.delete)
route.get('/:userId', passport.authenticate('jwt'), isAdmin, userController.getById)
route.put('/:userId', passport.authenticate('jwt'), isAdmin, userController.accessToAdmin)
route.get('/', passport.authenticate('jwt'), isAdmin, userController.getUsersData)

module.exports = route;
