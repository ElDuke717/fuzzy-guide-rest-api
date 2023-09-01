const date = new Date();

// Add the current date to the page
document.getElementById("date").innerText = date.toLocaleDateString();

// Declare tasks variable to hold all the tasks on the server
let tasks;

// Get all tasks and post them to the task page
fetch("http://localhost:3001/tasks")
  .then((res) => res.json())
  .then((data) => {
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

      // add an update button
      const updateButton = document.createElement("button");
      updateButton.textContent = "Update Task";
      updateButton.className = "update-button";
      updateButton.setAttribute("data-id", task._id);
      taskDiv.appendChild(updateButton);

      // Append the update form for this task
      const updateForm = document.createElement("form");
      updateForm.className = "update-form";
      updateForm.setAttribute("data-id", task._id);
      updateForm.style.display = "none"; // Initially hide the form
      updateForm.innerHTML = `
  <label for="title">Title</label>
  <input type="text" name="title" id="title" value="${task.title}" required>
  <label for="description">Description</label>
  <input type="text" name="description" id="description" value="${task.description}" required>
  <label for="due">Due Date</label>
  <input type="date" name="due" id="due" value="${task.due}" required>
  <button class="update-form-button" type="submit">Update Task</button>
  <button class="cancel-button" type="button">Cancel</button>
`;
      taskDiv.appendChild(updateForm);
      // Find the Cancel button inside the update form
const cancelButton = updateForm.querySelector(".cancel-button");

// Add an event listener to hide the form and show the Update button when Cancel is clicked
cancelButton.addEventListener("click", () => {
  updateForm.style.display = "none"; // Hide the form
  updateButton.style.display = "block"; // Show the Update button
});

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
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
      const taskId = event.target.getAttribute("data-id");

      try {
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Display the deletion message
          const messageElement = document.getElementById("message");
          messageElement.style.opacity = 1;

          // Hide the message with fade-out animation after 1 second
          setTimeout(() => {
            messageElement.style.opacity = 0;
          }, 1000);

          // Hide the taskDiv after deletion with fade-out animation
          const taskDiv = event.target.parentElement;
          // Remove the task from the page
          taskDiv.style.display = "none";
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
});

// Update a task
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("update-button")) {
    // Get the task ID from the button's data-id attribute

    const taskId = event.target.getAttribute("data-id");

    // Find the update form for the clicked task
    const updateForm = document.querySelector(
      `.update-form[data-id="${taskId}"]`
    );

    // Hide the "Update Task" and "Delete Task" buttons
    event.target.style.display = "none";
    const deleteButton = event.target.nextElementSibling;
    deleteButton.style.display = "none";

    // Display the update form
    updateForm.style.display = "block";
  }
});

// Handle the form submission for updating a task
document.addEventListener("submit", async (event) => {
  if (event.target.classList.contains("update-form")) {
    event.preventDefault();

    // Get the task ID from the form's data-id attribute
    const taskId = event.target.getAttribute("data-id");

    // Get the updated task data from the form inputs
    const formData = new FormData(event.target);
    const updatedTask = {
      title: formData.get("title"),
      description: formData.get("description"),
      due: formData.get("due"),
    };

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Refresh the page after successful update
        location.reload();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
