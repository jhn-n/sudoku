import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { Move } from "./move-index.js";

export { pointing, claiming };

const pointingTriples = blockAndLineTriples(sqs.rowOf).concat(
    blockAndLineTriples(sqs.columnOf),
);

function pointing(board) {
    console.time("pointing");
    const movesFound = [];
    for (const triple of pointingTriples) {
        const activeBlockAndLine = triple[0].filter((i) => board.hasNoValue(i));
        const activeBlockOnly = triple[1].filter((i) => board.hasNoValue(i));
        const activeLineOnly = triple[2].filter((i) => board.hasNoValue(i));

        const blockAndLineNotes = this.noteUnion(activeBlockAndLine);
        const blockOnlyNotes = this.noteUnion(activeBlockOnly);
        const lineOnlyNotes = this.noteUnion(activeLineOnly);

        const targetNotes = blockAndLineNotes & lineOnlyNotes & bit.not(blockOnlyNotes);
        const numTargetNotes = bit.countBits(targetNotes);

        // exclude 1 target note - this will be spotted by only place
        if (numTargetNotes > 1) {
            const newMove = new Move(
                board,
                `Pointing`,
                triple.flat(),
                [activeBlockAndLine, targetNotes],
                [activeLineOnly, targetNotes],
            );
            movesFound.push(newMove);
        }
    }
    console.timeEnd("pointing");
    return movesFound;
}

function claiming(board) {
    console.time("claiming");
    const movesFound = [];
    for (const triple of pointingTriples) {
        const activeBlockAndLine = triple[0].filter((i) => board.hasNoValue(i));
        const activeBlockOnly = triple[1].filter((i) => board.hasNoValue(i));
        const activeLineOnly = triple[2].filter((i) => board.hasNoValue(i));

        const blockAndLineNotes = this.noteUnion(activeBlockAndLine);
        const blockOnlyNotes = this.noteUnion(activeBlockOnly);
        const lineOnlyNotes = this.noteUnion(activeLineOnly);

        const targetNotes = blockAndLineNotes & bit.not(lineOnlyNotes) & blockOnlyNotes;
        const numTargetNotes = bit.countBits(targetNotes);

        // exclude 1 target note - this will be spotted by only place
        if (numTargetNotes > 1) {
            const newMove = new Move(
                board,
                `Claiming`,
                triple.flat(),
                [activeBlockAndLine, targetNotes],
                [activeBlockOnly, targetNotes],
            );
            movesFound.push(newMove);
        }
    }
    console.timeEnd("claiming");
    return movesFound;
}

// triple: [block&line], [block only], [line only]
function blockAndLineTriples(lineOf) {
    const triples = [];
    for (let b = 0; b < 9; b++) {
        for (let l = 0; l < 9; l++) {
            const triple = [[], [], []];
            for (const sq of sqs.all) {
                const sqLine = lineOf(sq);
                const sqBlock = sqs.blockOf(sq);
                if (sqBlock === b && sqLine === l) {
                    triple[0].push(sq);
                } else if (sqBlock === b) {
                    triple[1].push(sq);
                } else if (sqLine === l) {
                    triple[2].push(sq);
                }
            }
            if (triple[0].length > 0) {
                triples.push(triple);
            }
        }
    }
    return triples;
}
