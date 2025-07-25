import { sqs } from "./mods/mod-sqs.js";
import { bit } from "./mods/mod-bit.js";
import { cmb } from "./mods/mod-cmb.js";

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

class InvalidReport {
    constructor(line, squares) {
        this.line = line;
        this.squares = squares;
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
        return this.getValue(sq) === null;
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

    isComplete() {
        return sqs.all.every((i) => this.hasValue(i));
    }
    
    cloneValues() {
        return sqs.all.map((i) => this.getValue(i));
    }    

    uploadValues(newValues) {
        this.resetAll();
        newValues.forEach((v,i) => this.setValueOnly(i,v));
        this.recalculateAllNotes();
    }
    
    resetAll() {
        sqs.all.forEach((i) => this.resetCell(i));
    }

    cloneAll() {
        const boardClone = new Board();
        for (const i of sqs.all) {
            boardClone.setValueOnly(i, this.getValue(i));
            boardClone.setNotesOnly(i, this.getNotes(i));
        }
        return boardClone;
    }

    uploadAll(newBoard) {
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
        sqs.peers[sq].forEach((i) => this.removeNote(i, value));
    }

    updateNotesAfterUndoValue(sq, undoValue) {
        for (const i of sqs.peers[sq]) {
            if (this.hasValue(i)) {
                this.removeNote(sq, this.getValue(i));
            } else {
                if (sqs.peers[i].every((j) => this.getValue(j) !== undoValue)) {
                    this.addNote(i, undoValue);
                }
                // this.addNote(i, undoValue);
                // for (const j of sqs.peers[i]) {
                //     if (this.getValue(j) === undoValue) {
                //         this.removeNote(i, undoValue);
                //         break;
                //     }
                // }
            }
        }
    }

    recalculateAllNotes() {
        console.time("recalculateAllNotes");
        sqs.all.filter((i) => this.hasNoValue(i)).forEach((i) => this.resetNotes(i));
        const valueSquares = sqs.all.filter((i) => this.hasValue(i));
        valueSquares.forEach((i) => this.updateNotesAfterSetValue(i, this.getValue(i)));
        console.timeEnd("recalculateAllNotes");
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

    findInvalidSubset() {
        console.time("findInvalidSubset");
        for (const sq of sqs.all.filter((sq) => this.hasNoValue(sq))) {
            if (this.getNotes(sq) === 0) {
                return new InvalidReport([], [sq]);
            }
        }
        for (let subsetSize = 2; subsetSize < 9; subsetSize++) {
            for (const line of sqs.houses) {
                const activeSquares = line.filter((sq) => this.hasNoValue(sq));
                for (const subsets of cmb.bipartitions(activeSquares, subsetSize)) {
                    const subsetSquares = subsets[0];
                    const subsetNotes = this.noteUnion(subsetSquares);
                    if (bit.count(subsetNotes) < subsetSize) {
                        console.timeEnd("findInvalidSubset");
                        return new InvalidReport(line, subsetSquares);
                    }
                }
            }
        }
        console.timeEnd("findInvalidSubset");
        return null;
    }
}
