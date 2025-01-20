const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const secret_key = process.env.SECRET_KEY;

exports.auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // req.body.token ||
    // req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    try {
      const decode = jwt.verify(token, secret_key);
      const { userId } = decode;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = decode;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong in authentication middleware." });
  }
};
