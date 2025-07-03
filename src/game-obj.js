import { Cell } from "./cell-class";
import domMethods from "./game-dom";
import logicMethods from "./game-logic";
import grid from "./grid-mod";

export const sudoku = {
    validGame: true,
    setupMode: true,
    cells: Array(81),

    start() {
        this.validGame = true;
        this.setupMode = true;
        grid.allCells.forEach( (i) => this.cells[i] = new Cell());
        this.display();
    }
}

Object.assign(sudoku, domMethods, logicMethods);
