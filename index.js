let tasks;

// get all the tasks and return them to the client
fetch('http://localhost:3001/tasks').then((res) => {
    res.json();
}).then((data) => {
    tasks = data;

}
