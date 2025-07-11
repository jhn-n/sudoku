import { bipartitions } from "./mod-comb.js";
import squares from "./mod-squares.js";
import { countBits, not } from "./mod-bitwise.js";
import { Move } from "./classes.js";

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
                    this.matchNotes(subsetASquares, subsetANotes),
                    this.matchNotes(subsetBSquares, subsetANotes),
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
                this.matchNotes(subsetBSquares, not(subsetANotes)),
                this.matchNotes(subsetBSquares, subsetANotes),
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
