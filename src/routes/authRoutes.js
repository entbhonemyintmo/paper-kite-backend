const router = require("express").Router();
const singIn = require("../controllers/authController");

router.post("/login", singIn);

module.exports = router;
