import { union } from "./mod-bitwise";
import { NoteLabel } from "./classes";
import { nBit } from "./mod-bitwise";

export default { activeFilter, noteUnion, matchNotes};

function activeFilter(squares) {
    return squares.filter((e) => this.cells[e].value === null);
}

function noteUnion(squares) {
    return union(squares.map((i) => this.cells[i].notes));
}

function matchNotes(targetSquares, noteValues) {
    const matchedNotes = [];
    for (const sq of targetSquares) {
        for (let n = 1; n < 10; n++) {
            if (this.cells[sq].hasNote(n) && (nBit(n) & noteValues) !== 0) {
                matchedNotes.push(new NoteLabel(sq, n));
            }
        }
    }
    return matchedNotes;
}

// try
// function matchNotes(cells, targetSquares, noteValues) {
//     const matchedNotes = [];
//     for (const sq of targetSquares) {
//         const hitNotes = cells[sq].notes & noteValues;
//         const positions = onePositions(hitNotes);
//         positions.forEach((j) => matchedNotes.push(new NoteLabel(sq, j)));
//     }
//     return matchedNotes;
// }

