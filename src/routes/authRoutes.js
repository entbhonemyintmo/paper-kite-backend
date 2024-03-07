const router = require("express").Router();
const authController = require("../controllers/authController");
const { tokenGuard } = require("../middlewares/authCheck");

router.post("/login", authController.singIn);
router.post("/singup", authController.singUp);
router.get(
  "/refresh",
  tokenGuard(process.env.REFRESH_TOKEN_SECRET),
  authController.refreshToken
);

module.exports = router;
