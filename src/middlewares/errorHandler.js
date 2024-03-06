const HttpException = require("../utils/httpException");
const HttpStatus = require("../utils/httpStatus");

const errorHandler = (err, req, res, next) => {
  /**
   * If the error is an instance of HttpException, send the status and message
   */
  if (err instanceof HttpException) {
    res
      .status(err.status)
      .send({ statusCode: err.status, message: err.message });
  } else {
    // Handle other types of errors
    console.error(err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
