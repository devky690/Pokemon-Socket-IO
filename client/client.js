/* NEED TO DO 

1.Create a scoreboard

2.Send a scoreboard with you lost or you win or you tied
after 10 rounds 

*/
import Pokemon from "./pokemon.js";
const POKE = ["pikachu", "charizard", "bulbasaur", "squirtle", "pidgeot"];
//delete io server when deploying (no localhost:3000)
const socket = io("https://pokemon-socket-io.herokuapp.com");

let playingCardData = [];
//loop through pokeObjects while checking the data set of the element before
//previous sibling of e.target with click event below
//to determine which pokemon instance method to print
let pokeObjects = [];
let pokeOne = new Pokemon();
let pokeTwo = new Pokemon();

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
  const pokeOne = POKE[pokeOneIndex];
  const pokeTwo = POKE[pokeTwoIndex];
  const responseOne = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokeOne}`
  );
  const dataOne = await responseOne.json();
  const responseTwo = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokeTwo}`
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

const buttonSubmit = document.querySelector("#submit-btn");
const buttonShuffle = document.querySelector("#shuffle-btn");
const buttonClearChat = document.querySelector("#clear-btn");
const roomSelect = document.querySelector("#room-select");
const chatBoard = document.querySelector("#chat-board");
let room;
//decides if user can play or not
// let hasPrinted = false;

buttonShuffle.addEventListener("click", async () => {
  while (playingCardData.length !== 0) playingCardData.pop();
  await getPokemon();
  await createGame();
});

buttonClearChat.addEventListener("click", () => {
  //removes all child elements
  chatBoard.innerHTML = "";
});

buttonSubmit.addEventListener("click", () => {
  //roomSelect.value is the option selected
  socket.emit("join-room", roomSelect.value);
  room = roomSelect.value;
  socket.emit("clean-room", roomSelect.value);
});

//this client's move
let playerMove = {};

//to scale make use of event delegation and utilize e.target and
//the data attributes to affect click output
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

//other client will see you as enemy due to broadcast.emit
socket.on("receive-poke-info", () => {
  const chatMsg = document.createElement("div");
  chatMsg.style.color = "black";
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = "Enemy has chosen";
  chatBoard.appendChild(chatMsg);
});

//get rid of this and turn into an emit callback! so message can go to correct client!
socket.on("game-end", (message, enemyPokeType) => {
  console.log(
    `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`
  );
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`;
  chatBoard.appendChild(chatMsg);
  //so the user can choose their pokemon again and keep playing
  // hasPrinted = false;
  socket.emit("clean-room", roomSelect.value);
});

socket.on("player-joined", message => {
  const chatMsg = document.createElement("div");
  chatMsg.classList.add("chat-msg");
  chatMsg.innerText = message;
  chatBoard.appendChild(chatMsg);
});
