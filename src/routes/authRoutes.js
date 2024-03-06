const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/login", authController.singIn);
router.post("/singup", authController.singUp);

module.exports = router;
