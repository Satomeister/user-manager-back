const { body } = require("express-validator");

module.exports = {
  register: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Please enter an email")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please enter a password")
      .isLength({ min: 6 })
      .withMessage("Password must be at lease 6 characters")
      .isLength({ max: 128 })
      .withMessage("Password must be less than 128 characters"),
  ],
};
