const mongoose = require("mongoose");
const PORT = process.env.PORT;

// Handle mongo db connection and start the server
const connectHandler = async (app) => {
  try {
    await mongoose.connect(
      "mongodb+srv://demo:pass@cluster0.us26mxl.mongodb.net/TodoApp"
    );
    console.log("Connected to DB ");
    app.listen(PORT, () => {
      console.log(`Server started listening on ${PORT}`);
    });
  } catch (Err) {
    console.log("Error connecting to DB : " + Err.message);
  }
};

module.exports = connectHandler;
