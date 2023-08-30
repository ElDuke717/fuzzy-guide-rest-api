const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
const path = require("path");
const cookieParser = require("cookie-parser");

const taskController = require("./controllers/taskController");

// Middleware to handle URLs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// invoke cookieParser
app.use(cookieParser());

// serve static files
app.use("/assets", express.static(path.resolve(__dirname, "../assets")));

// server index.html page when request to the root is made
app.get("/", (req, res) => {
  console.log("get /");
  return res.sendFile(path.join(__dirname + "/../views/index.html"));
});

// serve the tasks view
app.get("/tasks", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../views/tasks.html"));
});

// get method on entries to see all blog entries
app.get("/tasks", taskController.getAllTasks, (req, res) => {
  // get all entries in the database
  return res.status(200).json(res.locals.tasks);
});

// // Get a task by id
// app.get("/tasks/:id", (req, res) => {
//   const task = tasks.find((t) => t.id === parseInt(req.params.id));
//   if (!task) return res.status(404).send("Task not found.");
//   res.json(task);
// });

// // Post a new task
// app.post("/tasks", (req, res) => {
//   const task = {
//     id: tasks.length + 1,
//     description: req.body.description,
//   };
//   tasks.push(task);
//   res.status(201).json(task);
// });

// // Update a task by id
// app.put("/tasks/:id", (req, res) => {
//   const task = tasks.find((t) => t.id === parseInt(req.params.id));
//   if (!task) return res.status(404).send("Task not found.");

//   task.description = req.body.description || task.description;
//   res.json(task);
// });

// // Delete a task by id
// app.delete("/tasks/:id", (req, res) => {
//   const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
//   if (taskIndex === -1) return res.status(404).send("Task not found.");

//   const removedTask = tasks.splice(taskIndex, 1);
//   res.json(removedTask[0]);
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});