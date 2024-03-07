const router = require("express").Router();
const apiController = require("../controllers/apiController");
const apiKeyGuard = require("../middlewares/apiKeyCheck");
const { tokenGuard } = require("../middlewares/authCheck");

router.post(
  "/key",
  tokenGuard(process.env.ACCESS_TOKEN_SECRET),
  apiController.generateApiKey
);

router.get(
  "/keys",
  tokenGuard(process.env.ACCESS_TOKEN_SECRET),
  apiController.getAllApiKeys
);

router.post("/send", apiKeyGuard, apiController.sendMessage);

module.exports = router;
