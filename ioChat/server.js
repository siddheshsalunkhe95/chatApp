const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const io = require("socket.io").listen(server);

let users = [];
let connections = [];

server.listen(process.env.PORT || 3002);
console.log("Server is running on port 3002");

/* 
  RENDER INDEX.HTML FILE 
*/
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

/* 
  SOCKET CODE
*/
io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  // DISCONNECT
  socket.on("disconnect", function (data) {
    // if (!socket.username) {
    //   return;
    // }
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();

    connections.splice(connections.indexOf(socket), 1);
    console.log("Dis-connected: %s sockets connected", connections.length);
  });

  // SEND MESSAGE
  socket.on("send message", function (data) {
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });

  // NEW USER
  socket.on("new user", function (data, cb) {
    cb(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });

  function updateUserNames() {
    io.sockets.emit("get users", users);
  }
});
