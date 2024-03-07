const HttpException = require("../utils/httpException");
const readCsv = require("../utils/readCsv");

const Batch = require("../models/Batch");

const createBatch = async (req, res, next) => {
  if (!req.file) return next(new HttpException(400, "File not provided!"));
  if (!req.body.description || !req.body.schedule_at)
    return next(new HttpException(400, "Please fill all fields!"));

  const file = req.file;
  const { description, scheduleAt } = req.body;

  try {
    const toSend = await readCsv(file.path);

    await new Batch({
      description,
      total: toSend.length,
      scheduleAt,
      createdAt: new Date().toISOString(),
      toSend,
    }).save();

    res
      .status(201)
      .send({ statusCode: 201, message: "Batch created successfully!" });
  } catch (e) {
    next(e);
  }
};

module.exports = { createBatch };
