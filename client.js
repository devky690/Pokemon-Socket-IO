/*1. Display all the cards for each user 
no shuffling...make a gallery with css grid 
with image tags...on sunday just setup gallery with pokemon
and get the pokemon name to be console logged

2. Dont bother with oop on this project

3. Goal is just to add a pokemon gallery and just print which pokemon
was selected

4. Create a scoreboard

5. Dont bother with tic tac toe tutorial

6. Send a scoreboard with you lost or you win or you tied
after 10 rounds 

*/
import Pokemon from "./pokemon.js";
const POKE = ["pikachu", "charizard", "bulbasaur", "squirtle", "pidgeot"];

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
  const pokeOneIndex = Math.floor(Math.random() * POKE.length);
  let pokeTwoIndex = Math.floor(Math.random() * POKE.length);
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

  headerOne.innerText = divOne.dataset.pokeName;
  headerTwo.innerText = divTwo.dataset.pokeName;

  divOne.appendChild(imgOne);
  divTwo.appendChild(imgTwo);

  listOne.appendChild(divOne);
  listTwo.appendChild(divTwo);

  headerOne.style.color = "white";
  headerOne.style.paddingLeft = "50px";

  headerTwo.style.color = "white";
  headerTwo.style.paddingLeft = "50px";

  buttonOne.innerText = `I choose ${divOne.dataset.pokeName}!`;
  buttonTwo.innerText = `I choose ${divTwo.dataset.pokeName}!`;

  listOne.appendChild(headerOne);
  listTwo.appendChild(headerTwo);

  listOne.appendChild(buttonOne);
  listTwo.appendChild(buttonTwo);
}

//to scale make use of event delegation and utilize e.target and
//the data attributes to affect click output
document.addEventListener("click", e => {
  if (!e.target.matches("button")) return;
  let hasPrinted = false;
  const div = e.target.previousElementSibling.previousElementSibling;
  pokeObjects.forEach(poke => {
    if (poke.name === div.dataset.pokeName && !hasPrinted) {
      poke.printHi();
      //break in case multiple pokemon objects with same name
      hasPrinted = true;
    }
  });
  console.log(div.dataset.pokeName);
});

async function createGame() {
  await setUpCards();
}

createGame();
