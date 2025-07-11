import { pointingTriples } from "./mod-comb.js";
import { not } from "./mod-bitwise.js";
import { Move } from "./classes.js";

export default { findPointingTriples };

function findPointingTriples() {
    console.time("pointingTriples");
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
        if (targetNotes !== 0) {
            const newMove = new Move(
                "Pointing Triple Block",
                [...triple],
                this.matchNotes(activeBlockAndLine, targetNotes),
                this.matchNotes(activeLineOnly, targetNotes),
            );
            movesFound.push(newMove);
        }
        if (targetNotes2 !== 0) {
            const newMove = new Move(
                "Pointing Triple Line",
                [...triple],
                this.matchNotes(activeBlockAndLine, targetNotes2),
                this.matchNotes(activeBlockOnly, targetNotes2),
            );
            movesFound.push(newMove);
        }
    }
    console.timeEnd("pointingTriples");
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}
