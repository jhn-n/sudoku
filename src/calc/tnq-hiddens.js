import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./class-Move.js";

export { hidden1234 };

const numberWord = { 1: "Single", 2: "Double", 3: "Triple", 4: "Quadruple" };

function hidden1234(board, n) {
    console.assert(n >= 1 && n <= 4, "Invalid argument to hidden1234");
    const movesFound = [];
    const hint =
        n === 1
            ? "Look for a note which is only in one cell of its house"
            : `Look for ${n} notes which are only in ${n} cells of a house`;
    const description =
        n === 1
            ? "This value must be in this cell, so no other value is possible"
            : `These ${n} values must be in these ${n} cells, so no other values are possible`;

    for (const house of sqs.houses) {
        const activeSquares = house.filter((i) => board.hasNoValue(i));
        const len = activeSquares.length;

        // To avoid replication between naked and hiddens
        if (n > Math.floor((len - 1) / 2)) {
            continue;
        }
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
                `Hidden ${numberWord[n]}`,
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
