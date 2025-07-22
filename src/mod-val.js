import { sqs } from "./mod-sqs.js";
import { cmb } from "./mod-cmb.js";
import { bit } from "./mod-bit.js";

class InvalidReport {
    constructor(line, squares) {
        this.line = line;
        this.squares = squares;
    }
}

// function gameIsValid() {
//     this.displayRemoveInvalid();
//     console.time("Validity check");
//     const invalidReport = this.makeInvalidReport();
//     console.timeEnd("Validity check");
//     if (invalidReport === null) {
//         return true;
//     }
//     console.log(invalidReport);
//     this.displayInvalid(invalidReport);
//     return false;
// }

function findInvalidSubset(board) {
    console.time("findInvalidSubset");
    for (const sq of sqs.all.filter(board.hasNoValue)) {
        if (board.getNotes(sq) === 0) {
            return new InvalidReport([], [sq]);
        }
    }

    for (let subsetSize = 2; subsetSize < 9; subsetSize++) {
        for (const line of sqs.blocksAndLines) {
            const activeSquares = line.filter(board.hasNoValue);
            for (const subsets of cmb.bipartitions(activeSquares, subsetSize)) {
                const subsetSquares = subsets[0];
                const subsetNotes = board.noteUnion(subsetSquares);
                if (bit.countBits(subsetNotes) < subsetSize) {
                    console.timeEnd("findInvalidSubset");
                    return new InvalidReport(line, subsetSquares);
                }
            }
        }
    }
    console.timeEnd("findInvalidSubset");
    return null;
}

export const val = { findInvalidSubset };
