import { Cell } from "./cell-class";
import boardDomMethods from "./board-dom";
import boardLogicMethods from "./board-logic";

export class Board {
    constructor() {
        this.validGame = true;
        this.setupMode = true;
        this.cells = [];
        for (let i = 0; i < 81; i++) {
            this.cells.push(new Cell());
        }
        this.display();
    }

    reset() {
        for (const cell of this.cells) {
            cell.reset();
        }
        this.display();
    }
}

for (const [key, value] of Object.entries(boardDomMethods)) {
    Board.prototype[key] = value;
}

for (const [key, value] of Object.entries(boardLogicMethods)) {
    Board.prototype[key] = value;
}
