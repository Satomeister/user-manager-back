const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("profile", ProfileSchema);
