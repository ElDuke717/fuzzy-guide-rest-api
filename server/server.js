const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import LocalStrategy
const User = require("../model/userModel"); // Import your User model
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const app = express();
const PORT = 3001;

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

// Configure passport.js to use the local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect email." });
      if (!user.validatePassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
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

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/tasklist",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// User registration route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  // Hash the password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Create a new user with the hashed password
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    newUser.save((err, savedUser) => {
      if (err) {
        return res.status(500).json({ error: "Error saving user" });
      }

      // User registration successful
      return res.status(201).json({ message: "User registered successfully" });
    });
  });
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
app.get("/tasks", taskController.getAllTasks, (req, res) => {
  return res.status(200).json(res.locals.tasks);
});

// post a new task
app.post("/tasks", taskController.createTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// update a task
app.put("/tasks/:id", taskController.updateTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

// delete a task
app.delete("/tasks/:id", taskController.deleteTask, (req, res) => {
  return res.status(200).json(res.locals.task);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
