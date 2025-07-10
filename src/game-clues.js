import { bipartitions } from "./comb-mod.js";
import squares from "./squares-mod.js";
// eslint-disable-next-line no-unused-vars
import { nBit, countBits, not, onePositions } from "./bitwise-mod.js";

export default { onlyValues, onlyPlaces };

function onlyValues(n) {
    console.assert(n > 0 && n < 5, "Invalid argument to onlyValues");
    console.time(`onlyValues${n}`);
    const movesFound = [];

    if (n === 1) {
        for (const sq of squares.all) {
            if (this.cells[sq].noteCount === 1) {
                movesFound.push(new Move(`Only 1 Value`, [[sq]], [], []));
            }
        }
    } else {
        for (const line of squares.lines) {
            const activeSquares = this.activeFilter(line);
            const len = activeSquares.length;
            // remove Math.floor?
            if (n > Math.floor(len / 2)) {
                continue;
            }
            for (const subsets of bipartitions[len][n]) {
                const subsetASquares = subsets[0].map((e) => activeSquares[e]);
                const subsetBSquares = subsets[1].map((e) => activeSquares[e]);
                const subsetANotes = this.noteUnion(subsetASquares);
                // if (countBits(subsetANotes) < n) {
                //     console.log("Invalid: insufficient notes in squares", subsetASquares);
                //     this.validGame = false;
                // }

                if (countBits(subsetANotes) > n) {
                    continue;
                }

                const subsetBNotes = this.noteUnion(subsetBSquares);
                if ((subsetBNotes & subsetANotes) === 0) {
                    continue;
                }

                const newMove = new Move(
                    `Only ${n} Values`,
                    [line],
                    matchNotes(this.cells, subsetASquares, subsetANotes),
                    matchNotes(this.cells, subsetBSquares, subsetANotes),
                );
                movesFound.push(newMove);
            }
        }
    }
    console.timeEnd(`onlyValues${n}`);
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}

// note there is overlap with onlyValues depending on length of activeSquares
// check math.floor conditions carefully!
function onlyPlaces(n) {
    console.assert(n > 0 && n < 5, "Invalid argument to onlyPlaces");
    console.time(`onlyPlaces${n}`);
    const movesFound = [];
    for (const line of squares.lines) {
        const activeSquares = this.activeFilter(line);
        const len = activeSquares.length;
        if (n > Math.floor((len - 1) / 2)) {
            continue;
        }
        for (const subsets of bipartitions[len][len - n]) {
            const subsetASquares = subsets[0].map((e) => activeSquares[e]);
            const subsetBSquares = subsets[1].map((e) => activeSquares[e]);
            const subsetANotes = this.noteUnion(subsetASquares);
            if (countBits(subsetANotes) > len - n) {
                continue;
            }
            const subsetBNotes = this.noteUnion(subsetBSquares);
            if ((subsetBNotes & subsetANotes) === 0) {
                continue;
            }

            // const deadNotes =
            //     n === 1 ? [] : matchNotes(this.cells, subsetBSquares, subsetANotes);

            const newMove = new Move(
                `Only ${n} Places`,
                [line],
                matchNotes(this.cells, subsetBSquares, not(subsetANotes)),
                matchNotes(this.cells, subsetBSquares, subsetANotes),
            );
            movesFound.push(newMove);
        }
    }

    console.timeEnd(`onlyPlaces${n}`);
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}


function matchNotes(cells, targetSquares, noteValues) {
    const matchedNotes = [];
    for (const sq of targetSquares) {
        for (let n = 1; n < 10; n++) {
            if (cells[sq].hasNote(n) && (nBit(n) & noteValues) !== 0) {
                matchedNotes.push(new NoteLabel(sq, n));
            }
        }
    }
    return matchedNotes;
}

// try
// function matchNotes(cells, targetSquares, noteValues) {
//     const matchedNotes = [];
//     for (const sq of targetSquares) {
//         const hitNotes = cells[sq].notes & noteValues;
//         const positions = onePositions(hitNotes);
//         positions.forEach((j) => matchedNotes.push(new NoteLabel(sq, j)));
//     }
//     return matchedNotes;
// }


class NoteLabel {
    constructor( cellNum, noteNum) {
        this.cell = cellNum;
        this.note = noteNum;
    }
}

class Move {
    constructor( type, lines, keyNotes, deadNotes, hint, description) {
        this.type = type;
        this.lines = lines;
        this.keyNotes = keyNotes;
        this.deadNotes = deadNotes;
        this.hint = hint;
        this.description = description;
    }
}

