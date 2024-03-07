const { tokenGuard } = require("../middlewares/authCheck");
const { createBatch } = require("../controllers/smsController");
const interceptFile = require("../middlewares/interceptFile");

const router = require("express").Router();

router.use(tokenGuard(process.env.ACCESS_TOKEN_SECRET));

router.post("/batch", interceptFile.single("csvFile"), createBatch);

module.exports = router;
