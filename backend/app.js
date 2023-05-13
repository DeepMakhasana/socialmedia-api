const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// include router file
const accountRouter = require("./router/account");
const postRouter = require("./router/post");

// app
const app = express();

// dotenv
dotenv.config({ path: "backend/config/.env" });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// router
app.get("/", (req, res) => {
  res.send(
    "Welcome on Social media backend part. - <a href='https://github.com/DeepMakhasana/socialmedia_webapp'>Go to API Documentation</a>"
  );
});
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/post", postRouter);

module.exports = app;
