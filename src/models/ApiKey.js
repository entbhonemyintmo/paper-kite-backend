const mongoose = require("mongoose");
const { Schema } = mongoose;

const apiKeySchema = new Schema({
  description: String,
  secret: String,
  key: String,
  isActive: { type: Boolean, default: true },
  expireAt: Date,
  _user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("apikeys", apiKeySchema);
