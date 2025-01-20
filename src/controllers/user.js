const connectionRequest = require("../models/connectionRequest");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");
const USER_SAFE_DATA = "firstName lastName age gender skills photoUrl";
exports.requestReceive = async (req, res) => {
  try {
    // check user is logged in
    const { userId } = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    })
      .populate("fromUserId", "firstName lastName about gender skills age")
      // }).populate("fromUserId",["firstName","lastName"])
      .exec();
    if (connectionRequest.length === 0) {
      return res.status(401).json({
        status: true,
        message: "No connections found",
      });
    }
    return res.status(200).json({
      requests: connectionRequest.length,
      status: true,
      message: "Connections fetched successfully",
      connections: connectionRequest,
    });
  } catch (err) {
    console.error("Error fetching user connections:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching user connections",
      error: err.message,
    });
  }
};

exports.userConnections = async (req, res) => {
  try {
    //check loggedIn user
    const { userId } = req.user;
    // Aman => Anuj => accepted
    // Anuj => Sadhana => accepted
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: userId, status: "accepted" },
          { fromUserId: userId, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA)
      .exec();
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === userId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res.json({
      number_of_connections: data.length,
      connections: data,
      status: true,
      message: "Connections fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching user connections:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching user connections",
      error: err.message,
    });
  }
};

exports.feed = async (req, res) => {
  try {
    // User should see all the user cards except
    // 0. His own card
    // 1. His connection
    // 2. ignored peaple.
    // 4. Already send the connection request.
    // Example : Rahul = [Mark,Donald, MS Dhoni, Virat]
    // R -> Anuj, R-> Elon
    // R-> Anuj --> rejected  R-> Elon -> accepted
    // Elon -> Elon see everyone but not see Rahul. because he is accepted and became friends to each other.
    // Anuj feed should not show Rahul because Rahul have ignored Anuj request.

    // LoggedIn User ->
    const { userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // Find all connection request (send + received)
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
      .select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    // console.log("Hide::", hideUserFromFeed);
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: userId } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    const userSize = user.length;
    return res.status(200).json({
      userSize,
      status: true,
      message: "User feed fetched successfully",
      users: user,
    });
  } catch (err) {
    console.error("Error fetching user feed:", err.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching user feed",
      error: err.message,
    });
  }
};
