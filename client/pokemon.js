export default class Pokemon {
  constructor(name, type, look) {
    this.name = name;
    this.type = type;
    this.look = look;
  }
  printAttack() {
    console.log(`I am an ${this.type} type so I won`);
  }
  printHi() {
    console.log(`I am ${this.name}, lets battle!`);
  }
}

// export function checkWin(playerOnePoke, playerTwoPoke) {
//   if (
//     (playerOnePoke.dataset.pokeType === "electric" &&
//     playerTwoPoke === "Water") || (playerOnePoke.dataset.pokeType)
//   ) {
//     return true;
//   }
//   if(player)
// }
