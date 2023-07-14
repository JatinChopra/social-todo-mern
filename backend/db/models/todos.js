const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for Todos
const todoSchema = new Schema({
  title: String,
  description: String,
  state: String, // completed | pending | due
  belongsTo: String, //  todo was created for this person
  createdBy: String, // person who created the todo
});

// compile the schema into a model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
