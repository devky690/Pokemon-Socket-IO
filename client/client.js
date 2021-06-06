/* NEED TO DO 

1.Create a scoreboard

2.Send a scoreboard with you lost or you win or you tied
after 10 rounds 

*/

import { io } from "socket.io-client";
import Pokemon from "./pokemon.js";
const POKE = ["pikachu", "charizard", "bulbasaur", "squirtle", "pidgeot"];
const socket = io("http://localhost:3000");

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
const chatBoard = document.querySelector("#chat-board");

async function getPokemon() {
  const pokeOneIndex = Math.floor(Math.random() * POKE.length);
  const pokeTwoIndex = Math.floor(Math.random() * POKE.length);
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

//Add in room joins later
const buttonSubmit = document.querySelector("#submit-btn");
const buttonShuffle = document.querySelector("#shuffle-btn");
const roomSelect = document.querySelector("#room-select");
buttonSubmit.addEventListener("click", () => {
  //roomSelect.value is the option selected
  console.log(roomSelect.value);
  //socket.emit("join-room")
});

buttonShuffle.addEventListener("click", async () => {
  while (playingCardData.length !== 0) playingCardData.pop();
  await getPokemon();
  await createGame();
});

//you will be seen as other/enemy player
let otherPlayerMove = {};
//this client's move
let playerMove = {};

//to scale make use of event delegation and utilize e.target and
//the data attributes to affect click output
document.addEventListener("click", e => {
  if (!e.target.matches(".poke-btn")) return;
  let hasPrinted = false;
  const div = e.target.previousElementSibling.previousElementSibling;
  pokeObjects.forEach(poke => {
    if (poke.name === div.dataset.pokeName && !hasPrinted) {
      poke.printHi();
      playerMove.type = poke.type;
      playerMove.name = poke.name;
      socket.emit(
        "send-poke-info",
        poke.name,
        poke.type
        //NEED TO CALL FUNCTION in CLIENT to use emit callback
        //it wont be used right away if your going to use them
      );
      //break in case multiple pokemon objects with same name
      hasPrinted = true;
    }
  });
  console.log(div.dataset.pokeName);
});

//other client will see you as enemy due to broadcast.emit
socket.on("receive-poke-info", (name, type) => {
  otherPlayerMove.name = name;
  otherPlayerMove.type = type;
  console.log(
    `Enemy chose ${otherPlayerMove.name} with the ${otherPlayerMove.type} type`
  );
  chatBoard.classList.remove("chat-hide");
  chatBoard.classList.add("chat-reveal");
  const chatMsg = document.createElement("div");
  chatMsg.innerText = "Enemy has chosen";
  chatBoard.appendChild(chatMsg);
});

socket.on("game-end", (message, enemyPokeType) => {
  console.log(
    `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`
  );
  const chatMsg = document.createElement("div");
  chatMsg.innerText = `${message} Because the enemy played a pokemon with the ${enemyPokeType} type`;
  chatBoard.appendChild(chatMsg);
});
