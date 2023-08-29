require("dotenv").config();
({ path: __dirname + "/.env" });

const mongoose = require("mongoose");

const myURI = process.env.MONGODB_URI;

const URI = process.env.MONGODB_URI || myURI;

// Check to see if we are connected to the database
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

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
