import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { Move } from "./class-Move.js";


export { pointing, claiming };

const pointingTriples = blockAndLineTriples(sqs.rowOf).concat(
    blockAndLineTriples(sqs.columnOf),
);

function pointing(board) {
    const movesFound = [];
    for (const triple of pointingTriples) {
        const activeBlockAndLine = triple[0].filter((i) => board.hasNoValue(i));
        const activeBlockOnly = triple[1].filter((i) => board.hasNoValue(i));
        const activeLineOnly = triple[2].filter((i) => board.hasNoValue(i));

        const blockAndLineNotes = board.noteUnion(activeBlockAndLine);
        const blockOnlyNotes = board.noteUnion(activeBlockOnly);
        const lineOnlyNotes = board.noteUnion(activeLineOnly);

        const targetNotes = blockAndLineNotes & lineOnlyNotes & bit.not(blockOnlyNotes);
        const numTargetNotes = bit.count(targetNotes);

        // exclude 1 target note - this will be spotted by hidden single
        if (numTargetNotes > 1) {
            const newMove = new Move(
                this.name, //`Pointing`,
                "Look for a block value that only occurs in the notes of a single line",
                "This block value must occur on this line, so can be removed from other line cells",
                triple.flat(),
                board.createNoteLabels(activeBlockAndLine, targetNotes),
                board.createNoteLabels(activeLineOnly, targetNotes),
            );
            movesFound.push(newMove);
        }
    }
    return movesFound;
}

function claiming(board) {
    const movesFound = [];
    for (const triple of pointingTriples) {
        const activeBlockAndLine = triple[0].filter((i) => board.hasNoValue(i));
        const activeBlockOnly = triple[1].filter((i) => board.hasNoValue(i));
        const activeLineOnly = triple[2].filter((i) => board.hasNoValue(i));

        const blockAndLineNotes = board.noteUnion(activeBlockAndLine);
        const blockOnlyNotes = board.noteUnion(activeBlockOnly);
        const lineOnlyNotes = board.noteUnion(activeLineOnly);

        const targetNotes = blockAndLineNotes & bit.not(lineOnlyNotes) & blockOnlyNotes;
        const numTargetNotes = bit.count(targetNotes);

        // exclude 1 target note - this will be spotted by hidden single
        if (numTargetNotes > 1) {
            const newMove = new Move(
                this.name, //`Claiming`,
                "Look for a line value that only occurs in the notes of a single block",
                "This line value must occur in this block, so can be removed from other block cells",
                triple.flat(),
                board.createNoteLabels(activeBlockAndLine, targetNotes),
                board.createNoteLabels(activeBlockOnly, targetNotes),
            );
            movesFound.push(newMove);
        }
    }
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
