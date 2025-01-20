const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/profile");

router.get("/users", getAllUsers);
router.get("/profile/view", auth, getUser);
router.patch("/profile/edit", auth, updateUser);
router.delete("/profile/delete", auth, deleteUser);
module.exports = router;
