const express = require("express");
const server = express();
const userRouter = require("./users/users");
server.use(express.json());
server.use("/api", userRouter);

server.get("/", (req, res) => {
  res.send("Server Running");
});
module.exports = server;
