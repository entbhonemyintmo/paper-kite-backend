const mongoose = require("mongoose");
const toSendSchema = require("./ToSend");
const { BatchStatus } = require("../utils/batchStatus");
const { Schema } = mongoose;

const batchSchema = new Schema({
  description: String,
  total: Number,
  success: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  status: {
    type: String,
    enum: Object.values(BatchStatus),
    default: BatchStatus.PENDING,
  },
  toSend: [toSendSchema],
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  scheduleAt: Date,
  compeleteDate: Date,
  createdAt: Date,
});

const Batch = mongoose.model("batches", batchSchema);

module.exports = Batch;
