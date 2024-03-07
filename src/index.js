const express = require("express");
require("dotenv").config();

const { connectDatabase } = require("./database");

const app = express();

/**
 * Importing Middlewares
 */
const bodyParser = require("body-parser");

/**
 * Importing Routes
 */
const authRoutes = require("./routes/authRoutes");
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

/**
 * Error handler middleware must below of all routes register
 */
app.use(errorHandler);

const PORT = process.env.PORT || 8001;

app.listen(PORT, async () => {
  console.log(await connectDatabase());

  console.log(`Server running at port ${PORT}`);
});
