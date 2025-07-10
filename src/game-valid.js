import squares from "./squares-mod.js";
import { bipartitions } from "./comb-mod.js";
import { countBits, union} from "./bitwise-mod";

export default { gameIsValid, makeInvalidReport };

let invalidReport = null;

function gameIsValid() {
    this.displayRemoveInvalid(invalidReport);
    console.time("Validity check");
    this.makeInvalidReport();
    console.timeEnd("Validity check");
    if (invalidReport === null) {
        return true;
    }
    console.log(invalidReport);
    this.displayInvalid(invalidReport);
    return false;
}

function makeInvalidReport() {
    for (const sq of active(this.cells, squares.all)) {
        if (this.cells[sq].notes === 0) {
            invalidReport = new InvalidReport([sq], [sq]);
            return;
        }
    }

    for (const line of squares.lines) {
        const activeSquares = active(this.cells, line);
        const len = activeSquares.length;
        for (let subsetSize = 2; subsetSize < len; subsetSize++) {
            for (const subsets of bipartitions[len][subsetSize]) {
                const subsetSquares = subsets[0].map((e) => activeSquares[e]);
                const subsetNotes = noteUnion(this.cells, subsetSquares);
                if (countBits(subsetNotes) < subsetSize) {
                    invalidReport = new InvalidReport(line, subsetSquares);
                    return;
                }
            }
        }
    }
    invalidReport = null;
}

function active(cells, squares) {
    return squares.filter((e) => cells[e].value === null);
}

function noteUnion(cells, squares) {
    return union(squares.map((i) => cells[i].notes));
}

export class InvalidReport {
    constructor( line, squares) {
        this.line = line;
        this.squares = squares;
    }
}


