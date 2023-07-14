const express = require("express");
const router = express.Router();

// importing models
const User = require("../db/models/users");

// importing middlewares
const verifyToken = require("../middleware/verifyToken");

// route to send request to a user
router.post("/sendRequest", verifyToken, async (req, res) => {
  // extract the search param
  const searchUser = req.body.username;
  console.log("searching for username : ", searchUser);

  // fetch the user from the db
  const user = await User.findOne({ username: searchUser });

  // check if the user exist
  if (!user) {
    console.log("user does not exist");
    return res
      .status(404)
      .json({ message: "user with that username does not exist" });
  }
  console.log("Found user : ", user);

  // create a request object
  const friendRequest = {
    senderId: req.userId,
    recipientId: user._id.toString(),
    status: "pending",
  };

  // update the sender and recipient users
  const sender = await User.findById(req.userId);
  console.log("this is sender : ", sender);
  // Check if the friend request object already exists in the sender's requests array
  const senderRequestExists = sender.requests.some((request) => {
    return (
      request.senderId.toString() === friendRequest.senderId.toString() &&
      request.recipientId.toString() === friendRequest.recipientId.toString()
    );
  });

  // Check if the friend request object already exists in the recipient's requests array
  const recipientRequestExists = user.requests.some((request) => {
    return (
      request.senderId.toString() === friendRequest.senderId.toString() &&
      request.recipientId.toString() === friendRequest.recipientId.toString()
    );
  });

  // If the friend request exists in both arrays, log "exists"
  if (senderRequestExists && recipientRequestExists) {
    console.log(
      "Friend request already exists in both sender and recipient arrays"
    );
    return res.status(403).json({ message: "Request already sent" });
  } else {
    // If the friend request does not exist in either array, push it to both arrays
    sender.requests.push(friendRequest);
    user.requests.push(friendRequest);
  }

  const res1 = await sender.save();
  const res2 = await user.save();

  console.log("request object created", friendRequest);

  res.json({ message: "Friend request sent !!!" });
});

// route to view all request in the user documents
router.get("/requests", verifyToken, async (req, res) => {
  // get the user object
  const user = await User.findById(req.userId);

  // divider the reqests in send and received
  let sent = [];
  let received = [];

  for (let i = 0; i < user.requests.length; i++) {
    let senderObj = await User.findById(user.requests[i].senderId);
    let userObj = await User.findById(user.requests[i].recipientId);
    requestObj = {
      ...user.requests[i],
      senderUsername: senderObj.username,
      recipientUsername: userObj.username,
    };

    if (user.requests[i].senderId === req.userId) {
      sent.push(requestObj);
    } else {
      received.push(requestObj);
    }
  }

  // fetch the requests array and attach in response
  res.json({ sent: sent, received: received });
});

// route to accept or reject friend request
router.post("/handle-request", verifyToken, async (req, res) => {
  // get the request object with updated state
  const updatedRequest = req.body;

  // find the initiating user
  const user = await User.findById(req.userId);

  // find the matching request
  const matchedRequest = user.requests.findIndex((item) => {
    return (
      item.senderId === updatedRequest.senderId &&
      item.recipientId === updatedRequest.recipientId
    );
  });
  if (user.requests[matchedRequest].status === "accept") {
    return res.json({ message: "You are already friends" });
  }

  if (matchedRequest == -1) {
    return res.status(500).json({ message: "invalid request object" });
  }

  // accept the request
  if (updatedRequest.status) {
    // recipient  : update request status

    let userUpdatedRequests = user.requests.map((item) => {
      if (item.senderId === user.requests[matchedRequest].senderId) {
        return { ...item, status: updatedRequest.status };
      }
      return item;
    });
    user.requests = userUpdatedRequests;

    // user.requests[matchedRequest].status = "accepted";
    await user.save();

    // recipient : get the sender username and add to friends
    let sender = await User.findById(user.requests[matchedRequest].senderId);
    let senderName = sender.username;

    if (updatedRequest.status === "accept") {
      user.friends.push({
        userId: user.requests[matchedRequest].senderId,
        userName: senderName,
      });
    }

    await user.save();

    // sender : update it on the sender side
    let updatedRequests = sender.requests.map((item) => {
      if (item.recipientId === req.userId) {
        return { ...item, status: updatedRequest.status };
      }
      return item;
    });

    sender.requests = updatedRequests;

    // sender : add to friends list
    if (updatedRequest.status === "accept") {
      sender.friends.push({
        userId: req.userId,
        userName: user.username,
      });
    }
    await sender.save();

    return res.json({ message: "friend request accepted" });
  } else {
    return res.status(403).json({ message: "Malformed request body" });
  }
});

router.get("/friends", verifyToken, async (req, res) => {
  // get the user object
  let user = await User.findById(req.userId);

  res.json({ friends: user.friends });
});

module.exports = router;
