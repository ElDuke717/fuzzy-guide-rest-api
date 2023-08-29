require("dotenv").config();
({ path: __dirname + "/.env" });

const mongoose = require("mongoose");

const myURI =
  "mongodb+srv://njhuemmer:v2xrKzoAJvNEdJ@cluster0.r742kzh.mongodb.net/?retryWrites=true&w=majority";

const URI = process.env.MONGODB_URI || my;
URI;

const mongoose = require("mongoose");

// Define a schema for your tasks
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  due: {
    type: Date,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

// Create a model using the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
