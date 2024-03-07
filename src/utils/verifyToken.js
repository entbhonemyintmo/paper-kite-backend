const jwt = require("jsonwebtoken");

const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    });
  });
};

module.exports = verifyToken;
