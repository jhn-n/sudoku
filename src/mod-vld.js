import { sqs } from "./mod-sqs.js";
import { cmb } from "./mod-cmb.js";
import { bit } from "./mod-bit.js";

class InvalidReport {
    constructor(line, squares) {
        this.line = line;
        this.squares = squares;
    }
}

function findInvalidSubset(board) {
    console.time("findInvalidSubset");
    for (const sq of sqs.all.filter((sq) => board.hasNoValue(sq))) {
        if (board.getNotes(sq) === 0) {
            return new InvalidReport([], [sq]);
        }
    }

    for (let subsetSize = 2; subsetSize < 9; subsetSize++) {
        for (const line of sqs.blocksAndLines) {
            const activeSquares = line.filter((sq) => board.hasNoValue(sq));
            for (const subsets of cmb.bipartitions(activeSquares, subsetSize)) {
                const subsetSquares = subsets[0];
                const subsetNotes = board.noteUnion(subsetSquares);
                if (bit.count(subsetNotes) < subsetSize) {
                    console.timeEnd("findInvalidSubset");
                    return new InvalidReport(line, subsetSquares);
                }
            }
        }
    }
    console.timeEnd("findInvalidSubset");
    return null;
}

export const vld = { findInvalidSubset };
