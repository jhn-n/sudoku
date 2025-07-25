import { naked1 } from "./naked1.js";
import { naked234 } from "./naked234.js";
import { hidden1234 } from "./hidden1234.js";
import { pointing, claiming } from "./pointing.js";

export { Move, findMove };

const strategies = [
    (b) => naked1(b),
    (b) => hidden1234(b, 1),
    (b) => naked234(b, 2),
    (b) => naked234(b, 3),
    (b) => naked234(b, 4),
    (b) => hidden1234(b, 2),
    (b) => hidden1234(b, 3),
    (b) => hidden1234(b, 4),
    (b) => pointing(b),
    (b) => claiming(b),
];

class Move {
    constructor(board, type, hint, description, lineSqs, keyNotesPair, deadNotesPair) {
        this.type = type;
        this.hint = hint;
        this.description = description;
        this.lineSqs = lineSqs;
        this.keyNotes = board.matchNotes(keyNotesPair);
        this.deadNotes = board.matchNotes(deadNotesPair);
    }
}

function findMove() {
    console.time("findMove");
    let result = null;
    for (const strategy of strategies) {
        const moves = strategy();
        if (moves.length > 0) {
            moves.sort((a, b) => {
                return b.deadNotes.length - a.deadNotes.length; 
            });
            result = moves[0];
            break;
        }
    }
    console.timeEnd("clue");
    return result;
}
