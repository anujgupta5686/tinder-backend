const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const { signup, login, logout } = require("../controllers/userAuth");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
module.exports = router;
