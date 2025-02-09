import { Server } from "socket.io";

const connectedUsers = {};
let io; // Declare io globally
export const getReceipientSocketId = (recipient) => {
  return connectedUsers[recipient];
};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (username) => {
      connectedUsers[username] = socket.id;
      console.log(`${username} joined with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      Object.keys(connectedUsers).forEach((username) => {
        if (connectedUsers[username] === socket.id) {
          delete connectedUsers[username];
        }
      });
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export { io };
