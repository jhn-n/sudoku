import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./move-index.js";

export { hidden1234 };

const numberWord = { 1: "single", 2: "double", 3: "triple", 4: "quadruple" };

function hidden1234(board, n) {
    console.assert(n >= 1 && n <= 4, "Invalid argument to hidden1234");
    console.time(`hidden1234-${n}`);
    const movesFound = [];

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
                board,
                `Hidden ${numberWord[n]}`,
                house,
                [subsetB, bit.not(subsetANotes)],
                [subsetB, subsetANotes],
            );
            movesFound.push(newMove);
        }
    }

    console.timeEnd(`hidden1234-${n}`);
    return movesFound;
}
