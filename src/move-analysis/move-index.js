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

import { sqs } from "./mod-sqs.js";


// triple: [block&line], [block only], [line only]
const pointingTriples = [];
for (let b = 0; b < 9; b++) {
    for (let l = 0; l < 9; l++) {
        const tripleRow = [[], [], []];
        const tripleColumn = [[], [], []];
        for (let sq = 0; sq < 81; sq++) {
            const sqRow = sqs.rowOf(sq);
            const sqColumn = sqs.columnOf(sq);
            const sqBlock = sqs.blockOf(sq);
            if (sqBlock === b && sqRow === l) {
                tripleRow[0].push(sq);
            } else if (sqBlock === b) {
                tripleRow[1].push(sq);
            } else if (sqRow === l) {
                tripleRow[2].push(sq);
            }
            if (sqBlock === b && sqColumn === l) {
                tripleColumn[0].push(sq);
            } else if (sqBlock === b) {
                tripleColumn[1].push(sq);
            } else if (sqColumn === l) {
                tripleColumn[2].push(sq);
            }
        }
        if (tripleRow[0].length > 0) {
            pointingTriples.push(tripleRow);
        }
        if (tripleColumn[0].length > 0) {
            pointingTriples.push(tripleColumn);
        }
    }
}