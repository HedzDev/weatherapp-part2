var express = require("express");
var router = express.Router();
const { register, connect, logout } = require("../controllers/usersController");

router.post("/register", register);
router.post("/connect", connect);
router.post("/logout", logout);

module.exports = router;
