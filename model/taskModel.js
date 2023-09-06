require("dotenv").config();

const mongoose = require("mongoose");

// Connect to MongoDB
const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define a schema for the tasks
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Create a model using the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
