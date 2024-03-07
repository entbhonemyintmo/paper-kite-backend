const mongoose = require("mongoose");
const { Schema } = mongoose;

const toSendSchema = new Schema({
  phoneNumber: String,
  message: String,
  isSent: { type: Boolean, default: false },
  dateSent: Date,
});

module.exports = toSendSchema;
