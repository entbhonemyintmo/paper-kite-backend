const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./jobs/sendSms");

const { connectDatabase } = require("./database");

const app = express();
app.use(cors());

/**
 * Importing Middlewares
 */
const bodyParser = require("body-parser");

/**
 * Importing Routes
 */
const authRoutes = require("./routes/authRoutes");
const smsRoutes = require("./routes/smsRoutes");
const apiRoutes = require("./routes/apiRoutes");
const errorHandler = require("./middlewares/errorHandler");

/**
 * Registering Middlewares
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Registering Routes
 */
app.use("/auth", authRoutes);
app.use("/sms", smsRoutes);
app.use("/api", apiRoutes);

/**
 * Error handler middleware must below of all routes register
 */
app.use(errorHandler);

const PORT = process.env.PORT || 8001;

app.listen(PORT, async () => {
  console.log(await connectDatabase());

  console.log(`Server running at port ${PORT}`);
});
