import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./move-index.js";

export { naked234 };

const numberWord = { 1: "single", 2: "double", 3: "triple", 4: "quadruple" };

function naked234(board, n) {
    console.assert(n >= 2 && n <= 4, "Invalid argument to naked234");
    console.time(`naked234-${n}`);
    const movesFound = [];

    for (const house of sqs.houses) {
        const activeSquares = house.filter((i) => board.hasNoValue(i));

        // To avoid replication between naked and hiddens
        // if (n > Math.floor(activeSquares.length / 2)) {
        // continue;
        // }
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
                board,
                `Naked ${numberWord[n]}`,
                house,
                [subsetA, subsetANotes],
                [subsetB, subsetANotes],
            );
            movesFound.push(newMove);
        }
    }

    console.timeEnd(`naked234-${n}`);
    return movesFound;
}
