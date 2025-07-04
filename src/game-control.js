import { Cell } from "./cell-class";
import grid from "./grid-mod";

export default { start, reset, finishedSetup };

function start() {
    this.reset();
}

function reset() {
    grid.allSquares.forEach((i) => (this.cells[i] = new Cell()));
    this.setupMode = true;
    this.validGame = true;
    this.buttonText = ["done", "reset"];
    this.message = "Create start position";
    this.description = "Click done button when complete";
    this.display();
}

function finishedSetup() {
    this.setupMode = false;
    this.buttonText = ["clue", "save", "revert", "reset"];
    this.message = "Get solving!";
    this.description = "";
    this.display();
}
