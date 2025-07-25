import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { Move } from "./move-index.js";

export { naked1 };

function naked1(board) {
    console.time(`naked1`);
    const movesFound = [];

    const nakedSquares = sqs.all.filter((i) => board.noteCount(i) === 1);
    for (const sq of nakedSquares) {
        const newMove = new Move(
            board,
            `Naked Single`,
            `Look for a cell with only one possible value`,
            `This cell has only a single note so this must be its value`,
            [sq],
            [[sq], bit.allNotes],
            [[], 0],
        );
        movesFound.push(newMove);
    }

    console.timeEnd(`naked1`);
    return movesFound;
}
