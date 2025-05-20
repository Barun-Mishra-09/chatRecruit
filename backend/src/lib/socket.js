import { Server } from "socket.io";
import http from "http";

import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// create a helper function name as getReceiveSocketId
export function getReceiveSocketId(userId) {
  return onlineUserSocketMap[userId];
}

// Used to store online users
const onlineUserSocketMap = {}; // {userId: socketId}

// connect socket witht the server and then disconnect it
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUserSocketMap[userId] = socket.id;
  }

  //   io.emit is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(onlineUserSocketMap));

  //   for disconnection since it is listening any event so we use socket.on function
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // delete the onlineUsers
    delete onlineUserSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUserSocketMap));
  });
});
export { io, app, server };
