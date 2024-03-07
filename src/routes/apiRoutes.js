const router = require("express").Router();
const apiController = require("../controllers/apiController");
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

module.exports = router;
