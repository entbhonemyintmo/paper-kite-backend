const jwt = require("jsonwebtoken");

const generateJwtToken = (payload, secret, expiresIn = "15m") => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

module.exports = generateJwtToken;
