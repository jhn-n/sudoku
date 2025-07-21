import { sqs } from "./mod-sqs.js";
import { bit } from "./mod-bit.js";

class Cell {
    constructor() {
        this.value = null;
        this.notes = bit.allNotes;
    }
}

export class Board {
    #cells;

    constructor() {
        this.#cells = Array(81);
        sqs.all.forEach((i) => (this.#cells[i] = new Cell()));
    }

    setValueOnly(sq, newValue) {
        this.#cells[sq].value = newValue;
    }

    getValue(sq) {
        return this.#cells[sq].value;
    }

    setNotesOnly(sq, newNotes) {
        this.#cells[sq].notes = newNotes;
    }

    getNotes(sq) {
        return this.#cells[sq].notes;
    }

    setValue(sq, value) {
        this.setValueOnly(sq, value);
        this.setNotesOnly(sq, 0);
    }

    undoValue(sq) {
        this.setValueOnly(sq, null);
        this.setNotesOnly(sq, bit.allNotes);
    }

    reset() {
        sqs.all.forEach((i) => this.undoValue(i));
    }

    addNote(sq, n) {
        this.setNotesOnly(sq, bit.add(this.getNotes(sq), n));
    }

    removeNote(sq, n) {
        this.setNotesOnly(sq, bit.remove(this.getNotes(sq), n));
    }

    hasNote(sq, n) {
        return bit.has(this.getNotes(sq), n);
    }

    noteCount(sq) {
        return bit.count(this.getNotes(sq));
    }

    clone() {
        const boardClone = new Board();
        for (const i of sqs.all) {
            boardClone.setValueOnly(i, this.getValue(i));
            boardClone.setNotesOnly(i, this.getNotes(i));
        }
        return boardClone;
    }

    upload(newBoard) {
        for (const i of sqs.all) {
            this.setValueOnly(i, newBoard.getValue(i));
            this.setNotesOnly(i, newBoard.getNotes(i));
        }
    }

    recalculateAllNotes() {
        for (const i of sqs.all) {
            if (this.getValue(i) === null) {
                this.setNotesOnly(i, bit.allNotes);
            }
        }
        const valueSquares = sqs.all.filter((i) => this.getValue(i) !== null);
        for (const i of valueSquares) {
            for (const j of sqs.neighbours[i]) {
                this.removeNote(j, this.getValue(i));
            }
        }
    }
}
