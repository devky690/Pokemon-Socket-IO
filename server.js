const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.static("client"));
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  //so client can be allowed access to server
  cors: {
    origin: [
      "http://localhost:3000",
      "https://pokemon-socket-io.herokuapp.com",
      "http://127.0.0.1:5500",
    ],
  },
});

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const roomsMap = new Map();

io.on("connection", socket => {
  socket.on("send-msg", message => {
    console.log(message);
    io.to(socket.roomID).emit("receive-msg", message);
  });

  // remember emit callbacks need to be the last parameter!
  socket.on("send-poke-info", (name, type) => {
    socket.to(socket.roomID).emit("receive-poke-info", name, type);
    const playerMove = { name: `${name}`, type: `${type}`, id: `${socket.id}` };
    //socket.id == the client socket id
    console.log(socket.roomID);
    const playerMoves = roomsMap.get(socket.roomID) || [];

    if (playerMoves.length === 0) {
      playerMoves.push(playerMove);
      roomsMap.set(socket.roomID, playerMoves);
    }
    //to make sure last move isnt from the previous user
    //cant use a hashset because if user used a different pokemon it would count as a
    //different move
    if (playerMoves.length !== 0 && playerMoves[0].id !== playerMove.id) {
      playerMoves.push(playerMove);
      roomsMap.set(socket.roomID, playerMoves);
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
      //last move won...corresponds to index
      if (result === 1) {
        io.to(socket.id).emit("game-end", "You WON!!!!", moveType0);
        io.to(playerMoves[0].id).emit("game-end", "You lost", moveType1);
      }
      // first move won...corresponds to index
      if (result === 0) {
        io.to(playerMoves[0].id).emit("game-end", "You Won", moveType1);
        io.to(socket.id).emit("game-end", "You lost", moveType0);
      }
      if (result === 2) {
        io.in(socket.roomID).emit("game-end", "You tied!!!!", moveType0);
      }
      console.log("end of game");
      console.log(roomsMap);
    }
  });
  //so on refresh we dont keep the playerMove
  socket.on("disconnect", () => {
    console.log(roomsMap.get(socket.roomID));
    io.in(socket.roomID).disconnectSockets();
    if (roomsMap.has(socket.roomID)) roomsMap.delete(socket.roomID);
    console.log(roomsMap);
  });

  socket.on("join-room", room => {
    socket.join(room);
    socket.roomID = room;
    console.log(socket.roomID);
    console.log(socket.id);
    console.log(roomsMap);
    socket.to(socket.roomID).emit("player-joined", "enemy connected");
  });

  socket.on("leave-room", room => {
    socket.to(room).emit("player-left", "player left the room");
    //not leaving room for some reason, just tell user to refresh
    socket.leave(socket.roomID);
  });

  socket.on("clean-room", room => {
    if (roomsMap.has(room)) roomsMap.delete(room);
  });
});

function checkWin(lastPlayer, otherPlayer) {
  if (
    (lastPlayer.type === "electric" && otherPlayer.type === "water") ||
    (lastPlayer.type === "water" && otherPlayer.type === "fire") ||
    (lastPlayer.type === "water" && otherPlayer.type === "rock") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "electric") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "water") ||
    (lastPlayer.type === "grass" && otherPlayer.type === "rock") ||
    (lastPlayer.type === "fire" && otherPlayer.type === "grass") ||
    (lastPlayer.type === "rock" && otherPlayer.type === "electric") ||
    (lastPlayer.type === "rock" && otherPlayer.type === "fire") ||
    (lastPlayer.type !== "normal" && otherPlayer.type === "normal")
  ) {
    return 1;
  }
  if (
    (otherPlayer.type === "electric" && lastPlayer.type === "water") ||
    (otherPlayer.type === "water" && lastPlayer.type === "fire") ||
    (otherPlayer.type === "water" && lastPlayer.type === "rock") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "electric") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "water") ||
    (otherPlayer.type === "grass" && lastPlayer.type === "rock") ||
    (otherPlayer.type === "fire" && lastPlayer.type === "grass") ||
    (otherPlayer.type === "rock" && lastPlayer.type === "electric") ||
    (otherPlayer.type === "rock" && lastPlayer.type === "fire") ||
    (otherPlayer.type !== "normal" && lastPlayer.type === "normal")
  ) {
    return 0;
  }

  if (
    lastPlayer.type === otherPlayer.type ||
    (lastPlayer.type === "fire" && otherPlayer.type === "electric") ||
    (otherPlayer.type === "electric" && lastPlayer.type === "fire")
  ) {
    return 2;
  }
}

http.listen(PORT, function () {
  console.log(`listening on ${PORT}`);
});

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
