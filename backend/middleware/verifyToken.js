const jwt = require("jsonwebtoken");

// middleware for token verification
const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization.replace("Bearer ", "");

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user id
    req.userId = decoded.id;
    req.username = decoded.user;
  } catch (err) {
    console.log(err.message);
    return res
      .status(403)
      .json({ message: "Session Expired, Please Login Again !!!" });
  }

  next();
};

module.exports = verifyToken;
