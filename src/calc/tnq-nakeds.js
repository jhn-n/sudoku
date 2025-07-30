import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./class-Move.js";

export { naked1, naked234 };

function naked1(board) {
    const movesFound = [];

    const nakedSquares = sqs.all.filter((i) => board.noteCount(i) === 1);
    for (const sq of nakedSquares) {
        const newMove = new Move(
            this.name, // `Naked Single`,
            `Look for a cell with only one possible value`,
            `This cell has only one note - that must be its value!`,
            [sq],
            board.createNoteLabels([sq], bit.allNotes),
            [],
        );
        movesFound.push(newMove);
    }

    return movesFound;
}

const numberWord = { 1: "Single", 2: "Double", 3: "Triple", 4: "Quadruple" };

function naked234(board, n) {
    console.assert(n >= 2 && n <= 4, "Invalid argument to naked234");
    const movesFound = [];

    for (const house of sqs.houses) {
        const activeSquares = house.filter((i) => board.hasNoValue(i));

        // To avoid replication between naked and hiddens
        if (n > Math.floor(activeSquares.length / 2)) {
        continue;
        }
        // could remove Math.floor?

        for (const subsets of cmb.bipartitions(activeSquares, n)) {
            const [subsetA, subsetB] = subsets;
            const subsetANotes = board.noteUnion(subsetA);
            if (bit.count(subsetANotes) > n) {
                continue;
            }
            const subsetBNotes = board.noteUnion(subsetB);
            if ((subsetBNotes & subsetANotes) === 0) {
                continue;
            }
            const newMove = new Move(
                `Naked ${numberWord[n]}`,
                `Look for ${n} cells which can only take ${n} values between them`,
                `There are only ${n} possible values across ${n} cells so the values cannot be used elsewhere in the house`,
                house,
                board.createNoteLabels(subsetA, subsetANotes),
                board.createNoteLabels(subsetB, subsetANotes),
            );
            movesFound.push(newMove);
        }
    }

    return movesFound;
}
