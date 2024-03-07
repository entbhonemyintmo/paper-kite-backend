const jwt = require("jsonwebtoken");
const ApiKey = require("../models/ApiKey");
const verifyToken = require("../utils/verifyToken");

const apiKeyGuard = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return next(new HttpException(401, "Api key not provided"));

    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new HttpException(401, "Api key not provided"));

    const payload = jwt.decode(token);

    const keyRecord = await ApiKey.findById(payload.keyId);

    await verifyToken(token, keyRecord.secret);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = apiKeyGuard;
