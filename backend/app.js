//import packages
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const routes = require("./routes");

const { ValidationError } = require("sequelize");

const { environment } = require("./config");
const isProduction = environment === "production";

//initialize express application
const app = express();
//connect morgan logger middleware
app.use(morgan("dev"));
//cookie-parser middleware
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);
//connect routes
app.use(routes);

//error handlers
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});
// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Validation error";
  }
  next(err);
});
// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  if (err.status === 400 || err.status === 403) {
    return res.json({
      message: err.message,
      statusCode: err.status,
      errors: err.errors,
    });
  }
  if (err.status === 401 || err.status === 404) {
    return res.json({
      message: err.message,
      statusCode: err.status,
    });
  }
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    statusCode: err.status,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});
module.exports = app;
