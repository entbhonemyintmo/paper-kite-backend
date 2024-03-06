const argon = require("argon2");
const generateJwtToken = require("../utils/generateJwtToken");
const HttpStatus = require("../utils/httpStatus");
const HttpException = require("../utils/httpException");

const User = require("../models/User");

const singUp = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(
      new HttpException(HttpStatus.BAD_REQUEST, "Please fill all fields!")
    );
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user)
    return next(
      new HttpException(HttpStatus.BAD_REQUEST, "Email already exists")
    );

  const hashedPassword = await argon.hash(password);

  try {
    await new User({ name, email, password: hashedPassword }).save();

    res.status(HttpStatus.CREATED).send({
      statusCode: HttpStatus.CREATED,
      message: "User created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

const singIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      new HttpException(HttpStatus.BAD_REQUEST, "Email and Password Required")
    );
  }

  // const user = { id: 1, email: "entbhone@gmail.com" };
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new HttpException(
        HttpStatus.NOT_FOUND,
        `There is no account with ${req.body.email}`
      )
    );

  const passwordMatches = await argon.verify(user.password, req.body.password);
  if (!passwordMatches)
    return next(
      new HttpException(HttpStatus.UNAUTHORIZED, "Incorrect Password")
    );

  const access_token = generateJwtToken(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET
  );

  const refresh_token = generateJwtToken(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    "4h"
  );

  res
    .status(HttpStatus.OK)
    .send({ access_token, refresh_token, type: "Bearer" });
};

module.exports = { singUp, singIn };
