const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const {
  connectionRequest,
  requestReview,
} = require("../controllers/connectionRequest");

router.post("/request/send/:status/:toUserId", auth, connectionRequest);
router.post("/request/review/:status/:requestId", auth, requestReview);
module.exports = router;
