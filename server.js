const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let tasks = [];  // Simple in-memory data store

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        description: req.body.description
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found.');

    task.description = req.body.description || task.description;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).send('Task not found.');

    const removedTask = tasks.splice(taskIndex, 1);
    res.json(removedTask[0]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

