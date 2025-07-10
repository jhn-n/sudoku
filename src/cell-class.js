import { hasBit, removeBit, addBit, countBits, not } from "./bitwise-mod";

export class Cell {
    constructor() {
        this.value = null;
        this.notes = not(0);
    }

    setValue(n) {
        console.assert(n >= 1 && n <= 9, "Error - trying to set cell value out of range");
        this.value = n;
        this.notes = 0;
    }

    hasNote(n) {
        return hasBit(this.notes, n);
    }

    removeNote(n) {
        this.notes = removeBit(this.notes, n);
    }

    addNote(n) {
        this.notes = addBit(this.notes, n);
    }

    reset() {
        this.value = null;
        this.notes = not(0);
    }

    
    get noteCount() {
        return countBits(this.notes);
    }

    clone() {
        const newCell = new Cell();
        newCell.value = this.value;
        newCell.notes = this.notes;
        return newCell;
    }
}
