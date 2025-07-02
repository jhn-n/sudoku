import { square } from "./square-mod";
import { Cell } from "./cell-class";
// eslint-disable-next-line no-unused-vars
import { lines } from "./line-mod";
import { display } from "./board-dom";

export class Board {
    constructor() {
        this.setup = true;
        this.cells = [];
        for (let i = 0; i < 81; i++) {
            this.cells.push(new Cell());
        }
    }
    
    calculateNotesGivenValues() {
        for (let i = 0; i < 81; i++) {
            if (!this.cells[i].value) {
                this.cells[i].reset();
            }
        }
        for (let i = 0; i < 81; i++) {
            if (this.cells[i].value) {
                for (let j = 0; j < 81; j++) {
                    if (square.sameLine(i, j)) {
                        this.cells[j].removeNote(this.cells[i].value);
                    }
                }
            }
        }
        this.display();
    }
}

Board.prototype.display = display;