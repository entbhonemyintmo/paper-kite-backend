const ApiKey = require("../models/ApiKey");
const generateJwtToken = require("../utils/generateJwtToken");
const generateRandomString = require("../utils/generateRandomString");
const getExpiration = require("../utils/getExpiration");

const api = require("axios");
const HttpException = require("../utils/httpException");
const ApiSent = require("../models/ApiSent");
const { status } = require("../utils/batchStatus");

const generateApiKey = async (req, res, next) => {
  if (!req.body.description || !req.body.duration)
    return next(new HttpException(400, "Please fill all fields!"));

  try {
    const secret = generateRandomString(10);

    const expireAt = getExpiration(req.body.duration);

    const apiKey = await new ApiKey({
      description: req.body.description,
      secret,
      _user: req.user.id,
      expireAt,
    }).save();

    const key = generateJwtToken(
      { id: req.user.id, keyId: apiKey.id },
      secret,
      `${req.body.duration}d`
    );

    await ApiKey.findByIdAndUpdate(apiKey.id, { key });

    res
      .status(201)
      .send({ statuCode: 201, message: "Api key generated successful!" });
  } catch (err) {
    next(err);
  }
};

const getAllApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ _user: req.user.id });

    res.status(200).send(keys);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.message) {
    return next(new HttpException(422, "Missing some parameters!"));
  }

  const { phoneNumber, message } = req.body;
  try {
    const record = await new ApiSent({
      phoneNumber,
      message,
      _user: req.payload.id,
    }).save();

    const apiRes = await api.post(
      `${process.env.SMS_GATEWAY_URL}/send`,
      req.body
    );

    if (apiRes.status === 200) {
      await ApiSent.findByIdAndUpdate(record.id, {
        status: status.SUCCESS,
        sentDate: new Date().toISOString(),
      });
    } else {
      await ApiSent.findByIdAndUpdate(record.id, {
        status: status.FAILED,
        sentDate: new Date().toISOString(),
      });
    }

    res.status(200).send({ statusCode: 200, message: "Message sent!" });
  } catch (err) {
    next(err);
  }
};

const getAllApiLogs = async (req, res, next) => {
  try {
    const apiLogs = await ApiSent.find({ _user: req.user.id });

    res.status(200).send(apiLogs);
  } catch (err) {
    next(err);
  }
};

module.exports = { generateApiKey, getAllApiKeys, sendMessage, getAllApiLogs };
