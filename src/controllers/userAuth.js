const User = require("../models/user");
const bcrypt = require("bcrypt");
// signup
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      about,
      photoUrl,
    } = req.body;

    // Validate request body
    if (!firstName || !emailId || !password || !age || !gender) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this email ID",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      skills,
      about,
      photoUrl,
    });

    // Save user to database
    const savedData = await user.save();

    return res.status(200).json({
      status: true,
      message: "User registered successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const checkExistingUser = await User.findOne({ emailId: emailId });
    if (!checkExistingUser) {
      return res.status(404).json({
        status: false,
        message: "Invalid credentials",
      });
    }
    const isMatchPassword = await checkExistingUser.validatePassword(password);
    if (isMatchPassword) {
      const token = await checkExistingUser.getJWT();
      checkExistingUser.password = undefined;
      return res
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json({
          status: true,
          message: "Login successful",
          token: token,
          data: checkExistingUser,
        });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong during login",
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Error during logout:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong during logout",
      error: err.message,
    });
  }
};
