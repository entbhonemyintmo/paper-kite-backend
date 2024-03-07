const User = require("../models/User");
const HttpException = require("../utils/httpException");
const verifyToken = require("../utils/verifyToken");

module.exports.tokenGuard = (secret) => async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return next(new HttpException(401, "No Auth Token"));

    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new HttpException(401, "No Auth Token"));

    const payload = await verifyToken(token, secret);

    const user = await User.findById(payload.id);
    if (!user) return next(new HttpException(401, "Invalid User"));

    req.refresh_token;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
