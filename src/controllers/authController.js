const argon = require("argon2");
const generateJwtToken = require("../utils/generateJwtToken");
const HttpException = require("../utils/httpException");

const User = require("../models/User");

const singUp = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(new HttpException(400, "Please fill all fields!"));
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) return next(new HttpException(400, "Email already exists"));

  try {
    const hashedPassword = await argon.hash(password);
    await new User({ name, email, password: hashedPassword }).save();

    res.status(201).send({
      statusCode: 201,
      message: "User created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

const singIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new HttpException(400, "Email and Password Required"));
  }

  // const user = { id: 1, email: "entbhone@gmail.com" };
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new HttpException(404, `There is no account with ${req.body.email}`)
    );

  const passwordMatches = await argon.verify(user.password, req.body.password);
  if (!passwordMatches)
    return next(new HttpException(401, "Incorrect Password"));

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

const refreshToken = (req, res, next) => {
  const access_token = generateJwtToken(
    { id: req.user.id, email: req.user.email },
    process.env.ACCESS_TOKEN_SECRET
  );

  res
    .status(200)
    .send({ access_token, refresh_token: req.refresh_token, type: "Bearer" });
};

module.exports = { singUp, singIn, refreshToken };
