require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");

var indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const weatherRouter = require("./routes/weather");

var app = express();

const cors = require("cors");
app.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/weather", weatherRouter);

module.exports = app;
