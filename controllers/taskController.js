const Task = require("../model/taskModel");

const taskController = {};

// Import your Task model and any other dependencies

// create a new task
taskController.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.locals.task = task;
    next();
  } catch (err) {
    next(err);
  }
};

// Get all tasks
taskController.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    res.locals.tasks = tasks;
    next();
  } catch (err) {
    next(err);
  }
};

// get a task by id
taskController.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.locals.task = task;
    next();
  } catch (err) {
    next(err);
  }
};

// update a task by id
taskController.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.due = req.body.due || task.due;
    await task.save();
    res.locals.task = task;
    next();
  } catch (err) {
    next(err);
  }
};

// delete a task by id
taskController.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.locals.task = task;
        next();
    } catch (err) {
        next(err);
    }
    };

