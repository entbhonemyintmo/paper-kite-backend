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

router.get("/send", apiKeyGuard, (req, res) => {
  res.status(200).send({ statuCode: 200, message: "got it!" });
});

module.exports = router;
