const HttpException = require("../utils/httpException");

const errorHandler = (err, req, res, next) => {
  // If the error is an instance of HttpException, send the status and message
  if (err instanceof HttpException) {
    res
      .status(err.status)
      .send({ statusCode: err.status, message: err.message });
  } else {
    // Handle other types of errors
    console.error(err);
    res.status(500).send({ statusCode: 500, message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
