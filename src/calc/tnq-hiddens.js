import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./class-Move.js";

export { hidden1234 };

// const numberWord = { 1: "single", 2: "double", 3: "triple", 4: "quadruple" };

function hidden1234(board, n) {
    console.assert(n >= 1 && n <= 4, "Invalid argument to hidden1234");
    const movesFound = [];
    const hint =
        n === 1
            ? "Look for a value which occurs only once in the notes of a house"
            : `Look for ${n} values which only occur in the notes of ${n} cells of a house`;
    const description =
        n === 1
            ? "This value can only occur in this cell, so no other value is possible here"
            : `These ${n} values can only occur in these ${n} cells, so other values can be excluded`;

    for (const house of sqs.houses) {
        const activeSquares = house.filter((i) => board.hasNoValue(i));
        const len = activeSquares.length;

        // To avoid replication between naked and hiddens
        // if (n > Math.floor((len - 1) / 2)) {
        //     continue;
        // }
        // could remove Math.floor?

        for (const subsets of cmb.bipartitions(activeSquares, len - n)) {
            const [subsetA, subsetB] = subsets;
            const subsetANotes = board.noteUnion(subsetA);
            if (bit.count(subsetANotes) > len - n) {
                continue;
            }
            const subsetBNotes = board.noteUnion(subsetB);
            if ((subsetBNotes & subsetANotes) === 0) {
                continue;
            }

            const newMove = new Move(
                this.name, //`Hidden ${numberWord[n]}`,
                hint,
                description,
                house,
                board.createNoteLabels(subsetB, bit.not(subsetANotes)),
                board.createNoteLabels(subsetB, subsetANotes),
            );
            movesFound.push(newMove);
        }
    }

    return movesFound;
}
