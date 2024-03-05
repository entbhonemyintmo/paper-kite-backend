const jwt = require("jsonwebtoken");

const generateJwtToken = (user, secret, expiresIn = "15m") => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn,
  });
};

module.exports = generateJwtToken;
