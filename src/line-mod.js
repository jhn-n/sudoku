function indexFromRowColumn(r, c) {
    return 9 * r + c;
}

function createBlockArray(startRow, startColumn) {
    const block = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            block.push(indexFromRowColumn(startRow + i, startColumn + j));
        }
    }
    return block;
}

const allRows = [];
for (let r = 0; r < 9; r++) {
    const currentLine = [];
    for (let c = 0; c < 9; c++) {
        currentLine.push(indexFromRowColumn(r, c));
    }
    allRows.push(currentLine);
}

const allColumns = [];
for (let c = 0; c < 9; c++) {
    const currentLine = [];
    for (let r = 0; r < 9; r++) {
        currentLine.push(indexFromRowColumn(r, c));
    }
    allColumns.push(currentLine);
}

const allBlocks = [];
for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
        allBlocks.push(createBlockArray(r, c));
    }
}

export const lines = { allRows, allColumns, allBlocks };
