const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
exports.connectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user.userId;
    const { toUserId } = req.params;
    const status = req.params.status;
    const ALLOWED_STATUS = ["ignored", "interested"];
    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({
        status: false,
        message: "Your ID is not correct.",
      });
    }
    const isToUserIdExist = await User.findById(toUserId);

    if (!isToUserIdExist) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Invalid status type :${status}`,
      });
    }
    // Can't be send request to yourself. There are two technique You can validate schema level or API level.
    // if (fromUserId === toUserId) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "You can't send request to yourself.",
    //   });
    // }
    // If there is an existing connection request.
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).json({
        status: false,
        message: "Connection request already sent.",
      });
    }

    // create entry in database.
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    return res.status(200).json({
      status: true,
      message: "Connection request sent successfully.",
      data,
    });
  } catch (err) {
    console.error("Error in connection request:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while send request.",
      error: err.message,
    });
  }
};
exports.requestReview = async (req, res) => {
  try {
    const loggedInUser = req.user.userId;
    const { status, requestId } = req.params;
    // Validate the Status
    // Anuj => Aman
    // loggedInId = toUserId;
    // status = interested
    // Validate requestId
    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid request ID",
      });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Invalid status type :${status}`,
      });
    }
    // Find requestId is present in Database or not
    const connectionRequestData = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested",
    });
    if (!connectionRequestData) {
      return res.status(404).json({
        status: false,
        message: "Connection request not found",
      });
    }
    connectionRequestData.status = status;
    const data = await connectionRequestData.save();
    return res.status(200).json({
      status: true,
      message: `Connection Request ${status}.`,
      data: data,
    });
  } catch (err) {
    console.error("Error in connection request:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while send request.",
      error: err.message,
    });
  }
};
