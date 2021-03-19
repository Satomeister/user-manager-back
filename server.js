const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./core/db");

const authRoute = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`${PORT} running`);
});
