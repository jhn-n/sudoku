import { bit } from "./mod-bit.js";



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
