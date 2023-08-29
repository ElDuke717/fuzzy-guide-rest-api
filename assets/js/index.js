const date = new Date();
console.log(date);

document.getElementById("date").innerText = date.toLocaleString();

let tasks;

// get all the tasks and return them to the client
// fetch('http://localhost:3001/tasks').then((res) => {
//     res.json();
// }).then((data) => {
//     tasks = data;

// }
// ).catch((err) => {
//     console.log(err);
// } );
