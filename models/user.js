const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profiles: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

module.exports = model("user", UserSchema);
