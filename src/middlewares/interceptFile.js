const multer = require("multer");
const HttpException = require("../utils/httpException");

const interceptFile = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new HttpException(400, "Only CSV files are allowed"));
    }
  },
});

module.exports = interceptFile;
