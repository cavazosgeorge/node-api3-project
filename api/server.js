const express = require("express");
const dotenv = require("dotenv");

const server = express();

const { logger } = require("./middleware/middleware");
const usersRouter = require("./users/users-router");

// SETUP CONFIG FILE VARIABLES
dotenv.config({
  path: "./config/config.env",
});

// BODY PARSER
server.use(express.json());

// GLOBAL MIDDLEWARES AND EXPRESS ROUTER => USE HERE
server.use(logger);
server.use("/api/users", usersRouter);

// IMPORT ROUTES

// TEST ENDPOINT
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
