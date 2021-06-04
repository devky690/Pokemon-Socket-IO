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
    //to make sure last move isnt from the previous user
    //cant use a hashset because if user used a different pokemon it would count as a
    //different move
    if (playerMoves.length !== 0 && playerMoves[0].id !== playerMove.id) {
      playerMoves.push(playerMove);
    }

    if (playerMoves.length === 2) {
      console.log("success");
      //check win here
      //state win or lose here...nothing needs to go to the server
      //just append div block to gameboard
      const result = checkWin(playerMoves[1], playerMoves[0]);
      //store here to prevent undefined from timing issues
      const moveType0 = playerMoves[0].type;
      const moveType1 = playerMoves[1].type;
      console.log(result);
      //last move won...corresponds to index
      if (result === 1) {
        socket.emit("game-end", "You WON!!!!", moveType0);
        socket.broadcast
          .to(playerMoves[0].id)
          .emit("game-end", "You lost", moveType1);
      }
      // first move won...corresponds to index
      if (result === 0) {
        socket.broadcast
          .to(playerMoves[0].id)
          .emit("game-end", "You Won", moveType1);
        socket.emit("game-end", "You lost", moveType0);
      }
      if (result === 2) {
        io.emit("game-end", "You tied!!!!", "Same pokemon types were played");
      }

      //so on refresh we dont keep the playerMove
      socket.on("disconnect", () => {
        while (playerMoves.length !== 0) playerMoves.pop();
      });

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

//To create new Rooms
// const map = new Map();
// let count = 0;
// function newRoom() {
//   const playerMoves = [];
//   map.set(count, playerMoves);
//   playerMoves.push(count);
//   console.log(playerMoves);
//   count++;
// }

// newRoom();
// newRoom();
// newRoom();
// newRoom();
