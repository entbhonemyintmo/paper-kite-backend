const { createReadStream } = require("fs");
const { createInterface } = require("readline");

const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const toSend = [];
    let isFirstRow = true;

    const readStream = createReadStream(filePath);
    const lineReader = createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    lineReader.on("line", (line) => {
      if (isFirstRow) {
        isFirstRow = false;
        return;
      }

      const [phoneNumber, message] = line.trim().split(",");

      if (phoneNumber !== "" && message !== "") {
        toSend.push({ phoneNumber, message });
      }
    });

    lineReader.on("close", () => resolve(toSend));
    readStream.on("error", (e) => reject(e));
  });
};

module.exports = readCsv;
