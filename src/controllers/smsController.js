const HttpException = require("../utils/httpException");
const readCsv = require("../utils/readCsv");

const Batch = require("../models/Batch");

const createBatch = async (req, res, next) => {
  if (!req.file) return next(new HttpException(400, "File not provided!"));
  if (!req.body.description || !req.body.scheduleAt)
    return next(new HttpException(400, "Please fill all fields!"));

  const file = req.file;
  const { description, scheduleAt } = req.body;

  try {
    const toSend = await readCsv(file.buffer);

    await new Batch({
      description,
      total: toSend.length,
      scheduleAt,
      createdAt: new Date().toISOString(),
      toSend,
      _user: req.user.id,
    }).save();

    res
      .status(201)
      .send({ statusCode: 201, message: "Batch created successfully!" });
  } catch (e) {
    next(e);
  }
};

const getAllBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find({ _user: req.user.id });

    res.status(200).send(batches);
  } catch (err) {
    next(err);
  }
};

module.exports = { createBatch, getAllBatches };
