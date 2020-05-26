const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const fs = require("fs");
const ejs = require("ejs");
const index = require("./routes/index");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.use("/", index);
app.use(express.static(__dirname + "/scripts"));
app.use(express.static(__dirname + "/data"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render("error", { status: err.status, message: err.message });
});

app.listen(process.env.port || port);

console.log(`Started server on port: ${port}`);
