import { bipartitions } from "./comb-mod.js";
import { Move, NoteLabel } from "./move-class.js";
import squares from "./squares-mod.js";
import { nBit, countBits, not } from "./bitwise-mod";

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
            const activeSquares = active(this.cells, line);
            const len = activeSquares.length;
            // remove Math.floor?
            if (n > Math.floor(len / 2)) {
                continue;
            }
            for (const subsets of bipartitions[len][n]) {
                const subsetASquares = subsets[0].map((e) => activeSquares[e]);
                const subsetBSquares = subsets[1].map((e) => activeSquares[e]);
                const subsetANotes = noteUnion(this.cells, subsetASquares);
                if (countBits(subsetANotes) < n) {
                    console.log("Invalid: insufficient notes in squares", subsetASquares);
                    this.validGame = false;
                }

                if (countBits(subsetANotes) > n) {
                    continue;
                }
                const subsetBNotes = noteUnion(this.cells, subsetBSquares);
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
        const activeSquares = active(this.cells, line);
        const len = activeSquares.length;
        if (n > Math.floor((len - 1) / 2)) {
            continue;
        }
        for (const subsets of bipartitions[len][len - n]) {
            const subsetASquares = subsets[0].map((e) => activeSquares[e]);
            const subsetBSquares = subsets[1].map((e) => activeSquares[e]);
            const subsetANotes = noteUnion(this.cells, subsetASquares);
            if (countBits(subsetANotes) > len - n) {
                continue;
            }
            const subsetBNotes = noteUnion(this.cells, subsetBSquares);
            if ((subsetBNotes & subsetANotes) === 0) {
                continue;
            }

            const deadNotes =
                n === 1 ? [] : matchNotes(this.cells, subsetBSquares, subsetANotes);

            const newMove = new Move(
                `Only ${n} Places`,
                [line],
                matchNotes(this.cells, subsetBSquares, not(subsetANotes)),
                deadNotes,
            );
            movesFound.push(newMove);
        }
    }

    console.timeEnd("onlyPlaces");
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}

// optimise?
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

function active(cells, squares) {
    return squares.filter((e) => cells[e].value === null);
}

function noteUnion(cells, squares) {
    return squares.reduce((acc, i) => {
        return acc | cells[i].notes;
    }, cells[squares[0]].notes);
}

// eslint-disable-next-line no-unused-vars
function noteIntersection(cells, squares) {
    return squares.reduce((acc, i) => {
        acc & this.cells[i].notes;
    }, cells[0].notes);
}

// try
// function matchNotes(cells, targetSquares, noteValues) {
//     const matchedNotes = [];
//     for (const sq of targetSquares) {
//         const hitNotes = cells[sq].notes & noteValues;
//         if (hitNotes) {
//             for (let n = 1; n < 10; n++) {
//                 if (nBit(hitNotes)) {
//                     matchedNotes.push(new NoteLabel(sq, n));
//                 }

//         }
//         }
//     }
//     return matchedNotes;
// }

// and then this
// const allNotes = [1,2,3,4,5,6,7,8,9];
// function onePositions(n) {
//     return allNotes.filter((note) => ((1 << (note - 1)) & n) !== 0);
// }
