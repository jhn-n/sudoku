import { sqs } from "../mods/mod-sqs.js";
import { bit } from "../mods/mod-bit.js";
import { cmb } from "../mods/mod-cmb.js";
import { Move } from "./class-Move.js";

export { xWing };
const xWingNames = { 2: "X-Wing", 3: "Swordfish", 4: "Jellyfish" };

function xWing(board, n) {
    const movesFound = [];

    // assume rows restricted first
    for (let x = 1; x <= 9; x++) {
        const rowBinaries = sqs.rows.map((r) => squaresToNoteTrace(board, r, x));
        const rowNoteCounts = rowBinaries.map((e) => bit.count(e));
        const potentialRowIndices = rowBinaries
            .keys()
            .filter((i) => rowNoteCounts[i] <= n && rowNoteCounts[i] >= 2)
            .toArray();
        if (potentialRowIndices.length < n) continue;

        for (const comb of cmb.bipartitions(potentialRowIndices, n)) {
            const targetRowIndices = comb[0];
            const targetRowBinaries = targetRowIndices.map((i) => rowBinaries[i]);
            const unionTargetRowsBinary = bit.union(targetRowBinaries);
            if (bit.count(unionTargetRowsBinary) !== n) continue;

            const targetColumnIndices = bit.onePositionsFromZero(unionTargetRowsBinary);
            const { crossCells, sweepCells, lines } = generateCellsForXWing(
                targetRowIndices,
                targetColumnIndices,
                true,
            );
            if ((board.noteUnion(sweepCells) & bit.nth(x)) === 0) continue;

            const newMove = new Move(
                `${xWingNames[n]} Rows`,
                `Look for a note in ${n} rows that is restricted to only ${n} columns`,
                `The note value for the ${n} columns must be in these ${n} rows only`,
                lines,
                board.createNoteLabels(crossCells, bit.nth(x)),
                board.createNoteLabels(sweepCells, bit.nth(x)),
            );
            movesFound.push(newMove);
        }
    }

    // now do columns!!
    for (let x = 1; x <= 9; x++) {
        const colBinaries = sqs.columns.map((c) => squaresToNoteTrace(board, c, x));
        const colNoteCounts = colBinaries.map((e) => bit.count(e));
        const potentialColIndices = colBinaries
            .keys()
            .filter((i) => colNoteCounts[i] <= n && colNoteCounts[i] >= 2)
            .toArray();
        if (potentialColIndices.length < n) continue;

        for (const comb of cmb.bipartitions(potentialColIndices, n)) {
            const targetColIndices = comb[0];
            const targetColBinaries = targetColIndices.map((i) => colBinaries[i]);
            const unionTargetColsBinary = bit.union(targetColBinaries);
            if (bit.count(unionTargetColsBinary) !== n) continue;

            const targetRowIndices = bit.onePositionsFromZero(unionTargetColsBinary);
            const { crossCells, sweepCells, lines } = generateCellsForXWing(
                targetRowIndices,
                targetColIndices,
                false,
            );
            if ((board.noteUnion(sweepCells) & bit.nth(x)) === 0) continue;

            const newMove = new Move(
                `${xWingNames[n]} Columns`,
                `Look for a note in ${n} columns that is restricted to only ${n} rows`,
                `The note value for the ${n} rows must be in these ${n} columns only`,
                lines,
                board.createNoteLabels(crossCells, bit.nth(x)),
                board.createNoteLabels(sweepCells, bit.nth(x)),
            );
            movesFound.push(newMove);
        }
    }
    return movesFound;
}

function generateCellsForXWing(rowIndices, colIndices, isRowType) {
    const crossCells = [];
    const sweepCells = [];
    for (const sq of sqs.all) {
        const sqRow = sqs.rowOf(sq);
        const sqColumn = sqs.columnOf(sq);
        const inTargetRows = rowIndices.includes(sqRow);
        const inTargetColumns = colIndices.includes(sqColumn);
        if (inTargetRows && inTargetColumns) {
            crossCells.push(sq);
        } else if (isRowType && !inTargetRows && inTargetColumns) {
            sweepCells.push(sq);
        } else if (!isRowType && inTargetRows && !inTargetColumns) {
            sweepCells.push(sq);
        }
    }
    const rowLines = rowIndices.map((i) => sqs.rows[i]);
    const colLines = colIndices.map((i) => sqs.columns[i]);
    const lines = rowLines.concat(colLines).flat();
    return { crossCells, sweepCells, lines };
}

// returns a binary indicating presence of specified note
function squaresToNoteTrace(board, squares, note) {
    return squares
        .map((sq, i) => (board.hasNote(sq, note) ? 1 << i : 0))
        .reduce((a, b) => a + b, 0);
}
