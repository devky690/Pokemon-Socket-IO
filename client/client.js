/**
 * TODO:
 * 1) (Done) mAdd more pokemon to pokemon array to fetch from api (Done)
 * 2)(Done) and room chat (the chatBoard...i have currently i can have players send
 *  messages there as well)...add a "clear messages" button to chat,
 * 3)(Done) guide in beginning (game not shown, just rooms to join)...make it so that
 * players have to type in their name
 * 4)(Need to Do Eventually) Start implementing pokemon cards and utilize stat points from
 * api to make a better game
 *
 * FIXME:
 * 1) (FIXED) Sometimes if a player starts a game early without another playing being room the game can never end.
 * To fix the user would need to refresh their browser or press join game again.
 * But this doesnt happen all time - sometimes its okay, so not a big bug.
 * And player shouldnt be starting a game early anyhow. (I think this was because I forgot to include
 * the other pokemon battle checks!)
 *
 * 2) (FIXED) Also when a player joins a room with other players. If they join a different room,
 * they will be able to see the previous room messages.
 * I need to leave room with a different event...I believe it was a timing issue. Now users can
 * leave properly! :)
 *
 * 3) (FIXED) chatmsgs appended at random (happens very infrequently
 * the cause turned out to be from not clearing pokemon objects when i cleared playingCardData
 *
 * 4) (FIXED) make sure to add pokemon types if add in new pokemon!
 */
import Pokemon from "./pokemon.js";
const POKE = [
  "pikachu",
  "charizard",
  "bulbasaur",
  "squirtle",
  "pidgeot",
  "onix",
  "eevee",
  "snorlax",
  "lapras",
  "gyarados",
  "tyranitar",
];
//delete io server when deploying (no localhost:3000)
//"https://pokemon-socket-io.herokuapp.com"
//change to "http://localhost:3000" to connect!
const socket = io("https://pokemon-socket-io.herokuapp.com");

let playingCardData = [];
//loop through pokeObjects while checking the data set of the element before
//previous sibling of e.target with click event below
//to determine which pokemon instance method to print
let pokeObjects = [];
let pokeOne;
let pokeTwo;

//to scale i just would select gameboard and on button press get
//user to click the amount of pokemon...but i would just need to put
//a limit
// const gameBoard = document.querySelector("#container");
const listOne = document.querySelector("#item-1");
const listTwo = document.querySelector("#item-2");
const divOne = document.createElement("div");
const divTwo = document.createElement("div");
const imgOne = document.createElement("img");
const imgTwo = document.createElement("img");
const headerOne = document.createElement("h2");
const headerTwo = document.createElement("h2");
const buttonOne = document.createElement("button");
const buttonTwo = document.createElement("button");

async function getPokemon() {
  let pokeOneIndex = Math.floor(Math.random() * POKE.length);
  let pokeTwoIndex = Math.floor(Math.random() * POKE.length);
  while (pokeOneIndex === pokeTwoIndex) {
    pokeOneIndex = Math.floor(Math.random() * POKE.length);
    pokeTwoIndex = Math.floor(Math.random() * POKE.length);
  }
  const pokeOneItem = POKE[pokeOneIndex];
  const pokeTwoItem = POKE[pokeTwoIndex];
  const responseOne = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokeOneItem}`
  );
  const dataOne = await responseOne.json();
  const responseTwo = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokeTwoItem}`
  );
  const dataTwo = await responseTwo.json();
  playingCardData.push(dataOne);
  playingCardData.push(dataTwo);
}

//because of the event loop, we need to setTimeout or make an async function
async function setPokemon() {
  await getPokemon();
  pokeOne = new Pokemon(
    playingCardData[0].name,
    playingCardData[0].types[0].type.name,
    playingCardData[0].sprites.other.dream_world.front_default
  );
  pokeTwo = new Pokemon(
    playingCardData[1].name,
    playingCardData[1].types[0].type.name,
    playingCardData[1].sprites.other.dream_world.front_default
  );
  pokeObjects.push(pokeOne, pokeTwo);
  console.log(playingCardData);
  console.log(pokeOne);
}

async function setUpCards() {
  await setPokemon();

  divOne.dataset.pokeName = pokeOne.name;
  divOne.dataset.pokeType = pokeOne.type;
  divOne.dataset.pokeLook = pokeOne.look;

  divTwo.dataset.pokeName = pokeTwo.name;
  divTwo.dataset.pokeType = pokeTwo.type;
  divTwo.dataset.pokeLook = pokeTwo.look;

  imgOne.src = divOne.dataset.pokeLook;
  imgTwo.src = divTwo.dataset.pokeLook;

  imgOne.classList.add("resize");
  imgTwo.classList.add("resize");

  divOne.appendChild(imgOne);
  divTwo.appendChild(imgTwo);

  listOne.appendChild(divOne);
  listTwo.appendChild(divTwo);

  buttonOne.innerText = `I choose ${divOne.dataset.pokeName}!`;
  buttonTwo.innerText = `I choose ${divTwo.dataset.pokeName}!`;

  // for the for loop later
  buttonOne.classList.add("poke-btn");
  buttonTwo.classList.add("poke-btn");

  listOne.appendChild(headerOne);
  listTwo.appendChild(headerTwo);

  listOne.appendChild(buttonOne);
  listTwo.appendChild(buttonTwo);
}

socket.on("connect", () => {
  console.log("Connected");
});

async function createGame() {
  await setUpCards();
}

createGame();

/**
 * ELements for playing the game
 */
