const express = require("express");
const server = express();
const userRouter = require("./users/users");
const session = require("express-session");
const connectSessionKnex = require("connect-session-knex");
const db = require("./data/db-config");

const KnexSessionStore = connectSessionKnex(session)
const sessionConfig = {
  name: "rabbit",
  secret: "keep it secret, keep safe",
  cookie: {
    maxAge: 1000 * 30,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialize: false,
  store: new KnexSessionStore({
    knex: db,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(express.json());
server.use(session(sessionConfig));
server.use("/api", userRouter);

server.get("/", (req, res) => {
  res.send("Server Running");
});
module.exports = server;
