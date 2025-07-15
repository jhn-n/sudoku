import squares from "./mod-squares.js";
import { pointingTriples } from "./mod-comb.js";
import { bipartitions } from "./mod-comb.js";
import { countBits, nBit, not, onePositionsFromZero, union } from "./mod-bitwise.js";
import { Move } from "./classes.js";

export default { findPointingTriples, findXWings };

function findPointingTriples() {
    console.time("findPointingTriples");
    const movesFound = [];
    for (const triple of pointingTriples) {
        const activeBlockAndLine = this.activeFilter(triple[0]);
        const activeBlockOnly = this.activeFilter(triple[1]);
        const activeLineOnly = this.activeFilter(triple[2]);
        const blockAndLineNotes = this.noteUnion(activeBlockAndLine);
        const blockOnlyNotes = this.noteUnion(activeBlockOnly);
        const lineOnlyNotes = this.noteUnion(activeLineOnly);
        const targetNotes = blockAndLineNotes & lineOnlyNotes & not(blockOnlyNotes);
        const targetNotes2 = blockAndLineNotes & not(lineOnlyNotes) & blockOnlyNotes;
        const numTargetNotes = countBits(targetNotes);
        const numTargetNotes2 = countBits(targetNotes2);

        // exclude 1 target note - this will be spotted by only place
        if (numTargetNotes > 1) {
            const label = numTargetNotes === 2 ? "Double" : "Triple";
            const newMove = new Move(
                "Pointing " + label + " Block",
                [...triple],
                this.matchNotes(activeBlockAndLine, targetNotes),
                this.matchNotes(activeLineOnly, targetNotes),
            );
            movesFound.push(newMove);
        }
        if (numTargetNotes2 > 1) {
            const label = numTargetNotes === 2 ? "Double" : "Triple";
            const newMove = new Move(
                "Pointing " + label + " Line",
                [...triple],
                this.matchNotes(activeBlockAndLine, targetNotes2),
                this.matchNotes(activeBlockOnly, targetNotes2),
            );
            movesFound.push(newMove);
        }
    }
    console.timeEnd("findPointingTriples");
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}

function findXWings(n) {
    console.time(`findXWings${n}`);
    const movesFound = [];
    for (let x = 1; x <= 9; x++) {
        const rowBinaries = squares.rows.map((row) => this.squaresToNoteTrace(row, x));
        const rowNoteCounts = rowBinaries.map((e) => countBits(e));
        const potentialRowIndices = Array.from(
            rowBinaries
                .keys()
                .filter((i) => rowNoteCounts[i] <= n && rowNoteCounts[i] >= 2),
        );
        console.log(x, "potential rows:", potentialRowIndices);
        const numPotentialRows = potentialRowIndices.length;
        if (numPotentialRows < n) {
            continue;
        }
        for (const comb of bipartitions[numPotentialRows][n]) {
            const targetRowIndices = comb[0].map((i) => potentialRowIndices[i]);
            console.log("Analysing", targetRowIndices);
            const targetRowBinaries = targetRowIndices.map((i) => rowBinaries[i]);
            console.log("With binaries", targetRowBinaries);
            const unionTargetRowsBinary = union(targetRowBinaries);
            console.log("Union", unionTargetRowsBinary);
            if (countBits(unionTargetRowsBinary) !== n) {
                console.log("No good!");
                continue;
            }
            console.log("found an X Wing!");

            const targetColumnIndices = onePositionsFromZero(unionTargetRowsBinary);
            const crossCells = [];
            const sweepCells = [];
            for (const sq of squares.all) {
                const sqRow = squares.rowOf(sq);
                const sqColumn = squares.columnOf(sq);
                const inTargetColumn = targetColumnIndices.includes(sqColumn);
                const inTargetRows = targetRowIndices.includes(sqRow);
                if (inTargetColumn && inTargetRows) {
                    crossCells.push(sq);
                }
                if (inTargetColumn && !inTargetRows) {
                    sweepCells.push(sq);
                }
            }
            const lineCells = targetRowIndices
                .map((i) => squares.rows[i])
                .concat(targetColumnIndices.map((i) => squares.columns[i]));
            console.log("target cells:", sweepCells);
            if ((this.noteUnion(sweepCells) & nBit(x)) === 0) {
                console.log("But no notes to remove :(");
                continue;
            }
            console.log("Yay");
            const newMove = new Move(
                `X-Wing ${n}`,
                lineCells,
                this.matchNotes(crossCells, nBit(x)),
                this.matchNotes(sweepCells, nBit(x)),
            );
            console.log(newMove);
            movesFound.push(newMove);
        }
    }
    // now do columns!!
    
    console.timeEnd(`findXWings${n}`);
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}
