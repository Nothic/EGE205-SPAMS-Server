const express = require("express");
const app = express();
const http = require("http");
const { join } = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/spams-server.html");
});

var clients = {};

io.on("connection", (socket) => {
  console.log("new client connected");
  clients[socket.id] = socket;
  socket.on("ping servo", (servoState) => {
    console.log("Servostate: " + servoState);
  });
  socket.on("disconnect", () => {
    console.log("a client disconnected");
    delete clients[socket.id];
  });
  socket.on("BBBW1_Motion", () => {
    console.log("bbbw1 picked up motion! om nom nom");
  });
  socket.on("BBBW1_NoMotion", () => {
    console.log("bbbw1 picked up no motion! om nom nom");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
