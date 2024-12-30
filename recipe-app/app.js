var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

var app = express();

// Database connection
const db = require("./database/db"); // Ensure this file handles DB connection

// Set up the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Layout setup for EJS templates
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    },
  })
);

// Use routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// Catch 404 errors and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
