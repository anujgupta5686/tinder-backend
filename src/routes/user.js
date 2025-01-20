const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const {
  requestReceive,
  userConnections,
  feed,
} = require("../controllers/user");
router.get("/user/requests/received", auth, requestReceive);
router.get("/user/connections", auth, userConnections);
router.get("/user/feed", auth, feed);
module.exports = router;
