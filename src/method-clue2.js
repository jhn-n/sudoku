import { pointingTriples, xWings } from "./mod-comb.js";
import { countBits, not } from "./mod-bitwise.js";
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
    console.timeEnd(`findXWings${n}`);
}
