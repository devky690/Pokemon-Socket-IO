export default class Pokemon {
  constructor(name, type, look) {
    this.name = name;
    this.type = type;
    this.look = look;
  }

  printHi() {
    return `I am ${this.name}, lets battle!`;
  }
}
