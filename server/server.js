const io = require("socket.io")(3000, {
  //so client can be allowed access to server
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", socket => {
  console.log(socket.id);

  socket.on("send-poke-info", (name, type) => {
    socket.broadcast.emit("receive-poke-info", name, type);
    console.log(name);
    console.log(type);
  });
  socket.on("join-room", room => {
    const clients = io.sockets.adapter.rooms[room].sockets;
    if (clients >= 2) {
      socket.emit("join-room", "The room is full!");
    } else {
      socket.emit("join-room", `You have joined ${room}`);
    }
  });
  //   socket.on("if-game-end", room => {
  //     // socket.emit("if-game-end", () => {
  //     //   //should be using emit callback though
  //     //   //with display message to update gameboard with a div
  //     //   console.log("game end");
  //     // });
  //   });
});
