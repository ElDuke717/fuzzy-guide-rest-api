const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import LocalStrategy
const User = require("../model/userModel"); // Import your User model
require("dotenv").config();

const flash = require("connect-flash");

console.log("user's model", User);

const bcrypt = require("bcrypt");

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

// use the flash middleware
app.use(flash());

// Configure passport.js to use the local strategy
passport.use(
  new LocalStrategy({ passReqToCallback: true }, (username, password, done) => {
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

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/tasklist",
    failureRedirect: "/",
    failureFlash: true,
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
    req.login(newUser, function(err) {
      if (err) {
        return res.status(500).json({ error: "Error logging in after registration" });
      }
      return res.redirect("/tasklist");  // Redirect to tasklist after successful login
    });

  } catch (error) {
    return res.status(500).json({ error: "Error saving user" });
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
