const mongoose = require("mongoose");
const { status } = require("../utils/batchStatus");
const { Schema } = mongoose;

const apiSentSchema = new Schema({
  phoneNumber: String,
  message: String,
  status: {
    type: String,
    enum: Object.values(status),
  },
  sentDate: Date,
});

module.exports = mongoose.model("apisents", apiSentSchema);
