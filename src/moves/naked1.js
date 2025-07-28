import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { Move } from "./class-Move.js";


export { naked1 };

function naked1(board) {
    console.time(`naked1`);
    const movesFound = [];

    const nakedSquares = sqs.all.filter((i) => board.noteCount(i) === 1);
    for (const sq of nakedSquares) {
        const newMove = new Move(
            this.name, // `Naked Single`,
            `Look for a cell with only one possible value`,
            `This cell has only a single note so that must be its value`,
            [sq],
            board.createNoteLables([sq], bit.allNotes),
            [],
        );
        movesFound.push(newMove);
    }

    console.timeEnd(`naked1`);
    return movesFound;
}
