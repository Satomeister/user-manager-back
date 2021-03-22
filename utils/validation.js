const { body } = require("express-validator");

module.exports = {
  register: [
    body("fullName")
      .not()
      .isEmpty()
      .withMessage("Please enter a fullname")
      .isLength({ min: 6 })
      .withMessage("FullName must be at lease 6 characters")
      .isLength({ max: 70 })
      .withMessage("FullName must be less than 70 characters"),
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
  profile: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Please enter a name")
      .isLength({ min: 3 })
      .withMessage("Name must be at lease 3 characters")
      .isLength({ max: 40 })
      .withMessage("Password must be less than 40 characters"),
    body("city")
      .not()
      .isEmpty()
      .withMessage("Please enter a city")
      .isLength({ max: 50 })
      .withMessage("Password must be less than 50 characters"),
    body("birthdate")
      .not()
      .isEmpty()
      .withMessage("Please enter a birthdate")
      .matches(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$/)
      .withMessage("Birthdate is invalid"),
  ],
};
