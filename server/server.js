const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Add live reload
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

app.use(bodyParser.json());
const path = require("path");
const cookieParser = require("cookie-parser");

const taskController = require("./controllers/taskController");

// Middleware to handle URLs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// invoke cookieParser
app.use(cookieParser());

const Task = require("../model/taskModel"); // Import your Task model

// serve static files
app.use("/assets", express.static(path.resolve(__dirname, "../assets")));

// server index.html page when request to the root is made
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../views/index.html"));
});

// serve the tasks view
app.get("/tasklist", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../views/tasklist.html"));
});

// get all the tasks from the database
app.get("/tasks", taskController.getAllTasks, (req, res) => {
  return res.status(200).json(res.locals.tasks);
});

// post a new task
app.post("/tasks", taskController.createTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// update a task
app.put("/tasks/:id", taskController.updateTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// delete a task
app.delete("/tasks/:id", taskController.deleteTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
