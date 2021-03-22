const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./core/db");
const passport = require("./core/passport");

const authRoute = require("./routes/auth");
const userRoute = require('./routes/user')
const profileRoute = require("./routes/profile");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use('/api/user', userRoute)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`${PORT} running`);
});
