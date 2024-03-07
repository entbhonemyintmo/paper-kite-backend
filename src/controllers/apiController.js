const ApiKey = require("../models/ApiKey");
const generateJwtToken = require("../utils/generateJwtToken");
const generateRandomString = require("../utils/generateRandomString");
const getExpiration = require("../utils/getExpiration");

const generateApiKey = async (req, res, next) => {
  if (!req.body.description || !req.body.duration)
    return next(new HttpException(400, "Please fill all fields!"));

  try {
    const secret = generateRandomString(10);

    const expireAt = getExpiration(req.body.duration);

    const api = await new ApiKey({
      secret,
      _user: req.user.id,
      expireAt,
    }).save();

    const key = generateJwtToken(
      { id: req.user.id },
      secret,
      `${req.body.duration}d`
    );

    await ApiKey.findByIdAndUpdate(api.id, { key });

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

module.exports = { generateApiKey, getAllApiKeys };
