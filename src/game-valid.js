import squares from "./squares-mod.js";
import { bipartitions } from "./comb-mod.js";
import { countBits } from "./bitwise-mod";

export default { gameIsValid, makeInvalidReport };


function gameIsValid() {
    this.displayRemoveInvalid();
    console.time("Validity check");
    const invalidReport = this.makeInvalidReport();
    console.timeEnd("Validity check");
    if (invalidReport === null) {
        return true;
    }
    console.log(invalidReport);
    this.displayInvalid(invalidReport);
    return false;
}

function makeInvalidReport() {
    for (const sq of this.activeFilter(squares.all)) {
        if (this.cells[sq].notes === 0) {
            return new InvalidReport([sq], [sq]);
        }
    }

    for (let subsetSize = 2; subsetSize < 9; subsetSize++) {
        for (const line of squares.lines) {
            const activeSquares = this.activeFilter(line);
            const len = activeSquares.length;
            for (const subsets of bipartitions[len][subsetSize]) {
                const subsetSquares = subsets[0].map((e) => activeSquares[e]);
                const subsetNotes = this.noteUnion(subsetSquares);
                if (countBits(subsetNotes) < subsetSize) {
                    return new InvalidReport(line, subsetSquares);
                }
            }
        }
    }
    return null;
}

class InvalidReport {
    constructor(line, squares) {
        this.line = line;
        this.squares = squares;
    }
}
