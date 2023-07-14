const express = require("express");
const router = express.Router();

// importing models
const User = require("../db/models/users");
const Todo = require("../db/models/todos");

// importing middlewares
const verifyToken = require("../middleware/verifyToken");

// middlware function to check if the two users are friends or not
const areFriends = async (req, res, next) => {
  // get the recipient object
  const recipient = await User.findById(req.body.friend.userId);

  // check if current user is a friend
  const areFriends = recipient.friends.some((item) => {
    return item.userId === req.userId;
  });

  if (!areFriends) {
    return res.status(403).json({ message: "You are not friends." });
  }

  next();
};

// route for accessing friend's tasks
router.post("/accessTodos", verifyToken, areFriends, async (req, res) => {
  // fetch the todos
  const todos = await Todo.find({ belongsTo: req.body.friend.userId });

  res.json({ todos: todos });
});

// route for creating tasks for friends
router.post("/createTodo", verifyToken, areFriends, async (req, res) => {
  // get the new todo from the request body
  const newTodo = req.body.todoData;
  newTodo.belongsTo = req.body.friend.userId;
  newTodo.createdBy = req.userId;
  newTodo.status = "pending";

  const todoObj = new Todo(newTodo);
  const result = await todoObj.save();

  res.json({ message: "Friend's Todo added !!! ", result: result });

  //
});
module.exports = router;
