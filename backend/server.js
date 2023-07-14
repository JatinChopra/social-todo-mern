const express = require("express");
require("dotenv").config();

const app = express();

const morgan = require("morgan");

const connectHandler = require("./db/connectHandler");

// import route modules
const authentication = require("./routes/authentication");
const todo = require("./routes/todo");
const network = require("./routes/network");
const networkTodos = require("./routes/networkTodos");

// importing middlewares
const verifyToken = require("./middleware/verifyToken");

// cors setup
const cors = require("cors");
app.use(cors());

// setup a connection to db and start listening
connectHandler(app);

// add middlewares
app.use(morgan("dev")); // for logging
app.use(express.json()); // for parsing json body

// for validating user session
app.get("/sessionLookup", verifyToken, (req, res) => {
  res.json({
    message: "Valid Session",
    userId: req.userId,
    userName: req.username,
  });
});

// handling signup and login via authentication route
app.use("/users", authentication);

// todo routes -> handle tasks related to user todos
app.use("/todo", todo);

// networking routes -> handle sending friend request , accepting or rejecting friend requests
app.use("/users", network);

// networking todo -> allow to view friend todos and add tasks for friends
app.use("/friends", networkTodos);
