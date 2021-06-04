const io = require("socket.io")(3000, {
  //so client can be allowed access to server
  cors: {
    origin: ["http://localhost:8080"],
  },
});
const playerMoves = [];

io.on("connection", socket => {
  console.log(socket.id);

  // remember emit callbacks need to be the last parameter!
  socket.on("send-poke-info", (name, type) => {
    socket.broadcast.emit("receive-poke-info", name, type);
    const playerMove = { name: `${name}`, type: `${type}`, id: `${socket.id}` };
    //socket.id == the client socket id
    console.log(socket.id);
    if (playerMoves.length === 0) {
      playerMoves.push(playerMove);
    }
    //to make last move isnt from the previous user
    if (playerMoves.length !== 0 && playerMoves[0].id !== playerMove.id) {
      playerMoves.push(playerMove);
    }

    if (playerMoves.length === 2) {
      console.log("success");
      //check win here
      //state win or lose here...nothing needs to go to the server
      //just append div block to gameboard
      const result = checkWin(playerMoves[1], playerMoves[0]);
      console.log(result);
      //last move won...corresponds to index
      if (result === 1) {
        socket.emit("game-end", "You WON!!!!");
        socket.broadcast.to(playerMoves[0].id)
      }
      // first move won...corresponds to index
      if (result === 0) {
        socket.broadcast.to(playerMoves[0].id).emit("game-end", "Yo Won");
      }
      if (result === 2) {
        io.emit("game-end", "You tied!!!!");
      }

      //reset the game
      playerMoves.pop();
      playerMoves.pop();
    }
  });
  socket.on("join-room", room => {
    //gets the number of clients connected to a room
    const clients = io.sockets.adapter.rooms[room].sockets;
    if (clients >= 2) {
      socket.emit("join-room", "The room is full!");
    } else {
      socket.emit("join-room", `You have joined ${room}`);
    }
    socket.on("check-win", playerMove);
  });

  //   socket.on("if-game-end", room => {
  //     // socket.emit("if-game-end", () => {
  //     //   //should be using emit callback though
  //     //   //with display message to update gameboard with a div
  //     //   console.log("game end");
  //     // });
  //   });
});

function checkWin(lastPlayer, otherPlayer) {
  if (
    (lastPlayer.type === "electric" && otherPlayer.type === "water") ||
    (lastPlayer.type === "water" && otherPlayer.type === "fire") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "electric") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "water") ||
    (lastPlayer.type !== "normal" && otherPlayer.type === "normal") ||
    (lastPlayer.type === "fire" && otherPlayer.type === "normal") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "normal")
  ) {
    return 1;
  }
  if (
    (otherPlayer.type === "electric" && lastPlayer.type === "water") ||
    (otherPlayer.type === "water" && lastPlayer.type === "fire") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "electric") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "water") ||
    (otherPlayer.type !== "normal" && lastPlayer.type === "normal") ||
    (otherPlayer.type === "fire" && lastPlayer.type === "normal") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "normal")
  ) {
    return 0;
  }

  if (lastPlayer.type === otherPlayer.type) {
    return 2;
  }
}
