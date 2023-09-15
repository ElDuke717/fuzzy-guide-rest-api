const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import LocalStrategy
const User = require("../model/userModel"); // Import your User model
require("dotenv").config();

const flash = require("connect-flash");

const bcrypt = require("bcrypt");

const secretKey = process.env.SECRET_KEY;

const app = express();
const PORT = 3001;

// // Logging Middleware
// app.use((req, res, next) => {
//   const now = new Date(Date.now());
//   const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${String(now.getDate()).padStart(2, "0")} ${String(
//     now.getHours()
//   ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
//     now.getSeconds()
//   ).padStart(2, "0")}`;
//   console.log(`A new request received at ${dateStr}`);
//   console.log("------ New Request Details ------");
//   console.log("Timestamp:", dateStr);
//   console.log("Method:", req.method);
//   console.log("URL:", req.originalUrl);
//   console.log("Host:", req.hostname);
//   // console.log("IP:", req.ip);
//   // console.log("Protocol:", req.protocol);
//   // console.log("User-Agent:", req.get("User-Agent"));

//   // Logging Headers
//   // console.log("Headers:", JSON.stringify(req.headers, null, 2));

//   // Logging Body (for POST/PUT/PATCH methods)
//   if (req.body) {
//     console.log("Body:", JSON.stringify(req.body, null, 2));
//   }

//   // Logging Query Parameters (if any)
//   if (Object.keys(req.query).length > 0) {
//     console.log("Query Parameters:", JSON.stringify(req.query, null, 2));
//   }

//   // Logging Cookies (if any)
//   if (req.cookies) {
//     console.log("Cookies:", JSON.stringify(req.cookies, null, 2));
//   }

//   next();
// });

// Add live reload
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

app.use(bodyParser.json());
const path = require("path");
const cookieParser = require("cookie-parser");

// use the flash middleware
app.use(flash());

// Configure passport.js to use the local strategy
passport.use(
  new LocalStrategy(
    { username: "email", passReqToCallback: true },
    (email, password, done) => {
      User.findOne({ email: email }, async (err, user) => {
        console.log("Inside LocalStrategy callback"); // logging here
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Incorrect email." });

        // Using the async validatePassword method
        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }
        console.log("Successful login");
        return done(null, user);
      });
    }
  )
);
// passport.js configuration
app.use(
  require("express-session")({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Route for existing user login redirect.
app.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/tasklist", // Redirect to tasklist on success
    failureRedirect: "/", // Redirect to root on failure
  })
  );

// User registration route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("new user", email, password);
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Log in the user programmatically and redirect to tasklist
    req.login(newUser, function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error logging in after registration" });
      }
      return res.redirect("/tasklist"); // Redirect to tasklist after successful login
    });
  } catch (error) {
    return res.status(500).json({ error: "Error saving user" });
  }
});

app.get("/checkUser/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const taskController = require("./controllers/taskController");

// Middleware to handle URLs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// invoke cookieParser
app.use(cookieParser());

const Task = require("../model/taskModel"); // Import your Task model

// serve static files
app.use("/assets", express.static(path.resolve(__dirname, "../assets")));

// server index.html page when request to the root is made
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../views/index.html"));
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/"); // Redirect to login if not authenticated
};

// serve the tasks view
app.get("/tasklist", ensureAuthenticated, (req, res) => {
  return res.sendFile(path.join(__dirname + "/../views/tasklist.html"));
});

// get all the tasks from the database
app.get(
  "/tasks",
  ensureAuthenticated,
  taskController.getAllTasks,
  (req, res) => {
    return res.status(200).json(res.locals.tasks);
  }
);

// post a new task
app.post(
  "/tasks",
  ensureAuthenticated,
  taskController.createTask,
  (req, res) => {
    // set the owner field to the logged-in user's id newTask.owner = req.user._id;
    return res.status(200).json(res.locals.task);
  }
);

// update a task
app.put("/tasks/:id", taskController.updateTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// delete a task
app.delete("/tasks/:id", taskController.deleteTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
