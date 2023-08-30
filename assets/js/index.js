const date = new Date();
console.log(date);

// Add the current date to the page
document.getElementById("date").innerText = date.toLocaleString();

// Declare tasks variable to hold all the tasks on the server
let tasks;

// Get all tasks and post them to the task page
fetch("http://localhost:3001/tasks")
  .then((res) => res.json())
  .then((data) => {
    console.log("data", data);
    tasks = data;
    // Loop through the tasks and post them to the task page
    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.setAttribute("data-id", task._id);

      // Add task title
      const taskTitle = document.createElement("h2");
      taskTitle.textContent = task.title;
      taskDiv.appendChild(taskTitle);

      // Add task description
      const taskDescription = document.createElement("p");
      taskDescription.textContent = task.description;
      taskDiv.appendChild(taskDescription);

      // Add task due date
      const taskDueDate = document.createElement("p");
      const dueDate = new Date(task.due);
      taskDueDate.textContent = `Due: ${dueDate.toDateString()}`;
      taskDiv.appendChild(taskDueDate);

      // Append delete button to the task div
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Task";
      deleteButton.className = "delete-button";
      deleteButton.setAttribute("data-id", task._id);
      taskDiv.appendChild(deleteButton);

      // Append the new task div element to the task list
      document.querySelector("#task-list").appendChild(taskDiv);
    });
  })
  .catch((err) => console.error(err));

// Rest of the code remains the same, including the event listeners for creating and deleting tasks
// ...

// Add a new task
const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks");

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const taskData = {
    title: formData.get("title"),
    description: formData.get("description"),
    due: formData.get("due"),
  };

  try {
    const response = await fetch("http://localhost:3001/tasks", {
      // Post to the /tasks route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      // Clear form fields after successful submission
      taskForm.reset();

      // Fetch and update the task list after successful task creation
      const tasksResponse = await fetch("/tasks"); // Fetch the updated task list
      const tasksData = await tasksResponse.json();

      // Update the tasksContainer with the new task list
      tasksContainer.innerHTML = "";
      tasksData.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        // ... Create and append elements for each task (similar to your previous code)
        tasksContainer.appendChild(taskDiv);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
  location.reload();
});

// Delete a task
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-button")) {
    const taskId = event.target.getAttribute("data-id");
    const taskDiv = event.target.parentElement;

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        taskDiv.style.display = "none";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
