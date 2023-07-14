const express = require("express");
const router = express.Router();

// import middlewares
const verifyToken = require("../middleware/verifyToken");

// import Todo model
const Todo = require("../db/models/todos");

// router for handling todo routes

// fetch all todos
router.get("/all", verifyToken, async (req, res) => {
  const todos = await Todo.find({ belongsTo: req.userId });
  res.json({ todos: todos });
});

// route of add new tasks with description
router.post("/new", verifyToken, async (req, res) => {
  // creating a new todo using model
  const todo = new Todo(req.body);
  todo.belongsTo = req.userId;
  todo.createdBy = req.userId;
  todo.state = "pending";

  const todoQuery = await todo.save();

  res.json({ message: "Todo created successfully", todoId: todoQuery.id });
});

// route for updating tasks
router.put("/:id", verifyToken, async (req, res) => {
  // creating a new todo using model
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body);

  res.json({ message: "Todo updated successfully", todoId: todo.id });
});

// route for deleting tasks
router.delete("/:id", verifyToken, async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted successfully" });
});

module.exports = router;