const buttonSubmit = document.querySelector("#submit-btn");
const buttonShuffle = document.querySelector("#shuffle-btn");
const buttonClearChat = document.querySelector("#clear-btn");
const buttonClearMsg = document.querySelector("#clear-msg-btn");
const playerCenter = document.querySelector("#player-center");
const chatBoard = document.querySelector("#chat-board");

/**
 * Elements for Messaging in game
 */
const chatResp = document.querySelector("#chat-response");
const roomMsgForm = document.querySelector("#message-form");
const playerText = document.querySelector("#player-text");

/**
 * ELements concerning rules
 */
const roomSelect = document.querySelector("#room-select");
const rules = document.querySelector("#rules");
let room;

/**
 * Elements concerning name
 */
const roomLabel = document.querySelector(".room-label");
const nameForm = document.querySelector(".name-container");
const nameInput = document.querySelector("#name-input");

/**
 * Name submission to server
 */
nameForm.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit("send-name", nameInput.value);
  nameInput.value = "";
});

/**
 * Shuffle and Change Pokemon during a round
 */
buttonShuffle.addEventListener("click", async () => {
  while (playingCardData.length !== 0) playingCardData.pop();
  while (pokeObjects.length !== 0) pokeObjects.pop();
  delete pokeOne.name;
  delete pokeTwo.name;
  await getPokemon();
  await createGame();
});

/**
 * Clear Game Chat
 */
buttonClearChat.addEventListener("click", () => {
  const responses = Array.from(chatBoard.children);
  responses.forEach(resp => {
    if (resp.tagName !== "H2") {
      // so extra blue isnt showing still
      resp.classList.remove("chat-msg");
      resp.innerHTML = "";
    }
  });
});

/**
 * Clear Messaging Chat
 */
buttonClearMsg.addEventListener("click", () => {
  //removes all child elements
  //not using innerHtml = "" on chatResp because dont want first child to
  //be removed...thats the header!
  const responses = Array.from(chatResp.children);
  responses.forEach(resp => {
    if (resp.tagName !== "H2") {
      // so extra blue isnt showing still
      resp.classList.remove("chat-msg");
      resp.innerHTML = "";
    }
  });
});
/**
 * Gain Entrance to the room and get away from rules page
 */
buttonSubmit.addEventListener("click", () => {
  //roomSelect.value is the option selected

  if (buttonSubmit.innerText === "Join Room") {
    socket.emit("join-room", roomSelect.value);
    room = roomSelect.value;
    socket.emit("clean-room", room);
    buttonSubmit.innerText = "Leave Room";
    roomSelect.classList.add("hide");
    playerCenter.classList.remove("hide");
    rules.style.display = "none";
    nameForm.style.display = "none";
    roomLabel.textContent = room;
  } else if (buttonSubmit.innerText === "Leave Room") {
    socket.emit("leave-room", room);
    socket.emit("clean-room", room);
    roomSelect.classList.remove("hide");
    buttonSubmit.innerText = "Join Room";
    playerCenter.classList.add("hide");
    rules.style.display = "flex";
    nameForm.style.display = "flex";
    roomLabel.textContent = "Rooms";
  }
});

/**
 * Select the Room to Join and Submit Choice
 */
roomMsgForm.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit("send-msg", playerText.value);
  playerText.value = "";
});
//this client's move
let playerMove = {};

/**
 * Click on pokemon button and pokemon will print its intro message
 *
 * to scale make use of event delegation and utilize e.target and
 * the data attributes to affect click output
 */
document.addEventListener("click", e => {
  if (!e.target.matches(".poke-btn")) return;
  const div = e.target.previousElementSibling.previousElementSibling;
  pokeObjects.forEach(poke => {
    if (poke.name === div.dataset.pokeName) {
      const chatMsg = document.createElement("div");
      chatMsg.classList.add("chat-msg");
      chatMsg.innerText = poke.printHi();
      playerMove.type = poke.type;
      playerMove.name = poke.name;
      socket.emit(
        "send-poke-info",
        poke.name,
        poke.type
        //NEED TO CALL FUNCTION in CLIENT to use emit callback
        //it wont be used right away if your going to use them
      );

      chatBoard.appendChild(chatMsg);
    }
  });
  console.log(div.dataset.pokeName);
});

/**
 *  Event triggered from pokemon info sent from another client
 */
socket.on("receive-poke-info", () => {
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = "Enemy has chosen";
  chatBoard.appendChild(chatMsg);
});

/**
 *  Event triggered from message sent from another client
 */
socket.on("receive-msg", (message, user) => {
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = user + message;
  chatResp.appendChild(chatMsg);
  console.log(chatResp);
});

/**
 *  Event triggered when game has ended (two player moves selected)
 */
socket.on("game-end", (message, enemyPokeType) => {
  console.log(
    `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`
  );
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`;
  chatBoard.appendChild(chatMsg);

  /**
   * So the game can be replayed again
   */
  socket.emit("clean-room", roomSelect.value);
});

/**
 * Event triggered when player joins room
 */
socket.on("player-joined", message => {
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = message;
  chatBoard.appendChild(chatMsg);
});

/**
 * Event triggered when room size is greater than 2
 */
socket.on("room-full", message => {
  alert(message);
  roomSelect.classList.remove("hide");
  buttonSubmit.innerText = "Join Room";
  playerCenter.classList.add("hide");
  rules.style.display = "flex";
  nameForm.style.display = "flex";
  roomLabel.textContent = "Rooms";
});

/**
 * Event triggered when a player leaves the room
 */
socket.on("player-left", message => {
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = message;
  chatBoard.appendChild(chatMsg);
});
