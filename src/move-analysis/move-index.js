export class Move {
    constructor( board, type, hint, description, lineSqs, keyNoteSqs, keyNoteValues, deadNoteSqs, deadNoteValues, ) {
        this.type = type;
        this.hint = hint;
        this.description = description;
        this.lineSqs = lineSqs;
        this.keyNotes = board.matchNotes(keyNoteSqs, keyNoteValues);
        this.deadNotes = board.matchNotes(deadNoteSqs, deadNoteValues);
    }

}

// returns a binary indicating presence of specified note
function squaresToNoteTrace(squares, note) {
    return squares
        .map((sq, i) => (this.cells[sq].hasNote(note) ? 1 << i : 0))
        .reduce((a, b) => a + b, 0);
}
