const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// include router file
const accountRouter = require("./router/account");

// app
const app = express();

// dotenv
dotenv.config({path: 'backend/config/.env'});

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// router
app.use("/api/v1/account", accountRouter);



module.exports = app;