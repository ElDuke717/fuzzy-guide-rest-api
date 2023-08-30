require("dotenv").config();

const mongoose = require("mongoose");

const myURI = '';

const URI = process.env.MONGODB_URI || myURI;

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
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
