const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// hashing setup for bcrypt
const saltRounds = 10;

// import models
const User = require("../db/models/users");

router.post("/signup", async (req, res) => {
  const user = req.body;

  // fetch the users from the db
  let users = await User.find({});

  // check if the user name or email is already taken
  const alreadyExists = users.findIndex((u) => {
    return u.username == user.username || u.email == user.email;
  });

  // if user already exists then return 403 status code
  if (alreadyExists > -1) {
    return res
      .status(403)
      .json({ message: "Username or Email already taken !!!" });
  }

  // hash the user password
  user.password = await bcrypt.hash(user.password, saltRounds);

  // add the user to db
  // use the model to create a new user
  const usr = new User(user);
  usr.requests = [];
  usr.friends = [];
  const usrDoc = await usr.save();

  // create and add jwt to response
  let token = jwt.sign(
    { id: usrDoc.id, user: usrDoc.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({ message: "User created successfully !!!", token: token });
});

router.post("/login", async (req, res) => {
  const user = req.body;

  // fetch the users from the db
  let users = await User.find({});

  // check if the user name exist and get the object
  const userData = users.find((u) => {
    return (
      u.username === user.username &&
      bcrypt.compareSync(user.password, u.password)
    );
  });

  // if username is incorrect
  if (!userData) {
    return res
      .status(401)
      .json({ message: "Username or Password incorrect !!!" });
  }

  // create and add jwt to response

  let token = jwt.sign(
    { id: userData.id, user: userData.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({ message: "Logged in  successfully !!!", token: token });
});

module.exports = router;
