// sign-up and login functionality

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(signupForm);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
  
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
  
    const requestBody = {
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(requestBody), // Convert the object to JSON
      });
  
      if (response.ok) {
        window.location.href = "/tasklist"; // Redirect on successful signup
      } else {
        // Handle signup error
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
});
