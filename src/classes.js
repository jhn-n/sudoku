import { hasBit, removeBit, addBit, countBits, not } from "./mod-bitwise";

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

export class NoteLabel {
    constructor( cellNum, noteNum) {
        this.cell = cellNum;
        this.note = noteNum;
    }
}

export class Move {
    constructor( type, lines, keyNotes, deadNotes, hint, description) {
        this.type = type;
        this.lines = lines;
        this.keyNotes = keyNotes;
        this.deadNotes = deadNotes;
        this.hint = hint;
        this.description = description;
    }
}

export class InvalidReport {
    constructor(line, squares) {
        this.line = line;
        this.squares = squares;
    }
}
