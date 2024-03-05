const generateJwtToken = require("../utils/generateJwtToken");

const User = require("../models/User");

const singIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Email and Password Required",
    });
  }

  const user = { id: 1, email: "entbhone@gmail.com" };
  // const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.send(404).send({ message: "Sorry!, user not found" });
  }

  const access_token = generateJwtToken(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET
  );

  const refresh_token = generateJwtToken(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    "4h"
  );

  res.status(200).send({ access_token, refresh_token, type: "Bearer" });
};

module.exports = singIn;
