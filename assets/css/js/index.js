const date = new Date();

document.getElementById("date").innerHTML = date.toDateString();

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
