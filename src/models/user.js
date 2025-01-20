const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      index: true,
      trim: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: [true, "Email Id is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (
          !["Male", "male", "Female", "female", "Others", "others"].includes(
            value
          )
        ) {
          throw new Error("Gender is not valid");
        }
      },
      // enum: ["Male", "Female", "Others"],
    },
    photoUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
//  Index Creation of the firstName and lastName
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { userId: user._id, email: user.emailId },
    SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
