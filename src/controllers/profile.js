const User = require("../models/user");
// Feed data/ get all users.
exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find({});
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Empty Collections.",
      });
    }
    return res.status(200).json({
      status: true,
      message: "User data fetched successfully",
      data,
    });
  } catch (err) {
    console.error("Error during fetching profile:", error.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching profile",
      error: err.message,
    });
  }
};

// Get Single user
exports.getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    // if (!mongoose.isValidObjectId(userId)) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid user ID",
    //   });
    // }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Single User fetched successfully",
      user,
    });
  } catch (err) {
    console.error("Error during fetching profile:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching profile",
      error: err.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { userId } = req.user;
    const loggedInUser = req.user;
    console.log("loggedInUser", loggedInUser);
    const updatedData = req.body;

    // Validate userId
    // if (!mongoose.isValidObjectId(userId)) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid user ID",
    //   });
    // }

    const ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];
    const SKILL_LIMIT = 5;

    // Validate update fields
    const isUpdateAllowed = Object.keys(updatedData).every((key) => {
      if (!ALLOWED_UPDATE.includes(key)) return false;

      if (key === "skills") {
        const skills = updatedData.skills;

        // Check if skills is an array
        if (!Array.isArray(skills)) {
          throw new Error("Skills must be an array.");
        }

        // Normalize skills (convert to lowercase)
        const normalizedSkills = skills.map((skill) => skill.toLowerCase());

        // Check for duplicates
        const uniqueSkills = new Set(normalizedSkills);
        if (uniqueSkills.size !== normalizedSkills.length) {
          throw new Error(
            "Duplicate values (case-insensitive) are not allowed in skills."
          );
        }

        // Check if the skills array exceeds the limit
        if (skills.length > SKILL_LIMIT) {
          throw new Error(
            `Skills array should have a maximum of ${SKILL_LIMIT} items.`
          );
        }

        // Overwrite updatedData.skills with normalized skills
        updatedData.skills = Array.from(uniqueSkills);
      }

      return true;
    });

    if (!isUpdateAllowed) {
      return res.status(400).json({
        status: false,
        message: "Invalid update fields.",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found. Please check the user ID.",
      });
    }

    // Success response
    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Error during updating profile:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while updating profile",
      error: err.message,
    });
  }
};

// Delete delete
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;
    // if (!mongoose.isValidObjectId(userId)) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid user ID",
    //   });
    // }
    // Validate userId
    const data = await User.findById(userId);
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    // Delete user data
    const deletedData = await User.findByIdAndDelete(userId);
    // Success response
    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: deletedData,
    });
  } catch (err) {
    console.error("Error during deleting profile:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while deleting profile",
      error: err.message,
    });
  }
};

// get connection request
