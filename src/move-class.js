export class NoteLabel {
    constructor( cellNum, noteNum) {
        this.cell = cellNum;
        this.note = noteNum;
    }
}

export class Move {
    constructor( type, lines, keyNotes, deadNotes) {
        this.type = type;
        this.lines = lines;
        this.keyNotes = keyNotes;
        this.deadNotes = deadNotes;
    }
}