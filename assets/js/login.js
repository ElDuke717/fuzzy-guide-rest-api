// sign-up and login functionality

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const signInForm = document.getElementById("signin-form");

  // Function to check if user exists
  const checkUserExists = async (email) => {
    try {
      const res = await fetch(`http://localhost:3001/checkUser/${email}`);
      const data = await res.json();
      if (data.exists) {
        // Show only the Sign-In form
        document.getElementById("signInForm").style.display = "block";
        document.getElementById("signUpForm").style.display = "none";
      } else {
        // Show only the Sign-Up form
        document.getElementById("signInForm").style.display = "none";
        document.getElementById("signUpForm").style.display = "block";
      }
    } catch (err) {
      console.error(err);
    }
  };
  // signup form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Check if user exists based on email entered in the form
    await checkUserExists(email);

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
          "Content-Type": "application/json", // Set the content type to JSON
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
}
  // Sign-in Event Listener
//   signInForm.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const formData = new FormData(signInForm); // Use the sign-in form
//     const email = formData.get("username"); // Match the "name" attribute from your HTML
//     const password = formData.get("password"); // Match the "name" attribute from your HTML

//     const requestBody = {
//       email: email, // You can also just use 'email' if your server expects 'email' field
//       password: password,
//     };

//     try {
//       const response = await fetch("/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json", // Set the content type to JSON
//         },
//         body: JSON.stringify(requestBody), // Convert the object to JSON
//       });

//       if (response.ok) {
//         window.location.href = "/tasklist"; // Redirect on successful sign-in
//         console.log("Sign-in successful");
//       } else {
//         // Handle sign-in error
//         console.error("Sign-in failed");
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }
//   });
// });
