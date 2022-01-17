const express = require("express");
const app = express();
const http = require("http");
const { join } = require("path");
const { disconnect } = require("process");
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
  socket.on("BBBW1_Motion", (motionFlag) => {
    console.log("bbbw1 motion state:"+ motionFlag);
    io.emit("Panel_Buzz", motionFlag);
  });
  socket.on("BBBW1_NoMotion", (motionFlag) => {
    console.log("bbbw1 motion state:"+ motionFlag);
    io.emit("Panel_NoBuzz", motionFlag);
  });
  socket.on("BBBW1_buzzerOn", (buzzerFreq) => {
    console.log("a client has hit the ring ring!!");
    io.emit("sendBBBW1_Buzz", buzzerFreq);
  });
  socket.on("BBBW1_ServoAngle", (servoAngle) => {
    console.log("servo angle being set to:" + servoAngle);
    io.emit("BBBW1_UpdateServoAngle", servoAngle);
    io.emit("BBBW1_ServerServoAngle", servoAngle);
  });

  socket.on("PD2S", (PD2S) => {
    console.log("PD2S have " + PD2S + " motion.");
    io.emit("PD2S_UpdatePD2S", PD2S);
    io.emit("PD2S_ServerPD2S", PD2S);
  });
  
});



server.listen(3001, () => {
  console.log("listening on *:3001");
});
