const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

module.exports = model("profile", ProfileSchema);
