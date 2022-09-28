/** @format */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv").config();
const xss = require("xss-clean");

const app = express();

//Set Cross origin Policy
app.use(cors());

//Set Security HTTP header
app.use(helmet());

//limit request from api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too much request from this IP, Please try again in 1hour!",
});
app.use("/account", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitize against XSS, malicious HTMLCode atttack
app.use(xss());

//Serving static file
app.use(express.static(`${__dirname}/public`));

//Routes
app.use("/todo", require("./routes/todo"));
app.use("/account", require("./routes/account"));

app.listen(5000, () => {
  console.log(`App is running on port 5000`);
});
