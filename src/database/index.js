const mongoose = require("mongoose");

const connectDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => {
        resolve("Connected to the database.");
      })
      .catch((err) => reject(err));
  });
};

module.exports = { connectDatabase };
