// returns a binary indicating presence of specified note
function squaresToNoteTrace(squares, note) {
    return squares
        .map((sq, i) => (this.cells[sq].hasNote(note) ? 1 << i : 0))
        .reduce((a, b) => a + b, 0);
}

function findXWings(n) {
    console.time(`findXWings${n}`);
    const movesFound = [];

    // assume rows restricted first
    for (let x = 1; x <= 9; x++) {
        const rowBinaries = squares.rows.map((row) => this.squaresToNoteTrace(row, x));
        const rowNoteCounts = rowBinaries.map((e) => countBits(e));
        const potentialRowIndices = rowBinaries
            .keys()
            .filter((i) => rowNoteCounts[i] <= n && rowNoteCounts[i] >= 2)
            .toArray();
        const numPotentialRows = potentialRowIndices.length;
        if (numPotentialRows < n) {
            continue;
        }
        for (const comb of bipartitions[numPotentialRows][n]) {
            const targetRowIndices = comb[0].map((i) => potentialRowIndices[i]);
            const targetRowBinaries = targetRowIndices.map((i) => rowBinaries[i]);
            const unionTargetRowsBinary = union(targetRowBinaries);
            if (countBits(unionTargetRowsBinary !== n)) {
                continue;
            }
            const targetColumnIndices = onePositionsFromZero(unionTargetRowsBinary);
            const { crossCells, sweepCells, lines } = generateCellsForXWing(
                targetRowIndices,
                targetColumnIndices,
                true,
            );

            if ((this.noteUnion(sweepCells) & nBit(x)) === 0) {
                continue;
            }
            const newMove = new Move(
                `X-Wing rows ${n}`,
                lines,
                this.matchNotes(crossCells, nBit(x)),
                this.matchNotes(sweepCells, nBit(x)),
            );
            console.log(newMove);
            movesFound.push(newMove);
        }
    }

    // now do columns!!
    for (let x = 1; x <= 9; x++) {
        const colBinaries = squares.columns.map((col) => this.squaresToNoteTrace(col, x));
        const colNoteCounts = colBinaries.map((e) => countBits(e));
        const potentialColIndices = colBinaries
            .keys()
            .filter((i) => colNoteCounts[i] <= n && colNoteCounts[i] >= 2)
            .toArray();
        const numPotentialColumns = potentialColIndices.length;
        if (numPotentialColumns < n) {
            continue;
        }
        for (const comb of bipartitions[numPotentialColumns][n]) {
            const targetColIndices = comb[0].map((i) => potentialColIndices[i]);
            const targetColBinaries = targetColIndices.map((i) => colBinaries[i]);
            const unionTargetColsBinary = union(targetColBinaries);
            if (countBits(unionTargetColsBinary) !== n) {
                continue;
            }
            const targetRowIndices = onePositionsFromZero(unionTargetColsBinary);
            const { crossCells, sweepCells, lines } = generateCellsForXWing(
                targetRowIndices,
                targetColIndices,
                false,
            );

            if ((this.noteUnion(sweepCells) & nBit(x)) === 0) {
                continue;
            }
            const newMove = new Move(
                `X-Wing columns ${n}`,
                lines,
                this.matchNotes(crossCells, nBit(x)),
                this.matchNotes(sweepCells, nBit(x)),
            );
            console.log(newMove);
            movesFound.push(newMove);
        }
    }

    console.timeEnd(`findXWings${n}`);
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}

function generateCellsForXWing(rowIndices, colIndices, isRowType) {
    const crossCells = [];
    const sweepCells = [];
    for (const sq of squares.all) {
        const sqRow = squares.rowOf(sq);
        const sqColumn = squares.columnOf(sq);
        const inTargetRows = rowIndices.includes(sqRow);
        const inTargetColumn = colIndices.includes(sqColumn);
        if (inTargetColumn && inTargetRows) {
            crossCells.push(sq);
        } else if (isRowType && !inTargetRows && inTargetColumn) {
            sweepCells.push(sq);
        } else if (!isRowType && inTargetRows && !inTargetColumn) {
            sweepCells.push(sq);
        }
    }
    const rowLines = rowIndices.map((i) => squares.rows[i]);
    const colLines = colIndices.map((i) => squares.columns[i]);
    const lines = rowLines.concat(colLines);
    return { crossCells, sweepCells, lines };
}

function findYWings() {
    console.time("findYWings");
    const movesFound = [];

    const squaresWithTwoNotes = squares.all.filter(
        (sq) => countBits(this.cells[sq].notes) === 2,
    );
    for (const pivot of squaresWithTwoNotes) {
        const potentialPincers = squaresWithTwoNotes
            .filter((sq) => squares.arePeers(pivot, sq))
            .filter((sq) => countBits(this.noteIntersection([pivot, sq])) === 1);
        const numPotentials = potentialPincers.length;
        if (numPotentials < 2) {
            continue;
        }
        console.log(pivot, potentialPincers);
        for (const comb of bipartitions[numPotentials][2]) {
            const pincers = comb[0].map((i) => potentialPincers[i]);
            const pincersIntersection = this.noteIntersection(pincers);
            if (
                this.noteIntersection([pivot, pincers[0], pincers[1]]) !== 0 ||
                pincersIntersection === 0
            ) {
                continue;
            }
            const targets = squares.all
                .filter((sq) => squares.arePeers(sq, pincers[0]))
                .filter((sq) => squares.arePeers(sq, pincers[1]))
                .filter((sq) => (this.cells[sq].notes & pincersIntersection) !== 0);
            if (targets.length === 0) {
                continue;
            }
            const newMove = new Move(
                `Y-Wing`,
                [pincers, targets, [pivot]],
                this.matchNotes([pincers, pivot[0], pivot[1]], not(0)),
                this.matchNotes(targets, pincersIntersection),
            );
            console.log(newMove);
            movesFound.push(newMove);
        }
    }
    console.timeEnd("findYWings");
    movesFound.sort((a, b) => {
        return b.deadNotes.length - a.deadNotes.length;
    });
    return movesFound;
}
