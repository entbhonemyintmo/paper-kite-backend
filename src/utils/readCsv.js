const { Readable } = require("stream");
const { createInterface } = require("readline");

const readCsvFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const toSend = [];
    let isFirstRow = true;

    const readStream = Readable.from(fileBuffer);

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

    lineReader.on("close", () => {
      fileBuffer = null;
      resolve(toSend);
    });

    lineReader.on("error", (e) => {
      fileBuffer = null;
      reject(e);
    });
  });
};

module.exports = readCsvFromBuffer;
