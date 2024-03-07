const { JsonWebTokenError } = require("jsonwebtoken");
const HttpException = require("../utils/httpException");

const errorHandler = (err, req, res, next) => {
  /**
   * Handling the custom throw Error
   */
  if (err instanceof HttpException) {
    res
      .status(err.status)
      .send({ statusCode: err.status, message: err.message });

    /**
     * Handling JWT related Error
     */
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).send({
      statusCode: 401,
      message: err.message,
    });

    /**
     * Handle other types of errors
     */
  } else {
    console.error(err);

    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
