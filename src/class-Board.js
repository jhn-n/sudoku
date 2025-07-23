import { sqs } from "./mod-sqs.js";
import { bit } from "./mod-bit.js";

class Cell {
    constructor() {
        this.value = null;
        this.notes = bit.allNotes;
    }
}

class NoteLabel {
    constructor(cellNum, noteNum) {
        this.cell = cellNum;
        this.note = noteNum;
    }
}

export class Board {
    #cells;

    constructor() {
        this.#cells = Array(81);
        sqs.all.forEach((i) => (this.#cells[i] = new Cell()));
    }

    setNotesOnly(sq, newNotes) {
        this.#cells[sq].notes = newNotes;
    }

    getNotes(sq) {
        return this.#cells[sq].notes;
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

    resetNotes(sq) {
        this.setNotesOnly(sq, bit.allNotes);
    }

    setValueOnly(sq, newValue) {
        this.#cells[sq].value = newValue;
    }

    getValue(sq) {
        return this.#cells[sq].value;
    }

    hasValue(sq) {
        return this.getValue(sq) !== null;
    }

    hasNoValue(sq) {
        return !this.hasValue(sq);
    }

    resetCell(sq) {
        this.setValueOnly(sq, null);
        this.resetNotes(sq);
    }

    setValue(sq, value) {
        this.setValueOnly(sq, value);
        this.setNotesOnly(sq, 0);
        this.updateNotesAfterSetValue(sq, value);
    }

    undoValue(sq) {
        const value = this.getValue(sq);
        this.resetCell(sq);
        this.updateNotesAfterUndoValue(sq, value);
    }

    resetAll() {
        sqs.all.forEach((i) => this.resetCell(i));
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

    noteUnion(squares) {
        return bit.union(squares.map((i) => this.getNotes(i)));
    }

    noteIntersection(squares) {
        return bit.intersection(squares.map((i) => this.getNotes(i)));
    }

    updateNotesAfterSetValue(sq, value) {
        sqs.neighbours[sq].forEach((i) => this.removeNote(i, value));
    }

    updateNotesAfterUndoValue(sq, undoValue) {
        for (const i of sqs.neighbours[sq]) {
            if (this.hasValue(i)) {
                this.removeNote(sq, this.getValue(i));
            } else {
                if (sqs.neighbours[i].every((j) => this.getValue(j) !== undoValue)) {
                    this.addNote(i, undoValue);
                }
                // this.addNote(i, undoValue);
                // for (const j of sqs.neighbours[i]) {
                //     if (this.getValue(j) === undoValue) {
                //         this.removeNote(i, undoValue);
                //         break;
                //     }
                // }
            }
        }
    }

    recalculateAllNotes() {
        sqs.all.filter(this.hasNoValue).forEach((i) => this.resetNotes(i));
        const valueSquares = sqs.all.filter(this.hasValue);
        valueSquares.forEach((i) => this.updateNotesAfterSetValue(i, this.getValue(i)));
    }

    createNoteLabels(targetSqs, notesToMatch) {
        const noteLabels = [];
        for (const sq of targetSqs) {
            const hitNotes = this.getNotes(sq) & notesToMatch;
            const positions = bit.onePositionsNotes(hitNotes);
            positions.forEach((j) => noteLabels.push(new NoteLabel(sq, j)));
        }
        return noteLabels;
    }
}
